import { httpService } from '@/api/http.service';
import { Warehouse } from '@/types/warehouse';
import { useEffect, useState } from 'react';

export const useGetWarehouses = () => {
  const [warehouses, setWarehosues] = useState<Warehouse[]>([]);

  useEffect(() => {
    if (!warehouses.length) {
      httpService
        .withMethod('GET')
        .withUrl('/warehouse')
        .execute<Warehouse[]>()
        .then((data) => {
          setWarehosues(data.data);
        })
        .catch((e) => console.log('er ris', e));
    }
  }, []);

  return {
    warehouses,
  };
};
