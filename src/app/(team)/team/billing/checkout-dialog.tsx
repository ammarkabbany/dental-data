import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSubmitInstapay } from "@/features/checkout/hooks/use-submit-instapay";
import { formatCurrency } from "@/lib/format-utils";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  price: number;
}

export function CheckoutDialog({
  isOpen,
  onClose,
  planName,
  price,
}: CheckoutDialogProps) {
  const [screenshot, setScreenshot] = useState<File | null>(null);

  const {mutate, isPending} = useSubmitInstapay();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!screenshot) {
      toast.error("Please provide the transaction screenshot");
      return;
    }

    mutate({
      image: screenshot,
      planId: planName.toLowerCase(),
      amount: price,
    }, {
      onSuccess: () => {
        toast.success(
          `Successfully submitted for ${planName} plan
          We will get back to you soon`
        );
        onClose();
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        // 1MB limit
        toast.error("File size should be less than 1MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setScreenshot(file);
    }
  };

  return (
    <ResponsiveModal open={isOpen} onOpenChange={onClose}>
      {/* <DialogContent className="sm:max-w-[425px]"> */}
        <DialogHeader className="px-4 mt-8">
          <DialogTitle>Upgrade to {planName}</DialogTitle>
          <div className="space-y-2 text-muted-foreground">
            <p>We currently only support Instapay payments.</p>
            <Link
              href="https://www.instapay.eg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-fit hover:opacity-80 transition-opacity"
            >
              <Image
                src="/instapay-logo.png"
                width={120}
                height={120}
                alt="Instapay"
                className="h-12 w-auto"
              />
            </Link>
            <p>
              If InstaPay is not possible, please contact us on
              <br />
              <Link
                href="mailto:croxteamco+dentaauto@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-primary"
              >
                croxteamco+dentaauto@gmail.com
              </Link>
            </p>
            <p>Please send payment to Instapay ID:</p>
            <code className="px-2 py-1 bg-muted rounded-md font-bold font-mono text-base">
              ammarka@instapay
            </code>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4 px-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Transaction Screenshot</Label>
              <div className="grid w-full">
                <Input
                  type="file"
                  accept=".jpg, .png, .svg, .jpeg"
                  onChange={handleFileChange}
                  disabled={isPending}
                  className="hidden"
                  id="screenshot-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("screenshot-upload")?.click()
                  }
                  className="w-full"
                  disabled={isPending}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {screenshot ? "Change Screenshot" : "Upload Screenshot"}
                </Button>
                {screenshot && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {screenshot.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Amount to Pay</span>
              <span>${price}</span>
            </div>
            <div className="flex items-center justify-between font-medium">
              <span>Total Converted</span>
              <span>{formatCurrency(Math.floor(price * 51), "EGP", 0)}/month</span>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={onClose}
              type="button"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </DialogFooter>
        </form>
      {/* </DialogContent> */}
    </ResponsiveModal>
  );
}
