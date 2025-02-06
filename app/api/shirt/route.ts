import { NextResponse } from "next/server";
import { createShirt } from "@/lib/database/actions/admin/ShirtArea/Shirt/shirt.actions";
import { useUser } from "@clerk/nextjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Extract necessary fields from the request body
    const {
      price,
      bottom,
      back,
      sleeves,
      cuffstyle,
      cufflinks,
      collarstyle,
      collarheight,
      collarbutton,
      placket,
      pocket,
      fit,
      watchCompatible,
      colorId,
      fabricId,
    } = body;

    const { user } = useUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    const result = await createShirt(
      price,
      bottom,
      back,
      sleeves,
      cuffstyle,
      cufflinks,
      collarstyle,
      collarheight,
      collarbutton,
      placket,
      pocket,
      fit,
      watchCompatible,
      colorId,
      fabricId,
      user.id
    );

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error creating shirt." },
      { status: 500 }
    );
  }
}