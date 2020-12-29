import React from 'react'
import ShopifyBuy from 'shopify-buy'

interface ContextShape {
  client: ShopifyBuy.Client | null
  cart: ShopifyBuy.Cart | null
  setCart: React.Dispatch<React.SetStateAction<ShopifyBuy.Cart | null>>
  shopName: string
  storefrontAccessToken: string
}

export const Context = React.createContext<ContextShape>({
  client: null,
  cart: null,
  shopName: '',
  storefrontAccessToken: '',
  setCart: () => {
    throw Error('You forgot to wrap this in a Provider object')
  },
})
