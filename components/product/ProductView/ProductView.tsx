import { FC, useState, useMemo, useEffect } from 'react'
import cn from 'classnames'
import Image from 'next/image'
import { NextSeo } from 'next-seo'

import s from './ProductView.module.css'
import { useUI } from '@components/ui/context'
import { Swatch, ProductSlider } from '@components/product'
import { Button, Container, Text } from '@components/ui'

import { useAddItemToCart } from '@lib/shopify/storefront-data-hooks'
import { prepareVariantsWithOptions, prepareVariantsImages } from '@lib/shopify/storefront-data-hooks/src/utils/product'
interface Props {
  className?: string
  children?: any
  product: ShopifyBuy.Product
}

const ProductView: FC<Props> = ({ product }) => {
  const addItem = useAddItemToCart()
  const colors = product.options?.find(option => option?.name?.toLowerCase() === 'color')?.values!;
  const sizes = product.options?.find(option => option?.name?.toLowerCase() === 'size')?.values;

  const variants = useMemo(() => prepareVariantsWithOptions(product!.variants! as any), [
    product.variants,
  ]);
  const images = useMemo(() => prepareVariantsImages(variants, 'color'), [variants]);

  const { openSidebar } = useUI()
  const [loading, setLoading] = useState(false)
  const [variant, setVariant] = useState(variants[0]);
  const [color, setColor] = useState(variant.color);
  const [size, setSize] = useState(variant.size);

  useEffect(() => {
    const newVariant = variants.find(variant => {
      return variant.size === size && variant.color === color;
    });

    if (variant.shopifyId !== newVariant.shopifyId) {
      setVariant(newVariant);
    }
  }, [size, color, variants, variant.shopifyId]);

  const addToCart = async () => {
    setLoading(true)
    try {
      await addItem(variant.id, 1)
      openSidebar()
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  return (
    <Container className="max-w-none w-full" clean>
      <NextSeo
        title={product.title}
        description={product.description}
        openGraph={{
          type: 'website',
          title: product.title,
          description: product.description,
          images: [
            {
              url: product.images?.[0]?.src!,
              width: 800,
              height: 600,
              alt: product.title,
            },
          ],
        }}
      />
      <div className={cn(s.root, 'fit')}>
        <div className={cn(s.productDisplay, 'fit')}>
          <div className={s.nameBox}>
            <h1 className={s.name}>{product.title}</h1>
            <div className={s.price}>
              {variant.compareAtPrice}
              {` `}
            </div>
          </div>

          <div className={s.sliderContainer}>
            <ProductSlider>
              {product.images.map((image, i) => (
                <div key={image.src} className={s.imageContainer}>
                  <Image
                    className={s.img}
                    src={image?.src!}
                    alt={'Product Image'}
                    width={1050}
                    height={1050}
                    priority={i === 0}
                    quality="85"
                  />
                </div>
              ))}
            </ProductSlider>
          </div>
        </div>

        <div className={s.sidebar}>
          <section>
              <div className="pb-4">
                <h2 className="uppercase font-medium">Colors</h2>
                <div className="flex flex-row py-4">
                {colors?.map((opt) => (
                      <Swatch
                        key={opt.option_id}
                        color={opt.value}
                        label={opt.name}
                        onClick={() => {
                          setColor(opt);
                        }}
                      />
                ))}
                </div>
              </div>

            <div className="pb-14 break-words w-full max-w-xl">
              <Text html={product.description} />
            </div>
          </section>
          <div>
            <Button
              aria-label="Add to Cart"
              type="button"
              className={s.button}
              onClick={addToCart}
              loading={loading}
              disabled={!variant}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default ProductView
