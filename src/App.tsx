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
import { OrderingPage } from './pages/OrderingPage';
import { SalonMasseusePage } from './pages/SalonMasseusePage';
import { GalleryPage } from './pages/GalleryPage';
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
  // Navigation State (Consolidated to 5 primary destinations + admin)
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

  // Handle URL hash changes with backward compatibility redirects
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (!hash) {
        setCurrentTab('home');
        return;
      }

      if (hash === 'admin') {
        setCurrentTab('admin');
      } else if (hash === 'order-online' || hash === 'ordering' || hash === 'restaurant-bar') {
        setCurrentTab('order-online');
      } else if (hash === 'salon-masseuse' || hash === 'salon-massage' || hash === 'beauty-salon' || hash === 'barbershop') {
        setCurrentTab('salon-masseuse');
      } else if (hash === 'gallery') {
        setCurrentTab('gallery');
      } else if (hash === 'contact') {
        setCurrentTab('contact');
      } else if (hash === 'events' || hash === 'events-lounge') {
        setCurrentTab('home');
        setTimeout(() => {
          const el = document.getElementById('events-lounge');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else if (hash === 'about' || hash === 'our-story') {
        setCurrentTab('home');
        setTimeout(() => {
          const el = document.getElementById('our-story');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        setCurrentTab('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSetTab = (tab: string) => {
    // Redirect legacy keys to consolidated destinations
    let destination = tab;
    if (tab === 'restaurant-bar' || tab === 'ordering') {
      destination = 'order-online';
    } else if (tab === 'salon-massage' || tab === 'beauty-salon' || tab === 'barbershop') {
      destination = 'salon-masseuse';
    } else if (tab === 'events') {
      destination = 'home';
      setTimeout(() => {
        const el = document.getElementById('events-lounge');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (tab === 'about') {
      destination = 'home';
      setTimeout(() => {
        const el = document.getElementById('our-story');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }

    setCurrentTab(destination);
    window.location.hash = destination === 'home' ? '' : destination;
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
      
      {/* Top Navbar with Exactly 5 Core Links */}
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
        {/* 1. HOME (Features Hero, Departments, Food/Drinks, Salon/Barber, Events & Lounge, Story, Reviews, Map) */}
        {(currentTab === 'home' || currentTab === 'events' || currentTab === 'about') && (
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

        {/* 2. ORDER ONLINE (Unified Restaurant Food & Bar Menu) */}
        {(currentTab === 'order-online' || currentTab === 'ordering' || currentTab === 'restaurant-bar') && (
          <OrderingPage
            menuItems={menuItems}
            cart={cart}
            addToCart={addToCart}
            openCart={() => setIsCartOpen(true)}
            settings={settings}
          />
        )}

        {/* 3. SALON & MASSEUSE (Unified Beauty Salon, Massage & Spa, and Miami Barbershop) */}
        {(currentTab === 'salon-masseuse' || currentTab === 'salon-massage' || currentTab === 'beauty-salon' || currentTab === 'barbershop') && (
          <SalonMasseusePage
            services={services}
            staff={staff}
            openBookingModal={handleOpenBookingModal}
            settings={settings}
            initialDepartment={currentTab === 'barbershop' ? 'barbershop' : currentTab === 'beauty-salon' ? 'beauty_salon' : 'all'}
          />
        )}

        {/* 4. GALLERY */}
        {currentTab === 'gallery' && (
          <GalleryPage
            gallery={gallery}
            openLightbox={handleOpenLightbox}
          />
        )}

        {/* 5. CONTACT US */}
        {currentTab === 'contact' && (
          <ContactPage
            settings={settings}
          />
        )}

        {/* ADMIN CMS DASHBOARD */}
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
