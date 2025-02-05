"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import { FaShoppingCart } from "react-icons/fa";
import { AiOutlineClose, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import Link from "next/link";
import { useAtom, useStore } from "jotai";
import { cartMenuState } from "@/app/utils/data/store";
import { useUser } from "@clerk/nextjs";

interface CartItem {
  product: string | {
    id?: string;
    _id?: string;
  };
  qty: string;
  price: number;
}

const CartDrawer = () => {
  const [cartMenuOpen, setCartMenuOpen] = useAtom(cartMenuState, { store: useStore() });
  const { user, isLoaded } = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch cart if user is logged in
  useEffect(() => {
    async function fetchCart() {
      if (!isLoaded || !user) {
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(`/api/cart?clerkId=${user.id}`);
        const data = await res.json();
        if (data.success && data.cart && data.cart.products) {
          setCartItems(data.cart.products);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error("Error fetching cart", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, [isLoaded, user]);

  const handleOnClickCartMenu = () => {
    if (user) setCartMenuOpen(true);
  };

  const removeItem = (productId: string) => {
    setCartItems(cartItems.filter((item) => {
      const id = typeof item.product === "object"
        ? (item.product.id || item.product._id)
        : item.product;
      return id !== productId;
    }));
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (!user) return;
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkId: user.id, productId, newQty: newQuantity }),
      });
      const data = await res.json();
      if (data.success && data.cart) {
        setCartItems(data.cart.products);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error updating quantity", error);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * Number(item.qty), 0);

  return (
    <div className="z-[500] relative flex items-center">
      <Sheet open={cartMenuOpen} onOpenChange={setCartMenuOpen}>
        <SheetTrigger asChild>
          <button onClick={handleOnClickCartMenu}>
            <FaShoppingCart className="text-[#4a2b2b]" />
          </button>
        </SheetTrigger>
        <SheetContent className="w-[90%] max-w-[450px] sm:max-w-[540px]">
          <SheetHeader>
            <SheetTitle className="subHeading">CART</SheetTitle>
          </SheetHeader>
          {(!user) ? (
            <div className="p-4">
              <p>Please log in to view your cart.</p>
            </div>
          ) : loading ? (
            <div className="p-4">
              <p>Loading cart...</p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {cartItems.length === 0 ? (
                <p className="p-4">Your cart is empty.</p>
              ) : (
                cartItems.map((item, index) => {
                  const productId = item.product && typeof item.product === "object"
                    ? item.product.id || item.product._id
                    : item.product;
                  return (
                    <div key={index} className="flex items-center space-x-4 border-b-2 pb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-xs sm:text-sm tracking-wide">
                          Product ID: {productId}
                        </h3>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center">
                            <button
                              className="p-1"
                              onClick={() =>
                                updateQuantity(productId, Number(item.qty) - 1)
                              }
                            >
                              <AiOutlineMinus className="w-4 h-4" />
                            </button>
                            <span className="mx-2">{item.qty}</span>
                            <button
                              className="p-1"
                              onClick={() =>
                                updateQuantity(productId, Number(item.qty) + 1)
                              }
                            >
                              <AiOutlinePlus className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="font-semibold text-xs sm:text-base">
                            ₹{item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <button onClick={() => removeItem(productId)} className="text-gray-500 hover:text-gray-700">
                          <AiOutlineClose className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
          {user && cartItems.length > 0 && (
            <div className="absolute bottom-2 w-[90%] mt-6 bg-white">
              <p className="text-sm text-gray-500">
                Tax included. Shipping calculated at checkout.
              </p>
              <Link href={"/checkout"}>
                <Button className="w-full mt-4 bg-[#c40600]">
                  CHECKOUT - ₹{total.toFixed(2)}
                </Button>
              </Link>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CartDrawer;
