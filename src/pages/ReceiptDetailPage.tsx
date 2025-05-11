
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Receipt from "@/components/Receipt";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const ReceiptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { receipts } = useCart();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const receipt = receipts.find((r) => r.id === id);

  if (!receipt) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h2 className="text-xl font-bold mb-2">Receipt Not Found</h2>
        <p className="text-gray-500 mb-6">The receipt you're looking for doesn't exist</p>
        <Button onClick={() => navigate("/receipts")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Receipts
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`flex items-center ${isMobile ? 'flex-col items-start gap-4' : ''}`}>
        <Button variant="ghost" onClick={() => navigate("/receipts")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className={`text-2xl font-bold ${!isMobile ? 'ml-4' : 'mt-2'}`}>Receipt Details</h1>
      </div>

      <Receipt receipt={receipt} />
    </div>
  );
};

export default ReceiptDetailPage;
