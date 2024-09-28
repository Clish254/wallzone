import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex w-full h-[calc(100vh-64px)] items-center justify-center ">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-bold italic">Wallzone</h1>
        <p className="text-2xl mt-3">
          Buy and sell sick wallpapers using your favourite sh*tcoins🎉
        </p>
        <div className="flex justify-center gap-2 mt-3">
          <Link href="/creator/signup">
            <Button>Become a creator</Button>
          </Link>
          <Link href="/creator/explore">
            <Button>Explore creators</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
