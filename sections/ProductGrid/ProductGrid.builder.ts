import dynamic from 'next/dynamic';
import { Builder } from '@builder.io/react';
import { Input } from '@builder.io/sdk'
const LazyProductGrid = dynamic(async () => {
  return (await import('./ProductGrid')).ProductGrid;
});

const productCardFields: Input[] = [
  {
    name: 'variant',
    type: 'enum',
    enum: ['slim', 'simple']
  },
  {
    name: 'imgWidth',
    type: 'number',
    defaultValue: 540,
  },
  {
    name: 'imgHeight',
    type: 'number',
    defaultValue: 540,
  },
  //   imgPriority?: boolean
  {
    name: 'imgPriority',
    type: 'boolean',
    defaultValue: true,
  },
  {
    name: 'imgLoading',
    type: 'enum',
    enum: ['eager', 'lazy']
  },
  {
    name: 'imgLayout',
    type: 'enum',
    enum: ['fixed', 'intrinsic', 'responsive', 'fill'],
    defaultValue: 'fill'
  },
]

const highlightedCardFields = productCardFields.concat({
  name: 'index',
  type: 'number',
})

Builder.registerComponent(LazyProductGrid, {
  name: 'Product Grid',
  inputs: [
    {
      name: 'productsQuery',
      type: 'object',
      helperText: 'shopify products query input ',
      defaultValue: {
        sortBy: 'createdAt',
        first: 10
      },
      subFields: [
        {
          type: 'string',
          name: 'query',
          helperText: 'for syntax check https://shopify.dev/concepts/about-apis/search-syntax'
        },
        {
          // https://shopify.dev/docs/admin-api/graphql/reference/products-and-collections/productsortkeys
          type: 'enum',
          name: 'sortBy',
          enum: [{
            label: 'vendor', value: 'VENDOR'
          }, {
            label: 'product ID', value: 'ID'
          }, {
            label: 'Date of creation', value: 'CREATED_AT',
          },
          {
            label: 'Date of last update', value: 'UPDATED_AT',
          },
          {
            label: 'Date of publishing', value: 'PUBLISHED_AT',
          }, {
            label: 'Relevance', value: 'RELEVANCE',
          },
          {
            label: 'Title', value: 'TITLE',
          },
          {
            label: 'Inventory Total', value: 'INVENTORY_TOTAL',
          },
        ]
        }
,        {
  type: 'number',
  name: 'first'
}
,        {
  type: 'number',
  name: 'last'
},
{
  type: 'boolean',
  name: 'reverse'
}

      ],
    },
    {
      name: 'cardProps',
      defaultValue: {
        imgWidth: 540,
        imgHeight: 540,
        layout: 'fixed',
      },
      type: 'object',
      subFields: productCardFields
    },
    {
      name: 'highlightCard',
      defaultValue: {
        imgWidth: 1080,
        imgHeight: 1080,
        layout: 'fixed',
        index: 1,
      },
      type: 'object',
      subFields: highlightedCardFields
    },
    {
      name: 'offset',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 10,
    },
  ]
})