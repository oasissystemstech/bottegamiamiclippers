/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { CartDrawer } from './components/CartDrawer';
import { BookingModal } from './components/BookingModal';
import { LightboxModal } from './components/LightboxModal';

// Pages
import { HomePage } from './pages/HomePage';
import { RestaurantBarPage } from './pages/RestaurantBarPage';
import { OrderingPage } from './pages/OrderingPage';
import { BeautySalonPage } from './pages/BeautySalonPage';
import { BarbershopPage } from './pages/BarbershopPage';
import { EventsPage } from './pages/EventsPage';
import { GalleryPage } from './pages/GalleryPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';

// Data & Storage
import { StorageService } from './services/storage';
import { 
  MenuItem, 
  CartItem, 
  SalonService, 
  StaffProfile, 
  EventItem, 
  GalleryItem, 
  BusinessSettings, 
  Order, 
  AppointmentBooking, 
  ServiceDepartment 
} from './types';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Application Data States
  const [settings, setSettings] = useState<BusinessSettings>(StorageService.getSettings());
  const [menuItems, setMenuItems] = useState<MenuItem[]>(StorageService.getMenuItems());
  const [services, setServices] = useState<SalonService[]>(StorageService.getSalonServices());
  const [staff, setStaff] = useState<StaffProfile[]>(StorageService.getStaff());
  const [events, setEvents] = useState<EventItem[]>(StorageService.getEvents());
  const [gallery, setGallery] = useState<GalleryItem[]>(StorageService.getGallery());
  const [orders, setOrders] = useState<Order[]>(StorageService.getOrders());
  const [bookings, setBookings] = useState<AppointmentBooking[]>(StorageService.getBookings());

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(StorageService.getCart());
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingServiceId, setBookingServiceId] = useState<string | undefined>(undefined);
  const [bookingDept, setBookingDept] = useState<ServiceDepartment>('massage');

  // Lightbox Modal State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Sync cart to storage
  useEffect(() => {
    StorageService.saveCart(cart);
  }, [cart]);

  // Handle URL hash changes (support #admin)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'admin') {
        setCurrentTab('admin');
      } else if (hash && ['home', 'restaurant-bar', 'ordering', 'salon-massage', 'barbershop', 'events', 'gallery', 'about', 'contact'].includes(hash)) {
        setCurrentTab(hash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSetTab = (tab: string) => {
    setCurrentTab(tab);
    window.location.hash = tab === 'home' ? '' : tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Operations
  const addToCart = (item: MenuItem, variant?: string, instructions?: string) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(
        i => i.menuItem.id === item.id && i.selectedVariant === variant && i.specialInstructions === instructions
      );
      if (existingIdx !== -1) {
        const next = [...prev];
        next[existingIdx].quantity += 1;
        return next;
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random()}`,
          menuItem: item,
          quantity: 1,
          selectedVariant: variant,
          specialInstructions: instructions,
        }
      ];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Booking Modal Trigger
  const handleOpenBookingModal = (serviceId?: string, dept?: ServiceDepartment) => {
    setBookingServiceId(serviceId);
    if (dept) setBookingDept(dept);
    setIsBookingOpen(true);
  };

  // Lightbox Trigger
  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const cartItemsCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#28201E] font-sans antialiased flex flex-col selection:bg-[#7B2635] selection:text-[#F5F0E8]">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleSetTab}
        cartCount={cartItemsCount}
        openCart={() => setIsCartOpen(true)}
        openBookingModal={() => handleOpenBookingModal()}
        settings={settings}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            settings={settings}
            menuItems={menuItems}
            services={services}
            events={events}
            gallery={gallery}
            setCurrentTab={handleSetTab}
            openBookingModal={handleOpenBookingModal}
            addToCart={addToCart}
            openLightbox={handleOpenLightbox}
          />
        )}

        {currentTab === 'restaurant-bar' && (
          <RestaurantBarPage
            menuItems={menuItems}
            addToCart={addToCart}
            settings={settings}
          />
        )}

        {currentTab === 'ordering' && (
          <OrderingPage
            menuItems={menuItems}
            cart={cart}
            addToCart={addToCart}
            openCart={() => setIsCartOpen(true)}
            settings={settings}
          />
        )}

        {currentTab === 'salon-massage' && (
          <BeautySalonPage
            services={services}
            staff={staff}
            openBookingModal={handleOpenBookingModal}
            settings={settings}
          />
        )}

        {currentTab === 'barbershop' && (
          <BarbershopPage
            services={services}
            staff={staff}
            openBookingModal={handleOpenBookingModal}
            settings={settings}
          />
        )}

        {currentTab === 'events' && (
          <EventsPage
            events={events}
            settings={settings}
          />
        )}

        {currentTab === 'gallery' && (
          <GalleryPage
            gallery={gallery}
            openLightbox={handleOpenLightbox}
          />
        )}

        {currentTab === 'about' && (
          <AboutPage
            settings={settings}
            setCurrentTab={handleSetTab}
            openBookingModal={() => handleOpenBookingModal()}
          />
        )}

        {currentTab === 'contact' && (
          <ContactPage
            settings={settings}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            settings={settings}
            setSettings={setSettings}
            menuItems={menuItems}
            setMenuItems={setMenuItems}
            orders={orders}
            setOrders={setOrders}
            bookings={bookings}
            setBookings={setBookings}
            events={events}
            setEvents={setEvents}
            gallery={gallery}
            setGallery={setGallery}
            services={services}
            setServices={setServices}
            staff={staff}
            onExit={() => handleSetTab('home')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        setCurrentTab={handleSetTab}
        openBookingModal={() => handleOpenBookingModal()}
      />

      {/* Persistent Floating WhatsApp Action */}
      <WhatsAppFloatingButton settings={settings} />

      {/* Slide-Over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        settings={settings}
      />

      {/* Interactive Massage / Salon / Barber Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        services={services}
        staff={staff}
        settings={settings}
        preselectedServiceId={bookingServiceId}
        preselectedDepartment={bookingDept}
      />

      {/* Fullscreen Lightbox Modal */}
      <LightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        items={gallery}
        currentIndex={lightboxIndex}
        setCurrentIndex={setLightboxIndex}
      />

    </div>
  );
}
