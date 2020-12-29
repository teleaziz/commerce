import { FC, useEffect, useState, useMemo } from 'react';
import { Grid, GridProps, LoadingDots, Marquee, MarqueeProps } from '@components/ui'
import { ProductCard, ProductCardProps } from '@components/product';
import { useClientUnsafe } from '@lib/shopify/storefront-data-hooks';
import { Builder } from '@builder.io/react';

interface HighlightedCardProps extends ProductCardProps {
  index: number;
}

interface Props {
  gridProps?: GridProps,
  productsQuery?: ShopifyBuy.Query;
  products: ShopifyBuy.Product[],
  offset: number;
  limit: number;
  cardProps: ProductCardProps
  highlightCard?: HighlightedCardProps
  marquee?: boolean;
  marqueeOptions?: MarqueeProps
}

export const ProductGrid: FC<Props> = ({products: initlaProducts, productsQuery, offset = 0, limit = 10, cardProps, highlightCard, gridProps, marquee, marqueeOptions}) => {
  const client = useClientUnsafe();
  const [products, setProducts] = useState(initlaProducts || []);
  useEffect(() => {
    const getProducts = async () => {
      if (productsQuery) {
        const results = await client?.product.fetchQuery({...productsQuery, sortKey: productsQuery.sortBy} as any)
        if (results) {
          setProducts(() => results);
        }
      }
    }
    if (!initlaProducts || Builder.isEditing || Builder.isPreviewing) {
      getProducts();
    }
  }, [productsQuery, initlaProducts]);

  console.log('rendering products ', products.length, marquee, marqueeOptions);

  if (!products.length) {
    return <LoadingDots />
  }

  if (marquee) {
    return <Marquee {...marqueeOptions}>
      {products.slice(offset, limit)
        .map((product) => <ProductCard key={String(product.id)} {...cardProps} product={product} />)}
    </Marquee>
  }
  return <Grid {...gridProps}>
    {products.slice(offset, limit)
      .map((product, i) => <ProductCard key={String(product.id)} {...(highlightCard?.index === i ? highlightCard : cardProps)} product={product} />)}
  </Grid>
}