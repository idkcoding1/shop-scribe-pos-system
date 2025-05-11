
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Menu, ChevronLeft, ChevronRight, LayoutDashboard, Package, ShoppingCart, Settings, Receipt, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { logout, shopDetails } = useAuth();

  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "POS", icon: ShoppingCart, path: "/pos" },
    { name: "Products", icon: Package, path: "/products" },
    { name: "Receipts", icon: Receipt, path: "/receipts" },
    { name: "Shop Settings", icon: Settings, path: "/shop-setup" }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        onClick={() => setCollapsed(true)} 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${collapsed ? "hidden" : "block"}`}
      />

      {/* Sidebar */}
      <div 
        className={`${
          collapsed ? "w-20" : "w-64"
        } flex flex-col fixed lg:relative h-full bg-white border-r border-gray-200 transition-all duration-300 z-30`}
      >
        {/* Header */}
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} h-16 px-4 border-b border-gray-100`}>
          {!collapsed && (
            <div className="text-lg font-bold text-primary-700 truncate">
              {shopDetails?.name || "ShopScribe"}
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="lg:flex hidden"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(true)}
            className="lg:hidden flex"
          >
            <ChevronLeft size={20} />
          </Button>
        </div>

        {/* Links */}
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`${
                    isActive
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-600 hover:bg-gray-100"
                  } flex items-center ${
                    collapsed ? "justify-center" : "justify-start"
                  } py-2 px-3 rounded-md transition-colors`}
                >
                  <item.icon
                    size={20}
                    className={`${isActive ? "text-primary-500" : ""}`}
                  />
                  {!collapsed && (
                    <span className="ml-3 font-medium">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <Button
            variant="ghost"
            className={`w-full flex items-center ${
              collapsed ? "justify-center" : "justify-start"
            } text-red-500 hover:bg-red-50 hover:text-red-600`}
            onClick={logout}
          >
            <LogOut size={20} />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(false)}
        className={`fixed top-4 left-4 z-10 lg:hidden ${collapsed ? "flex" : "hidden"}`}
      >
        <Menu size={20} />
      </Button>
    </>
  );
};

export default Sidebar;
