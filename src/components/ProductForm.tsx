
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/context/ProductContext";
import { XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, "id">) => void;
  initialData?: Product;
}

const categories = ["Clothing", "Electronics", "Food", "Home Goods", "Stationery", "Other"];

const ProductForm: React.FC<ProductFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    price: 0,
    category: "",
    quantity: 0,
    image: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price,
        category: initialData.category,
        quantity: initialData.quantity || 0,
        image: initialData.image || "",
      });
    } else {
      setFormData({
        name: "",
        price: 0,
        category: "",
        quantity: 0,
        image: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4" 
            onClick={onClose}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Product Name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="pl-7"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL (optional)</Label>
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
