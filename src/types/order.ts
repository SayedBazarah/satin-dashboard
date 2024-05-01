// ----------------------------------------------------------------------

import { useTranslate } from 'src/locales';

export type IOrderTableFilterValue = string | Date | null;

export type IOrderTableFilters = {
  name: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
};

// ----------------------------------------------------------------------

export type IOrderHistory = {
  orderTime: Date;
  paymentTime?: Date;
  deliveryTime?: Date;
  completionTime?: Date;
  timeline: {
    title?: string;
    time: Date;
  }[];
};

export type IOrderShippingAddress = {
  fullAddress: string;
  phoneNumber: string;
};

export type IOrderPayment = {
  cardType: string;
  cardNumber: string;
};

export type IOrderDelivery = {
  shipBy: string;
  speedy: string;
  trackingNumber: string;
};

export type IOrderCustomer = {
  id: string;
  name: string;
  email?: string;
  address?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  ipAddress?: string;
};

export type IOrderProductItem = {
  id: string;
  sku: string;
  name: string;
  price: number;
  coverUrl: string;
  quantity: number;
};

export type IBillinig = {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
};

export type IOrderItem = {
  _id: string;
  taxes: number;
  status: string;
  shipping: number;
  discount: number;
  subTotal: number;
  billing: IBillinig;
  orderNumber: number;
  totalAmount: number;
  totalQuantity: number;
  history: IOrderHistory;
  customer?: IOrderCustomer;
  delivery: IOrderDelivery;
  items: IOrderProductItem[];
  createdAt: Date;
};

export const OrderStatus = () => {
  const { t } = useTranslate();
  return [
    { value: 'pending', label: t('order.pending') },
    { value: 'completed', label: t('order.completed') },
    { value: 'cancelled', label: t('order.cancelled') },
    { value: 'refunded', label: t('order.refunded') },
  ];
};
