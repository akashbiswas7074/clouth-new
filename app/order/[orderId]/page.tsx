"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";
import { MdCheckCircle } from "react-icons/md";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getOrderDetailsById } from "@/lib/database/actions/order.actions";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

const OrderPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        const response = await getOrderDetailsById(orderId as string);
        if (response.success) {
          setOrder(response.order);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error || "Order not found"}</p>
      </div>
    );
  }

  const formatDate = (dateString: string | number | Date) => {
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Date unavailable';
      }
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      return 'Date unavailable';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-full mx-auto bg-white shadow-md">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Back link */}
            <Link href="/" className="flex items-center mb-4">
              <FaArrowLeft className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Home</span>
            </Link>

            {/* Order header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">
                THANK YOU {order.orderAddress.name}
              </h1>
              <p className="text-gray-600">Order ID: {order._id}</p>
            </div>

            {/* Order details grid */}
            <div className="mb-6 border rounded-lg overflow-hidden">
              <div className="flex flex-wrap">
                <div className="w-full sm:w-1/2 md:w-1/5 p-4 border-b sm:border-b-0 sm:border-r">
                  <div className="font-semibold text-sm mb-1">ORDER NUMBER:</div>
                  <div>{order._id}</div>
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 p-4 border-b md:border-b-0 md:border-r">
                  <div className="font-semibold text-sm mb-1">DATE:</div>
                  <div>{formatDate(order.createdAt)}</div>
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 p-4 border-b md:border-b-0 md:border-r">
                  <div className="font-semibold text-sm mb-1">PAYMENT METHOD:</div>
                  <div className="capitalize">{order.paymentMethod.replace(/_/g, ' ')}</div>
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 p-4">
                  <div className="font-semibold text-sm mb-1">TOTAL:</div>
                  <div>₹{order.cartTotal.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Main content grid */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left column */}
              <div className="flex-1">
                {/* Order status */}
                <div className="flex items-center mb-4">
                  <MdCheckCircle className="w-[50px] h-[50px] text-green-500 mr-2 flex-shrink-0" />
                  <div>
                    <h2 className="text-xl font-semibold">
                      Your order is confirmed
                    </h2>
                    <p className="text-gray-600">
                      Order will be delivered to you in 2-3 days
                    </p>
                  </div>
                </div>

                {/* Delivery address */}
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{order.orderAddress.name}</span>
                    <span className="text-gray-600">{order.orderAddress.phoneNumber}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {order.orderAddress.address1}
                    {order.orderAddress.address2 && <><br />{order.orderAddress.address2}</>}
                    <br />
                    {order.orderAddress.city}, {order.orderAddress.state}
                    <br />
                    {order.orderAddress.zipCode}
                    <br />
                    {order.orderAddress.country}
                  </p>
                </div>

                {/* Order items */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">{order.products.length} Items</span>
                    <span className="font-medium">₹{order.cartTotal.toFixed(2)}</span>
                  </div>

                  {order.products.map((item: any, index: number) => (
                    <div key={index} className="flex items-center mt-4 first:mt-0">
                      {/* <img
                        src={item.product.image || '/placeholder.png'}
                        alt={`Product ${index + 1}`}
                        className="mr-4 w-[60px] h-[60px] object-cover"
                      /> */}
                      <div>
                        {/* <h3 className="font-medium">Custom Shirt #{item.product._id}</h3> */}
                        <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                        <div className="flex items-center mt-1">
                          <span className="font-medium mr-2">₹{item.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column - Order summary */}
              <div className="flex-1">
                {order.totalAfterDiscount && order.totalAfterDiscount < order.cartTotal && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <MdCheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-green-700">
                        You saved ₹{(order.cartTotal - order.totalAfterDiscount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="bg-gray-100 rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{order.cartTotal.toFixed(2)}</span>
                    </div>
                    
                    {order.totalAfterDiscount && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-₹{(order.cartTotal - order.totalAfterDiscount).toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>₹{order.deliveryCost.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Total</span>
                      <span>₹{(order.totalAfterDiscount || order.cartTotal).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Link href="/form-new">
                  <Button className="w-full mt-3">CONTINUE SHOPPING</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;