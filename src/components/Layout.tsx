
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

interface PrivateLayoutProps {
  children?: React.ReactNode;
}

const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default PrivateLayout;
