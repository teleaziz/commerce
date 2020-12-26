import type {
  GetStaticPathsContext,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'
import { useRouter } from 'next/router'
import { Layout } from '@components/common'
import { ProductView } from '@components/product'
import { buildClient } from 'shopify-buy'
import shopifyConfig from '@config/shopify';

// Data
const config = {
  domain: shopifyConfig.shopName,
  storefrontAccessToken: shopifyConfig.accessToken,
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ slug: string }>) {
  const client = buildClient(config);

  const product = await client.product.fetchByHandle(params!.slug)

  if (!product) {
    throw new Error(`Product with slug '${params!.slug}' not found`)
  }

  return {
    props: { product: JSON.parse(JSON.stringify(product)) },
    revalidate: 200,
  }
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  const client = buildClient(config);

  const products: any[] = await client.product.fetchAll();
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
