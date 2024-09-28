import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product, { IProduct } from "@/models/Product";

export async function GET() {
  await dbConnect();

  try {
    const products = await Product.find({});
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const body = await request.json();
    const { name, description, wallpaper, price, walletAddress } = body;

    // Check if a creator with the given wallet address already exists
    const existingProduct = await Product.findOne({ wallpaper });
    if (existingProduct) {
      return NextResponse.json(
        { error: "Product with this wallpaper already exists" },
        { status: 400 },
      );
    }

    const product = await Product.create({
      name,
      description,
      price,
      wallpaper,
      walletAddress,
    });
    console.log(product);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
