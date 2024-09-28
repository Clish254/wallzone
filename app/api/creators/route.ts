import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Creator, { ICreator } from "@/models/Creator";

export async function GET() {
  await dbConnect();

  try {
    const creators = await Creator.find({});
    return NextResponse.json(creators);
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
    const { name, bio, socialLink, profilePicture, walletAddress } = body;

    // Check if a creator with the given wallet address already exists
    const existingCreator = await Creator.findOne({ walletAddress });
    if (existingCreator) {
      return NextResponse.json(
        { error: "Creator with this wallet address already exists" },
        { status: 400 },
      );
    }

    const creator = await Creator.create({
      name,
      bio,
      socialLink,
      profilePicture,
      walletAddress,
    });
    return NextResponse.json(creator, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
