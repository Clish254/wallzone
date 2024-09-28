import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import PaymentRequest, { IPaymentRequest } from "@/models/PaymentRequest";
import { Connection, PublicKey } from "@solana/web3.js";
import { encodeURL, findReference, validateTransfer } from "@solana/pay";
import BigNumber from "bignumber.js";
import Product from "@/models/Product";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const reference = searchParams.get("reference");
    if (!reference) {
      return NextResponse.json(
        { error: "reference is required" },
        { status: 400 },
      );
    }
    const paymentData: any = await PaymentRequest.findOne({
      reference: reference,
    });
    if (!paymentData) {
      return NextResponse.json(
        { error: "PaymentRequest not found" },
        { status: 404 },
      );
    }
    let { recipient, amount, memo } = paymentData;
    const clusterUrl = process.env.CLUSTER_URL;
    if (!clusterUrl) {
      console.log("CLUSTER_URL environment variable not set up");
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 },
      );
    }
    const connection = new Connection(clusterUrl, "confirmed");

    const found = await findReference(connection, new PublicKey(reference));
    amount = new BigNumber(amount);
    const response = await validateTransfer(
      connection,
      found.signature,
      {
        recipient: new PublicKey(recipient),
        amount,
        splToken: undefined,
        reference: new PublicKey(reference),
        memo,
      },
      { commitment: "confirmed" },
    );
    if (response) {
      return NextResponse.json({ status: "verified" }, { status: 200 });
    }
    return NextResponse.json(
      { error: "Could not verify transfer" },
      { status: 404 },
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

async function generateUrl(
  recipient: PublicKey,
  amount: BigNumber,
  reference: PublicKey,
  label: string,
  message: string,
  memo: string,
) {
  const url: URL = encodeURL({
    recipient,
    amount,
    reference,
    label,
    message,
    memo,
  });
  return { url };
}
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    let { recipient, amount, reference, label, message, memo, productId } =
      body;

    // Check if a creator with the given wallet address already exists
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product with the provided productId does not exist" },
        { status: 404 },
      );
    }

    const urlData = await generateUrl(
      new PublicKey(recipient),
      new BigNumber(amount),
      new PublicKey(reference),
      label,
      message,
      memo,
    );
    const paymentRequest = await PaymentRequest.create({
      productId: existingProduct._id,
      recipient,
      amount,
      reference,
      label,
      message,
      memo,
    });

    const { url } = urlData;
    return NextResponse.json({ url, reference }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
