import { InventoryItem } from '@/types/inventory';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useContext, useState } from 'react';
import { httpService } from '@/api/http.service';
import { ProductsContext } from '@/providers/products.context';

interface InventoryTableProps {
  inventoryItems: InventoryItem[];
  sku: string;
}

const getUpdateId = (pId: string, wId: string) => `${pId}-${wId}`;

export const InventoryTable: React.FC<InventoryTableProps> = ({
  inventoryItems,
  sku,
}) => {
  const [updateData, setUpdateData] = useState<{ [key: string]: number }>({});
  const { products, setProducts } = useContext(ProductsContext);

  const onUpdateStockLevel = async (
    productId: string,
    warehouseId: string,
    quantity: number,
  ) => {
    const response = await httpService
      .withUrl('/inventory/adjust-stock')
      .withMethod('POST')
      .withBody({
        productId,
        warehouseId,
        quantityChange: quantity,
      })
      .execute();

    setProducts(
      products.map((p) =>
        p.sku === sku
          ? {
              ...p,
              inventoryItems: p.inventoryItems.map((pi) =>
                pi.productId === productId && pi.warehouseId === warehouseId
                  ? { ...pi, quantityInStock: quantity }
                  : pi,
              ),
            }
          : p,
      ),
    );

    console.log('response is', response.data);
  };

  return (
    <Table className="min-w-full">
      <TableHeader>
        <TableRow>
          <TableHead>Warehouse</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Quantity in Stock</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inventoryItems.map((item, index) => {
          const newStockValue =
            updateData[getUpdateId(item.productId, item.warehouseId)];
          console.log('value is', newStockValue);
          return (
            <TableRow key={index}>
              <TableCell className="text-left">{item.warehouse.name}</TableCell>
              <TableCell className="text-left">
                {item.warehouse.location}
              </TableCell>
              <TableCell>
                <div className="flex">
                  <Input
                    type="number"
                    id="supplierId"
                    name="supplierId"
                    value={
                      updateData[
                        getUpdateId(item.productId, item.warehouseId)
                      ] || item.quantityInStock
                    }
                    onChange={(e) =>
                      setUpdateData({
                        ...updateData,
                        [getUpdateId(item.productId, item.warehouseId)]: Number(
                          e.target.value,
                        ),
                      })
                    }
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  <Button
                    disabled={typeof newStockValue !== 'number'}
                    className="ml-2"
                    variant="outline"
                    onClick={() =>
                      onUpdateStockLevel(
                        item.productId,
                        item.warehouseId,
                        newStockValue,
                      )
                    }
                  >
                    Update
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
