"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { FaArrowLeft, FaMapPin, FaCreditCard } from "react-icons/fa";
import { GiTicket } from "react-icons/gi";
import { MdCheckCircle, MdAutorenew } from "react-icons/md"; // Updated import
import Link from "next/link";
import { useParams } from "next/navigation";
import { getOrderDetailsById } from "@/lib/database/actions/order.actions";
import { format } from "date-fns";

const formatDate = (dateString: string | number | Date) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Date unavailable';
    }
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    return 'Date unavailable';
  }
};

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
        <MdAutorenew className="h-8 w-8 animate-spin" /> {/* Updated component */}
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Access order safely as order is guaranteed by now */}
      <div className="max-w-full mx-auto bg-white shadow-md">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Link href="/" className="flex items-center mb-4">
              <FaArrowLeft className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Home</span>
            </Link>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">
                THANK YOU {order.orderAddress?.name}
              </h1>
              <p className="text-gray-600">Order ID: {order._id}</p>
            </div>
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
                  <div className="capitalize">{order.paymentMethod?.replace(/_/g, ' ')}</div>
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 p-4">
                  <div className="font-semibold text-sm mb-1">TOTAL:</div>
                  <div>₹{order.cartTotal?.toFixed(2)}</div>
                </div>
              </div>
            </div>
            <div className="mb-6 border rounded-lg overflow-hidden">
              <div className="p-4">
                <h2 className="font-semibold text-lg mb-2">Shipping Address</h2>
                <p>{order.orderAddress?.address1}</p>
                <p>{order.orderAddress?.address2}</p>
                <p>{order.orderAddress?.city}, {order.orderAddress?.state} {order.orderAddress?.zipCode}</p>
                <p>{order.orderAddress?.country}</p>
                <p>Phone: {order.orderAddress?.phoneNumber}</p>
              </div>
            </div>
            <div className="mb-6 border rounded-lg overflow-hidden">
              <div className="p-4">
                <h2 className="font-semibold text-lg mb-2">Products</h2>
                {order.products.map((product: any, index: number) => (
                  <div key={index} className="mb-4">
                    <p><strong>Name:</strong> {product.product.name}</p>
                    <p><strong>Quantity:</strong> {product.qty}</p>
                    <p><strong>Price:</strong> ₹{product.price}</p>
                    <p><strong>Size:</strong> {product.size}</p>
                    <p><strong>Color:</strong> {product.color.color}</p>
                  </div>
                ))}
              </div>
            </div>
            <Link href={"/"}>
              <Button className="w-full mt-3">CONTINUE SHOPPING</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;