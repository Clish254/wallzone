"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import dynamic from "next/dynamic";

// Check: https://github.com/solana-labs/wallet-adapter/issues/648
const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false },
);
export default function NavBar() {
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex">
        {" "}
        <Link href="/" className="flex items-center mr-4" prefetch={false}>
          <span className="text-lg font-semibold italic">WALLZONE</span>
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Creators</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <ListItem href="/creator/signup" title="Become a creator">
                    Open a creator account
                  </ListItem>
                  <ListItem href="/creator/explore" title="Explore creators">
                    Check out the amazing creators on the platform
                  </ListItem>
                  <ListItem href="/creator/account" title="Account">
                    View your creator account
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div>
        <WalletMultiButtonDynamic style={{}} />
      </div>
    </div>
  );
}
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  if (!href) {
    throw new Error("`href` is required for the ListItem component.");
  }
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
