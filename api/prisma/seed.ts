import { PrismaClient, PurchaseOrderStatus } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Suppliers
  const suppliers = await prisma.supplier.createMany({
    data: [
      {
        name: 'Supplier One',
        contactEmail: 'supplier1@example.com',
        contactPhone: '123-456-7890',
      },
      {
        name: 'Supplier Two',
        contactEmail: 'supplier2@example.com',
        contactPhone: '987-654-3210',
      },
    ],
  });

  console.log(`Inserted ${suppliers.count} suppliers.`);

  // Fetch created suppliers
  const supplierOne = await prisma.supplier.findFirst({
    where: { name: 'Supplier One' },
  });
  const supplierTwo = await prisma.supplier.findFirst({
    where: { name: 'Supplier Two' },
  });

  if (!supplierOne || !supplierTwo)
    throw new Error('Suppliers not created correctly.');

  // Create Warehouses
  const warehouses = await prisma.warehouse.createMany({
    data: [
      { name: 'Central Warehouse', location: 'Downtown', capacity: 1000 },
      { name: 'East Warehouse', location: 'Eastside', capacity: 500 },
    ],
  });

  console.log(`Inserted ${warehouses.count} warehouses.`);

  // Fetch created warehouses
  const centralWarehouse = await prisma.warehouse.findFirst({
    where: { name: 'Central Warehouse' },
  });
  const eastWarehouse = await prisma.warehouse.findFirst({
    where: { name: 'East Warehouse' },
  });

  if (!centralWarehouse || !eastWarehouse)
    throw new Error('Warehouses not created correctly.');

  // Create Products
  const products = await prisma.product.createMany({
    data: [
      {
        sku: 'PROD-001',
        name: 'Lagavulin 16',
        description: 'Spirit',
        reorderThreshold: 50,
        defaultSupplierId: supplierOne.id,
      },
      {
        sku: 'PROD-002',
        name: 'Wine X',
        description: 'Wine',
        reorderThreshold: 20,
        defaultSupplierId: supplierTwo.id,
      },
    ],
  });

  console.log(`Inserted ${products.count} products.`);

  // Fetch created products
  const product1 = await prisma.product.findFirst({
    where: { sku: 'PROD-001' },
  });
  const product2 = await prisma.product.findFirst({
    where: { sku: 'PROD-002' },
  });

  if (!product1 || !product2)
    throw new Error('Products not created correctly.');

  // Create ProductWarehouse entries
  const productWarehouses = await prisma.productWarehouse.createMany({
    data: [
      {
        productId: product1.id,
        warehouseId: centralWarehouse.id,
        quantityInStock: 200,
      },
      {
        productId: product2.id,
        warehouseId: eastWarehouse.id,
        quantityInStock: 100,
      },
    ],
  });

  console.log(
    `Inserted ${productWarehouses.count} product-warehouse relationships.`,
  );

  // Create PurchaseOrders
  const purchaseOrders = await prisma.purchaseOrder.createMany({
    data: [
      {
        productId: product1.id,
        supplierId: supplierOne.id,
        warehouseId: centralWarehouse.id,
        quantityOrdered: 50,
        expectedArrivalDate: new Date(
          new Date().setDate(new Date().getDate() + 7),
        ),
        status: PurchaseOrderStatus.PENDING,
      },
      {
        productId: product2.id,
        supplierId: supplierTwo.id,
        warehouseId: eastWarehouse.id,
        quantityOrdered: 30,
        expectedArrivalDate: new Date(
          new Date().setDate(new Date().getDate() + 10),
        ),
        status: PurchaseOrderStatus.PENDING,
      },
      {
        productId: product2.id,
        supplierId: supplierTwo.id,
        warehouseId: eastWarehouse.id,
        quantityOrdered: 30,
        expectedArrivalDate: new Date(
          new Date().setDate(new Date().getDate() + 10),
        ),
        status: PurchaseOrderStatus.PENDING,
      },
    ],
  });

  console.log(`Inserted ${purchaseOrders.count} purchase orders.`);

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
