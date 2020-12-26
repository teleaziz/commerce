import { FC, useEffect, useState } from 'react';
import { Grid, GridProps } from '@components/ui'
import { ProductCard, ProductCardProps } from '@components/product';
import { useClientUnsafe } from '@lib/shopify/storefront-data-hooks';
import { Builder } from '@builder.io/react';

interface HighlightedCardProps extends ProductCardProps {
  index: number;
}

interface Props extends GridProps {
  productsQuery?: ShopifyBuy.Query;
  products: ShopifyBuy.Product[],
  offset: number;
  limit: number;
  cardProps: ProductCardProps
  highlightCard?: HighlightedCardProps
}

export const ProductGrid: FC<Props> = ({products: initlaProducts, productsQuery, offset = 0, limit = 10, cardProps, highlightCard, ...gridProps}) => {
  const client = useClientUnsafe();
  console.log('initialProducts', initlaProducts);
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

  console.log('highlightedCard  ', highlightCard, initlaProducts);
  return <Grid {...gridProps}>
    {
      products.slice(offset, limit).map((product, i) => <ProductCard key={product.id} {...(highlightCard?.index === i ? highlightCard : cardProps)} product={product}></ProductCard>)
    }
  </Grid>
}