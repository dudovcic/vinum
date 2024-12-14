import { httpService } from '@/api/http.service';
import { PurchaseOrder } from '@/types/purchase-order';
import { useEffect, useState } from 'react';

export const useGetPurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);

  const getPurhcaseOrders = () => {
    httpService
      .withMethod('GET')
      .withUrl('/purchase-orders')
      .execute()
      .then((data) => {
        console.log('fetching data...');
        setPurchaseOrders(data.data as []);
      })
      .catch((e) => console.log('err is', e));
  };

  useEffect(() => {
    if (!purchaseOrders.length) {
      getPurhcaseOrders();
    }
  }, []);

  return {
    purchaseOrders: purchaseOrders,
    getPurhcaseOrders,
  };
};
