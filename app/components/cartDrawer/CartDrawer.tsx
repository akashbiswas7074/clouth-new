"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
// import { ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
// import { AiOutlineClose, Minus, Plus } from "lucide-react";
import { FaShoppingCart } from "react-icons/fa";
import { AiOutlineClose, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import Link from "next/link";
import { useAtom, useStore } from "jotai";
import { cartMenuState } from "@/app/utils/data/store";
const CartDrawer = () => {
  const [cartMenuOpen, setCartMenuOpen] = useAtom(cartMenuState, {
    store: useStore(),
  });
  const handleOnClickCartMenu = () => {
    setCartMenuOpen(true);
    console.log("cart", cartMenuOpen);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const closeCartMenu = () => {
    setCartMenuOpen(false);
  };

  interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Cotton shirts",
      price: 1615,
      quantity: 4,
      image:
        "/archive/relaxed-young-man-with-checkered-shirt-posing-2021-08-26-23-05-04-utc.jpg",
    },
    {
      id: "2",
      name: "Black Shirts",
      price: 2300,
      quantity: 4,
      image:
        "/archive/shirts-2022-11-10-08-14-58-utc.jpg",
    },
  ]);
  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };
  const updateQuantity = (id: string, newQuantity: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return (
    <div className="relative flex items-center">
      <Sheet open={cartMenuOpen} onOpenChange={setCartMenuOpen}>
        <SheetTrigger asChild>
          <button
            onClick={() => 
              handleOnClickCartMenu }
          >
            <FaShoppingCart className="text-[#4a2b2b]"/>
            
          </button>
        </SheetTrigger>
        <SheetContent className="w-[90%] max-w-[450px] sm:max-w-[540px]">
          <SheetHeader>
            <SheetTitle className="subHeading">CART</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            {cartItems.map((item) => (
              <div
                className="flex items-center space-x-4 border-b-2 pb-3"
                key={item.id}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-xs sm:text-sm tracking-wide">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Buy More Save More
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <button
                        className="p-1"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <AiOutlineMinus className="w-4 h-4" />
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        className="p-1"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
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
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <AiOutlineClose className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-2 w-[90%] mt-6  bg-white">
            <p className="text-sm text-gray-500">
              Tax included. Shipping calculated at checkout.
            </p>
            <Link href={"/checkout"}>
              <Button className="w-full mt-4 bg-[#c40600]">
                CHECKOUT - ${total.toFixed(2)}
              </Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CartDrawer;
