import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

  // Check for existing session on load
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (session?.user) {
          const realUser: User = {
            id: session.user.id,
            email: session.user.email ?? "",
            name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "",
          };
          setUser(realUser);
        }

        // Check for shop details
        const storedShopDetails = localStorage.getItem("shopDetails");
        if (storedShopDetails) {
          setShopDetails(JSON.parse(storedShopDetails));
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const realUser: User = {
          id: session.user.id,
          email: session.user.email ?? "",
          name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "",
        };
        setUser(realUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        toast.error("Invalid credentials");
        setIsLoading(false);
        return;
      }

      const realUser: User = {
        id: data.user.id,
        email: data.user.email ?? "",
        name: data.user.user_metadata?.name || data.user.email?.split("@")[0] || "",
      };

      setUser(realUser);
      toast.success("Logged in successfully!");

      // Check if shop details exist
      const storedShopDetails = localStorage.getItem("shopDetails");
      if (storedShopDetails) {
        navigate("/pos");
      } else {
        navigate("/shop-setup");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate("/login");
      toast.info("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
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
