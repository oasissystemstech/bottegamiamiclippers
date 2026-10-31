import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  LayoutDashboard, 
  FileEdit, 
  UtensilsCrossed, 
  ShoppingBag, 
  Calendar, 
  Sparkles, 
  Image as ImageIcon, 
  MessageSquare, 
  Settings as SettingsIcon, 
  Database, 
  Network, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertTriangle, 
  Save, 
  Eye, 
  MessageCircle, 
  Copy, 
  Check 
} from 'lucide-react';
import { 
  BusinessSettings, 
  MenuItem, 
  Order, 
  AppointmentBooking, 
  EventItem, 
  GalleryItem, 
  ContactEnquiry, 
  AuditLogEntry, 
  SalonService, 
  StaffProfile,
  Currency,
  MenuSection
} from '../types';
import { StorageService } from '../services/storage';
import { SupabaseService } from '../services/supabase';
import { SUPABASE_SQL_MIGRATION, FUTURE_BMS_INTEGRATION_SPEC } from '../data/supabaseSchema';

interface AdminDashboardProps {
  settings: BusinessSettings;
  setSettings: (settings: BusinessSettings) => void;
  menuItems: MenuItem[];
  setMenuItems: (items: MenuItem[]) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  bookings: AppointmentBooking[];
  setBookings: (bookings: AppointmentBooking[]) => void;
  events: EventItem[];
  setEvents: (events: EventItem[]) => void;
  gallery: GalleryItem[];
  setGallery: (gallery: GalleryItem[]) => void;
  services: SalonService[];
  setServices: (services: SalonService[]) => void;
  staff: StaffProfile[];
  onExit: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings,
  setSettings,
  menuItems,
  setMenuItems,
  orders,
  setOrders,
  bookings,
  setBookings,
  events,
  setEvents,
  gallery,
  setGallery,
  services,
  setServices,
  staff,
  onExit,
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(StorageService.isAdminLoggedIn());
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [adminRole, setAdminRole] = useState<'Super Administrator' | 'Content Editor' | 'Orders Staff'>('Super Administrator');

  // Active module tab
  const [activeModule, setActiveModule] = useState<string>('overview');

  // Copy helper
  const [copiedSql, setCopiedSql] = useState(false);

  // Supabase live health status
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<{ connected: boolean; message: string; timestamp?: string } | null>(null);

  const testSupabaseConnection = async () => {
    setIsTestingSupabase(true);
    const result = await SupabaseService.checkConnection();
    setSupabaseStatus(result);
    setIsTestingSupabase(false);
    if (result.connected) {
      showBanner('Supabase connection verified successfully!');
    }
  };

  // Status message
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  const showBanner = (msg: string) => {
    setSaveBanner(msg);
    setTimeout(() => setSaveBanner(null), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default master passcodes: "bottega2026" or "admin" or "monrovia"
    if (passcode.toLowerCase() === 'bottega2026' || passcode.toLowerCase() === 'admin' || passcode.toLowerCase() === 'monrovia') {
      setIsAuthenticated(true);
      StorageService.setAdminLoggedIn(true);
      setAuthError(null);
    } else {
      setAuthError('Invalid administrator credentials. (Default demo PIN: bottega2026)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    StorageService.setAdminLoggedIn(false);
  };

  // ================= MODULE STATES & HANDLERS =================
  // 1. Settings state
  const [formSettings, setFormSettings] = useState<BusinessSettings>(settings);

  const handleSaveSettings = () => {
    StorageService.saveSettings(formSettings, adminRole);
    setSettings(formSettings);
    showBanner('Website & Contact settings successfully updated.');
  };

  // 2. Menu Item Modal / Editor
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [isAddingMenuItem, setIsAddingMenuItem] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    section: 'restaurant',
    category: 'Local Specialties',
    price: 10,
    currency: 'USD',
    isAvailable: true,
    isFeatured: false,
    variants: [],
  });

  const handleSaveMenuItem = () => {
    if (!editingMenuItem) return;
    StorageService.updateMenuItem(editingMenuItem.id, editingMenuItem, adminRole);
    setMenuItems(StorageService.getMenuItems());
    setEditingMenuItem(null);
    showBanner(`Updated menu item: "${editingMenuItem.name}".`);
  };

  const handleCreateMenuItem = () => {
    if (!newItem.name) return;
    StorageService.addMenuItem({
      name: newItem.name || 'New Item',
      description: newItem.description || '',
      section: newItem.section || 'restaurant',
      category: newItem.category || 'General',
      price: Number(newItem.price) || 0,
      currency: newItem.currency || 'USD',
      image: newItem.image || undefined,
      isAvailable: newItem.isAvailable !== undefined ? newItem.isAvailable : true,
      isFeatured: !!newItem.isFeatured,
      variants: newItem.variants || [],
    }, adminRole);
    setMenuItems(StorageService.getMenuItems());
    setIsAddingMenuItem(false);
    setNewItem({
      name: '',
      description: '',
      section: 'restaurant',
      category: 'Local Specialties',
      price: 10,
      currency: 'USD',
      isAvailable: true,
      isFeatured: false,
      variants: [],
    });
    showBanner('New menu item successfully added to catalogue.');
  };

  const handleDeleteMenuItem = (id: string) => {
    if (confirm('Are you sure you want to remove this menu item?')) {
      StorageService.deleteMenuItem(id, adminRole);
      setMenuItems(StorageService.getMenuItems());
      showBanner('Item removed from menu.');
    }
  };

  // 3. Orders Status updater
  const handleOrderStatusChange = (orderId: string, newStatus: Order['status']) => {
    StorageService.updateOrderStatus(orderId, newStatus, adminRole);
    setOrders(StorageService.getOrders());
    showBanner(`Order status changed to "${newStatus}".`);
  };

  // 4. Bookings Status updater
  const handleBookingStatusChange = (bookingId: string, newStatus: AppointmentBooking['status']) => {
    StorageService.updateBookingStatus(bookingId, newStatus, adminRole);
    setBookings(StorageService.getBookings());
    showBanner(`Booking request status updated to "${newStatus}".`);
  };

  // 5. Events Manager
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<EventItem>>({
    title: '',
    description: '',
    date: 'Upcoming Weekend',
    startTime: '8:00 PM',
    location: 'Bottega Restro & Lounge',
    ticketInfo: 'Free Entry',
    isPublished: true,
    isArchived: false,
    tag: 'Special Event',
    image: '/public/assets/aistudio/WhatsApp_Image_2026-10-31_at_10.14.37__6__2f1053fa.jpeg'
  });

  const handleCreateEvent = () => {
    if (!newEvent.title) return;
    StorageService.addEvent({
      title: newEvent.title || 'New Event',
      description: newEvent.description || '',
      date: newEvent.date || 'Upcoming',
      startTime: newEvent.startTime || '8:00 PM',
      endTime: newEvent.endTime,
      location: newEvent.location || 'Bottega Lounge',
      ticketInfo: newEvent.ticketInfo || 'Open to all',
      isPublished: true,
      isArchived: false,
      tag: newEvent.tag || 'Special',
      image: newEvent.image || '/public/assets/aistudio/WhatsApp_Image_2026-10-31_at_10.14.37__6__2f1053fa.jpeg'
    }, adminRole);
    setEvents(StorageService.getEvents());
    setIsAddingEvent(false);
    showBanner('Event published successfully.');
  };

  const handleToggleEventPublish = (event: EventItem) => {
    StorageService.updateEvent(event.id, { isPublished: !event.isPublished }, adminRole);
    setEvents(StorageService.getEvents());
    showBanner(`Event ${event.isPublished ? 'unpublished' : 'published'}.`);
  };

  const handleToggleEventArchive = (event: EventItem) => {
    StorageService.updateEvent(event.id, { isArchived: !event.isArchived }, adminRole);
    setEvents(StorageService.getEvents());
    showBanner(`Event ${event.isArchived ? 'restored to active' : 'moved to archive'}.`);
  };

  // 6. Gallery Manager
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryCat, setNewGalleryCat] = useState<GalleryItem['category']>('restaurant');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newGalleryCaption, setNewGalleryCaption] = useState('');

  const handleAddGalleryItem = () => {
    if (!newGalleryTitle.trim() || !newGalleryUrl.trim()) return;
    StorageService.addGalleryItem({
      title: newGalleryTitle.trim(),
      category: newGalleryCat,
      image: newGalleryUrl.trim(),
      caption: newGalleryCaption.trim() || undefined,
      isFeatured: true,
    }, adminRole);
    setGallery(StorageService.getGallery());
    setNewGalleryTitle('');
    setNewGalleryUrl('');
    setNewGalleryCaption('');
    showBanner('New photo added to gallery.');
  };

  const handleDeleteGallery = (id: string) => {
    StorageService.deleteGalleryItem(id, adminRole);
    setGallery(StorageService.getGallery());
    showBanner('Media item deleted.');
  };

  // 7. Enquiries
  const enquiries = StorageService.getEnquiries();

  // Metrics
  const pendingOrders = orders.filter(o => o.status === 'new' || o.status === 'confirmed' || o.status === 'preparing');
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const totalRevenueUSD = orders.filter(o => o.status !== 'cancelled').reduce((acc, o) => acc + o.totalUSD, 0);
  const totalRevenueLRD = orders.filter(o => o.status !== 'cancelled').reduce((acc, o) => acc + o.totalLRD, 0);

  // ================= LOGIN SCREEN =================
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#F5F0E8]">
        <div className="max-w-md w-full bg-[#EDE3D5]/50 border border-[#EDE3D5] p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#7B2635] text-[#F5F0E8] flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-2xl font-normal text-[#28201E]">
              Staff Concierge Portal
            </h2>
            <p className="text-xs text-[#28201E]/70 font-light">
              Authorized staff management for Bottega Restro & Miami Clipper.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#28201E] mb-1.5">
                Staff Role
              </label>
              <select
                value={adminRole}
                onChange={(e) => setAdminRole(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-white border border-[#EDE3D5] text-xs text-[#28201E] focus:border-[#7B2635] focus:outline-none"
              >
                <option value="Super Administrator">Super Administrator (Full System Access)</option>
                <option value="Content Editor">Content Editor (Menu, Events & Pages)</option>
                <option value="Orders Staff">Orders & Booking Reception Desk</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#28201E] mb-1.5">
                Access Passcode / Security PIN
              </label>
              <input
                type="password"
                required
                placeholder="Enter admin passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#EDE3D5] text-xs text-[#28201E] focus:border-[#7B2635] focus:outline-none"
              />
              <span className="text-[10px] text-[#28201E]/60 mt-1 block font-light">
                Default demo passcode: <code className="text-[#7B2635] font-semibold">bottega2026</code>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#7B2635] hover:bg-[#641F2B] text-[#F5F0E8] font-bold text-xs uppercase tracking-wider shadow-md transition-colors"
            >
              Sign In to Management Portal
            </button>

            <button
              type="button"
              onClick={onExit}
              className="w-full py-2 text-xs font-medium text-[#28201E]/60 hover:text-[#28201E] transition-colors"
            >
              ← Return to Public Website
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ================= MAIN AUTHENTICATED DASHBOARD =================
  const modules = [
    { id: 'overview', label: 'Overview & KPIs', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'orders', label: `Orders (${pendingOrders.length})`, icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'bookings', label: `Bookings (${pendingBookings.length})`, icon: <Calendar className="w-4 h-4" /> },
    { id: 'menu', label: 'Menu & Bars', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: 'pages', label: 'Content Editor', icon: <FileEdit className="w-4 h-4" /> },
    { id: 'events', label: 'Events Manager', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery Media', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'enquiries', label: `Enquiries (${enquiries.length})`, icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings & Contact', icon: <SettingsIcon className="w-4 h-4" /> },
    { id: 'bms_integration', label: 'Future BMS Specs', icon: <Network className="w-4 h-4" /> },
    { id: 'supabase_schema', label: 'Supabase SQL DDL', icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner Message */}
      {saveBanner && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveBanner}</span>
          </div>
        </div>
      )}

      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#c59b27]/10 border border-[#c59b27]/30 text-[#c59b27] flex items-center justify-center shadow-xs">
            <Unlock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-lg font-bold text-neutral-900">
                Bottega & Miami Clipper CMS Portal
              </h1>
              <span className="px-2 py-0.5 rounded bg-neutral-100 text-[10px] text-[#c59b27] font-bold border border-neutral-200">
                {adminRole}
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Logged in as authorized staff · Oldroad Junction, Monrovia
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-semibold text-neutral-800 hover:border-[#c59b27] hover:bg-white transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" /> View Public Site
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-neutral-200 scrollbar-none">
        {modules.map(mod => (
          <button
            key={mod.id}
            onClick={() => setActiveModule(mod.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
              activeModule === mod.id
                ? 'bg-[#c59b27] text-white font-bold shadow-sm'
                : 'bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 border border-neutral-200'
            }`}
          >
            {mod.icon}
            <span>{mod.label}</span>
          </button>
        ))}
      </div>

      {/* ================= MODULE 1: OVERVIEW & KPIS ================= */}
      {activeModule === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-1 shadow-xs">
              <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider block">Pending Orders</span>
              <span className="text-2xl font-bold text-neutral-900 tabular-nums">{pendingOrders.length}</span>
              <p className="text-[10px] text-[#c59b27] font-medium">Food & drinks queue</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-1 shadow-xs">
              <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider block">Pending Appointments</span>
              <span className="text-2xl font-bold text-neutral-900 tabular-nums">{pendingBookings.length}</span>
              <p className="text-[10px] text-[#c59b27] font-medium">Massage, salon & barber</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-1 shadow-xs">
              <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider block">Total Orders Revenue</span>
              <span className="text-lg font-bold text-neutral-900 tabular-nums block">
                ${totalRevenueUSD.toFixed(2)} USD
              </span>
              <span className="text-xs text-neutral-600 font-medium tabular-nums">
                + {totalRevenueLRD.toLocaleString()} LRD
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-1 shadow-xs">
              <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider block">Contact Inquiries</span>
              <span className="text-2xl font-bold text-neutral-900 tabular-nums">{enquiries.length}</span>
              <p className="text-[10px] text-emerald-600 font-medium">Submitted from web</p>
            </div>
          </div>

          {/* Quick Actions & Recent Orders Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h3 className="font-display text-base font-bold text-neutral-900">
                  Recent Food Orders
                </h3>
                <button
                  onClick={() => setActiveModule('orders')}
                  className="text-xs text-[#c59b27] font-semibold hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="space-y-3">
                {orders.slice(0, 4).map(o => (
                  <div key={o.id} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900">{o.orderRef}</span>
                        <span className="text-neutral-500">({o.customerName})</span>
                      </div>
                      <span className="text-[11px] text-[#c59b27] font-semibold tabular-nums">
                        {o.totalUSD > 0 && `$${o.totalUSD.toFixed(2)} USD `}
                        {o.totalLRD > 0 && `${o.totalLRD.toLocaleString()} LRD`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        o.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        o.status === 'preparing' ? 'bg-amber-100 text-amber-800' :
                        o.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-700'
                      }`}>
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h3 className="font-display text-base font-bold text-neutral-900">
                  Pending Appointment Requests
                </h3>
                <button
                  onClick={() => setActiveModule('bookings')}
                  className="text-xs text-[#c59b27] font-semibold hover:underline"
                >
                  Manage Bookings →
                </button>
              </div>

              <div className="space-y-3">
                {bookings.slice(0, 4).map(b => (
                  <div key={b.id} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-neutral-900">{b.serviceTitle}</p>
                      <p className="text-[11px] text-neutral-500">
                        {b.customerName} · {b.preferredDate} ({b.preferredTime})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        b.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODULE 2: ORDERS MANAGEMENT ================= */}
      {activeModule === 'orders' && (
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
            <div>
              <h2 className="font-display text-lg font-bold text-neutral-900">
                Online Food Orders Pipeline
              </h2>
              <p className="text-xs text-neutral-500">
                Update kitchen status, contact customers on WhatsApp, and view delivery details.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {orders.map(order => {
              const customerWhatsApp = (order.whatsapp || order.phone).replace(/[^0-9]/g, '');

              return (
                <div key={order.id} className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-base font-bold text-neutral-900">
                          {order.orderRef}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white text-[10px] uppercase font-bold text-[#c59b27] border border-neutral-200 shadow-xs">
                          {order.orderType}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600">
                        Client: <strong className="text-neutral-900">{order.customerName}</strong> · Phone: {order.phone}
                      </p>
                      {order.deliveryAddress && (
                        <p className="text-xs text-neutral-700">
                          Delivery: {order.deliveryAddress}
                        </p>
                      )}
                      {order.orderNotes && (
                        <p className="text-xs text-amber-700 italic">
                          Notes: "{order.orderNotes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${customerWhatsApp}?text=${encodeURIComponent(`Hello ${order.customerName}, this is Bottega Restro regarding your order ${order.orderRef}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200 flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" /> WhatsApp Client
                      </a>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] uppercase font-semibold text-neutral-500 block">
                      Ordered Items:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-white border border-neutral-200 flex justify-between">
                          <span className="text-neutral-800 font-medium">{it.quantity}x {it.name} {it.selectedVariant ? `(${it.selectedVariant})` : ''}</span>
                          <span className="font-bold text-[#c59b27] tabular-nums">
                            {it.currency === 'USD' ? `$${(it.price * it.quantity).toFixed(2)}` : `${(it.price * it.quantity).toLocaleString()} LRD`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Pipeline Buttons */}
                  <div className="pt-3 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500 font-medium">Change Status:</span>
                      {(['new', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled'] as Order['status'][]).map(st => (
                        <button
                          key={st}
                          onClick={() => handleOrderStatusChange(order.id, st)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize transition-all ${
                            order.status === st
                              ? 'bg-[#c59b27] text-white shadow-xs'
                              : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200 hover:bg-neutral-50'
                          }`}
                        >
                          {st.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-[#c59b27] tabular-nums">
                        Total: {order.totalUSD > 0 && `$${order.totalUSD.toFixed(2)} USD `}
                        {order.totalLRD > 0 && `${order.totalLRD.toLocaleString()} LRD`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= MODULE 3: APPOINTMENT MANAGEMENT ================= */}
      {activeModule === 'bookings' && (
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h2 className="font-display text-lg font-bold text-neutral-900">
                Appointment Bookings (Massage, Salon & Barbershop)
              </h2>
              <p className="text-xs text-neutral-500">
                Approve, decline, reschedule, and prevent double-booking conflicts.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {bookings.map(bk => {
              const cleanWhatsApp = (bk.whatsapp || bk.phone).replace(/[^0-9]/g, '');

              return (
                <div key={bk.id} className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-neutral-900">{bk.bookingRef}</span>
                        <span className="px-2 py-0.5 rounded bg-white text-[10px] uppercase font-bold text-[#c59b27] border border-neutral-200 shadow-xs">
                          {bk.department}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          bk.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                          bk.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {bk.status}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm text-neutral-900 mt-1">{bk.serviceTitle}</h4>
                      <p className="text-neutral-600 mt-0.5">
                        Client: <strong className="text-neutral-900">{bk.customerName}</strong> · Phone: {bk.phone} · Specialist: {bk.staffName || 'Any'}
                      </p>
                      <p className="text-[#c59b27] font-semibold mt-0.5">
                        Slot: {bk.preferredDate} at {bk.preferredTime}
                      </p>
                      {bk.additionalNotes && (
                        <p className="text-amber-800 italic mt-1">Client notes: "{bk.additionalNotes}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello ${bk.customerName}, this is Miami Clipper & Spa regarding your appointment request ${bk.bookingRef} for ${bk.serviceTitle}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold border border-emerald-200 flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" /> WhatsApp Client
                      </a>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-neutral-500 font-medium">Action:</span>
                    <button
                      onClick={() => handleBookingStatusChange(bk.id, 'confirmed')}
                      className="px-3 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold"
                    >
                      Approve & Confirm
                    </button>
                    <button
                      onClick={() => handleBookingStatusChange(bk.id, 'declined')}
                      className="px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 font-semibold"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleBookingStatusChange(bk.id, 'completed')}
                      className="px-3 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium border border-neutral-200"
                    >
                      Mark Completed
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= MODULE 4: MENU & BAR MANAGEMENT ================= */}
      {activeModule === 'menu' && (
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
            <div>
              <h2 className="font-display text-lg font-bold text-neutral-900">
                Menu & Beverage Catalogue Management
              </h2>
              <p className="text-xs text-neutral-500">
                Update dish pricing, original currencies, and availability for Main Bar and Outside Bar separately.
              </p>
            </div>
            <button
              onClick={() => setIsAddingMenuItem(true)}
              className="px-4 py-2 rounded-xl bg-[#c59b27] text-white font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-[#b0871d] transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          {/* Add Item Modal */}
          {isAddingMenuItem && (
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-300 space-y-4">
              <h3 className="font-bold text-sm text-neutral-900">Add New Food or Drink Item</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-neutral-600 font-medium mb-1">Item Name *</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                    placeholder="e.g. Grilled Red Snapper"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-600 font-medium mb-1">Section *</label>
                  <select
                    value={newItem.section}
                    onChange={(e) => setNewItem({ ...newItem, section: e.target.value as MenuSection })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                  >
                    <option value="restaurant">Restaurant Food</option>
                    <option value="main_bar">Main Bar Lounge</option>
                    <option value="outside_bar">Outside Bar Terrace</option>
                    <option value="wines">Wines</option>
                    <option value="cocktails">Cocktails</option>
                    <option value="non_alcoholic">Non-Alcoholic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-600 font-medium mb-1">Category Name *</label>
                  <input
                    type="text"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                    placeholder="e.g. Seafood & Grill"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-600 font-medium mb-1">Price *</label>
                  <input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-600 font-medium mb-1">Currency *</label>
                  <select
                    value={newItem.currency}
                    onChange={(e) => setNewItem({ ...newItem, currency: e.target.value as Currency })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="LRD">LRD (Liberian Dollars)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-600 font-medium mb-1">Image URL or Local Path</label>
                  <input
                    type="text"
                    value={newItem.image || ''}
                    onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                    placeholder="/public/assets/..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-neutral-600 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 text-xs resize-none focus:border-[#c59b27] focus:outline-none"
                  placeholder="Ingredients, sides, serving details..."
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCreateMenuItem}
                  className="px-4 py-2 rounded-lg bg-[#c59b27] text-white font-bold text-xs hover:bg-[#b0871d]"
                >
                  Save Item to Menu
                </button>
                <button
                  onClick={() => setIsAddingMenuItem(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-200 text-neutral-800 text-xs hover:bg-neutral-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Edit Item Modal */}
          {editingMenuItem && (
            <div className="p-5 rounded-2xl bg-neutral-50 border-2 border-[#c59b27] space-y-4">
              <h3 className="font-bold text-sm text-neutral-900">Edit Item: {editingMenuItem.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-neutral-600 font-medium mb-1">Item Name</label>
                  <input
                    type="text"
                    value={editingMenuItem.name}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-600 font-medium mb-1">Price</label>
                  <input
                    type="number"
                    value={editingMenuItem.price}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-600 font-medium mb-1">Currency</label>
                  <select
                    value={editingMenuItem.currency}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, currency: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="LRD">LRD</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingMenuItem.isAvailable}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, isAvailable: e.target.checked })}
                    className="rounded text-[#c59b27]"
                  />
                  <span>Is Available</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingMenuItem.isFeatured}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, isFeatured: e.target.checked })}
                    className="rounded text-[#c59b27]"
                  />
                  <span>Featured on Homepage</span>
                </label>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveMenuItem}
                  className="px-4 py-2 rounded-lg bg-[#c59b27] text-white font-bold text-xs hover:bg-[#b0871d]"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingMenuItem(null)}
                  className="px-4 py-2 rounded-lg bg-neutral-200 text-neutral-800 text-xs hover:bg-neutral-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Menu Items Table */}
          <div className="overflow-x-auto rounded-xl border border-neutral-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200 font-semibold">
                <tr>
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">Section</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 bg-white">
                {menuItems.map(item => (
                  <tr key={item.id} className="hover:bg-[#faf8f5] transition-colors">
                    <td className="py-3 px-4 font-semibold text-neutral-900">{item.name}</td>
                    <td className="py-3 px-4 capitalize text-neutral-600">{item.section.replace('_', ' ')}</td>
                    <td className="py-3 px-4 text-neutral-500">{item.category}</td>
                    <td className="py-3 px-4 font-bold text-[#c59b27] tabular-nums">
                      {item.currency === 'USD' ? `$${item.price.toFixed(2)}` : `${item.price.toLocaleString()} LRD`}
                    </td>
                    <td className="py-3 px-4">
                      {item.isAvailable ? (
                        <span className="text-emerald-700 font-semibold">In Stock</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Unavailable</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setEditingMenuItem(item)}
                        className="p-1.5 rounded-lg bg-neutral-100 hover:bg-[#c59b27] hover:text-white text-neutral-700 transition-colors"
                        title="Edit Item"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMenuItem(item.id)}
                        className="p-1.5 rounded-lg bg-neutral-100 hover:bg-red-500 text-neutral-700 hover:text-white transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODULE 5: PAGE & CONTENT EDITOR ================= */}
      {activeModule === 'pages' && (
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h2 className="font-display text-lg font-bold text-neutral-900">
                Website Content & Hero Editor
              </h2>
              <p className="text-xs text-neutral-500">
                Modify homepage hero text, subtext, taglines, and brand copy without touching code.
              </p>
            </div>
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 rounded-xl bg-[#c59b27] text-white font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-[#b0871d] transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" /> Save Content Changes
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-neutral-600 mb-1">
                Business Display Name
              </label>
              <input
                type="text"
                value={formSettings.heroTitle}
                onChange={(e) => setFormSettings({ ...formSettings, heroTitle: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 focus:border-[#c59b27] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-neutral-600 mb-1">
                Hero Subtitle / Description
              </label>
              <textarea
                rows={3}
                value={formSettings.heroSubtext}
                onChange={(e) => setFormSettings({ ...formSettings, heroSubtext: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 resize-none focus:border-[#c59b27] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-neutral-600 mb-1">
                Official Logo URL
              </label>
              <input
                type="text"
                value={formSettings.logoUrl}
                onChange={(e) => setFormSettings({ ...formSettings, logoUrl: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 focus:border-[#c59b27] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= MODULE 6: EVENTS MANAGER ================= */}
      {activeModule === 'events' && (
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h2 className="font-display text-lg font-bold text-neutral-900">
                Events & Entertainment Management
              </h2>
              <p className="text-xs text-neutral-500">
                Publish upcoming specials or move past promotions to the archive.
              </p>
            </div>
            <button
              onClick={() => setIsAddingEvent(true)}
              className="px-4 py-2 rounded-xl bg-[#c59b27] text-white font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-[#b0871d] transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create Event
            </button>
          </div>

          {isAddingEvent && (
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-300 space-y-4 text-xs">
              <h3 className="font-bold text-sm text-neutral-900">Create New Event</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-neutral-600 font-medium mb-1">Event Title *</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                    placeholder="e.g. Afrobeats Night"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-600 font-medium mb-1">Date & Frequency</label>
                  <input
                    type="text"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                    placeholder="e.g. Every Saturday Night"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-600 font-medium mb-1">Start Time</label>
                  <input
                    type="text"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                    placeholder="e.g. 9:00 PM"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-600 font-medium mb-1">Tag / Category</label>
                  <input
                    type="text"
                    value={newEvent.tag}
                    onChange={(e) => setNewEvent({ ...newEvent, tag: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                    placeholder="e.g. Nightlife & Lounge"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-neutral-600 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 text-xs resize-none focus:border-[#c59b27] focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCreateEvent}
                  className="px-4 py-2 rounded-lg bg-[#c59b27] text-white font-bold text-xs hover:bg-[#b0871d]"
                >
                  Publish Event
                </button>
                <button
                  onClick={() => setIsAddingEvent(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-200 text-neutral-800 text-xs hover:bg-neutral-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {events.map(evt => (
              <div key={evt.id} className="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-neutral-900">{evt.title}</h4>
                    <span className="px-2 py-0.5 rounded bg-white border border-neutral-200 text-[10px] text-[#c59b27] font-semibold shadow-xs">
                      {evt.tag}
                    </span>
                    {evt.isArchived && (
                      <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-semibold">
                        Archived
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    {evt.date} · {evt.startTime} · Location: {evt.location}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleEventPublish(evt)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      evt.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {evt.isPublished ? 'Published' : 'Draft'}
                  </button>
                  <button
                    onClick={() => handleToggleEventArchive(evt)}
                    className="px-3 py-1 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-800 text-xs shadow-xs"
                  >
                    {evt.isArchived ? 'Restore' : 'Archive'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODULE 7: GALLERY MANAGER ================= */}
      {activeModule === 'gallery' && (
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h2 className="font-display text-lg font-bold text-neutral-900">
                Gallery Media Management
              </h2>
              <p className="text-xs text-neutral-500">
                Add new venue photos, edit descriptions, or remove outdated shots.
              </p>
            </div>
          </div>

          {/* Add Media Form */}
          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-300 space-y-3 text-xs">
            <h3 className="font-bold text-sm text-neutral-900">Add Photo / Media</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-neutral-600 font-medium mb-1">Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Lounge Booths at Night"
                  value={newGalleryTitle}
                  onChange={(e) => setNewGalleryTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-neutral-600 font-medium mb-1">Category *</label>
                <select
                  value={newGalleryCat}
                  onChange={(e) => setNewGalleryCat(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                >
                  <option value="restaurant">Restaurant</option>
                  <option value="bar_lounge">Bar Lounge</option>
                  <option value="outside_bar">Outside Bar Terrace</option>
                  <option value="beauty_salon">Beauty Salon & Spa</option>
                  <option value="barbershop">Miami Barbershop</option>
                  <option value="events">Events</option>
                  <option value="general">General Business</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-neutral-600 font-medium mb-1">Image URL / Path *</label>
                <input
                  type="text"
                  placeholder="/public/assets/..."
                  value={newGalleryUrl}
                  onChange={(e) => setNewGalleryUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={handleAddGalleryItem}
              className="px-4 py-2 rounded-lg bg-[#c59b27] text-white font-bold text-xs hover:bg-[#b0871d] shadow-sm"
            >
              Add Media to Gallery
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map(g => (
              <div key={g.id} className="p-2.5 rounded-xl bg-white border border-neutral-200 space-y-2 shadow-xs">
                <div className="h-32 rounded-lg overflow-hidden relative border border-neutral-100">
                  <img src={g.image} alt={g.title} className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleDeleteGallery(g.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-sm"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs font-semibold text-neutral-900 truncate">{g.title}</p>
                <span className="text-[10px] text-neutral-500 capitalize block">{g.category.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODULE 8: ENQUIRIES ================= */}
      {activeModule === 'enquiries' && (
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h2 className="font-display text-lg font-bold text-neutral-900">
                Customer Contact Enquiries
              </h2>
              <p className="text-xs text-neutral-500">
                Messages submitted through the public Contact page enquiry form.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {enquiries.map(enq => (
              <div key={enq.id} className="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900">{enq.name}</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-neutral-200 text-[10px] text-[#c59b27] font-semibold shadow-xs">
                      {enq.category.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-500">Contact: {enq.contact}</span>
                </div>
                <p className="text-neutral-800 bg-white p-3 rounded-xl border border-neutral-200 shadow-xs leading-relaxed">
                  "{enq.message}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODULE 9: SETTINGS & CONTACT ================= */}
      {activeModule === 'settings' && (
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h2 className="font-display text-lg font-bold text-neutral-900">
                Business Contact & Social Settings
              </h2>
              <p className="text-xs text-neutral-500">
                Configure official WhatsApp number, phone, opening hours, and social media handles.
              </p>
            </div>
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 rounded-xl bg-[#c59b27] text-white font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-[#b0871d] transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-neutral-600 mb-1">
                WhatsApp Hotline Number (Digits with country code)
              </label>
              <input
                type="text"
                value={formSettings.whatsappNumber}
                onChange={(e) => setFormSettings({ ...formSettings, whatsappNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                placeholder="231774499840"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-neutral-600 mb-1">
                Telephone Call Number
              </label>
              <input
                type="text"
                value={formSettings.phone}
                onChange={(e) => setFormSettings({ ...formSettings, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                placeholder="+231 77 449 9840"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-neutral-600 mb-1">
                Physical Address
              </label>
              <input
                type="text"
                value={formSettings.address}
                onChange={(e) => setFormSettings({ ...formSettings, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-neutral-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formSettings.email}
                onChange={(e) => setFormSettings({ ...formSettings, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-neutral-600 mb-1">
                TikTok Profile URL
              </label>
              <input
                type="text"
                value={formSettings.socialLinks.tiktok}
                onChange={(e) => setFormSettings({
                  ...formSettings,
                  socialLinks: { ...formSettings.socialLinks, tiktok: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-neutral-600 mb-1">
                Instagram URL
              </label>
              <input
                type="text"
                value={formSettings.socialLinks.instagram}
                onChange={(e) => setFormSettings({
                  ...formSettings,
                  socialLinks: { ...formSettings.socialLinks, instagram: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-neutral-600 mb-1">
                Facebook Page URL
              </label>
              <input
                type="text"
                value={formSettings.socialLinks.facebook}
                onChange={(e) => setFormSettings({
                  ...formSettings,
                  socialLinks: { ...formSettings.socialLinks, facebook: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= MODULE 10: FUTURE BMS INTEGRATION ================= */}
      {activeModule === 'bms_integration' && (
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-6 shadow-xs">
          <div className="border-b border-neutral-100 pb-4">
            <h2 className="font-display text-lg font-bold text-neutral-900">
              Future Business Management System (BMS) Integration Architecture
            </h2>
            <p className="text-xs text-neutral-500">
              Decoupled bridge design ensuring the website can sync with the separate BMS when finished.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#faf8f2] border border-[#c59b27]/30 space-y-2 text-xs text-neutral-800">
            <h4 className="font-bold text-sm text-[#9e7b1c]">Architecture Principles:</h4>
            <p>1. <strong>Decoupled Persistence:</strong> Public web visitors order and submit appointments without depending on BMS server uptime.</p>
            <p>2. <strong>Bidirectional REST & Webhook Channels:</strong> Web orders push to kitchen POS queue; catalog & price changes propagate down to website.</p>
            <p>3. <strong>Currency Integrity:</strong> Both systems maintain independent USD and LRD ledgers with zero automated conversion loss.</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Defined BMS API Contracts:
            </h4>
            {FUTURE_BMS_INTEGRATION_SPEC.endpoints.map((ep, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-neutral-50/70 border border-neutral-200 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#c59b27] text-white font-bold text-[10px]">
                    {ep.method}
                  </span>
                  <code className="text-neutral-900 font-mono font-semibold">{ep.path}</code>
                </div>
                <p className="text-neutral-600">{ep.description}</p>
                {ep.samplePayload && (
                  <pre className="p-3 rounded-lg bg-neutral-900 text-emerald-300 font-mono text-[11px] overflow-x-auto shadow-inner">
                    {JSON.stringify(ep.samplePayload, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODULE 11: SUPABASE SQL MIGRATION & LIVE CONNECTION ================= */}
      {activeModule === 'supabase_schema' && (
        <div className="p-6 rounded-3xl bg-white border border-[#EDE3D5] space-y-6 shadow-xs font-sans">
          
          {/* Live Supabase Connection Card */}
          <div className="p-5 rounded-2xl bg-[#F5F0E8] border border-[#EDE3D5] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#7B2635] text-[#F5F0E8] flex items-center justify-center font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-normal text-[#28201E]">
                    Connected Supabase Project
                  </h3>
                  <p className="text-xs text-[#28201E]/70 font-light">
                    Project Ref: <code className="font-mono font-bold text-[#7B2635]">sdlyhrzhhccinvxvswou</code>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={testSupabaseConnection}
                disabled={isTestingSupabase}
                className="px-4 py-2 bg-[#7B2635] hover:bg-[#641F2B] text-[#F5F0E8] text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2 shadow-xs"
              >
                {isTestingSupabase ? <Clock className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {isTestingSupabase ? 'Testing Connection...' : 'Test Live Connection'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-light">
              <div className="p-3 bg-white border border-[#EDE3D5]">
                <span className="text-[10px] text-[#28201E]/60 uppercase tracking-wider block font-semibold">Endpoint URL</span>
                <span className="font-mono text-xs text-[#28201E] select-all">https://sdlyhrzhhccinvxvswou.supabase.co</span>
              </div>
              <div className="p-3 bg-white border border-[#EDE3D5]">
                <span className="text-[10px] text-[#28201E]/60 uppercase tracking-wider block font-semibold">Anon Public Key</span>
                <span className="font-mono text-xs text-emerald-700 font-medium">eyJhbGci...Vp3Mg (Active & Authenticated)</span>
              </div>
            </div>

            {supabaseStatus && (
              <div className={`p-3.5 rounded-xl border text-xs ${
                supabaseStatus.connected
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="font-medium">{supabaseStatus.message}</p>
                    {supabaseStatus.timestamp && (
                      <p className="text-[10px] opacity-75">Verified at: {new Date(supabaseStatus.timestamp).toLocaleTimeString()}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SQL Script Header & Copy */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EDE3D5]">
            <div>
              <h2 className="font-serif text-xl font-normal text-[#28201E]">
                PostgreSQL DDL & RLS Migration Script
              </h2>
              <p className="text-xs text-[#28201E]/70 font-light">
                Ready to execute in your Supabase SQL Editor. Creates all 12 tables, indexes, and security policies.
              </p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(SUPABASE_SQL_MIGRATION);
                setCopiedSql(true);
                setTimeout(() => setCopiedSql(false), 2000);
              }}
              className="px-4 py-2 bg-[#7B2635] text-[#F5F0E8] font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-[#641F2B] transition-colors shadow-xs"
            >
              {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedSql ? 'Copied to Clipboard' : 'Copy SQL Script'}
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-[#28201E] border border-[#28201E] text-emerald-300 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[460px] shadow-inner">
            {SUPABASE_SQL_MIGRATION}
          </pre>
        </div>
      )}

    </div>
  );
};
