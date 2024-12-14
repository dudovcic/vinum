import { PurchaseOrder } from '@/types/purchase-order';
import React from 'react';

// Define the PurchaseOrder type based on the TypeScript types
interface PurchaseOrderTableProps {
  data: PurchaseOrder[];
}

export const PurchaseOrderTable: React.FC<PurchaseOrderTableProps> = ({
  data,
}) => {
  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              ID
            </th>
            <th scope="col" className="px-6 py-3">
              Product Name
            </th>
            <th scope="col" className="px-6 py-3">
              Quantity Ordered
            </th>
            <th scope="col" className="px-6 py-3">
              Order Date
            </th>
            <th scope="col" className="px-6 py-3">
              Expected Arrival
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Supplier
            </th>
            <th scope="col" className="px-6 py-3">
              Warehouse
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((order) => (
            <tr
              key={order.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <td className="px-6 py-4">{order.id}</td>
              <td className="px-6 py-4">{order.product.name}</td>
              <td className="px-6 py-4">{order.quantityOrdered}</td>
              <td className="px-6 py-4">
                {new Date(order.orderDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                {new Date(order.expectedArrivalDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 text-xs font-medium ${
                    order.status === 'PENDING'
                      ? 'text-yellow-800 bg-yellow-200'
                      : order.status === 'COMPLETED'
                      ? 'text-green-800 bg-green-200'
                      : 'text-red-800 bg-red-200'
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4">{order.supplier.name}</td>
              <td className="px-6 py-4">{order.warehouse.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseOrderTable;
