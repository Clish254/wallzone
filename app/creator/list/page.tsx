"use client";

import { ListProduct } from "@/components/ListProduct";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { ICreator } from "@/models/Creator";
import { LoadingSpinner } from "@/components/Spinner";
import Link from "next/link";

export default function List() {
  const { publicKey } = useWallet();
  const [creator, setCreator] = useState<ICreator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCreator() {
      if (!publicKey) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/creators/${publicKey.toString()}`);
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

    fetchCreator();
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
    <div>
      {creator ? (
        <ListProduct />
      ) : (
        <div className="text-center">
          <p className="mb-4">
            You haven't signed up as a creator yet to be able to list products.
          </p>
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
