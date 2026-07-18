/**
 * Core domain types for the AZERII store.
 *
 * AZERII — online shop for scale models of armored vehicles.
 */

/** Supported UI locales. */
export type Locale = 'en' | 'ru';

/**
 * Availability / lifecycle status of a product.
 * - in_stock        — available for purchase right now
 * - out_of_stock    — temporarily unavailable
 * - coming_soon     — announced, not yet on sale
 * - planned         — planned for the roadmap
 * - discontinued    — no longer produced
 * - limited         — limited edition / limited quantity
 * - in_development  — currently being designed/prototyped
 */
export type ProductStatus =
  | 'in_stock'
  | 'out_of_stock'
  | 'coming_soon'
  | 'planned'
  | 'discontinued'
  | 'limited'
  | 'in_development';

/**
 * Manufacturing technology of the model.
 * - lazer   — laser-cut parts
 * - 3d      — 3D-printed parts
 * - rezin   — resin cast
 * - litnik  — injection-molded sprue (litnik) parts
 */
export type TechType = 'lazer' | '3d' | 'rezin' | 'litnik';

/**
 * Product category (type of armored vehicle / part).
 * - tank        — tanks
 * - chassis     — vehicle chassis / hulls
 * - tracks      — track sets
 * - armored_car — armored cars
 */
export type CategoryType = 'tank' | 'chassis' | 'tracks' | 'armored_car';

/** How the order is delivered. */
export type ShippingMethod = 'standard' | 'express' | 'pickup';

/** Order lifecycle status. */
export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

/** Localized string: one value per supported locale. */
export type Localized<T = string> = Record<Locale, T>;

/**
 * A single sellable product (scale model).
 * Prices are stored in EUR with a decimal part (e.g. 499.99).
 */
export interface Product {
  id: string;
  slug: string;
  /** Localized display name. */
  name: Localized;
  /** Localized long description. */
  description: Localized;
  category: CategoryType;
  tech: TechType;
  status: ProductStatus;
  /** Price in EUR (e.g. 499.99). */
  priceEur: number;
  /** Model scale, e.g. "1/35", "1/72". */
  scale: string;
  /** Image URLs; first entry is the primary image. */
  images: string[];
  /** Whether the product is featured on the homepage. */
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * A line item held in the client-side cart.
 * `priceEur` is a display snapshot only — the server re-reads authoritative
 * prices from the catalog when an order is submitted.
 */
export interface CartItem {
  productId: string;
  slug: string;
  /** Localized display name. */
  name: Localized;
  /** Unit price in EUR (display snapshot). */
  priceEur: number;
  /** Primary image URL, if the product has one. */
  image?: string;
  scale?: string;
  quantity: number;
}

/** A single line item inside an order. */
export interface OrderItem {
  productId: string;
  /** Product name snapshot at time of purchase (localized). */
  name: Localized;
  /** Unit price in EUR at time of purchase. */
  unitPriceEur: number;
  quantity: number;
}

/** Customer + shipping information attached to an order. */
export interface Customer {
  name: string;
  email: string;
  phone?: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
}

/**
 * A customer order.
 * `totalEur` is the sum of all line items in EUR.
 */
export interface Order {
  id: string;
  items: OrderItem[];
  customer: Customer;
  status: OrderStatus;
  /** Order total in EUR. */
  totalEur: number;
  /** How the order should be delivered. */
  shipping: ShippingMethod;
  /** Locale the customer used when placing the order. */
  locale: Locale;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}
