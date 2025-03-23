import { createContext, ReactNode, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  variant?: Record<string, string>;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateItemQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  totalPrice: number;
  shippingCost: number;
}

const CartContext = createContext<CartContextType | null>(null);

// Get cart from local storage
const getInitialCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : [];
};

// Calculate shipping cost based on order total
const calculateShippingCost = (total: number): number => {
  if (total >= 2000000) return 0; // Free shipping for orders over 2M VND
  return 30000; // Default shipping cost is 30,000 VND
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(getInitialCart);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [shippingCost, setShippingCost] = useState<number>(30000);

  // Update total price and shipping cost whenever items change
  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
    setShippingCost(calculateShippingCost(total));
  }, [items]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: CartItem) => {
    setItems(prevItems => {
      // Check if item with same ID and variant already exists
      const existingItemIndex = prevItems.findIndex(
        item => item.id === newItem.id && 
        JSON.stringify(item.variant) === JSON.stringify(newItem.variant)
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, newItem];
      }
    });
  };

  const updateItemQuantity = (id: number, quantity: number) => {
    setItems(prevItems =>
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      updateItemQuantity,
      removeItem,
      clearCart,
      totalPrice,
      shippingCost
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
