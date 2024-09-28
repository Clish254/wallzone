import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "./ui/button";
import { toast, Toaster } from "sonner";
import { useState } from "react";
import { LoadingSpinner } from "./Spinner";

interface PaymentDialogProps {
  qrCode: string;
  reference: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setQrCode: React.Dispatch<React.SetStateAction<string>>;
  setReference: React.Dispatch<React.SetStateAction<string>>;
}
export const PaymentDialog = ({
  qrCode,
  reference,
  open,
  setOpen,
  setQrCode,
  setReference,
}: PaymentDialogProps) => {
  const [loading, setLoading] = useState(false);
  const handleVerifyClick = async () => {
    const res = await fetch(`/api/payments?reference=${reference}`);

    setLoading(true);
    try {
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }
      const { status } = await res.json();

      toast.success("Transaction verified");
      setQrCode("");
      setReference("");
      setOpen(false);
    } catch (error: any) {
      setLoading(false);
      if (error?.message) {
        toast.error(`${error?.message}`);
      } else {
        toast.error(`Transaction not verified, try again`);
        console.error("Error saving creator:", error);
        console.log(error.message);
      }
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan the qr code</DialogTitle>
          <DialogDescription>
            Scan the qr code with your wallet app to make payment
          </DialogDescription>
        </DialogHeader>
        <div className="my-2 flex flex-col items-center justify-center">
          <Image
            src={qrCode}
            style={{ position: "relative", background: "white" }}
            alt="QR Code"
            width={200}
            height={200}
            priority
          />

          {!loading && (
            <Button onClick={handleVerifyClick} className="mt-4">
              Verify Payment
            </Button>
          )}
          {loading && <LoadingSpinner className="mr-2 h-4 w-4 animate-spin" />}
        </div>
      </DialogContent>
    </Dialog>
  );
};
