
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { ProductProvider } from "@/context/ProductContext";
import { CartProvider } from "@/context/CartContext";

import LoginPage from "@/pages/LoginPage";
import ShopSetupPage from "@/pages/ShopSetupPage";
import POSPage from "@/pages/POSPage";
import ProductsPage from "@/pages/ProductsPage";
import ReceiptsPage from "@/pages/ReceiptsPage";
import ReceiptDetailPage from "@/pages/ReceiptDetailPage";
import DashboardPage from "@/pages/DashboardPage";
import NotFound from "@/pages/NotFound";
import PrivateLayout from "@/components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                
                <Route element={<PrivateLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/pos" element={<POSPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/receipts" element={<ReceiptsPage />} />
                  <Route path="/receipts/:id" element={<ReceiptDetailPage />} />
                  <Route path="/shop-setup" element={<ShopSetupPage />} />
                </Route>
                
                <Route path="/" element={<LoginPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
