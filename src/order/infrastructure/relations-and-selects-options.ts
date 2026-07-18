import { RelationsAndSelectsOptions } from '../../utils/types/relations-and-selects-options';

export const orderFindManyDefault: RelationsAndSelectsOptions = {
  select: [
    'order.id',
    'order.userId',
    'order.totalAmount',
    'order.status',
    'order.shippingAddress',
    'order.phoneNumber',
    'order.paymentMethod',
    'order.createdAt',
    'order.updatedAt',
    'item.id',
    'item.orderId',
    'item.productId',
    'item.quantity',
    'item.size',
    'item.color',
    'item.priceAtPurchase',
    'item.discountPercentAtPurchase',
    'product.id',
    'product.name',
  ],
  joins: [
    { propertyPath: 'order.items', alias: 'item', joinType: 'left' },
    { propertyPath: 'item.product', alias: 'product', joinType: 'left' },
  ],
};

export const orderFindOneDefault: RelationsAndSelectsOptions = {
  select: [
    'order.id',
    'order.userId',
    'order.totalAmount',
    'order.status',
    'order.shippingAddress',
    'order.phoneNumber',
    'order.paymentMethod',
    'order.createdAt',
    'order.updatedAt',
    'item.id',
    'item.orderId',
    'item.productId',
    'item.quantity',
    'item.size',
    'item.color',
    'item.priceAtPurchase',
    'item.discountPercentAtPurchase',
    'product.id',
    'product.name',
  ],
  joins: [
    { propertyPath: 'order.items', alias: 'item', joinType: 'left' },
    { propertyPath: 'item.product', alias: 'product', joinType: 'left' },
  ],
};
