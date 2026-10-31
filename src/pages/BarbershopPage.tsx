import React from 'react';
import { 
  Scissors, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  MessageCircle, 
  CheckCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SalonService, StaffProfile, BusinessSettings } from '../types';

interface BarbershopPageProps {
  services: SalonService[];
  staff: StaffProfile[];
  openBookingModal: (serviceId?: string, dept?: any) => void;
  settings: BusinessSettings;
}

export const BarbershopPage: React.FC<BarbershopPageProps> = ({
  services,
  staff,
  openBookingModal,
  settings,
}) => {
  const barberServices = services.filter(s => s.department === 'barbershop');
  const barbers = staff.filter(st => st.department === 'barbershop');

  const handleWhatsAppEnquiry = (service: SalonService) => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const message = `Hello Miami Barbershop! I would like to book a cut for: "${service.title}" ($${service.priceUSD} USD / ${service.priceLRD.toLocaleString()} LRD). What times are open today?`;
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#F5F0E8] text-[#28201E] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Editorial Hero Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-8 h-[1px] bg-[#C85B35]"></span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C85B35]">
                Master Grooming Suite · Oldroad Junction
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#28201E] font-normal tracking-tight leading-[1.1]">
              Precision Cuts, Beard Artistry <br />
              <span className="italic font-light text-[#7B2635]">& Traditional Hot Towels</span>
            </h1>

            <p className="text-sm sm:text-base text-[#28201E]/80 font-light leading-relaxed max-w-xl">
              Step into Monrovia’s premier gentlemen’s parlour. Where master scissor craft meets razor-sharp fades, organic beard elixirs, and hospital-grade UV sterilization on every instrument before it touches your skin.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => openBookingModal(undefined, 'barbershop')}
                className="px-6 py-3.5 bg-[#7B2635] text-[#F5F0E8] text-xs font-bold uppercase tracking-wider hover:bg-[#641F2B] transition-colors shadow-xs flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" /> Book Barber Chair
              </button>
              
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Miami Barbershop, I would like to check current waiting times or book an executive haircut.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-transparent border border-[#7B2635]/40 text-[#7B2635] text-xs font-bold hover:bg-[#7B2635]/5 transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#168a3e]" /> Inquire via WhatsApp
              </a>
            </div>

            {/* Hygiene & Standard Highlights */}
            <div className="pt-6 border-t border-[#EDE3D5] grid grid-cols-3 gap-4 text-xs font-light">
              <div>
                <span className="font-bold text-[#28201E] block font-serif text-sm">Active UV Chamber</span>
                <span className="text-[#28201E]/70 text-[11px]">Sanitized clippers & guards</span>
              </div>
              <div>
                <span className="font-bold text-[#28201E] block font-serif text-sm">Single-Use Razors</span>
                <span className="text-[#28201E]/70 text-[11px]">Fresh Japanese blades</span>
              </div>
              <div>
                <span className="font-bold text-[#28201E] block font-serif text-sm">Executive Recliners</span>
                <span className="text-[#28201E]/70 text-[11px]">Ergonomic comfort</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] overflow-hidden bg-[#EDE3D5] border border-[#EDE3D5] shadow-lg">
              <img 
                src="/public/assets/aistudio/WhatsApp_Image_2026-10-31_at_10.14.38__4__de9e00cf.jpeg" 
                alt="Miami Clipper Barber UV Sterilizer Stations" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Overlapping Detail Photo */}
            <div className="hidden sm:block absolute -bottom-6 -left-8 w-44 aspect-square overflow-hidden bg-[#28201E] border-4 border-[#F5F0E8] shadow-xl">
              <img 
                src="/public/assets/aistudio/WhatsApp_Image_2026-10-31_at_10.14.38__6__a5d50f34.jpeg" 
                alt="Miami Barbershop Luxury Suite" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Hygiene & Sanitation Standard Section */}
        <section className="bg-[#28201E] text-[#F5F0E8] p-8 sm:p-12 border border-[#28201E] relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B38A45]">
                <ShieldCheck className="w-4 h-4 text-[#B38A45]" /> Hospital-Grade Sterilization
              </div>
              
              <h2 className="font-serif text-2xl sm:text-3xl font-normal leading-snug">
                Safety & Scalp Health are Non-Negotiable
              </h2>
              
              <p className="text-xs sm:text-sm text-[#F5F0E8]/80 font-light leading-relaxed max-w-2xl">
                Every client receives fresh, individual razor blades opened in your presence. Clipper attachments, shears, and metal guards cycle through continuous ultraviolet sterilizer stations visible right beside each styling station. We prioritize your dermatological wellness.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-[#F5F0E8]/90 font-light">
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#B38A45]" /> Single-use straight razor blades</span>
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#B38A45]" /> UV-C radiation chambers</span>
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#B38A45]" /> Antiseptic cooling scalp finish</span>
              </div>
            </div>

            <div className="md:col-span-4 aspect-video sm:aspect-square overflow-hidden bg-[#3a302e] border border-white/10">
              <img 
                src="/public/assets/aistudio/WhatsApp_Image_2026-10-31_at_10.14.38__3__9d78629f.jpeg" 
                alt="Miami Clippers Emblem" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Barber Service Menu Grid */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EDE3D5] pb-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C85B35]">
                Service Menu
              </span>
              <h2 className="font-serif text-3xl font-normal text-[#28201E] mt-1">
                Haircuts, Beard Sculpting & Executive Grooming
              </h2>
            </div>
            <p className="text-xs text-[#28201E]/70 font-light max-w-sm">
              All treatments include complimentary warm shampoo, cooling tonic, and precision hairline touch-up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {barberServices.map(srv => (
              <div
                key={srv.id}
                className="bg-[#EDE3D5]/50 border border-[#EDE3D5] p-6 flex flex-col justify-between space-y-5 hover:bg-[#EDE3D5] transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="uppercase tracking-widest text-[10px] font-bold text-[#C85B35]">
                      {srv.category}
                    </span>
                    <span className="tabular-nums flex items-center gap-1 text-[#28201E]/70 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#B38A45]" /> {srv.durationMinutes} min
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-normal text-[#28201E] leading-snug">
                    {srv.title}
                  </h3>

                  <p className="text-xs text-[#28201E]/75 font-light leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EDE3D5] flex items-end justify-between">
                  <div>
                    <span className="text-sm font-bold text-[#7B2635] tabular-nums block font-serif">
                      ${srv.priceUSD.toFixed(2)} USD
                    </span>
                    <span className="text-[11px] text-[#28201E]/60 tabular-nums font-light">
                      {srv.priceLRD.toLocaleString()} LRD
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleWhatsAppEnquiry(srv)}
                      className="p-2.5 bg-white hover:bg-neutral-100 text-[#168a3e] border border-[#EDE3D5] transition-colors"
                      title="Ask on WhatsApp"
                      aria-label="Ask on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                    </button>
                    <button
                      onClick={() => openBookingModal(srv.id, 'barbershop')}
                      className="px-4 py-2 bg-[#7B2635] hover:bg-[#641F2B] text-[#F5F0E8] font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Master Barbers Showcase */}
        <section className="space-y-8">
          <div className="border-b border-[#EDE3D5] pb-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C85B35]">
              Craftsmanship & Expertise
            </span>
            <h2 className="font-serif text-3xl font-normal text-[#28201E] mt-1">
              Master Barbers in Attendance
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {barbers.map(barber => (
              <div 
                key={barber.id} 
                className="p-7 bg-[#EDE3D5]/40 border border-[#EDE3D5] flex flex-col sm:flex-row gap-6 items-start"
              >
                <div className="w-24 h-24 bg-[#EDE3D5] border border-[#EDE3D5] overflow-hidden shrink-0">
                  <img 
                    src={barber.photo || '/public/assets/aistudio/WhatsApp_Image_2026-10-31_at_10.14.38__4__de9e00cf.jpeg'} 
                    alt={barber.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="font-serif text-xl font-normal text-[#28201E]">{barber.name}</h3>
                    <p className="text-xs text-[#C85B35] font-semibold tracking-wider uppercase">{barber.role}</p>
                  </div>
                  <p className="text-xs text-[#28201E]/80 font-light leading-relaxed">{barber.bio}</p>
                  
                  <div className="pt-1 flex flex-wrap gap-2">
                    {barber.specialties.map(spec => (
                      <span key={spec} className="px-2.5 py-1 bg-white border border-[#EDE3D5] text-[10px] text-[#28201E] font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#EDE3D5] text-xs text-[#28201E]/70 font-light flex items-center justify-between">
                    <span>Working Hours: {barber.workingHours}</span>
                    <button
                      onClick={() => openBookingModal(undefined, 'barbershop')}
                      className="text-[#7B2635] hover:underline font-bold text-xs"
                    >
                      Request with {barber.name.split(' ')[0]} →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
