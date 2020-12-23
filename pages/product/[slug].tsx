import type {
  GetStaticPathsContext,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'
import { useRouter } from 'next/router'
import { Layout } from '@components/common'
import { ProductView } from '@components/product'
import { buildClient } from 'shopify-buy'
// Data

const config = {
  storefrontAccessToken: '2dd7917030d4c08c36d2cf4bb7617df0',
  domain: 'builder-io-store.myshopify.com',
}
export async function getStaticProps({
  params,
  locale,
  preview,
}: GetStaticPropsContext<{ slug: string }>) {
  const client = buildClient(config);

  const product = JSON.parse(JSON.stringify(await client.product.fetchByHandle(params!.slug)))
  console.log('here product ', product);

  if (!product) {
    throw new Error(`Product with slug '${params!.slug}' not found`)
  }

  return {
    props: { product },
    revalidate: 200,
  }
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  const client = buildClient(config);

  const products: any[] = await client.product.fetchAll();

  console.log('here slug ', products[0]?.handle)
  return {
    paths: products.map((product) => `/product/${product.handle}`),
    fallback: 'blocking',
  }
}

export default function Slug({
  product,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()

  return router.isFallback ? (
    <h1>Loading...</h1> // TODO (BC) Add Skeleton Views
  ) : (
    <ProductView product={product} />
  )
}

Slug.Layout = Layout
