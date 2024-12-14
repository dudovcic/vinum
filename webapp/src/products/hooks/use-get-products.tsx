import { httpService } from '@/api/http.service';
import { ProductsContext } from '@/providers/products.context';
import { Product } from '@/types/product';
import { useContext, useEffect } from 'react';

export const useGetProducts = () => {
  const { products, setProducts } = useContext(ProductsContext);

  useEffect(() => {
    if (!products.length) {
      httpService
        .withMethod('GET')
        .withUrl('/products')
        .execute<Product[]>()
        .then((data) => {
          setProducts(data.data);
        })
        .catch(() => console.error('Error fetching products'));
    }
  }, []);

  return {
    products,
  };
};
