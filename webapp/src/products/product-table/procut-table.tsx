import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InventoryTable } from '../inventory-table/inventory-table';
import { Product } from '@/types/product';

export const ProductRow: React.FC<ProductRowProps> = ({ product }) => {
  const {
    sku,
    name,
    description,
    reorderThreshold,
    defaultSupplier,
    inventoryItems,
  } = product;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>{name}</TableCell>
        <TableCell>{sku}</TableCell>
        <TableCell>{description}</TableCell>
        <TableCell>{reorderThreshold}</TableCell>
        <TableCell>
          {defaultSupplier.name}
          <br />
          <span className="text-sm text-gray-600">
            {defaultSupplier.contactEmail}
          </span>
          <br />
          <span className="text-sm text-gray-600">
            {defaultSupplier.contactPhone}
          </span>
        </TableCell>
        <TableCell>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            size="sm"
            variant="outline"
          >
            {isOpen ? 'Hide Inventory' : 'Show Inventory'}
          </Button>
        </TableCell>
      </TableRow>
      {isOpen && (
        <TableRow>
          <TableCell colSpan={6} className="bg-gray-50">
            <InventoryTable inventoryItems={inventoryItems} sku={sku} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
interface ProductTableProps {
  products: Product[];
}

interface ProductRowProps {
  product: Product;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  return (
    <div className="p-6">
      <Table className="min-w-full bg-white">
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Reorder Threshold</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Inventory</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
