import type {
  GetStaticPathsContext,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'
import { useRouter } from 'next/router'
import { Layout } from '@components/common'
import { buildClient } from 'shopify-buy'
import shopifyConfig from '@config/shopify';
import { BuilderComponent, Builder, builder } from '@builder.io/react'
import { resolveBuilderContent } from '@lib/resolve-builder-content';
import '../../sections/ProductView/ProductView.builder';
import { apiKey } from '@config/builder';
builder.init(apiKey);
Builder.isStatic = true;

// Data
const config = {
  domain: shopifyConfig.shopName,
  storefrontAccessToken: shopifyConfig.accessToken,
}
const isDev = process.env.NODE_ENV === 'development';

export async function getStaticProps({
  params,
  locale,
}: GetStaticPropsContext<{ slug: string }>) {
  const client = buildClient(config);

  const product: any = await client.product.fetchByHandle(params!.slug);
  const page = await resolveBuilderContent('product-page-template', { product: product.id, locale })
  if (!product) {
    throw new Error(`Product with slug '${params!.slug}' not found`)
  }

  return {
    props: { product: JSON.parse(JSON.stringify(product)), page },
    // 4 hours in production, 1s in development
    revalidate: isDev ? 1 : 14400,
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
  page,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()

  return router.isFallback ? (
    <h1>Loading...</h1> // TODO (BC) Add Skeleton Views
  ) : (
    <BuilderComponent model="product-page-template" data={{product}}
      {...!Builder.isEditing && !Builder.isPreviewing && { content: page}}
    />
  )
}

Slug.Layout = Layout
