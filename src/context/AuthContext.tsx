
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface ShopDetails {
  name: string;
  phone: string;
  address: string;
  logo?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  shopDetails: ShopDetails | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  saveShopDetails: (details: ShopDetails) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [shopDetails, setShopDetails] = useState<ShopDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing user session on load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedShopDetails = localStorage.getItem("shopDetails");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedShopDetails) {
      setShopDetails(JSON.parse(storedShopDetails));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // This is a mock implementation. In a real app, you'd make an API call here
      if (email && password) {
        // Simulate successful login
        const mockUser: User = {
          id: "user-123",
          email,
          name: email.split("@")[0],
        };
        
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
        toast.success("Logged in successfully!");
        
        // Check if shop details exist
        const storedShopDetails = localStorage.getItem("shopDetails");
        if (storedShopDetails) {
          navigate("/pos");
        } else {
          navigate("/shop-setup");
        }
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
    toast.info("Logged out successfully");
  };

  const saveShopDetails = (details: ShopDetails) => {
    setShopDetails(details);
    localStorage.setItem("shopDetails", JSON.stringify(details));
    toast.success("Shop details saved successfully!");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    shopDetails,
    login,
    logout,
    saveShopDetails,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
