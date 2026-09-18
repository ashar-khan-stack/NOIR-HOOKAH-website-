export type UserRole = 'USER' | 'ADMIN';

export type PageRoute =
  | 'welcome'
  | 'home'
  | 'menu'
  | 'hookahs'
  | 'flavors'
  | 'experience'
  | 'gallery'
  | 'reservations'
  | 'private-events'
  | 'about'
  | 'contact'
  | 'auth'
  | 'login'
  | 'register'
  | 'admin-login'
  | 'profile'
  | 'user-dashboard'
  | 'cart'
  | 'checkout'
  | 'app-download'
  | 'settings'
  | 'admin'
  | 'privacy'
  | 'terms';

export type FlavorCategory = 'Fruity' | 'Mint' | 'Dessert' | 'Premium' | 'Classic' | 'Signature';
export type MenuCategory = 'Signature Hookahs' | 'Craft Beverages' | 'Artisanal Tea' | 'Gourmet Bites' | 'VIP Packages';
export type SeatingPreference = 'Standard' | 'Premium' | 'VIP' | 'Private Room';

export interface Hookah {
  id: string;
  name: string;
  description: string;
  price: number; // in PKR Rs.
  image: string;
  recommendedFlavor: string;
  strength: 'Smooth' | 'Balanced' | 'Robust' | 'Intense';
  baseOptions: string[];
  features: string[];
  rating: number;
  isPopular?: boolean;
  available?: boolean;
  alloys?: string[];
  crystalFinish?: string;
  pairingNotes?: string;
}

export interface Flavor {
  id: string;
  name: string;
  category: FlavorCategory;
  description: string;
  intensity: number; // 1-5
  coolingLevel: number; // 1-5
  recommendedHookah: string;
  price: number; // in PKR Rs.
  image: string;
  isExclusive?: boolean;
  available?: boolean;
  pairingNotes?: string;
  sommelierRecommendations?: string;
  blendSpecifications?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  description: string;
  price: number; // in PKR Rs.
  image: string;
  tags?: string[];
  rating?: number;
  spicy?: boolean;
  vegan?: boolean;
  available?: boolean;
}

export interface CartItem {
  id: string; // unique item instance id in cart
  type: 'hookah' | 'menu_item';
  item: Hookah | MenuItem;
  selectedFlavor?: string;
  selectedStrength?: string;
  selectedBase?: string;
  selectedAddOns?: string[];
  quantity: number;
  unitPrice: number;
}

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  seatingPreference: SeatingPreference;
  specialRequest?: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  createdAt: string;
}

export interface PrivateEventInquiry {
  id: string;
  eventType: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  guestCount: number;
  preferredSeating: SeatingPreference;
  budgetRange: string;
  specialRequirements?: string;
  message?: string;
  status: 'Received' | 'Under Review' | 'Contacted';
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  tableNumber: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'card' | 'lounge_cash' | 'wallet';
  status: 'Pending' | 'Preparing' | 'Ready' | 'Served' | 'Completed' | 'Cancelled' | 'delivered';
  createdAt: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  loungeSector?: string;
  preparationNotes?: string;
  coalTiming?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: UserRole;
  tier: 'Black VIP' | 'Gold VIP' | 'Noir Reserve';
  membershipTier?: 'Black VIP' | 'Gold VIP' | 'Noir Reserve';
  loyaltyPoints: number;
  isAdmin?: boolean;
  rewardHistory?: {
    id: string;
    title: string;
    points: number;
    date: string;
  }[];
  orderHistory?: {
    id: string;
    date: string;
    total: number;
    itemsCount: number;
    status: 'Completed' | 'Processing' | 'Delivered';
  }[];
  reservationsHistory?: Reservation[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Hookahs' | 'Lounge' | 'VIP' | 'Flavors' | 'Drinks' | 'Atmosphere';
  image: string;
  description: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'offer' | 'reservation' | 'order' | 'drop' | 'announcement' | 'privilege' | 'floor' | 'tasting' | 'onboarding';
  actionPath?: string;
  actionLabel?: string;
  userId?: string;
}

export interface ClientRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  requestType: string;
  membershipPreference: string;
  reason: string;
  additionalNote?: string;
  status: 'PENDING' | 'UNDER REVIEW' | 'APPROVED' | 'REJECTED';
  adminResponse?: string;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface AccentColorOption {
  id: string;
  name: string;
  hex: string;
  lightHex: string;
  glowRgb: string;
}

export * from './errorMonitoring';
