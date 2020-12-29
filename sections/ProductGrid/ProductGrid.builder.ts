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

const gridFields: Input[] = [
  {
    name: 'variant',
    type: 'enum',
    defaultValue: 'default',
    enum: ['default', 'filled']
  },
  {
    name: 'layout',
    type: 'enum',
    defaultValue: 'A',
    enum: ['A', 'B', 'C', 'D', 'normal']
  }
]

Builder.registerComponent(LazyProductGrid, {
  name: 'Product Grid',
  inputs: [
    {
      name: 'productsQuery',
      type: 'object',
      onChange: (options: Map<string, any>) => {
        const isMarquee= options.get('marquee');
        if (isMarquee) {
          // Marquee requires a rerender on each change
          // this is only needed while editing in builder
          options.set('marquee', false);
          setTimeout(() => options.set('marquee', true));
        }
      },

      helperText: 'shopify products query input ',
      defaultValue: {
        sortBy:'RELEVANCE',
        first:3,
        query:'shirt'
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
      name: 'marquee',
      type: 'boolean',
      defaultValue: false,
    },  
    {
      name: 'marqueeOptions',
      showIf: (options) => options.get('marquee'),
      defaultValue: {
        variant: 'primary',
      },
      type: 'object',
      subFields: [
        {
          name: 'variant',
          type: 'enum',
          enum: ['primary', 'secondary'],
        }
      ]
    },
    {
      name: 'gridProps',
      showIf: (options) => !options.get('marquee'),
      defaultValue: {
        variant: 'default',
        layout: 'A',
      },
      type: 'object',
      subFields: gridFields
    },
    {
      name: 'cardProps',
      onChange: (options: Map<string, any>) => {
        const isMarquee= options.get('marquee');
        if (isMarquee) {
          // Marquee requires a rerender on each change
          // this is only needed while editing in builder
          options.set('marquee', false);
          setTimeout(() => options.set('marquee', true));
        }
      },
      defaultValue: {
        variant:'simple',
        imgPriority:true,
        imgLayout:'responsive',
        imgLoading:'eager',
        imgWidth: 540,
        imgHeight: 540,
        layout: 'fixed',
      },
      type: 'object',
      subFields: productCardFields
    },
    {
      name: 'highlightCard',
      showIf: (options) => !options.get('marquee'),
      defaultValue: {
        imgWidth: 1080,
        imgHeight: 1080,
        variant:'simple',
        imgPriority:true,
        imgLayout:'responsive',
        imgLoading:'eager',
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
      defaultValue: 3,
    },
  ]
})