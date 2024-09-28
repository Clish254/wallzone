"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/lib/uploadthing";
import { useState } from "react";
import { ClientUploadedFileData } from "uploadthing/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useWallet } from "@solana/wallet-adapter-react";
import { Toaster, toast } from "sonner";
import { LoadingSpinner } from "./Spinner";

type UploadResult = {
  uploadedBy: string;
  url: string;
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  description: z.string().min(5, {
    message: "description must be at least 5 characters.",
  }),
  price: z.number(),
});

export function ListProduct() {
  const [uploadResult, setUploadResult] =
    useState<ClientUploadedFileData<UploadResult> | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0.0005,
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!publicKey) {
      toast.error("Please connect your wallet");
      return;
    }
    if (!uploadResult) {
      setUploadError("Wallpaper is required");
      return;
    }
    setLoading(true);
    const wallpaper = uploadResult.url;
    const payload = {
      ...values,
      wallpaper,
      walletAddress: publicKey.toBase58(),
    };
    try {
      const response = await fetch("/api/products", {
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
      toast.success("Product listed successfully🎊");
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
  }
  return (
    <div className="flex w-full h-[calc(100vh-64px)] items-center justify-center ">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>List product</CardTitle>
          <CardDescription>
            After your wallpaper is listed users should be able to buy them
            using solana and the sol will be sent to your wallet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the wallpaper name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Short description of the wallpaper"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price in SOL</FormLabel>
                    <FormControl>
                      <Input placeholder="Price in SOL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Label htmlFor="name">Upload wallpaper image</Label>
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    setUploadResult(res[0]);
                    setUploadError(null);
                  }}
                  onUploadError={(error: Error) => {
                    setUploadError(
                      "Something went wrong with your upload, try again",
                    );
                  }}
                />
                {uploadResult && (
                  <p>
                    Wallpaper uploaded successfully 🥳:{" "}
                    <a
                      className="text-blue-500 underline"
                      target="_blank"
                      href={uploadResult.url}
                      rel="noopener noreferrer"
                    >
                      link
                    </a>
                  </p>
                )}
                {uploadError && <p className="text-red-500">{uploadError}</p>}
              </div>
              <div>
                {!loading && (
                  <Button
                    type="submit"
                    className="cursor-pointer"
                    disabled={publicKey == null}
                  >
                    List
                  </Button>
                )}
                {loading && (
                  <LoadingSpinner className="mr-2 h-4 w-4 animate-spin" />
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
