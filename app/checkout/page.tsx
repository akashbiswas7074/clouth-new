"use client";

import React, { useState } from "react";

// Importing UI components from custom UI library and icons from Lucide
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { toast } from "react-toast";
import { FaMapPin, FaCreditCard } from "react-icons/fa";
import { GiTicket } from "react-icons/gi"; // Game Icons collection
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { clerkClient } from "@clerk/nextjs/server";
import { json } from "stream/consumers";
import { createOrder } from "@/lib/database/actions/order.actions";

type Steps = {
  title: string;
  icon: React.ReactNode;
};

const steps: Steps[] = [
  { title: "Delivery Address", icon: <FaMapPin className="h-5 w-5" /> },
  { title: "Apply Coupon", icon: <GiTicket className="h-5 w-5" /> },
  { title: "Choose Payment", icon: <FaCreditCard className="h-5 w-5" /> },
];

const CheckoutPage = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const [deliveryAddress, setDeliveryAddress] = useState(() => {
    if (typeof window !== "undefined") {
      const savedAddress = localStorage.getItem("deliveryAddress");
      return savedAddress
        ? JSON.parse(savedAddress)
        : {
          phoneNumber: "",
          address1: "",
          address2: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
        };
    }
    return {
      phoneNumber: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    };
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // New state for cart data
  const [cart, setCart] = useState<any>(null);
  const [cartLoading, setCartLoading] = useState<boolean>(true);
  const [cartError, setCartError] = useState<string | null>(null);

  // Fetch cart on mount if user available
  useEffect(() => {
    async function fetchCart() {
      if (!isLoaded || !user) return;
      try {
        setCartLoading(true);
        const res = await fetch(`/api/cart?clerkId=${user.id}`);
        const data = await res.json();
        if (data.success && data.cart) {
          setCart(data.cart);
        } else {
          setCartError(data.message || "Error fetching cart.");
        }
      } catch (err: any) {
        console.error("Cart fetch error:", err);
        setCartError(err.message || "Error fetching cart.");
      } finally {
        setCartLoading(false);
      }
    }
    fetchCart();
  }, [isLoaded, user]);

  if (!isSignedIn) return <div>Sign in to view this page</div>;

  // Calculate order summary using cart data
  const subtotal =
    cart && cart.products
      ? cart.products.reduce(
        (sum: number, item: any) => sum + item.price * Number(item.qty),
        0
      )
      : 0;
  const discount = 600; // You can update this logic if needed
  const total = subtotal - discount;

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSaveAddress = async () => {
    try {
      // Assume saveAddress is defined and saves address in your backend
      const response = await saveAddress(deliveryAddress, user.id);
      console.log(response);
      if (response && response.success) {
        toast(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save address');
    } finally {
      handleNext();
    }
  };

  const handleConfirmPayment = async () => {
    if (paymentMethod === "paypal") {
      router.push("/checkout/paypal");
    } else if (paymentMethod === "cash-on-delivery") {
      // Call the createOrder API and pass the required parameters for a cash-on-delivery order.
      // Replace the placeholder values with actual data from your state.
      const orderResponse = await createOrder(
        cart?.products || [],
        deliveryAddress,
        "cash_on_delivery",
        total,
        total, // totalBeforeDiscount (update if needed)
        couponCode,
        user.id,
        0 // totalSaved (update if needed)
      );

      if (orderResponse.success) {
        router.push(`/order/${orderResponse.orderId}`);
      } else {
        console.error(orderResponse.message);
        // Optionally implement error UI here
      }
    }
  };

  return (
    <div className="container mx-auto pt-36 font-play">
      <h1 className="text-4xl text-[#646464] font-bold mb-6 text-center">CHECKOUT</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left section for checkout steps */}
        <div className="lg:w-2/3 w-full px-4">
          <div className="flex flex-col lg:flex-row mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center mb-4 lg:mb-0 lg:flex-row flex-col lg:space-x-4">
                <div
                  className={`rounded-full p-2 ${index <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                    }`}
                >
                  {index < currentStep ? null : step.icon}
                </div>
                <div className="ml-0 lg:ml-4 lg:mr-8 text-center lg:text-left">
                  <p className={`text-sm font-medium ${index <= currentStep ? "text-primary" : "text-secondary-foreground"}`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="h-0.5 w-8 bg-border mt-1 lg:mt-0 mr-0 lg:mr-4 hidden lg:block"></div>
                )}
              </div>
            ))}
          </div>

          <Card className="bg-[#f5f5f0]">
            <CardHeader>
              <CardTitle className="subHeading">{steps[currentStep].title}</CardTitle>
            </CardHeader>
            <CardContent>
              {currentStep === 0 && (
                <div className="space-y-4">
                  {/* Render Delivery Address form */}
                  {/* (Your existing delivery address form code goes here) */}
                  <Button className="w-full bg-[#c40600] text-white" onClick={handleSaveAddress}>
                    Save Address And Continue
                  </Button>
                </div>
              )}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <label htmlFor="couponCode">Enter Coupon Code</label>
                  <input
                    id="couponCode"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                  <Button className="w-full bg-[#c40600] text-white" onClick={handleNext}>
                    Apply Coupon
                  </Button>
                </div>
              )}
              {currentStep === 0 && (
                <div className="space-y-4">
                  {/* Render Payment method selection */}
                  {/* Form for inputting the delivery address */}
                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="First Name" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Last Name" />
                    </div>
                  </div> */}
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" placeholder="Phone Number" value={deliveryAddress.phoneNumber} onChange={(e) => setDeliveryAddress({ ...deliveryAddress, phoneNumber: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode">Zip Code / Postal Code</Label>
                      <Input
                        id="zipCode"
                        placeholder="Zip Code / Postal Code" value={deliveryAddress.zipCode}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, zipCode: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="City" value={deliveryAddress.city} onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input id="state" placeholder="State" value={deliveryAddress.state} onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        placeholder="Country"
                        defaultValue="India"
                        value={deliveryAddress.country} onChange={(e) => setDeliveryAddress({ ...deliveryAddress, country: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address1">Address 1</Label>
                    <Input id="address1" placeholder="Address 1" value={deliveryAddress.address1} onChange={(e) => setDeliveryAddress({ ...deliveryAddress, address1: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="address2">Address 2</Label>
                    <Input id="address2" placeholder="Address 2" value={deliveryAddress.address2} onChange={(e) => setDeliveryAddress({ ...deliveryAddress, address2: e.target.value })} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-lg font-semibold"></Label>
                <div className="grid grid-cols-1 gap-4">
                  <Card
                    className={`p-4 cursor-pointer transition-all ${paymentMethod === "paypal" ? "border-primary border-2" : ""
                      }`}
                    onClick={() => setPaymentMethod("paypal")}
                  >
                    <CardContent className="flex items-center space-x-4 p-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentMethod === "paypal"}
                        onChange={() => setPaymentMethod("paypal")}
                        className="h-4 w-4"
                      />
                      <div>
                        <h3 className="font-semibold">PayPal</h3>
                        <p className="text-sm text-muted-foreground">
                          Pay securely via PayPal
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`p-4 cursor-pointer transition-all ${paymentMethod === "card" ? "border-primary border-2" : ""
                      }`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <CardContent className="flex items-center space-x-4 p-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="h-4 w-4"
                      />
                      <div>
                        <h3 className="font-semibold">Credit/Debit Card</h3>
                        <p className="text-sm text-muted-foreground">
                          Pay with your card
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card
                    className={`p-4 cursor-pointer transition-all ${paymentMethod === "cash-on-delivery" ? "border-primary border-2" : ""
                      }`}
                    onClick={() => setPaymentMethod("cash-on-delivery")}
                  >
                    <CardContent className="flex items-center space-x-4 p-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash-on-delivery"
                        checked={paymentMethod === "cash-on-delivery"}
                        onChange={() => setPaymentMethod("cash-on-delivery")}
                        className="h-4 w-4"
                      />
                      <div>
                        <h3 className="font-semibold">Cash on Delivery</h3>
                        <p className="text-sm text-muted-foreground">
                          Pay at your door step
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <Button
                className="w-full bg-[#c40600] text-white hover:bg-[#a80500] transition-colors"
                onClick={handleConfirmPayment}
                disabled={!paymentMethod}
              >
                Confirm Payment
              </Button>
            </div>
          )}

          <div className="mt-4 flex space-x-4 justify-center lg:justify-start">
            {currentStep > 0 && (
              <Button variant={"outline"} className="bg-[#c40600] text-white" onClick={handlePrevious}>
                Back
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button variant={"outline"} className="bg-[#c40600] text-white" onClick={handleNext}>
                Continue
              </Button>
            )}
          </div>
        </div>

        {/* Right section for dynamic Order Summary */}
        <div className="lg:w-1/3 w-full px-4">
          <Card className="bg-[#f5f5f0]">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {cartLoading ? (
                <p>Loading order summary...</p>
              ) : cartError ? (
                <p>Error: {cartError}</p>
              ) : (
                <div className="space-y-4">
                  {cart?.products?.length > 0 ? (
                    cart.products.map((item: any, index: number) => {
                      // Safely access product id
                      const productId = item?.product?._id?.toString() || item?.product;
                      if (!productId) return null;

                      return (
                        <div key={index} className="flex justify-between">
                          <div>
                            <p className="font-semibold">ID: {productId}</p>
                            <p>Qty: {item.qty || 0}</p>
                          </div>
                          <p className="font-semibold">
                            ₹{((item.price || 0) * Number(item.qty || 0)).toFixed(2)}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p>No items in your cart.</p>
                  )}
                  <hr className="border-t border-border" />
                  <div className="flex justify-between">
                    <p>Subtotal:</p>
                    <p>₹{(cart?.cartTotal || 0).toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Discount:</p>
                    <p>₹{(cart?.totalAfterDiscount || 0).toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between font-bold">
                    <p>Total:</p>
                    <p>₹{((cart?.cartTotal || 0) - (cart?.totalAfterDiscount || 0)).toFixed(2)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

async function saveAddress(deliveryAddress: any, userId: string) {
  try {
    const response = await fetch('/api/address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        ...deliveryAddress
      })
    });

    //     const data = await response.json();

    //     if (!response.ok) {
    //       throw new Error(data.message || 'Failed to save address');
    //     }

    //     // Save to localStorage for persistence
    //     localStorage.setItem('deliveryAddress', JSON.stringify(deliveryAddress));

    //     return {
    //       success: true,
    //       message: 'Address saved successfully'
    //     };

  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error saving address'
    };
  }
}

export default CheckoutPage;
