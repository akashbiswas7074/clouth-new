"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getUserOrders } from "@/lib/database/actions/order.actions";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/components/ui/badge"
// Replace lucide-react icons with react-icons
import { FaSpinner, FaBoxOpen } from "react-icons/fa";
import { format } from "date-fns";
import Link from "next/link";

// Types
interface OrderProduct {
  product: {
    _id: string;
    price: number;
    name: string;
    image?: string;
    fabricId?: { name: string; type: string };
    colorId?: { name: string };
    measurementId?: {
      collar: number;
      chest: number;
      waist: number;
      sleevesLength: number;
    };
  };
  qty: string;
  price: number;
}

interface Order {
  _id: string;
  products: OrderProduct[];
  cartTotal: number;
  totalAfterDiscount: number;
  orderConfirmation: boolean;
  deliveryStatus: "pending" | "shipped" | "delivered";
  price: number;
  deliveryCost: number;
  paymentMethod: "credit_card" | "debit_card" | "paypal" | "cash_on_delivery";
  paymentTime: string;
  receipt: string;
  orderAddress: {
    phoneNumber: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    active: boolean;
  };
  createdAt: string;
}

// Status Badge Component
const DeliveryStatusBadge = ({ status }: { status: Order["deliveryStatus"] }) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    shipped: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800"
  };

  return (
    <Badge className={`${statusColors[status]} capitalize`}>
      {status}
    </Badge>
  );
};

// Payment Method Badge Component
const PaymentMethodBadge = ({ method }: { method: Order["paymentMethod"] }) => {
  const displayNames = {
    credit_card: "Credit Card",
    debit_card: "Debit Card",
    paypal: "PayPal",
    cash_on_delivery: "Cash on Delivery"
  };

  return (
    <Badge variant="outline" className="capitalize">
      {displayNames[method]}
    </Badge>
  );
};

// Order Card Component
const OrderCard = ({ order }: { order: Order }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (error) {
      return 'Date not available';
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* Order Header */}
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div>
            <Link href={`/order/${order._id}`} className="font-medium hover:underline">
              Order ID: {order._id}
            </Link>
            <p className="text-sm text-gray-500">
              Placed on {formatDate(order.createdAt)}
            </p>
            <div className="mt-2">
              <DeliveryStatusBadge status={order.deliveryStatus} />
            </div>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="font-medium">Total: ₹{order.cartTotal.toFixed(2)}</p>
            {order.totalAfterDiscount < order.cartTotal && (
              <p className="text-sm text-green-600">
                Discounted: ₹{order.totalAfterDiscount.toFixed(2)}
              </p>
            )}
            <div className="mt-2">
              <PaymentMethodBadge method={order.paymentMethod} />
            </div>
          </div>
        </div>

        {/* Products List */}
        {order.products.map((item, index) => (
          item.product && (
            <div key={index} className="border-t pt-4 mb-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Product Details</h3>
                  <div className="space-y-1 text-sm">
                    <p>Name: {item.product.name || 'Custom Shirt'}</p>
                    <p>Quantity: {item.qty}</p>
                    <p>Price per item: ₹{item.price}</p>
                    {item.product.fabricId && (
                      <p>Fabric: {item.product.fabricId.name} ({item.product.fabricId.type})</p>
                    )}
                    {item.product.colorId && (
                      <p>Color: {item.product.colorId.name}</p>
                    )}
                  </div>
                </div>

                {/* Measurements & Shipping Details */}
                <div>
                  {item.product.measurementId && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-1">Measurements</h4>
                      <div className="text-sm grid grid-cols-2 gap-2">
                        <p>Collar: {item.product.measurementId.collar}″</p>
                        <p>Chest: {item.product.measurementId.chest}″</p>
                        <p>Waist: {item.product.measurementId.waist}″</p>
                        <p>Sleeves: {item.product.measurementId.sleevesLength}″</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        ))}

        {/* Shipping Address */}
        <div className="border-t pt-4 grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Shipping Address</h3>
            <div className="text-sm space-y-1">
              <p>{order.orderAddress.address1}</p>
              {order.orderAddress.address2 && <p>{order.orderAddress.address2}</p>}
              <p>{order.orderAddress.city}, {order.orderAddress.state} {order.orderAddress.zipCode}</p>
              <p>{order.orderAddress.country}</p>
              <p>Phone: {order.orderAddress.phoneNumber}</p>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <h3 className="font-medium mb-2">Payment Details</h3>
            <div className="text-sm space-y-1">
              <p>Payment Date: {formatDate(order.paymentTime)}</p>
              <p>Delivery Cost: ₹{order.deliveryCost.toFixed(2)}</p>
              {order.receipt && <p>Receipt Number: {order.receipt}</p>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main History Page Component
export default function OrderHistory() {
  const { user, isLoaded } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await getUserOrders(user.id);
        if (response.success && response.orders) {
          setOrders(response.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded) {
      fetchOrders();
    }
  }, [user, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <FaSpinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <p className="text-gray-500">Please sign in to view your order history</p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <FaBoxOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No orders found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
}