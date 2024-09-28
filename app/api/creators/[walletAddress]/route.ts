import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Creator from "@/models/Creator";

export async function GET(
  request: NextRequest,
  { params }: { params: { walletAddress: string } },
) {
  await dbConnect();

  try {
    const { walletAddress } = params;
    const creator = await Creator.findOne({ walletAddress });

    if (!creator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    return NextResponse.json(creator);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
