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

/**
 * Technique a painting was made with ("тип работы").
 * - oil        — oil paints
 * - acrylic    — acrylic paints
 * - watercolor — watercolor
 * - graphics   — pencil / ink / charcoal
 * - mixed      — mixed media
 * - print      — reproduction print
 */
export type WorkType = 'oil' | 'acrylic' | 'watercolor' | 'graphics' | 'mixed' | 'print';

/**
 * Physical surface a painting is made on ("материал").
 * Canvas is the common case; the rest exist because a gallery inevitably
 * accumulates work on other surfaces.
 */
export type PaintingMaterial = 'canvas' | 'canvas_on_board' | 'paper' | 'wood';

/**
 * Category of a museum exhibit.
 * The museum shows finished models built by children — these are exhibits,
 * not merchandise, so they have their own categories independent of
 * `CategoryType` (which classifies sellable products).
 */
export type MuseumCategory =
  | 'cars'
  | 'armor'
  | 'aviation'
  | 'miniatures'
  | 'railway'
  | 'ships';

/** Model scales offered across the site. */
export type ModelScale =
  | '1:8'
  | '1:16'
  | '1:18'
  | '1:24'
  | '1:35'
  | '1:43'
  | '1:64'
  | '1:72'
  | '1:144';

/**
 * A single museum exhibit — a finished, assembled model on display.
 * Not a product: it has no price, status or stock.
 */
export interface MuseumItem {
  id: string;
  /** Localized display title, e.g. "Messerschmitt Bf 109Z Zwilling". */
  title: Localized;
  /** Localized free-form text: the model's history, who built it, facts. */
  description: Localized;
  category: MuseumCategory;
  /** Optional — not every exhibit records a scale. */
  scale?: ModelScale;
  /** Image URLs; the first entry is the main photo. */
  images: string[];
  /**
   * Slug of the catalog product this kit corresponds to, when we sell it.
   * Undefined when the exhibit has no counterpart on sale.
   */
  productSlug?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * One block of the museum timeline: a product joined to its curated history
 * note (see `constants/museumHistory.ts`).
 *
 * Built on the server and handed to the client component already flattened,
 * so the timeline never has to know about products or history separately.
 * Deliberately carries no price — the museum does not sell.
 */
export interface MuseumTimelineEntry {
  /** Catalog code of the product, used for the link to its page. */
  slug: string;
  /** Localized product name, shown in Latin as stored. */
  name: Localized;
  /** Primary photograph, when the product has one. */
  image?: string;
  year: number;
  country: string;
  crew: string;
  armor: string;
  engine: string;
  weight: string;
}

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
 * A painting shown in the AZERII gallery.
 *
 * Deliberately separate from `Product`: a canvas has no scale, no
 * manufacturing technology and no stock — each one is a single physical piece.
 * Currently a showcase only; buyers enquire via the contact page rather than
 * ordering through the cart.
 */
export interface Painting {
  id: string;
  /** Localized title. */
  title: Localized;
  /** Localized description. */
  description: Localized;
  /** Free-form physical size as entered by the admin, e.g. "60×80 см". */
  size: string;
  workType: WorkType;
  material: PaintingMaterial;
  /** Price in EUR (e.g. 450.00). */
  priceEur: number;
  /** Image URLs; first entry is the primary image. */
  images: string[];
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
