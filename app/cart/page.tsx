"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { 
  getSavedCartForUser, 
  updateCartItemQuantity, 
  deleteShirtFromCart 
} from "@/lib/database/actions/cart.actions";
import { getFabricById } from "@/lib/database/actions/admin/ShirtArea/Fabric/fabric.actions";
import { getColorById } from "@/lib/database/actions/admin/ShirtArea/Color/color.actions";
import { getMeasurementById } from "@/lib/database/actions/measurement.actions";
import Image from "next/image";
import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface ShirtDetails {
  _id: string;
  price: number;
  collarStyle?: { name: string };
  collarButton?: { name: string };
  collarHeight?: { name: string };
  cuffStyle?: { name: string };
  cuffLinks?: { name: string };
  watchCompatible?: boolean;
  bottom?: { name: string };
  back?: { name: string };
  pocket?: { name: string };
  placket?: { name: string };
  sleeves?: { name: string };
  fit?: { name: string };
  fabricId?: string;
  colorId?: string;
  measurementId?: string;
  fabricDetails?: {
    name: string;
    type: string;
    image?: string;
  };
  colorDetails?: {
    name: string;
    hexCode: string;
    image?: string;
  };
  measurementDetails?: {
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

const ShirtFeatures = ({ details }: { details: ShirtDetails }) => {
  const features = [
    { label: 'Collar Style', value: details.collarStyle?.name },
    { label: 'Collar Button', value: details.collarButton?.name },
    { label: 'Collar Height', value: details.collarHeight?.name },
    { label: 'Cuff Style', value: details.cuffStyle?.name },
    { label: 'Cuff Links', value: details.cuffLinks?.name },
    { label: 'Bottom', value: details.bottom?.name },
    { label: 'Back', value: details.back?.name },
    { label: 'Pocket', value: details.pocket?.name },
    { label: 'Placket', value: details.placket?.name },
    { label: 'Sleeves', value: details.sleeves?.name },
    { label: 'Fit', value: details.fit?.name },
  ].filter(f => f.value);

  return (
    <div className="grid grid-cols-2 gap-2 text-sm">
      {features.map((f, i) => (
        <p key={i}>
          <span className="text-gray-600">{f.label}:</span> {f.value}
        </p>
      ))}
      <p>
        <span className="text-gray-600">Watch Compatible:</span>
        {details.watchCompatible ? ' Yes' : ' No'}
      </p>
    </div>
  );
};

const CartItem = ({ 
  item, 
  onUpdateQuantity, 
  onDelete, 
  isUpdating 
}: {
  item: CartItem;
  onUpdateQuantity: (id: string, qty: number) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isUpdating: boolean;
}) => {
  const [details, setDetails] = useState<ShirtDetails>(item.product);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const [fabricRes, colorRes, measurementRes] = await Promise.all([
          details.fabricId ? getFabricById(details.fabricId) : null,
          details.colorId ? getColorById(details.colorId) : null,
          details.measurementId ? getMeasurementById(details.measurementId) : null
        ]);

        setDetails({
          ...details,
          fabricDetails: fabricRes?.fabric,
          colorDetails: colorRes?.color,
          measurementDetails: measurementRes || undefined
        });
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetails();
  }, [item.product]);

  if (isLoading) {
    return <Card className="w-full p-6 flex justify-center">
      <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" />
    </Card>;
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between">
          <h3 className="font-semibold text-lg">Custom Shirt</h3>
          <div className="text-right">
            <p className="font-bold text-lg">
              ${(item.price * parseInt(item.qty)).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              ${item.price.toFixed(2)} each
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Style Details</h4>
              <ShirtFeatures details={details} />
            </div>

            {(details.fabricDetails || details.colorDetails) && (
              <div>
                <h4 className="font-medium mb-2">Material</h4>
                {details.fabricDetails && (
                  <p className="text-sm">
                    Fabric: {details.fabricDetails.name} 
                    {details.fabricDetails.type && ` (${details.fabricDetails.type})`}
                  </p>
                )}
                {details.colorDetails && (
                  <div className="flex items-center gap-2 mt-1">
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: details.colorDetails.hexCode }}
                    />
                    <p className="text-sm">{details.colorDetails.name}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {details.measurementDetails && (
            <div>
              <h4 className="font-medium mb-2">Measurements</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p>Collar: {details.measurementDetails.collar}″</p>
                <p>Chest: {details.measurementDetails.chest}″</p>
                <p>Waist: {details.measurementDetails.waist}″</p>
                <p>Sleeves: {details.measurementDetails.sleevesLength}″</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => onUpdateQuantity(item.product._id, parseInt(item.qty) - 1)}
              disabled={isUpdating || parseInt(item.qty) <= 1}
            >
              <FaMinus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">
              {isUpdating ? <AiOutlineLoading3Quarters className="h-4 w-4 animate-spin" /> : item.qty}
            </span>
            <Button
              size="icon"
              variant="outline"
              onClick={() => onUpdateQuantity(item.product._id, parseInt(item.qty) + 1)}
              disabled={isUpdating}
            >
              <FaPlus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            size="icon"
            variant="destructive"
            onClick={() => onDelete(item.product._id)}
            disabled={isUpdating}
          >
            <FaTrashAlt className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function CartPage() {
  const { user } = useUser();
  const [cart, setCart] = useState<CartData['cart']>(undefined);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    if (!user) {
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
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, newQty: number) => {
    if (!user?.id) return;
    
    setUpdatingItem(productId);
    try {
      const response = await updateCartItemQuantity(user.id, productId, newQty);
      if (response.success && response.cart) {
        setCart(response.cart);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!user?.id) return;

    setUpdatingItem(productId);
    try {
      const response = await deleteShirtFromCart(user.id, productId);
      if (response.success) {
        toast.success("Item removed from cart");
        setCart(response.cart);
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    } finally {
      setUpdatingItem(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <AiOutlineLoading3Quarters className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!cart?.products?.length) {
    return (
      <div className="min-h-screen pt-16 flex flex-col items-center justify-center">
        <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
        <Link href="/customize">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="space-y-6">
        {cart.products.map((item) => (
          <CartItem
            key={item.product._id}
            item={item}
            onUpdateQuantity={updateQuantity}
            onDelete={handleDelete}
            isUpdating={updatingItem === item.product._id}
          />
        ))}

        <div className="mt-8 border-t pt-6">
          <div className="flex flex-col items-end gap-2">
            <p className="text-2xl font-bold">
              Total: ${cart.cartTotal.toFixed(2)}
            </p>
            {cart.totalAfterDiscount !== undefined && (
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
    </div>
  );
}