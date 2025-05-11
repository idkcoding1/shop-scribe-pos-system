
import React, { useRef } from "react";
import { Receipt as ReceiptType } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";

interface ReceiptProps {
  receipt: ReceiptType;
}

const Receipt: React.FC<ReceiptProps> = ({ receipt }) => {
  const { shopDetails } = useAuth();
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!receiptRef.current) return;

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `receipt-${receipt.id}.png`;
      link.click();
    } catch (error) {
      console.error("Error generating receipt image:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="mb-4 shadow-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Receipt #{receipt.id.split("-")[1]}</h2>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
          
          <div ref={receiptRef} className="bg-white p-4 border rounded-md">
            {/* Shop Header */}
            <div className="text-center mb-6">
              <h1 className="font-bold text-xl">{shopDetails?.name || "ShopScribe"}</h1>
              {shopDetails?.address && (
                <p className="text-sm text-gray-500">{shopDetails.address}</p>
              )}
              {shopDetails?.phone && (
                <p className="text-sm text-gray-500">{shopDetails.phone}</p>
              )}
            </div>

            {/* Receipt Details */}
            <div className="border-t border-b border-dashed py-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Receipt #:</span>
                <span>{receipt.id.split("-")[1]}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Date:</span>
                <span>{format(new Date(receipt.date), "MMM dd, yyyy h:mm a")}</span>
              </div>
            </div>

            {/* Items */}
            <div className="mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1">Item</th>
                    <th className="text-center py-1">Qty</th>
                    <th className="text-right py-1">Price</th>
                    <th className="text-right py-1">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {receipt.items.map((item) => (
                    <tr key={item.product.id} className="border-b border-dotted">
                      <td className="py-1">{item.product.name}</td>
                      <td className="text-center py-1">{item.quantity}</td>
                      <td className="text-right py-1">${item.product.price.toFixed(2)}</td>
                      <td className="text-right py-1">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="border-t border-dashed pt-2">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${receipt.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Thank You */}
            <div className="text-center mt-6">
              <p>Thank you for your purchase!</p>
              <p className="text-xs text-gray-400 mt-2">powered by ShopScribe POS</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Receipt;
