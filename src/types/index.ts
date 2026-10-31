export type DepartmentId = 'restaurant' | 'bar_lounge' | 'beauty_salon' | 'barbershop';

export type Currency = 'USD' | 'LRD';

export type MenuSection = 
  | 'restaurant'
  | 'main_bar'
  | 'outside_bar'
  | 'wines'
  | 'cocktails'
  | 'vip_bottles'
  | 'non_alcoholic';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  section: MenuSection;
  category: string;
  price: number;
  currency: Currency;
  image?: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  variants?: string[];
  preparationTime?: string;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedVariant?: string;
  specialInstructions?: string;
}

export type OrderType = 'dine_in' | 'takeaway' | 'delivery';

export type OrderStatus = 
  | 'new'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled';

export interface Order {
  id: string;
  orderRef: string;
  customerName: string;
  phone: string;
  whatsapp: string;
  orderType: OrderType;
  deliveryAddress?: string;
  orderNotes?: string;
  items: {
    menuItemId: string;
    name: string;
    price: number;
    currency: Currency;
    quantity: number;
    selectedVariant?: string;
    specialInstructions?: string;
  }[];
  totalUSD: number;
  totalLRD: number;
  status: OrderStatus;
  paymentStatus: 'pending_verification' | 'verified_on_site' | 'unpaid';
  createdAt: string;
}

export type ServiceDepartment = 'beauty_salon' | 'massage' | 'barbershop';

export interface SalonService {
  id: string;
  title: string;
  department: ServiceDepartment;
  category: string;
  durationMinutes: number;
  priceUSD: number;
  priceLRD: number;
  description: string;
  image?: string;
  requiresSpecialist?: boolean;
  isPopular?: boolean;
}

export interface StaffProfile {
  id: string;
  name: string;
  department: ServiceDepartment;
  role: string;
  photo?: string;
  specialties: string[];
  bio: string;
  workingDays: string[];
  workingHours: string;
  isAvailable: boolean;
}

export type BookingStatus = 'pending' | 'confirmed' | 'rescheduled' | 'declined' | 'completed';

export interface AppointmentBooking {
  id: string;
  bookingRef: string;
  customerName: string;
  phone: string;
  whatsapp: string;
  email?: string;
  department: ServiceDepartment;
  serviceId: string;
  serviceTitle: string;
  staffId?: string;
  staffName?: string;
  preferredDate: string;
  preferredTime: string;
  additionalNotes?: string;
  status: BookingStatus;
  createdAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime?: string;
  image: string;
  location: string;
  ticketInfo: string;
  isPublished: boolean;
  isArchived: boolean;
  tag: string;
}

export type GalleryCategory = 
  | 'all'
  | 'restaurant'
  | 'food_drinks'
  | 'bar_lounge'
  | 'outside_bar'
  | 'beauty_salon'
  | 'massage'
  | 'barbershop'
  | 'events'
  | 'general';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  image: string;
  caption?: string;
  isFeatured?: boolean;
}

export interface ContactEnquiry {
  id: string;
  name: string;
  contact: string;
  category: 'general' | 'restaurant_table' | 'bar_lounge_vip' | 'salon_appointment' | 'barber_booking' | 'event_hosting';
  message: string;
  status: 'new' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface BusinessSettings {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  openingHours: {
    restaurant: string;
    barLounge: string;
    outsideBar: string;
    beautySalon: string;
    barbershop: string;
  };
  socialLinks: {
    tiktok: string;
    instagram: string;
    facebook: string;
  };
  heroTitle: string;
  heroHeadline: string;
  heroSubtext: string;
  logoUrl: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
}
