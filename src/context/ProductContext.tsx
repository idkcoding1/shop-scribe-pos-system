
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

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
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
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

  // Load products from localStorage on mount
  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      // Add sample products for demo
      const sampleProducts: Product[] = [
        { id: "1", name: "T-Shirt", price: 19.99, category: "Clothing", quantity: 50 },
        { id: "2", name: "Coffee Mug", price: 9.99, category: "Home Goods", quantity: 30 },
        { id: "3", name: "Notebook", price: 4.99, category: "Stationery", quantity: 100 },
        { id: "4", name: "Phone Case", price: 14.99, category: "Electronics", quantity: 25 },
      ];
      setProducts(sampleProducts);
      localStorage.setItem("products", JSON.stringify(sampleProducts));
    }
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
    };
    
    setProducts((prevProducts) => [...prevProducts, newProduct]);
    toast.success("Product added successfully!");
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, ...updatedProduct } : product
      )
    );
    toast.success("Product updated successfully!");
  };

  const deleteProduct = (id: string) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );
    toast.success("Product deleted successfully!");
  };

  const getProduct = (id: string) => {
    return products.find((product) => product.id === id);
  };

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, getProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};
