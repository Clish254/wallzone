"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { Creator } from "@/components/Creator";
import { ICreator } from "@/models/Creator";
import { LoadingSpinner } from "@/components/Spinner";
import { IProduct } from "@/models/Product";
import { Product } from "@/components/Product";

export default function Explore() {
  const { publicKey } = useWallet();
  const [creators, setCreators] = useState<ICreator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCreators() {
      if (!publicKey) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/creators`);
        if (!response.ok) {
          throw new Error("Failed to fetch creators data");
        } else {
          const data = await response.json();
          setCreators(data);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchCreators();
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
      {creators.length ? (
        <div className="flex gap-4">
          {creators.map((creator: ICreator) => (
            <Creator creator={creator} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-4">There are no creator signups yet.</p>
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
