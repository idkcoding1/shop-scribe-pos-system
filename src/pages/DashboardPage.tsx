
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";
import { Calendar, Package, ShoppingCart, BarChart3 } from "lucide-react";
import { format } from "date-fns";

const DashboardPage: React.FC = () => {
  const { shopDetails } = useAuth();
  const { products } = useProducts();
  const { receipts } = useCart();

  const totalSales = receipts.reduce((sum, receipt) => sum + receipt.total, 0);
  const totalProducts = products.length;
  const totalTransactions = receipts.length;
  
  // Get low stock products (less than or equal to 5 items)
  const lowStockProducts = products.filter(
    (product) => product.quantity !== undefined && product.quantity <= 5
  );

  // Get today's date in YYYY-MM-DD format
  const today = format(new Date(), "yyyy-MM-dd");
  
  // Get today's transactions
  const todaysTransactions = receipts.filter((receipt) => 
    format(new Date(receipt.date), "yyyy-MM-dd") === today
  );

  // Calculate today's sales
  const todaysSales = todaysTransactions.reduce((sum, receipt) => sum + receipt.total, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Welcome Banner */}
      <Card className="bg-primary-100">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-primary-800">
                Welcome back to {shopDetails?.name || "ShopScribe POS"}
              </h2>
              <p className="text-primary-700 mt-1">
                Today is {format(new Date(), "MMMM d, yyyy")}
              </p>
            </div>
            <Calendar className="h-10 w-10 text-primary-500" />
          </div>
        </CardContent>
      </Card>
      
      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Today's Sales */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Today's Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold">Rs {todaysSales.toFixed(2)}</p>
                <p className="text-xs text-gray-500">
                  {todaysTransactions.length} transactions today
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>
        
        {/* Total Sales */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold">Rs {totalSales.toFixed(2)}</p>
                <p className="text-xs text-gray-500">
                  {totalTransactions} total transactions
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>
        
        {/* Products */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold">{totalProducts}</p>
                <p className="text-xs text-gray-500">
                  {lowStockProducts.length} items low in stock
                </p>
              </div>
              <Package className="h-8 w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>
        
        {/* Last Sale */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Last Sale</CardTitle>
          </CardHeader>
          <CardContent>
            {receipts.length > 0 ? (
              <div>
                <p className="text-xl font-bold">
                  Rs {receipts[receipts.length - 1].total.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  {format(new Date(receipts[receipts.length - 1].date), "h:mm a")}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No sales yet</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {receipts.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No transactions yet</p>
          ) : (
            <div className="space-y-4">
              {receipts
                .slice()
                .reverse()
                .slice(0, 5)
                .map((receipt) => (
                  <div
                    key={receipt.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                  >
                    <div>
                      <p className="font-medium">Receipt #{receipt.id.split("-")[1]}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(receipt.date), "MMM d, yyyy h:mm a")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">Rs {receipt.total.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">
                        {receipt.items.length} items
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Low Stock Products */}
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Products</CardTitle>
        </CardHeader>
        <CardContent>
          {lowStockProducts.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No low stock products</p>
          ) : (
            <div className="space-y-4">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-500">
                      {product.quantity} in stock
                    </p>
                    <p className="text-xs text-gray-500">
                      Rs {product.price.toFixed(2)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
