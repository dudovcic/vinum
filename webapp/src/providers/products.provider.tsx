import { useState } from 'react';
import { Product } from 'src/types/product';
import { ProductsContext } from './products.context';

interface IProductsContext {
  products: Product[];
  setProducts: (products: Product[]) => void;
}

export const ProductsContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [products, setProducts] = useState<IProductsContext['products']>([]);

  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};
