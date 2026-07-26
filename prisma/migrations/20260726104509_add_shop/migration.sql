-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('VOUCHER', 'PHYSICAL');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELLED', 'FULFILLED');

-- CreateEnum
CREATE TYPE "DeliveryMethod" AS ENUM ('PICKUP', 'COURIER');

-- CreateEnum
CREATE TYPE "VoucherStatus" AS ENUM ('ACTIVE', 'REDEEMED', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL,
    "type" "ProductType" NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "stock" INTEGER,
    "voucherValidDays" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "deliveryMethod" "DeliveryMethod" NOT NULL DEFAULT 'PICKUP',
    "shippingAddress" TEXT,
    "shippingCents" INTEGER NOT NULL DEFAULT 0,
    "totalCents" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "p24SessionId" TEXT,
    "p24OrderId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "nameSnapshot" TEXT NOT NULL,
    "unitPriceCents" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vouchers" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "valueCents" INTEGER NOT NULL,
    "status" "VoucherStatus" NOT NULL DEFAULT 'ACTIVE',
    "recipientName" TEXT,
    "message" TEXT,
    "expiresAt" TIMESTAMP(3),
    "redeemedAt" TIMESTAMP(3),
    "redeemedBookingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "orders_p24SessionId_key" ON "orders"("p24SessionId");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "vouchers_code_key" ON "vouchers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "vouchers_redeemedBookingId_key" ON "vouchers"("redeemedBookingId");

-- CreateIndex
CREATE INDEX "vouchers_code_idx" ON "vouchers"("code");

-- CreateIndex
CREATE INDEX "vouchers_status_idx" ON "vouchers"("status");

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_redeemedBookingId_fkey" FOREIGN KEY ("redeemedBookingId") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
