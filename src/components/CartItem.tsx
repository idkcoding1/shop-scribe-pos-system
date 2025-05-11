
import { CartItem as CartItemType } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const { product, quantity } = item;
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity)) {
      onUpdateQuantity(product.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center justify-between py-2 border-b">
      <div className="flex items-center flex-1">
        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <span className="text-gray-400">{product.name.charAt(0)}</span>
          )}
        </div>
        <div className="ml-3 flex-1">
          <h4 className="font-medium text-sm">{product.name}</h4>
          <p className="text-gray-500 text-xs">Rs {product.price.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          min="1"
          className="w-16 h-8 text-center text-sm"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(product.id)}
          className="h-8 w-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
