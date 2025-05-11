import { createContext, useState, useContext } from "react";
import { toast } from "sonner";
import { Product } from "./ProductContext";
import { supabase } from "@/integrations/supabase/client";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Receipt {
  id: string;
  items: CartItem[];
  total: number;
  date: Date;
  customer_name?: string;
  customer_phone?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  checkout: (customerInfo?: { name?: string; phone?: string }) => Promise<Receipt>;
  receipts: Receipt[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { product, quantity }];
      }
    });
    toast.success(`Added ${product.name} to cart`);
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
    toast.info("Item removed from cart");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const checkout = async (customerInfo?: { name?: string; phone?: string }) => {
    if (items.length === 0) {
      toast.error("Cannot checkout with an empty cart");
      throw new Error("Cannot checkout with an empty cart");
    }

    // Create a receipt object
    const receipt: Receipt = {
      id: `receipt-${Date.now()}`,
      items: [...items],
      total: getCartTotal(),
      date: new Date(),
      customer_name: customerInfo?.name,
      customer_phone: customerInfo?.phone
    };

    try {
      // Update product quantities in Supabase
      for (const item of items) {
        const product = item.product;
        const newQuantity = (product.quantity || 0) - item.quantity;
        
        if (newQuantity < 0) {
          toast.error(`Not enough ${product.name} in stock`);
          throw new Error(`Not enough ${product.name} in stock`);
        }

        const { error: updateError } = await supabase
          .from('products')
          .update({ quantity: newQuantity })
          .eq('id', product.id);

        if (updateError) {
          throw updateError;
        }
      }

      // Store the receipt in Supabase
      const { error } = await supabase
        .from('receipts')
        .insert({
          total: receipt.total,
          items: JSON.stringify(receipt.items),
          date: receipt.date.toISOString(),
          customer_name: receipt.customer_name,
          customer_phone: receipt.customer_phone
        });

      if (error) {
        throw error;
      }

      // Update local state
      setReceipts((prev) => [...prev, receipt]);
      setItems([]);
      toast.success("Checkout complete!");

      return receipt;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Checkout failed. Please try again.");
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        checkout,
        receipts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
