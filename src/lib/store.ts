import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Session } from '@supabase/supabase-js'

export type CartItem = {
  id: string;
  gameSlug: string;
  gameName: string;
  itemName: string;
  price: number;
  quantity: number;
}

export type CurrencyCode = 'USD' | 'MYR'

export type OrderRecord = {
  id: string;
  createdAt: string;
  userId: string;
  items: CartItem[];
  total: number;
  currency: CurrencyCode;
  email: string;
  customerName: string;
  externalId: string;
  invoiceUrl?: string;
  source: 'cart' | 'buy-now';
  status: 'Pending' | 'Paid' | 'Failed';
}

interface AppState {
  // Auth
  user: { id: string; name: string; email: string } | null;
  session: Session | null;
  isAuthLoading: boolean;
  setAuthSession: (session: Session | null) => void;
  clearAuthSession: () => void;
  setAuthLoading: (loading: boolean) => void;
  signOutLocal: () => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  buyNowItem: CartItem | null;
  setBuyNowItem: (item: CartItem) => void;
  clearBuyNowItem: () => void;
  orders: OrderRecord[];
  addOrder: (order: Omit<OrderRecord, 'id' | 'createdAt'> & Partial<Pick<OrderRecord, 'status'>>) => OrderRecord;
  updateOrderByExternalId: (externalId: string, updates: Partial<OrderRecord>) => void;
  
  // UI Triggers
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setAuthOpen: (open: boolean) => void;

  // Currency
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isAuthLoading: true,
      setAuthSession: (session) => set({
        session,
        user: session?.user
          ? {
              id: session.user.id,
              name:
                (session.user.user_metadata?.full_name as string | undefined) ??
                [session.user.user_metadata?.first_name, session.user.user_metadata?.last_name].filter(Boolean).join(' ') ??
                session.user.email?.split('@')[0] ??
                'User',
              email: session.user.email ?? '',
            }
          : null,
        isAuthLoading: false,
        isAuthOpen: false,
      }),
      clearAuthSession: () => set({ session: null, user: null, isAuthLoading: false }),
      setAuthLoading: (loading) => set({ isAuthLoading: loading }),
      signOutLocal: () => set({ session: null, user: null }),

      cart: [],
      addToCart: (item) => set((state) => {
        const existing = state.cart.find(i => i.id === item.id);
        if (existing) {
          return { cart: state.cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i) };
        }
        return { cart: [...state.cart, item], isCartOpen: true };
      }),
      removeFromCart: (id) => set((state) => ({ cart: state.cart.filter(i => i.id !== id) })),
      clearCart: () => set({ cart: [] }),
      buyNowItem: null,
      setBuyNowItem: (item) => set({ buyNowItem: item }),
      clearBuyNowItem: () => set({ buyNowItem: null }),
      orders: [],
      addOrder: (order) => {
        const nextOrder: OrderRecord = {
          ...order,
          id: `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          createdAt: new Date().toISOString(),
          status: order.status ?? 'Pending',
        }

        set((state) => ({ orders: [nextOrder, ...state.orders] }))
        return nextOrder
      },
      updateOrderByExternalId: (externalId, updates) => set((state) => ({
        orders: state.orders.map((order) => (order.externalId === externalId ? { ...order, ...updates } : order)),
      })),

      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
      isAuthOpen: false,
      setAuthOpen: (open) => set({ isAuthOpen: open }),

      currency: 'USD',
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'zhan-store-preferences',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ currency: state.currency, cart: state.cart, buyNowItem: state.buyNowItem, orders: state.orders }),
    }
  )
)
