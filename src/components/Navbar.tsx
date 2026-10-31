import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Menu as MenuIcon, 
  X, 
  Lock,
  Sparkles,
  UtensilsCrossed,
  Calendar
} from 'lucide-react';
import { BusinessSettings } from '../types';
import { AppImage } from './AppImage';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  cartCount: number;
  openCart: () => void;
  openBookingModal: () => void;
  settings: BusinessSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  cartCount,
  openCart,
  openBookingModal,
  settings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Consolidated 5 primary destinations as strictly requested
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'order-online', label: 'Order Online' },
    { id: 'salon-masseuse', label: 'Salon & Masseuse' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNav = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F5F0E8]/95 backdrop-blur-md border-b border-[#E3D9CC] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-6">
          
          {/* Brand Mark & Typography */}
          <button 
            onClick={() => handleNav('home')}
            className="flex items-center gap-3.5 text-left focus:outline-none group whitespace-nowrap shrink-0"
          >
            <div className="w-11 h-11 rounded-full border border-[#B38A45]/50 bg-[#EDE3D5] flex items-center justify-center overflow-hidden shadow-xs group-hover:border-[#7B2635] transition-colors">
              <AppImage 
                src={settings.logoUrl || '/images/brand/bottega-logo.jpeg'} 
                alt="Bottega Restro & Miami Clipper" 
                priority={true}
                departmentIcon="brand"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#28201E] group-hover:text-[#7B2635] transition-colors">
                  Bottega <span className="font-normal italic text-[#7B2635]">&</span> Miami Clipper
                </span>
              </div>
              <p className="text-[11px] text-[#6B5E59] tracking-wider uppercase hidden sm:block font-medium">
                Dining · Lounge · Salon · Barbershop · Monrovia
              </p>
            </div>
          </button>

          {/* 5 Primary Destination Links */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-8 text-[13px] font-semibold text-[#4A3F3B]">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`relative py-1.5 tracking-wide transition-colors ${
                    isActive 
                      ? 'text-[#7B2635] font-bold' 
                      : 'hover:text-[#7B2635] text-[#4A3F3B]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#7B2635] rounded-t-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Primary Action Suite */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Cart Trigger */}
            <button
              onClick={openCart}
              aria-label="View Shopping Cart"
              className="relative p-2.5 rounded-xl bg-[#EDE3D5] border border-[#D9CEBF] text-[#28201E] hover:border-[#7B2635] hover:bg-[#E5DAC9] transition-all shadow-xs"
            >
              <ShoppingBag className="w-5 h-5 text-[#28201E]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#7B2635] text-[#F5F0E8] font-bold text-xs flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Prominent "Order Online" CTA Button */}
            <button
              onClick={() => handleNav('order-online')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase text-[#F5F0E8] bg-[#7B2635] hover:bg-[#641F2B] active:bg-[#4A131E] shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0"
            >
              Order Online
            </button>

            {/* Quick Booking CTA */}
            <button
              onClick={() => handleNav('salon-masseuse')}
              className="hidden md:inline-flex items-center justify-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-[#28201E] bg-[#EDE3D5] border border-[#B38A45]/40 hover:border-[#7B2635] hover:bg-[#E5DAC9] transition-all whitespace-nowrap shrink-0"
            >
              Book Service
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-[#EDE3D5] border border-[#D9CEBF] text-[#28201E] hover:text-[#7B2635]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F5F0E8] border-b border-[#E3D9CC] px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in fade-in slide-in-from-top-4">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#E3D9CC]">
            <button
              onClick={() => { handleNav('order-online'); }}
              className="w-full py-2.5 px-3 rounded-lg bg-[#7B2635] text-[#F5F0E8] font-semibold text-xs uppercase text-center shadow-xs"
            >
              Order Online
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); openBookingModal(); }}
              className="w-full py-2.5 px-3 rounded-lg bg-[#EDE3D5] border border-[#B38A45]/40 text-[#28201E] font-semibold text-xs text-center"
            >
              Book Appointment
            </button>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  currentTab === link.id
                    ? 'bg-[#EDE3D5] text-[#7B2635] font-bold'
                    : 'text-[#4A3F3B] hover:bg-[#EDE3D5]/50 hover:text-[#28201E]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E3D9CC] flex items-center justify-between text-xs text-[#6B5E59]">
            <span>Oldroad Junction, Monrovia</span>
            <button 
              onClick={() => handleNav('admin')}
              className="text-[#7B2635] hover:text-[#641F2B] flex items-center gap-1 font-medium"
            >
              <Lock className="w-3 h-3" /> Staff Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
