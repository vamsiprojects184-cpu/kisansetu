import { create } from 'zustand';
import type { CartItem, Product, Order } from '@/types';
import { mockOrders } from '@/data/mock-data';

interface CartState {
  items: CartItem[];
  orders: Order[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  placeOrder: (address: string, method: string, paymentMethod: string) => Order;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  orders: mockOrders,

  addToCart: (product: Product) => {
    set(state => {
      const existing = state.items.find(i => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map(i =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { items: [...state.items, { product, quantity: 1 }] };
    });
  },

  removeFromCart: (productId: string) => {
    set(state => ({
      items: state.items.filter(i => i.product.id !== productId),
    }));
  },

  updateQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set(state => ({
      items: state.items.map(i =>
        i.product.id === productId ? { ...i, quantity } : i
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  getTotal: () => {
    return get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  },

  getItemCount: () => {
    return get().items.reduce((sum, i) => sum + i.quantity, 0);
  },

  placeOrder: (address: string, method: string, paymentMethod: string): Order => {
    const state = get();
    const total = state.getTotal();
    const order: Order = {
      id: `ORD-2025-${String(state.orders.length + 1).padStart(3, '0')}`,
      items: [...state.items],
      total,
      status: 'placed',
      createdAt: new Date().toISOString().split('T')[0],
      deliveryAddress: address,
      deliveryMethod: method,
      paymentMethod,
      estimatedDelivery: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      trackingSteps: [
        { status: 'placed', label: 'Order Placed', completed: true, time: new Date().toLocaleString('en-IN') },
        { status: 'preparing', label: 'Preparing', completed: false },
        { status: 'quality_verified', label: 'Quality Verified', completed: false },
        { status: 'out_for_delivery', label: 'Out for Delivery', completed: false },
        { status: 'delivered', label: 'Delivered', completed: false },
      ],
    };
    set({ orders: [order, ...state.orders], items: [] });
    return order;
  },
}));
