import {
  MenuItem,
  SalonService,
  StaffProfile,
  EventItem,
  GalleryItem,
  BusinessSettings,
  AppointmentBooking,
  Order,
  ContactEnquiry,
  AuditLogEntry,
  CartItem,
  WebsiteImageRecord,
  MediaLibraryItem
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_MENU_ITEMS,
  INITIAL_SALON_SERVICES,
  INITIAL_STAFF,
  INITIAL_EVENTS,
  INITIAL_GALLERY,
  INITIAL_ORDERS,
  INITIAL_BOOKINGS,
  INITIAL_ENQUIRIES,
  INITIAL_SECTION_IMAGE_RECORDS,
  INITIAL_MEDIA_LIBRARY
} from '../data/initialData';
import { SupabaseService } from './supabase';

const STORAGE_KEYS = {
  SETTINGS: 'bottega_settings_v1',
  MENU: 'bottega_menu_v1',
  SERVICES: 'bottega_services_v1',
  STAFF: 'bottega_staff_v1',
  EVENTS: 'bottega_events_v1',
  GALLERY: 'bottega_gallery_v1',
  ORDERS: 'bottega_orders_v1',
  BOOKINGS: 'bottega_bookings_v1',
  ENQUIRIES: 'bottega_enquiries_v1',
  AUDIT: 'bottega_audit_v1',
  CART: 'bottega_cart_v1',
  ADMIN_AUTH: 'bottega_admin_auth_v1',
  SECTION_IMAGES: 'bottega_section_images_v1',
  MEDIA_LIBRARY: 'bottega_media_library_v1',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Failed reading storage key "${key}":`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed writing storage key "${key}":`, err);
  }
}

export const StorageService = {
  getSettings(): BusinessSettings {
    return safeGet<BusinessSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },
  saveSettings(settings: BusinessSettings, adminUser = 'Super Admin'): void {
    safeSet(STORAGE_KEYS.SETTINGS, settings);
    this.addAuditLog(adminUser, 'Updated Website & Contact Settings', 'Updated business details, phone, hours, or social media links.');
  },

  getMenuItems(): MenuItem[] {
    return safeGet<MenuItem[]>(STORAGE_KEYS.MENU, INITIAL_MENU_ITEMS);
  },
  saveMenuItems(items: MenuItem[], adminUser = 'Admin'): void {
    safeSet(STORAGE_KEYS.MENU, items);
  },
  addMenuItem(item: Omit<MenuItem, 'id'>, adminUser = 'Admin'): MenuItem {
    const items = this.getMenuItems();
    const newItem: MenuItem = { ...item, id: `item-${Date.now()}` };
    items.unshift(newItem);
    this.saveMenuItems(items);
    this.addAuditLog(adminUser, 'Added Menu Item', `Added "${newItem.name}" to ${newItem.section}.`);
    return newItem;
  },
  updateMenuItem(id: string, updates: Partial<MenuItem>, adminUser = 'Admin'): void {
    const items = this.getMenuItems();
    const idx = items.findIndex(i => i.id === id);
    if (idx !== -1) {
      items[idx] = { ...items[idx], ...updates };
      this.saveMenuItems(items);
      this.addAuditLog(adminUser, 'Updated Menu Item', `Modified details for item "${items[idx].name}".`);
    }
  },
  deleteMenuItem(id: string, adminUser = 'Admin'): void {
    const items = this.getMenuItems().filter(i => i.id !== id);
    this.saveMenuItems(items);
    this.addAuditLog(adminUser, 'Deleted Menu Item', `Removed item ID ${id}.`);
  },

  getSalonServices(): SalonService[] {
    return safeGet<SalonService[]>(STORAGE_KEYS.SERVICES, INITIAL_SALON_SERVICES);
  },
  saveSalonServices(services: SalonService[], adminUser = 'Admin'): void {
    safeSet(STORAGE_KEYS.SERVICES, services);
  },
  updateSalonService(id: string, updates: Partial<SalonService>, adminUser = 'Admin'): void {
    const list = this.getSalonServices();
    const idx = list.findIndex(s => s.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      this.saveSalonServices(list);
      this.addAuditLog(adminUser, 'Updated Salon/Barber Service', `Updated service "${list[idx].title}".`);
    }
  },
  addSalonService(service: Omit<SalonService, 'id'>, adminUser = 'Admin'): SalonService {
    const list = this.getSalonServices();
    const newService: SalonService = { ...service, id: `srv-${Date.now()}` };
    list.push(newService);
    this.saveSalonServices(list);
    this.addAuditLog(adminUser, 'Created Service', `Added "${newService.title}" under ${newService.department}.`);
    return newService;
  },

  getStaff(): StaffProfile[] {
    return safeGet<StaffProfile[]>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
  },
  saveStaff(staff: StaffProfile[]): void {
    safeSet(STORAGE_KEYS.STAFF, staff);
  },

  getEvents(): EventItem[] {
    return safeGet<EventItem[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  },
  saveEvents(events: EventItem[], adminUser = 'Admin'): void {
    safeSet(STORAGE_KEYS.EVENTS, events);
  },
  addEvent(event: Omit<EventItem, 'id'>, adminUser = 'Admin'): EventItem {
    const events = this.getEvents();
    const newEvent: EventItem = { ...event, id: `event-${Date.now()}` };
    events.unshift(newEvent);
    this.saveEvents(events);
    this.addAuditLog(adminUser, 'Created Event', `Created event "${newEvent.title}".`);
    return newEvent;
  },
  updateEvent(id: string, updates: Partial<EventItem>, adminUser = 'Admin'): void {
    const events = this.getEvents();
    const idx = events.findIndex(e => e.id === id);
    if (idx !== -1) {
      events[idx] = { ...events[idx], ...updates };
      this.saveEvents(events);
      this.addAuditLog(adminUser, 'Updated Event', `Updated event "${events[idx].title}".`);
    }
  },
  deleteEvent(id: string, adminUser = 'Admin'): void {
    const events = this.getEvents().filter(e => e.id !== id);
    this.saveEvents(events);
    this.addAuditLog(adminUser, 'Deleted Event', `Removed event ID ${id}.`);
  },

  getGallery(): GalleryItem[] {
    return safeGet<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
  },
  saveGallery(items: GalleryItem[], adminUser = 'Admin'): void {
    safeSet(STORAGE_KEYS.GALLERY, items);
  },
  addGalleryItem(item: Omit<GalleryItem, 'id'>, adminUser = 'Admin'): GalleryItem {
    const list = this.getGallery();
    const newItem: GalleryItem = { ...item, id: `gal-${Date.now()}` };
    list.unshift(newItem);
    this.saveGallery(list);
    this.addAuditLog(adminUser, 'Added Gallery Media', `Uploaded "${newItem.title}".`);
    return newItem;
  },
  deleteGalleryItem(id: string, adminUser = 'Admin'): void {
    const list = this.getGallery().filter(g => g.id !== id);
    this.saveGallery(list);
    this.addAuditLog(adminUser, 'Deleted Gallery Media', `Removed item ID ${id}.`);
  },

  getOrders(): Order[] {
    return safeGet<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },
  saveOrders(orders: Order[]): void {
    safeSet(STORAGE_KEYS.ORDERS, orders);
  },
  createOrder(orderData: Omit<Order, 'id' | 'orderRef' | 'createdAt' | 'status' | 'paymentStatus'>): Order {
    const orders = this.getOrders();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderRef = `BOT-${new Date().getFullYear()}-${randomSuffix}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderRef,
      status: 'new',
      paymentStatus: 'pending_verification',
      createdAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    this.saveOrders(orders);
    // Asynchronously sync to Supabase live database
    SupabaseService.syncOrder(newOrder).catch(() => {});
    return newOrder;
  },
  updateOrderStatus(id: string, status: Order['status'], adminUser = 'Orders Desk'): void {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      orders[idx].status = status;
      this.saveOrders(orders);
      this.addAuditLog(adminUser, 'Updated Order Status', `Order ${orders[idx].orderRef} status changed to ${status}.`);
    }
  },

  getBookings(): AppointmentBooking[] {
    return safeGet<AppointmentBooking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  },
  saveBookings(bookings: AppointmentBooking[]): void {
    safeSet(STORAGE_KEYS.BOOKINGS, bookings);
  },
  createBooking(bookingData: Omit<AppointmentBooking, 'id' | 'bookingRef' | 'createdAt' | 'status'>): { success: boolean; booking?: AppointmentBooking; message?: string } {
    const bookings = this.getBookings();
    
    // Double-booking check: prevent duplicate accepted slot for same staff member and date/time
    if (bookingData.staffId) {
      const conflict = bookings.find(
        b => b.staffId === bookingData.staffId &&
             b.preferredDate === bookingData.preferredDate &&
             b.preferredTime === bookingData.preferredTime &&
             (b.status === 'confirmed' || b.status === 'pending')
      );
      if (conflict) {
        return {
          success: false,
          message: `The selected specialist is already requested or booked at ${bookingData.preferredTime} on ${bookingData.preferredDate}. Please select another time or specialist.`
        };
      }
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = `MIA-${new Date().getFullYear()}-${randomSuffix}`;
    const newBooking: AppointmentBooking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      bookingRef,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    bookings.unshift(newBooking);
    this.saveBookings(bookings);
    // Asynchronously sync to Supabase live database
    SupabaseService.syncBooking(newBooking).catch(() => {});
    return { success: true, booking: newBooking };
  },
  updateBookingStatus(id: string, status: AppointmentBooking['status'], adminUser = 'Reception'): void {
    const bookings = this.getBookings();
    const idx = bookings.findIndex(b => b.id === id);
    if (idx !== -1) {
      bookings[idx].status = status;
      this.saveBookings(bookings);
      this.addAuditLog(adminUser, 'Updated Booking Status', `Booking ${bookings[idx].bookingRef} marked as ${status}.`);
    }
  },

  getEnquiries(): ContactEnquiry[] {
    return safeGet<ContactEnquiry[]>(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
  },
  createEnquiry(data: Omit<ContactEnquiry, 'id' | 'createdAt' | 'status'>): ContactEnquiry {
    const list = this.getEnquiries();
    const newEnquiry: ContactEnquiry = {
      ...data,
      id: `enq-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    list.unshift(newEnquiry);
    safeSet(STORAGE_KEYS.ENQUIRIES, list);
    // Asynchronously sync to Supabase live database
    SupabaseService.syncEnquiry(newEnquiry).catch(() => {});
    return newEnquiry;
  },
  updateEnquiryStatus(id: string, status: ContactEnquiry['status']): void {
    const list = this.getEnquiries();
    const idx = list.findIndex(e => e.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      safeSet(STORAGE_KEYS.ENQUIRIES, list);
    }
  },

  getAuditLogs(): AuditLogEntry[] {
    return safeGet<AuditLogEntry[]>(STORAGE_KEYS.AUDIT, [
      {
        id: 'aud-1',
        timestamp: '2026-10-31T08:00:00Z',
        actor: 'Super Administrator',
        action: 'System Initialized',
        details: 'Initial catalogue loaded with 4 departments and Monrovia credentials.',
      }
    ]);
  },
  addAuditLog(actor: string, action: string, details: string): void {
    const logs = this.getAuditLogs();
    logs.unshift({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor,
      action,
      details,
    });
    safeSet(STORAGE_KEYS.AUDIT, logs.slice(0, 100));
  },

  getCart(): CartItem[] {
    return safeGet<CartItem[]>(STORAGE_KEYS.CART, []);
  },
  saveCart(cart: CartItem[]): void {
    safeSet(STORAGE_KEYS.CART, cart);
  },

  isAdminLoggedIn(): boolean {
    return safeGet<boolean>(STORAGE_KEYS.ADMIN_AUTH, false);
  },
  setAdminLoggedIn(val: boolean): void {
    safeSet(STORAGE_KEYS.ADMIN_AUTH, val);
  },

  // Website Section Images Manager
  getSectionImages(): WebsiteImageRecord[] {
    return safeGet<WebsiteImageRecord[]>(STORAGE_KEYS.SECTION_IMAGES, INITIAL_SECTION_IMAGE_RECORDS);
  },
  saveSectionImages(records: WebsiteImageRecord[]): void {
    safeSet(STORAGE_KEYS.SECTION_IMAGES, records);
  },
  updateSectionImage(id: string, updates: Partial<WebsiteImageRecord>, adminUser = 'Admin'): WebsiteImageRecord | null {
    const records = this.getSectionImages();
    const idx = records.findIndex(r => r.id === id || r.key === id);
    if (idx !== -1) {
      records[idx] = { ...records[idx], ...updates, updatedAt: new Date().toISOString() };
      this.saveSectionImages(records);
      
      // Also sync to BusinessSettings.sectionImages if appropriate
      const settings = this.getSettings();
      const updatedSectionImages = { ...(settings.sectionImages || {}), [records[idx].key]: records[idx].url };
      
      // Update heroImage or logo if matching key
      const extraSettings: Partial<BusinessSettings> = { sectionImages: updatedSectionImages };
      if (records[idx].key === 'homepage.hero_main') {
        extraSettings.heroImage = records[idx].url;
      } else if (records[idx].key === 'homepage.hero_secondary') {
        extraSettings.heroSecondaryImage = records[idx].url;
      } else if (records[idx].key === 'brand.logo') {
        extraSettings.logoUrl = records[idx].url;
      }
      
      this.saveSettings({ ...settings, ...extraSettings }, adminUser);
      this.addAuditLog(adminUser, 'Replaced Website Section Image', `Updated photograph for "${records[idx].sectionLabel}".`);
      return records[idx];
    }
    return null;
  },

  // Website Media Library Manager
  getMediaLibrary(): MediaLibraryItem[] {
    return safeGet<MediaLibraryItem[]>(STORAGE_KEYS.MEDIA_LIBRARY, INITIAL_MEDIA_LIBRARY);
  },
  saveMediaLibrary(items: MediaLibraryItem[]): void {
    safeSet(STORAGE_KEYS.MEDIA_LIBRARY, items);
  },
  addMediaLibraryItem(item: Omit<MediaLibraryItem, 'id' | 'createdAt' | 'updatedAt'>, adminUser = 'Admin'): MediaLibraryItem {
    const list = this.getMediaLibrary();
    const newItem: MediaLibraryItem = {
      ...item,
      id: `med-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.unshift(newItem);
    this.saveMediaLibrary(list);
    this.addAuditLog(adminUser, 'Uploaded Media Library Image', `Added file "${newItem.fileName}" to ${newItem.category} library.`);
    return newItem;
  },
  updateMediaLibraryItem(id: string, updates: Partial<MediaLibraryItem>, adminUser = 'Admin'): void {
    const list = this.getMediaLibrary();
    const idx = list.findIndex(m => m.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
      this.saveMediaLibrary(list);
      this.addAuditLog(adminUser, 'Edited Media Metadata', `Modified caption/details for image "${list[idx].fileName}".`);
    }
  },
  deleteMediaLibraryItem(id: string, adminUser = 'Admin'): boolean {
    const list = this.getMediaLibrary();
    const item = list.find(m => m.id === id);
    if (!item) return false;
    
    // Check if image is protected or in active use
    if (item.usedIn && item.usedIn.length > 0 && adminUser !== 'Super Administrator') {
      return false; // Only Super Admin can delete actively used media
    }
    
    const filtered = list.filter(m => m.id !== id);
    this.saveMediaLibrary(filtered);
    this.addAuditLog(adminUser, 'Deleted Media Library Image', `Removed image "${item.fileName}" from library.`);
    return true;
  },

  resetToDefaults(): void {
    safeSet(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    safeSet(STORAGE_KEYS.MENU, INITIAL_MENU_ITEMS);
    safeSet(STORAGE_KEYS.SERVICES, INITIAL_SALON_SERVICES);
    safeSet(STORAGE_KEYS.STAFF, INITIAL_STAFF);
    safeSet(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    safeSet(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
    safeSet(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    safeSet(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    safeSet(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
    safeSet(STORAGE_KEYS.SECTION_IMAGES, INITIAL_SECTION_IMAGE_RECORDS);
    safeSet(STORAGE_KEYS.MEDIA_LIBRARY, INITIAL_MEDIA_LIBRARY);
  }
};
