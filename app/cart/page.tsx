"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "../components/ui/card";
import { Loader2 } from "lucide-react";

interface CartData {
  success: boolean;
  cart?: any;
  message?: string;
}

export default function CartPage() {
  const { isLoaded, user } = useUser();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCart() {
      if (!isLoaded || !user) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/cart?clerkId=${user.id}`);
        const data: CartData = await res.json();
        if (data.success) {
          setCart(data.cart);
        } else {
          setError(data.message || "Error retrieving cart.");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, [isLoaded, user]);

  if (!isLoaded) return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <Loader2 className="animate-spin" />
      <span className="ml-2">Loading user...</span>
    </div>
  );
  
  if (!user) return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <p className="text-lg">Please log in to view your cart.</p>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <Loader2 className="animate-spin" />
      <span className="ml-2">Loading cart...</span>
    </div>
  );

  if (error) return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <p className="text-red-500">Error: {error}</p>
    </div>
  );

  const products = cart?.products || [];

  return (
    <div className="min-h-screen pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Your cart is empty.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4">
              {products.map((item: any, index: number) => {
                const productId =
                  item.product && typeof item.product === "object"
                    ? item.product.id || item.product._id
                    : item.product;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <span className="font-medium">Product ID:</span>
                          <p className="text-gray-600">{productId}</p>
                        </div>
                        <div>
                          <span className="font-medium">Price:</span>
                          <p className="text-gray-600">${item.price}</p>
                        </div>
                        <div>
                          <span className="font-medium">Quantity:</span>
                          <p className="text-gray-600">{item.qty}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="mt-8 border-t pt-6">
              <div className="flex flex-col items-end space-y-2">
                <h2 className="text-2xl font-bold">
                  Total: ${cart.cartTotal}
                </h2>
                {cart.totalAfterDiscount && (
                  <h3 className="text-xl text-green-600">
                    Total After Discount: ${cart.totalAfterDiscount}
                  </h3>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}