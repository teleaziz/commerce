import { builder, Builder } from '@builder.io/react';
import { getAsyncProps } from './get-async-props'
import { buildClient } from 'shopify-buy'
import { apiKey } from '@config/builder';
// TODO: fix utils package
import shopifyConfig from '@config/shopify';
// import { getAsyncProps } from '@builder.io/utils/src/get-async-props';
builder.init(apiKey);
Builder.isStatic = true;

// Data
const config = {
  domain: shopifyConfig.shopName,
  storefrontAccessToken: shopifyConfig.accessToken,
}

export async function resolveBuilderContent( modelName: string, targetingAttributes: any) {
  const client = buildClient(config);
  const page = await builder.get(modelName, { userAttributes: targetingAttributes }).toPromise();
  if (page) {
    return await getAsyncProps(page, {
      async productsQuery(field) {
        const products = await client.product.fetchQuery(field.productsQuery)
        return {
          products: JSON.parse(JSON.stringify(products)),
        }
      }
    })  
  }
  return null;
}