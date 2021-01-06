import type {
  GetStaticPathsContext,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { Layout } from '@components/common'
import {
  BuilderComponent,
  Builder,
  builder,
  BuilderContent,
} from '@builder.io/react'
import { apiKey } from '@config/builder'
import DefaultErrorPage from 'next/error'
import Head from 'next/head'
builder.init(apiKey)
import '../sections/ProductGrid/ProductGrid.builder'
import '../sections/Hero/Hero.builder'

import { resolveBuilderContent } from '@lib/resolve-builder-content'

const isDev = process.env.NODE_ENV === 'development'

export async function getStaticProps({
  params,
  locale,
}: GetStaticPropsContext<{ path: string[] }>) {
  const page = await resolveBuilderContent('page', {
    locale,
    urlPath: '/' + (params?.path?.join('/') || ''),
  })
  return {
    props: {
      page,
      locale,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 4 minutes ( 240 seconds)
    revalidate: isDev ? 1 : 240,
  }
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  const pages: BuilderContent[] = (
    await fetch(
      `https://cdn.builder.io/api/v2/content/page?apiKey=${apiKey}`
    ).then((res) => res.json())
  ).results
  return {
    // exclude home page to always render on the server instead of static
    paths: pages
      .map((page) => `${page.data?.url}`)
      .filter((url: string) => url !== '/'),
    fallback: true,
  }
}

export default function Path({
  page,
  locale,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  if (router.isFallback) {
    return <h1>Loading...</h1>
  }
  // This includes setting the noindex header because static files always return a status 200 but the rendered not found page page should obviously not be indexed
  if (!page && !Builder.isEditing && !Builder.isPreviewing) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
          <meta name="title"></meta>
        </Head>
        <DefaultErrorPage statusCode={404} />
      </>
    )
  }

  const { title, description, image } = page.data
  return (
    <>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          type: 'website',
          title,
          description,
          locale,
          images: [
            {
              url: image,
              width: 800,
              height: 600,
              alt: title,
            },
          ],
        }}
      />
      <BuilderComponent
        options={{ includeRefs: true } as any}
        model="page"
        {...(!Builder.isEditing && !Builder.isPreviewing && { content: page })}
      />
    </>
  )
}

Path.Layout = Layout
