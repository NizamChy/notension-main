import { create } from "zustand";
import { persist } from "zustand/middleware";
import { lineTotal, toNumber } from "@/utils/price";
import { readLegacyFashionCart, readLegacyRoot } from "./legacy";
import { legacyAwareStorage } from "./storage";

export type CartModule = "grocery" | "food" | "medicine";

export type CartLine = {
  _id: string;
  quantity: number;
  max_allowed?: number;
  [k: string]: unknown;
};

/** What callers pass in: a product, before it has a quantity. */
export type CartItemInput = { _id: string; max_allowed?: number; [k: string]: unknown };

export type ModuleCart = {
  items: CartLine[];
  storeInfo: Record<string, unknown>;
  startAt: number;
};

export type FashionLine = CartLine & {
  selectedSize: string | null;
  selectedImage: string | null;
  selectedColor: string | null;
  addedAt: string;
};

export type CartState = {
  grocery: ModuleCart;
  food: ModuleCart;
  medicine: ModuleCart;
  fashion: FashionLine[];
};

type CartActions = {
  add: (m: CartModule, item: CartItemInput) => void;
  remove: (m: CartModule, id: string) => void;
  increment: (m: CartModule, id: string) => void;
  decrement: (m: CartModule, id: string) => void;
  clear: (m: CartModule) => void;
  saveStoreInfo: (m: CartModule, info: Record<string, unknown>) => void;
  fashionAdd: (
    product: CartItemInput,
    quantity?: number,
    selectedSize?: string | null,
    selectedImage?: string | null,
    selectedColor?: string | null,
  ) => void;
  fashionUpdateQuantity: (
    id: string,
    qty: number,
    selectedSize: string | null,
    selectedImage: string | null,
  ) => void;
  fashionRemove: (
    id: string,
    selectedSize: string | null,
    selectedImage: string | null,
  ) => void;
  fashionClear: () => void;
};

const emptyModule = (): ModuleCart => ({ items: [], storeInfo: {}, startAt: 0 });

export const initialCartState: CartState = {
  grocery: emptyModule(),
  food: emptyModule(),
  medicine: emptyModule(),
  fashion: [],
};

// A cart line can grow until the store's per-order limit (0 = no limit).
const belowLimit = (item: CartLine) =>
  !item.max_allowed || item.quantity < item.max_allowed;

export const cartTotal = (c: ModuleCart): number =>
  c.items.reduce((total, item) => total + lineTotal(item), 0);

export const fashionTotal = (lines: FashionLine[]): number =>
  lines.reduce((total, item) => total + lineTotal(item), 0);

export const fashionCount = (lines: FashionLine[]): number =>
  lines.reduce((count, item) => count + toNumber(item?.quantity), 0);

const sameFashionLine = (
  item: FashionLine,
  id: string,
  size: string | null,
  image: string | null,
) =>
  item?._id === id && item?.selectedSize === size && item?.selectedImage === image;

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function moduleFromLegacy(
  cart: Record<string, unknown>,
  prefix: CartModule,
): ModuleCart {
  const items = cart[`${prefix}Items`];
  const storeInfo = cart[`${prefix}StoreInfo`];
  const startAt = cart[`${prefix}CartStartAt`];
  return {
    items: Array.isArray(items) ? (items as CartLine[]) : [],
    storeInfo: isRecord(storeInfo) ? storeInfo : {},
    startAt: typeof startAt === "number" ? startAt : 0,
  };
}

/** Builds the store state from the old Redux cart slice and Fashion bag. */
export function cartFromLegacy(s: Pick<Storage, "getItem">): CartState | null {
  const root = readLegacyRoot(s);
  const cart = root && isRecord(root.cart) ? root.cart : {};
  const fashion = readLegacyFashionCart(s) as FashionLine[];
  const state: CartState = {
    grocery: moduleFromLegacy(cart, "grocery"),
    food: moduleFromLegacy(cart, "food"),
    medicine: moduleFromLegacy(cart, "medicine"),
    fashion,
  };
  const hasData =
    fashion.length > 0 ||
    (["grocery", "food", "medicine"] as const).some((m) => {
      const c = state[m];
      return c.items.length > 0 || c.startAt > 0 || Object.keys(c.storeInfo).length > 0;
    });
  return hasData ? state : null;
}

const mapModule = (
  state: CartState,
  m: CartModule,
  fn: (c: ModuleCart) => ModuleCart,
): Partial<CartState> => ({ [m]: fn(state[m]) });

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set) => ({
      ...initialCartState,

      add: (m, item) =>
        set((state) =>
          mapModule(state, m, (c) => {
            const startAt = c.items.length < 1 ? new Date().getTime() : c.startAt;
            const existing = c.items.find((i) => i._id === item._id);
            if (existing) {
              return {
                ...c,
                startAt,
                items: c.items.map((i) =>
                  i === existing && belowLimit(i) ? { ...i, quantity: i.quantity + 1 } : i,
                ),
              };
            }
            return { ...c, startAt, items: [...c.items, { ...item, quantity: 1 } as CartLine] };
          }),
        ),

      remove: (m, id) =>
        set((state) =>
          mapModule(state, m, (c) => ({ ...c, items: c.items.filter((i) => i._id !== id) })),
        ),

      increment: (m, id) =>
        set((state) =>
          mapModule(state, m, (c) => ({
            ...c,
            items: c.items.map((i) =>
              i._id === id && belowLimit(i) ? { ...i, quantity: i.quantity + 1 } : i,
            ),
          })),
        ),

      decrement: (m, id) =>
        set((state) =>
          mapModule(state, m, (c) => {
            const item = c.items.find((i) => i._id === id);
            if (item && item.quantity > 1) {
              return {
                ...c,
                items: c.items.map((i) =>
                  i === item ? { ...i, quantity: i.quantity - 1 } : i,
                ),
              };
            }
            return { ...c, items: c.items.filter((i) => i._id !== id) };
          }),
        ),

      clear: (m) =>
        set((state) => mapModule(state, m, (c) => ({ ...c, startAt: 0, items: [] }))),

      saveStoreInfo: (m, info) =>
        set((state) => mapModule(state, m, (c) => ({ ...c, storeInfo: info }))),

      fashionAdd: (
        product,
        quantity = 1,
        selectedSize = null,
        selectedImage = null,
        selectedColor = null,
      ) =>
        set((state) => {
          const index = state.fashion.findIndex((item) =>
            sameFashionLine(item, product?._id, selectedSize, selectedImage),
          );
          if (index >= 0) {
            const fashion = [...state.fashion];
            fashion[index] = {
              ...fashion[index],
              quantity: fashion[index].quantity + quantity,
            };
            return { fashion };
          }
          return {
            fashion: [
              ...state.fashion,
              {
                ...product,
                quantity,
                selectedSize,
                selectedImage,
                selectedColor,
                addedAt: new Date().toISOString(),
              } as FashionLine,
            ],
          };
        }),

      fashionUpdateQuantity: (id, qty, selectedSize, selectedImage) => {
        if (qty < 1) return;
        set((state) => ({
          fashion: state.fashion.map((item) =>
            sameFashionLine(item, id, selectedSize, selectedImage)
              ? { ...item, quantity: qty }
              : item,
          ),
        }));
      },

      fashionRemove: (id, selectedSize, selectedImage) =>
        set((state) => ({
          fashion: state.fashion.filter(
            (item) => !sameFashionLine(item, id, selectedSize, selectedImage),
          ),
        })),

      fashionClear: () => set({ fashion: [] }),
    }),
    {
      name: "notension-cart",
      version: 1,
      skipHydration: true,
      storage: legacyAwareStorage<CartState>("notension-cart", 1, cartFromLegacy),
      partialize: (s): CartState => ({
        grocery: s.grocery,
        food: s.food,
        medicine: s.medicine,
        fashion: s.fashion,
      }),
    },
  ),
);
