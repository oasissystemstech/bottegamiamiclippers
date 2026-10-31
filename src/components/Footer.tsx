import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Lock, 
  UtensilsCrossed, 
  Wine, 
  Sparkles, 
  Scissors, 
  ArrowUpRight 
} from 'lucide-react';
import { BusinessSettings } from '../types';

interface FooterProps {
  settings: BusinessSettings;
  setCurrentTab: (tab: string) => void;
  openBookingModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, setCurrentTab }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#28201E] border-t border-[#3E3432] text-[#EDE3D5] transition-colors">
      
      {/* Top Experience Ribbon */}
      <div className="bg-[#1E1716] border-b border-[#3E3432] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#28201E] border border-[#B38A45]/30 flex items-center justify-center text-[#B38A45] shrink-0">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#F5F0E8]">Bottega Restaurant</h4>
              <p className="text-xs text-[#A89D96]">Liberian Nimba & Continental</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#28201E] border border-[#B38A45]/30 flex items-center justify-center text-[#B38A45] shrink-0">
              <Wine className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#F5F0E8]">Lounge & Outside Bar</h4>
              <p className="text-xs text-[#A89D96]">VIP Booths & Terrace Screenings</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#28201E] border border-[#B38A45]/30 flex items-center justify-center text-[#B38A45] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#F5F0E8]">Miami Clipper Salon</h4>
              <p className="text-xs text-[#A89D96]">Massage & Luxury Spa Pod</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#28201E] border border-[#B38A45]/30 flex items-center justify-center text-[#B38A45] shrink-0">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#F5F0E8]">Miami Barbershop</h4>
              <p className="text-xs text-[#A89D96]">Razor Fades & Hot Towels</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Directory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Story Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#B38A45]/40 bg-[#1E1716] flex items-center justify-center overflow-hidden">
                <img 
                  src={settings.logoUrl} 
                  alt="Bottega Restro & Miami Clipper" 
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-[#F5F0E8]">
                Bottega <span className="font-serif italic font-normal text-[#B38A45]">&</span> Miami Clipper
              </span>
            </div>
            
            <p className="text-xs leading-relaxed text-[#A89D96] max-w-sm">
              An established Monrovia hospitality house bringing together culinary traditions, relaxed bar lounge culture, restorative massage therapies, and master grooming at Oldroad Junction.
            </p>

            {/* Social Channels */}
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#B38A45] mb-2.5">
                Connect With Us
              </p>
              <div className="flex items-center gap-2.5">
                <a 
                  href={settings.socialLinks.tiktok} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#1E1716] border border-[#3E3432] text-xs font-medium text-[#EDE3D5] hover:border-[#B38A45] hover:text-[#B38A45] transition-all flex items-center gap-1.5"
                >
                  TikTok <ArrowUpRight className="w-3 h-3 text-[#B38A45]" />
                </a>
                <a 
                  href={settings.socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#1E1716] border border-[#3E3432] text-xs font-medium text-[#EDE3D5] hover:border-[#B38A45] hover:text-[#B38A45] transition-all flex items-center gap-1.5"
                >
                  Instagram <ArrowUpRight className="w-3 h-3 text-[#B38A45]" />
                </a>
                <a 
                  href={settings.socialLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#1E1716] border border-[#3E3432] text-xs font-medium text-[#EDE3D5] hover:border-[#B38A45] hover:text-[#B38A45] transition-all flex items-center gap-1.5"
                >
                  Facebook <ArrowUpRight className="w-3 h-3 text-[#B38A45]" />
                </a>
              </div>
            </div>
          </div>

          {/* Directory Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#F5F0E8] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setCurrentTab('restaurant-bar')} className="text-[#A89D96] hover:text-[#B38A45] transition-colors">
                  Dining & Bar Menu
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('ordering')} className="text-[#A89D96] hover:text-[#B38A45] transition-colors">
                  Order Online
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('salon-massage')} className="text-[#A89D96] hover:text-[#B38A45] transition-colors">
                  Salon & Spa Treatments
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('barbershop')} className="text-[#A89D96] hover:text-[#B38A45] transition-colors">
                  Miami Barbershop
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('events')} className="text-[#A89D96] hover:text-[#B38A45] transition-colors">
                  Events & Live Entertainment
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('gallery')} className="text-[#A89D96] hover:text-[#B38A45] transition-colors">
                  Photo Gallery
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('about')} className="text-[#A89D96] hover:text-[#B38A45] transition-colors">
                  Our Story
                </button>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#F5F0E8] mb-4">
              Operating Hours
            </h4>
            <div className="space-y-3 text-xs text-[#A89D96]">
              <div>
                <p className="font-medium text-[#F5F0E8]">Restaurant Dining</p>
                <p className="text-[11px] text-[#A89D96]">{settings.openingHours.restaurant}</p>
              </div>
              <div>
                <p className="font-medium text-[#F5F0E8]">Lounge & Outside Bar</p>
                <p className="text-[11px] text-[#A89D96]">{settings.openingHours.outsideBar}</p>
              </div>
              <div>
                <p className="font-medium text-[#F5F0E8]">Miami Salon & Massage</p>
                <p className="text-[11px] text-[#A89D96]">{settings.openingHours.beautySalon}</p>
              </div>
              <div>
                <p className="font-medium text-[#F5F0E8]">Miami Barbershop</p>
                <p className="text-[11px] text-[#A89D96]">{settings.openingHours.barbershop}</p>
              </div>
            </div>
          </div>

          {/* Location & Direct Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#F5F0E8] mb-4">
              Location & Enquiries
            </h4>
            <div className="space-y-3 text-xs text-[#A89D96]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B38A45] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B38A45] shrink-0" />
                <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="hover:text-[#B38A45] font-medium transition-colors">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B38A45] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-[#B38A45] transition-colors">
                  {settings.email}
                </a>
              </div>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Hello Bottega & Miami Clipper, I would like to make an enquiry.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#25d366]/15 text-[#25d366] border border-[#25d366]/30 text-xs font-semibold hover:bg-[#25d366]/25 transition-colors"
                >
                  WhatsApp: +{settings.whatsappNumber}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Discreet Admin Access */}
        <div className="mt-12 pt-6 border-t border-[#3E3432] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A89D96]">
          <div>
            © {currentYear} Bottega Restro & Miami Clipper. All rights reserved. Oldroad Junction, Monrovia, Liberia.
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentTab('contact')}
              className="hover:text-[#B38A45] transition-colors"
            >
              Contact Support
            </button>
            <span aria-hidden="true" className="text-[#3E3432]">·</span>
            {/* Discreet Staff Portal */}
            <button
              onClick={() => {
                setCurrentTab('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#B38A45] hover:text-[#F5F0E8] font-medium flex items-center gap-1.5 transition-colors"
              title="Access Admin CMS Dashboard"
            >
              <Lock className="w-3.5 h-3.5" /> Staff Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
