import { ICreator } from "@/models/Creator";
import Image from "next/image";
import React from "react";
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
import { usePathname } from "next/navigation";

interface CreatorCardProps {
  creator: ICreator;
}
export const Creator = ({ creator }: CreatorCardProps) => {
  const { publicKey } = useWallet();
  const pathname = usePathname();
  console.log(pathname);
  return (
    <Card className="w-[350px]">
      <CardContent>
        <div className="flex items-center my-4">
          <Image
            src={creator.profilePicture}
            alt={`${creator.name}'s profile picture`}
            width={64}
            height={64}
            className="rounded-full"
          />
          <div>
            <h2 className="text-xl font-bold">{creator.name}</h2>
            <p className="text-gray-500">
              {truncateString(creator.walletAddress, 4, 4)}
            </p>
          </div>
        </div>
        <p className="mb-4 text-center">{creator.bio}</p>
      </CardContent>
      <CardFooter className="flex f justify-between">
        <a
          href={creator.socialLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Social Media
        </a>
        {pathname == "/creator/account" && (
          <Link href="/creator/list" className="text-blue-500 hover:underline">
            {publicKey?.toBase58() == creator.walletAddress && (
              <Button>List product</Button>
            )}
          </Link>
        )}
        {pathname == "/creator/explore" && (
          <Link
            href={`/creator/${creator.walletAddress}/listings`}
            className="text-blue-500 hover:underline"
          >
            <Button>View listings</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};
