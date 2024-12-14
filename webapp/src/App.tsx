import './App.css';
import { useGetProducts } from './products/hooks/use-get-products';
import { useGetPurchaseOrders } from './purchase-order/hooks/use-get-purchase-orders';
import { ProductTable } from './products/product-table/procut-table';
import PurchaseOrderTable from './purchase-order/purchase-order-table/purhcase-order-table';
import CreatePurchaseOrderModal from './purchase-order/create-purchase-order/create-purchase-order.dialog';
import { httpService } from './api/http.service';
import { CreatePurchaseOrderRequest } from './types/purchase-order';

function App() {
  const { products } = useGetProducts();
  const { purchaseOrders, getPurhcaseOrders } = useGetPurchaseOrders();

  const handleCreatePurchaseOrder = async (
    data: CreatePurchaseOrderRequest,
  ) => {
    try {
      await httpService
        .withMethod('POST')
        .withUrl('/purchase-orders')
        .withBody(data)
        .execute()
        // TODO: Use context and manually update items ad-hoc
        // Refetch purchase order
        .then(getPurhcaseOrders);
    } catch {
      console.error('There was a problem with the order');
    }
  };

  return (
    <>
      {/* TODO: add header */}
      {/* TODO: add routing and organise pages */}
      <div className="p-6">
        <h1 className="text-3xl font-semibold mb-4 text-left">Products</h1>
      </div>
      <ProductTable products={products} />
      <div className="p-6 flex justify-between">
        <h1 className="text-3xl font-semibold mb-4">Purchase Orders</h1>
        <CreatePurchaseOrderModal onSubmit={handleCreatePurchaseOrder} />
      </div>
      <PurchaseOrderTable data={purchaseOrders} />
    </>
  );
}

export default App;
