"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { Creator } from "@/components/Creator";
import { ICreator } from "@/models/Creator";
import { LoadingSpinner } from "@/components/Spinner";
import { IProduct } from "@/models/Product";
import { Product } from "@/components/Product";

export default function CreatorAccount() {
  const { publicKey } = useWallet();
  const [creator, setCreator] = useState<ICreator | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCreator() {
      if (!publicKey) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/creators/${publicKey.toBase58()}`);
        if (!response.ok) {
          if (response.status === 404) {
            // Creator not found
            setCreator(null);
          } else {
            throw new Error("Failed to fetch creator data");
          }
        } else {
          const data = await response.json();
          setCreator(data);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    }
    async function fetchProducts() {
      if (!publicKey) {
        return;
      }

      try {
        const response = await fetch(`/api/products/${publicKey.toBase58()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        } else {
          const data = await response.json();
          setProducts(data);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      }
    }

    fetchCreator();
    fetchProducts();
  }, [publicKey]);

  if (isLoading) {
    return <LoadingSpinner className="mr-2 h-4 w-4 animate-spin" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!publicKey) {
    return <div>Please connect your wallet to view your account.</div>;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      {creator ? (
        <div>
          <h1 className="my-4">Your profile</h1>
          <Creator creator={creator} />
          <h1 className="my-4">Your listings</h1>
          <div className="flex gap-4">
            {products.length &&
              products.map((product: IProduct) => (
                <Product product={product} />
              ))}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-4">You haven't signed up as a creator yet.</p>
          <Link
            href="/creator/signup"
            className="text-blue-500 hover:underline"
          >
            Sign up as a creator
          </Link>
        </div>
      )}
    </div>
  );
}
