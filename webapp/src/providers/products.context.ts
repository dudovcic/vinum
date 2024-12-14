import { createContext } from 'react';
import { Product } from 'src/types/product';

interface IProductsContext {
  products: Product[];
  setProducts: (products: Product[]) => void;
}

export const ProductsContext = createContext<IProductsContext>({
  products: [],
  setProducts: () => void 0,
});