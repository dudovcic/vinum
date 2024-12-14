import React, { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreatePurchaseOrderRequest } from '@/types/purchase-order';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/date-picker/date-picker';
import { useGetProducts } from '@/products/hooks/use-get-products';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetWarehouses } from '@/warehouse/hooks/hooks/use-get-warehouses';

interface CreatePurchaseOrderModalProps {
  onSubmit: (data: CreatePurchaseOrderRequest) => void;
}

const CreatePurchaseOrderModal: React.FC<CreatePurchaseOrderModalProps> = ({
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CreatePurchaseOrderRequest>({
    productId: '',
    supplierId: '',
    warehouseId: '',
    quantityOrdered: 1,
    expectedArrivalDate: undefined,
  });
  const { products } = useGetProducts();
  const { warehouses } = useGetWarehouses();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isNumber?: boolean,
  ) => {
    const { name, value } = e.target;
    console.log('vaoue is', name, value, typeof value);
    setFormData((prevState) => ({
      ...prevState,
      [name]: isNumber ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Call the onSubmit prop to send the data
    onSubmit(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 text-white">
          Create Purchase Order
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-description="Form"
        className="w-full max-w-md p-6 bg-white rounded-md shadow-lg"
      >
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
          <DialogDescription hidden={true}>Form</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="productId"
              className="block text-sm font-medium text-gray-700"
            >
              Product ID
            </label>
            <Select
              onValueChange={(productId) =>
                setFormData((prevState) => ({
                  ...prevState,
                  productId,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Product ID" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="supplierId"
              className="block text-sm font-medium text-gray-700"
            >
              Supplier ID (Optional)
            </label>
            <p className="text-gray-500 text-xs">
              TODO: Add search or select just like Products
            </p>
            <Input
              type="text"
              id="supplierId"
              name="supplierId"
              value={formData.supplierId || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="warehouseId"
              className="block text-sm font-medium text-gray-700"
            >
              Warehouse ID
            </label>
            <Select
              onValueChange={(warehouseId) =>
                setFormData((prevState) => ({
                  ...prevState,
                  warehouseId,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Warehouse ID" />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="quantityOrdered"
              className="block text-sm font-medium text-gray-700"
            >
              Quantity Ordered
            </label>
            <Input
              type="number"
              id="quantityOrdered"
              name="quantityOrdered"
              value={formData.quantityOrdered}
              onChange={(e) => handleChange(e, true)}
              min={1}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="expectedArrivalDate"
              className="block text-sm font-medium text-gray-700"
            >
              Expected Arrival Date (Optional)
            </label>
            <p className="text-gray-500 text-xs">
              TODO: This works but there's a styling issue with Shad/Tailwind
              after selection, hover after selecting to see
            </p>
            <DatePicker
              onChange={(date) =>
                setFormData({
                  ...formData,
                  expectedArrivalDate: date ? date : undefined,
                })
              }
            />
          </div>

          <div className="flex justify-end">
            <DialogClose asChild>
              <Button className="mr-2">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-green-500 text-white">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePurchaseOrderModal;
