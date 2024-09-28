import { IProduct } from "@/models/Product";
import Image from "next/image";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "./ui/button";
import { truncateString } from "@/lib/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast, Toaster } from "sonner";
import { Keypair } from "@solana/web3.js";
import { LoadingSpinner } from "./Spinner";
import { createQR } from "@solana/pay";
import { PaymentDialog } from "./PaymentDialog";

interface ProductCardProps {
  product: IProduct;
}
export const Product = ({ product }: ProductCardProps) => {
  const { publicKey } = useWallet();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string>("");
  const [reference, setReference] = useState<string>("");

  const handleGenerateClick = async () => {
    if (!publicKey) {
      toast.error("Please connect your wallet");
      return;
    }
    const reference = new Keypair().publicKey.toBase58();
    setReference(reference);
    const payload = {
      recipient: product.walletAddress,
      amount: product.price,
      reference,
      label: product.name,
      message: `${product._id} order by ${publicKey.toBase58()}`,
      memo: `${product._id} order by ${publicKey.toBase58()}`,
      productId: product._id,
    };
    setLoading(true);
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const data = await response.json();
      const qr = createQR(data.url);
      const qrBlob = await qr.getRawData("png");
      if (!qrBlob) return;
      // 3 - Convert the blob to a base64 string (using FileReader) and set the QR code state
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === "string") {
          setQrCode(event.target.result);
        }
      };
      reader.readAsDataURL(qrBlob);
      setOpen(true);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      if (error?.message) {
        toast.error(`${error?.message}`);
      } else {
        toast.error(`Error saving creator`);
        console.error("Error saving creator:", error);
        console.log(error.message);
      }
    }
  };
  return (
    <Card className="max-w-[409px]">
      <CardContent className="flex flex-col">
        <Image
          src={product.wallpaper}
          width={400}
          height={300}
          alt={`${product.name}'s wallpaper`}
          className="my-2"
        />
        <div>
          <h2 className="text-xl font-bold text-center">{product.name}</h2>
          <p className="text-center">{product.description}</p>
        </div>
      </CardContent>

      <CardFooter className="flex f justify-between">
        <span>{product.price} SOL</span>

        {!loading && publicKey?.toBase58() !== product.walletAddress && (
          <Button onClick={handleGenerateClick}>Buy now</Button>
        )}
        {loading && <LoadingSpinner className="mr-2 h-4 w-4 animate-spin" />}
      </CardFooter>

      <Toaster position="bottom-right" richColors />
      {qrCode && reference && (
        <PaymentDialog
          open={open}
          setOpen={setOpen}
          qrCode={qrCode}
          reference={reference}
          setQrCode={setQrCode}
          setReference={setReference}
        />
      )}
    </Card>
  );
};
