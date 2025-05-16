import { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity?: number;
  image?: string;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProduct: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [user]);

  const fetchProducts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching products:', error);
      return;
    }

    setProducts(data || []);
  };

  const addProduct = async (productData: Omit<Product, "id">) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Log the user ID to verify it's a UUID
    console.log("Current user ID:", user.id);

    const { data, error } = await supabase
      .from('products')
      .insert([{ 
        ...productData, 
        user_id: user.id  // This should be a UUID from Supabase Auth
      }])
      .select()
      .single();

    if (error) {
      console.error("Error adding product:", error);
      throw error;
    }

    setProducts((prev) => [...prev, data]);
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, ...productData } : product
      )
    );
  };

  const deleteProduct = async (id: string) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const getProduct = (id: string) => {
    return products.find((product) => product.id === id);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
