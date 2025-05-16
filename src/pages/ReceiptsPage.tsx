import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Receipt from "@/components/Receipt";
import { format } from "date-fns";

const ReceiptsPage = () => {
  const { user } = useAuth();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipts = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('receipts')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      if (!error) {
        setReceipts(
          (data || []).map((receipt) => ({
            ...receipt,
            items: typeof receipt.items === "string" ? JSON.parse(receipt.items) : receipt.items,
          }))
        );
      }
      setLoading(false);
    };
    fetchReceipts();
  }, [user]);

  if (loading) return <div>Loading receipts...</div>;

  // Group receipts by date (YYYY-MM-DD)
  const grouped: { [key: string]: typeof receipts } = receipts.reduce((acc, receipt) => {
    const dateKey = format(new Date(receipt.date), "yyyy-MM-dd");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(receipt);
    return acc;
  }, {} as { [key: string]: typeof receipts });

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-8">Receipts</h1>
      {Object.keys(grouped).length === 0 && <div>No receipts found.</div>}
      {Object.entries(grouped).map(([date, receiptsForDate]) => {
        const totalSale = receiptsForDate.reduce((sum, r) => sum + r.total, 0);
        return (
          <div key={date} className="mb-12">
            <h2 className="text-xl font-semibold mb-4">{format(new Date(date), "PPP")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-4">
              {receiptsForDate.map((receipt) => (
                <Receipt key={receipt.id} receipt={receipt} />
              ))}
            </div>
            <div className="flex justify-end">
              <div className="bg-green-100 border border-green-300 rounded-lg p-4 font-bold text-lg text-green-800 shadow">
                Total Sale of the Day: Rs {totalSale.toFixed(2)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReceiptsPage;
