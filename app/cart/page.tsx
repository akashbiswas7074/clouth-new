"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Loader2, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { getSavedCartForUser, updateCartItemQuantity } from "@/lib/database/actions/cart.actions";

interface ShirtDetails {
  _id: string;
  price: number;
  collarStyle: { name: string };
  collarButton: { name: string };
  collarHeight: { name: string };
  cuffStyle: { name: string };
  cuffLinks: { name: string };
  watchCompatible: boolean;
  bottom: { name: string };
  back: { name: string };
  pocket: { name: string };
  placket: { name: string };
  sleeves: { name: string };
  fit: { name: string };
  fabricId?: { 
    name: string;
    type: string;
  };
  colorId?: { 
    name: string;
    code: string;
  };
  measurementId?: {
    collar: number;
    chest: number;
    waist: number;
    sleevesLength: number;
  };
}

interface CartItem {
  product: ShirtDetails;
  qty: string;
  price: number;
}

interface CartData {
  success: boolean;
  cart?: {
    products: CartItem[];
    cartTotal: number;
    totalAfterDiscount?: number;
  };
  message?: string;
}

const CartItem = ({ item, onUpdateQuantity }: {
  item: CartItem;
  onUpdateQuantity: (id: string, qty: number) => Promise<void>;
}) => {
  const getDisplayDetails = () => {
    const details = [];

    // Style Details
    if (item.product.collarStyle?.name) {
      details.push({ category: "Style", label: "Collar", value: item.product.collarStyle.name });
    }
    if (item.product.cuffStyle?.name) {
      details.push({ category: "Style", label: "Cuff", value: item.product.cuffStyle.name });
    }
    if (item.product.fit?.name) {
      details.push({ category: "Style", label: "Fit", value: item.product.fit.name });
    }

    // Material Details
    if (item.product.fabricId?.name) {
      details.push({ 
        category: "Material", 
        label: "Fabric", 
        value: `${item.product.fabricId.name} (${item.product.fabricId.type})` 
      });
    }
    if (item.product.colorId?.name) {
      details.push({ 
        category: "Material", 
        label: "Color", 
        value: item.product.colorId.name 
      });
    }

    // Features
    if (item.product.pocket?.name) {
      details.push({ category: "Features", label: "Pocket", value: item.product.pocket.name });
    }
    if (item.product.placket?.name) {
      details.push({ category: "Features", label: "Placket", value: item.product.placket.name });
    }
    if (item.product.watchCompatible) {
      details.push({ category: "Features", label: "Watch", value: "Compatible" });
    }

    return details.reduce((acc, detail) => {
      if (!acc[detail.category]) {
        acc[detail.category] = [];
      }
      acc[detail.category].push({ label: detail.label, value: detail.value });
      return acc;
    }, {} as Record<string, { label: string; value: string }[]>);
  };

  const details = getDisplayDetails();

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex justify-between mb-4">
          <div className="space-y-4 flex-grow">
            <div>
              <h3 className="font-semibold text-lg">Custom Shirt</h3>
              <p className="text-sm text-gray-500 mb-2">ID: {item.product._id}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(details).map(([category, items]) => (
                <div key={category}>
                  <h4 className="font-medium text-sm mb-2">{category}</h4>
                  <div className="space-y-1">
                    {items.map((detail, index) => (
                      <p key={index} className="text-sm">
                        {detail.label}: <span className="font-medium">{detail.value}</span>
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {item.product.measurementId && (
              <div className="border-t pt-3">
                <h4 className="font-medium text-sm mb-2">Measurements</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <p className="text-sm">
                    Collar: <span className="font-medium">{item.product.measurementId.collar}″</span>
                  </p>
                  <p className="text-sm">
                    Chest: <span className="font-medium">{item.product.measurementId.chest}″</span>
                  </p>
                  <p className="text-sm">
                    Waist: <span className="font-medium">{item.product.measurementId.waist}″</span>
                  </p>
                  <p className="text-sm">
                    Sleeves: <span className="font-medium">{item.product.measurementId.sleevesLength}″</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="text-right min-w-[150px]">
            <p className="font-semibold text-lg mb-1">
              ${(item.price * parseInt(item.qty)).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mb-3">
              ${item.price.toFixed(2)} each
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => onUpdateQuantity(item.product._id, parseInt(item.qty) - 1)}
                disabled={parseInt(item.qty) <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{item.qty}</span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => onUpdateQuantity(item.product._id, parseInt(item.qty) + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function CartPage() {
  const { isLoaded, user } = useUser();
  const [cart, setCart] = useState<CartData['cart']>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCart() {
      if (!isLoaded || !user) {
        setLoading(false);
        return;
      }

      try {
        const response = await getSavedCartForUser(user.id);
        if (response.success && response.cart) {
          setCart(response.cart);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, [isLoaded, user]);

  const updateQuantity = async (productId: string, newQty: number) => {
    if (!user?.id || newQty < 1) return;

    try {
      const response = await updateCartItemQuantity(user.id, productId, newQty);
      if (response.success && response.cart) {
        setCart(response.cart);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <p>Please sign in to view your cart</p>
        <Link href="/sign-in">
          <Button className="ml-4">Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      {!cart?.products?.length ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
          <Link href="/customize">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {cart.products.map((item) => (
            <CartItem
              key={item.product._id}
              item={item}
              onUpdateQuantity={updateQuantity}
            />
          ))}

          <div className="mt-8 border-t pt-6">
            <div className="flex flex-col items-end gap-2">
              <p className="text-2xl font-bold">
                Total: ${cart.cartTotal.toFixed(2)}
              </p>
              {cart.totalAfterDiscount && (
                <p className="text-xl text-green-600">
                  Discounted Total: ${cart.totalAfterDiscount.toFixed(2)}
                </p>
              )}
              <Link href="/checkout">
                <Button size="lg" className="mt-4">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}