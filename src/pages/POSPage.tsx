
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, BadgeX } from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import CartItem from "@/components/CartItem";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const POSPage: React.FC = () => {
  const { products } = useProducts();
  const { items, addToCart, removeFromCart, updateQuantity, getCartTotal, checkout } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get unique categories from products
  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];

  // Filter products based on search term and selected category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add products to cart before checking out",
        variant: "destructive",
      });
      return;
    }

    try {
      const receipt = checkout();
      navigate(`/receipts/${receipt.id}`);
    } catch (error) {
      toast({
        title: "Checkout failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const cartTotal = getCartTotal();

  return (
    <div className="h-full flex flex-col lg:flex-row lg:space-x-6">
      {/* Products Section */}
      <div className="flex-1 pb-4 lg:pb-0 lg:overflow-y-auto">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories Tabs */}
          <Tabs defaultValue="all" value={selectedCategory} onValueChange={(value) => setSelectedCategory(value)}>
            <TabsList className="w-full overflow-x-auto flex-nowrap whitespace-nowrap">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <BadgeX className="mx-auto h-10 w-10 text-gray-400" />
              <p className="mt-2 text-gray-500">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={() => addToCart(product, 1)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-full lg:w-96 flex-shrink-0">
        <Card className="shadow-lg">
          <CardHeader className="bg-primary-100 pb-4 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-primary-500" />
                <h2 className="font-bold">Shopping Cart</h2>
              </div>
              <span className="bg-primary-500 text-white px-2 py-1 rounded-full text-xs">
                {items.length} items
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4 max-h-[40vh] lg:max-h-[50vh] overflow-y-auto">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-2 text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-1">
                {items.map((item) => (
                  <CartItem
                    key={item.product.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col border-t p-4 space-y-4">
            <div className="w-full flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <Button
              onClick={handleCheckout}
              disabled={items.length === 0}
              className="w-full"
              size="lg"
            >
              Checkout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default POSPage;
