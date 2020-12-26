import type {
  GetStaticPathsContext,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'
import { useRouter } from 'next/router'
import { Layout } from '@components/common'
import { buildClient } from 'shopify-buy'
import shopifyConfig from '@config/shopify';
import { BuilderComponent, builder, Builder } from '@builder.io/react'
import { apiKey } from '@config/builder';
// TODO: fix utils package
import { getAsyncProps } from '@lib/get-async-props';
import DefaultErrorPage from 'next/error'
import Head from 'next/head'

// import { getAsyncProps } from '@builder.io/utils/src/get-async-props';
builder.init(apiKey);
import '../../sections/ProductGrid/ProductGrid.builder';
Builder.isStatic = true;

// Data
const config = {
  domain: shopifyConfig.shopName,
  storefrontAccessToken: shopifyConfig.accessToken,
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ path: string[] }>) {
   const client = buildClient(config);
    const page = await builder.get('page', { userAttributes: { urlPath: '/' + params?.path.join('/') }}).toPromise();
    const pageWithData = await getAsyncProps(page, {
      async productsQuery(field) {
        const products = await client.product.fetchQuery(field.productsQuery)
        return {
          products: JSON.parse(JSON.stringify(products)),
        }
      }
    })
    return {
      props: {
        page: page ? pageWithData : null,
      },
      revalidate: 200,
    }
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {

  const pages = (await fetch(`https://cdn.builder.io/api/v2/content/page?apiKey=${apiKey}`).then(res => res.json())).results;
  return {
    paths: pages.map((page: any) => `${page.data?.url}`).filter((url: string) => url !== '/').map((url: string) => `/m${url}`),
    fallback: true,
  }
}

export default function Path({
  page,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  if(router.isFallback) {
    return <h1>Loading...</h1>
 }
  // This includes setting the noindex header because static files always return a status 200 but the rendered not found page page should obviously not be indexed
  if(!page && !Builder.isEditing && !Builder.isPreviewing) {
    return (<>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <DefaultErrorPage statusCode={404} />
    </>)
  }

  return <BuilderComponent
    model='page'
    {...!Builder.isEditing && !Builder.isPreviewing && { content: page}}
  />

}

Path.Layout = Layout
