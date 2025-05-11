import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  return (
    <Card className="overflow-hidden card-shadow transition-all">
      <div className="relative aspect-square bg-gray-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">{product.name.charAt(0)}</span>
          </div>
        )}
        {product.quantity !== undefined && product.quantity <= 5 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Low Stock: {product.quantity}
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.category}</p>
            <p className="text-primary-700 font-bold mt-1">Rs{product.price.toFixed(2)}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAdd(product)}
            className="rounded-full hover:bg-primary-100"
          >
            <Plus className="h-5 w-5 text-primary-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
