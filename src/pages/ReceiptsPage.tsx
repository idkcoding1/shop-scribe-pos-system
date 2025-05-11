
import { useState } from "react";
import { useCart, Receipt as ReceiptType } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Search, Receipt as ReceiptIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

const ReceiptsPage: React.FC = () => {
  const { receipts } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredReceipts = receipts.filter((receipt) => {
    const receiptId = receipt.id.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    // Search by receipt ID or by items in the receipt
    return (
      receiptId.includes(searchLower) ||
      receipt.items.some((item) =>
        item.product.name.toLowerCase().includes(searchLower)
      )
    );
  });
  
  const sortedReceipts = [...filteredReceipts].sort((a, b) => {
    // Sort by date, newest first
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Receipts</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search receipts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {sortedReceipts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <ReceiptIcon className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium">No receipts found</h3>
          <p className="text-gray-500 mt-1">
            {searchTerm
              ? "No receipts match your search"
              : "Complete a sale to generate receipts"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedReceipts.map((receipt) => (
            <ReceiptCard key={receipt.id} receipt={receipt} />
          ))}
        </div>
      )}
    </div>
  );
};

interface ReceiptCardProps {
  receipt: ReceiptType;
}

const ReceiptCard: React.FC<ReceiptCardProps> = ({ receipt }) => {
  return (
    <Link to={`/receipts/${receipt.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="bg-gray-50 pb-2 border-b">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Receipt #{receipt.id.split("-")[1]}</h3>
            <span className="text-sm text-gray-500">
              {format(new Date(receipt.date), "MMM dd, yyyy")}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            {format(new Date(receipt.date), "h:mm a")}
          </p>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Items:</span>
              <span>{receipt.items.length}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>Rs {receipt.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ReceiptsPage;
