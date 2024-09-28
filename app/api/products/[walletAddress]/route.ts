import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(
  request: NextRequest,
  { params }: { params: { walletAddress: string } },
) {
  await dbConnect();

  try {
    const { walletAddress } = params;
    const creator = await Product.find({ walletAddress });

    return NextResponse.json(creator);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
