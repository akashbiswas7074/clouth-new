import { NextResponse } from "next/server";
import { getSavedCartForUser, updateCartItemQuantity } from "@/lib/database/actions/cart.actions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clerkId, productId, newQty } = body;
    if (!clerkId || !productId || newQty == null) {
      return NextResponse.json({ success: false, message: "Missing required fields" });
    }
    const result = await updateCartItemQuantity(clerkId, productId, Number(newQty));
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Internal server error" });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get("clerkId");
    if (!clerkId) {
      return NextResponse.json({ success: false, message: "Missing clerkId" });
    }
    const result = await getSavedCartForUser(clerkId);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Internal server error" });
  }
}
