
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const ShopSetupPage: React.FC = () => {
  const { shopDetails: existingDetails, saveShopDetails } = useAuth();
  const navigate = useNavigate();
  
  const [shopName, setShopName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [logo, setLogo] = useState("");
  
  useEffect(() => {
    if (existingDetails) {
      setShopName(existingDetails.name || "");
      setPhone(existingDetails.phone || "");
      setAddress(existingDetails.address || "");
      setLogo(existingDetails.logo || "");
    }
  }, [existingDetails]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    saveShopDetails({
      name: shopName,
      phone,
      address,
      logo,
    });
    
    navigate("/pos");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 to-white p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-700">Shop Setup</h1>
          <p className="text-gray-600 mt-2">Configure your shop details</p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Shop Information</CardTitle>
            <CardDescription>
              Enter your shop details to personalize your POS system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="shopName" className="text-sm font-medium">
                  Shop Name*
                </label>
                <Input
                  id="shopName"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="My Awesome Shop"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Address
                </label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, City, State, ZIP"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="logo" className="text-sm font-medium">
                  Logo URL (optional)
                </label>
                <Input
                  id="logo"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
                {logo && (
                  <div className="mt-2 flex justify-center">
                    <img
                      src={logo}
                      alt="Shop Logo"
                      className="h-20 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/150?text=Logo";
                      }}
                    />
                  </div>
                )}
              </div>
              
              <Button type="submit" className="w-full">
                {existingDetails ? "Update Shop Details" : "Save & Continue"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4">
            <p className="text-sm text-gray-500">
              You can update these details later in settings
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ShopSetupPage;
