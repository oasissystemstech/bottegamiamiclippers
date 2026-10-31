import React from 'react';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  MessageCircle, 
  Heart, 
  ShieldCheck, 
  Star 
} from 'lucide-react';
import { SalonService, StaffProfile, BusinessSettings } from '../types';

interface BeautySalonPageProps {
  services: SalonService[];
  staff: StaffProfile[];
  openBookingModal: (serviceId?: string, dept?: any) => void;
  settings: BusinessSettings;
}

export const BeautySalonPage: React.FC<BeautySalonPageProps> = ({
  services,
  staff,
  openBookingModal,
  settings,
}) => {
  const salonServices = services.filter(s => s.department === 'beauty_salon' || s.department === 'massage');
  const salonStaff = staff.filter(st => st.department === 'beauty_salon' || st.department === 'massage');

  const categories = ['All Services', 'Therapeutic Massage', 'Nails & Spa Pod', 'Hair Care & Washing', 'Hair Styling', 'Skin & Facial'];
  const [activeCategory, setActiveCategory] = React.useState('All Services');

  const filtered = activeCategory === 'All Services'
    ? salonServices
    : salonServices.filter(s => s.category === activeCategory);

  const handleWhatsAppEnquiry = (service: SalonService) => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const message = `Hello Miami Clipper & Spa! I would like to enquire about: "${service.title}" ($${service.priceUSD} USD / ${service.priceLRD.toLocaleString()} LRD). When is the next available appointment?`;
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 bg-[#F5F0E8] text-[#28201E]">
      
      {/* Editorial Sanctuary Showcase */}
      <div className="relative rounded-3xl bg-[#EDE3D5] border border-[#DDD1C0] p-8 sm:p-12 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2635]">
              Miami Clipper Salon & Spa
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#28201E] leading-tight">
              Calm, Care <span className="italic font-serif text-[#7B2635]">&</span> Restorative Wellness
            </h1>
            <p className="text-sm text-[#5A4D48] leading-relaxed">
              Step into Monrovia’s tranquil sanctuary at Oldroad Junction. Indulge in certified therapeutic Swedish massage, relax inside our high-tech massage pedicure pod capsule, or revitalize your hair with deep steaming and custom styling.
            </p>
            
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                onClick={() => openBookingModal(undefined, 'massage')}
                className="px-6 py-3 rounded-lg bg-[#7B2635] hover:bg-[#641F2B] text-[#F5F0E8] font-semibold text-xs tracking-wider uppercase transition-colors shadow-sm flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#B38A45]" /> Request Appointment
              </button>
              
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Miami Clipper Salon, I would like to enquire about booking a massage or salon treatment today.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-lg bg-[#F5F0E8] border border-[#DDD1C0] text-[#28201E] text-xs font-semibold hover:border-[#7B2635] transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#7B2635]" /> Enquire on WhatsApp
              </a>
            </div>

            <div className="pt-4 border-t border-[#DDD1C0] grid grid-cols-3 gap-4 text-xs text-[#5A4D48]">
              <div>
                <strong className="text-[#28201E] block font-semibold">Private Suites</strong>
                <span className="text-[11px] text-[#6B5E59]">Calm & unhurried</span>
              </div>
              <div>
                <strong className="text-[#28201E] block font-semibold">Spa Pod Capsule</strong>
                <span className="text-[11px] text-[#6B5E59]">Hydro back massage</span>
              </div>
              <div>
                <strong className="text-[#28201E] block font-semibold">Certified Therapists</strong>
                <span className="text-[11px] text-[#6B5E59]">Years of practice</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            <div className="h-64 sm:h-72 rounded-2xl overflow-hidden border border-[#DDD1C0] bg-[#D5C7B5]">
              <img 
                src="/public/assets/aistudio/WhatsApp_Image_2026-10-31_at_10.14.38__1__1599b6f5.jpeg" 
                alt="Luxury Spa Pedicure Massage Capsule & Wash Beds" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-64 sm:h-72 rounded-2xl overflow-hidden border border-[#DDD1C0] bg-[#D5C7B5] mt-4 sm:mt-6">
              <img 
                src="/public/assets/aistudio/WhatsApp_Image_2026-10-31_at_10.14.38__2__ba5554bd.jpeg" 
                alt="Miami Clipper Vanity Mirrors and Styling Stations" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Plaque: Pedicure Spa Pod */}
      <section className="p-8 sm:p-10 rounded-3xl bg-[#EDE3D5] border border-[#DDD1C0] grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-8 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2635]">
            Signature Treatment Feature
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-normal text-[#28201E]">
            Futuristic Luxury Pedicure Spa Pod Capsule
          </h2>
          <p className="text-sm text-[#5A4D48] leading-relaxed">
            Experience our specialized ergonomic pod capsule featuring motorized shiatsu back-rolling massage, warm hydrotherapy foot whirlpool with sanitizing circulation, dead sea salt exfoliation, and precision nail care while you relax with herbal tea or order a refreshing drink from Bottega.
          </p>
          <div className="flex items-center gap-4 pt-3">
            <span className="text-sm font-bold text-[#7B2635] tabular-nums">$25.00 USD / 4,900 LRD</span>
            <button
              onClick={() => openBookingModal('srv-3', 'beauty_salon')}
              className="px-5 py-2.5 rounded-lg bg-[#7B2635] text-[#F5F0E8] font-semibold text-xs tracking-wider uppercase hover:bg-[#641F2B] transition-colors"
            >
              Book Spa Pod
            </button>
          </div>
        </div>
        <div className="md:col-span-4 h-52 rounded-2xl overflow-hidden border border-[#DDD1C0] bg-[#D5C7B5]">
          <img 
            src="/public/assets/aistudio/WhatsApp_Image_2026-10-31_at_10.14.38__1__1599b6f5.jpeg" 
            alt="Spa Pod Capsule" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Service Catalog */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E3D9CC] pb-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2635]">
              Treatment Menu
            </span>
            <h2 className="font-display text-3xl font-normal text-[#28201E]">
              Massage, Spa & Hair Therapies
            </h2>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#7B2635] text-[#F5F0E8] font-semibold'
                    : 'bg-[#EDE3D5] text-[#5A4D48] hover:text-[#28201E]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(srv => (
            <div
              key={srv.id}
              className="rounded-2xl bg-[#EDE3D5] border border-[#DDD1C0] p-6 flex flex-col justify-between space-y-4 hover:border-[#7B2635] transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-[#6B5E59]">
                  <span className="uppercase tracking-wider font-semibold text-[10px] text-[#7B2635]">
                    {srv.category}
                  </span>
                  <span className="tabular-nums flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#7B2635]" /> {srv.durationMinutes} min
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-[#28201E]">
                  {srv.title}
                </h3>

                <p className="text-xs text-[#5A4D48] leading-relaxed">
                  {srv.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#DDD1C0] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#28201E] tabular-nums block">
                    ${srv.priceUSD.toFixed(2)} USD
                  </span>
                  <span className="text-[11px] text-[#6B5E59] tabular-nums">
                    {srv.priceLRD.toLocaleString()} LRD
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleWhatsAppEnquiry(srv)}
                    className="p-2 rounded-md bg-[#F5F0E8] hover:bg-white text-emerald-800 border border-[#DDD1C0] transition-colors"
                    title="Ask on WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current text-emerald-600" />
                  </button>
                  <button
                    onClick={() => openBookingModal(srv.id, srv.department)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#7B2635] hover:bg-[#641F2B] text-[#F5F0E8] font-semibold text-xs tracking-wider uppercase transition-colors"
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Staff & Specialists */}
      <section className="space-y-8">
        <div className="border-b border-[#E3D9CC] pb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2635]">
            Our Practitioners
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-normal text-[#28201E] mt-1">
            Meet the Therapists & Stylists
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {salonStaff.map(st => (
            <div key={st.id} className="p-6 sm:p-8 rounded-2xl bg-[#EDE3D5] border border-[#DDD1C0] flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-20 h-20 rounded-xl bg-[#D5C7B5] border border-[#DDD1C0] overflow-hidden shrink-0">
                <img 
                  src={st.photo || '/public/assets/aistudio/WhatsApp_Image_2026-10-31_at_10.14.38__1__1599b6f5.jpeg'} 
                  alt={st.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2 flex-1">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#28201E]">{st.name}</h3>
                  <p className="text-xs text-[#7B2635] font-semibold">{st.role}</p>
                </div>
                <p className="text-xs text-[#5A4D48] leading-relaxed">{st.bio}</p>
                
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {st.specialties.map(spec => (
                    <span key={spec} className="px-2.5 py-0.5 rounded bg-[#F5F0E8] text-[11px] text-[#4A3F3B] border border-[#DDD1C0]">
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="pt-3 text-[11px] text-[#6B5E59] flex items-center justify-between border-t border-[#DDD1C0]/60">
                  <span>Hours: {st.workingHours}</span>
                  <button
                    onClick={() => openBookingModal(undefined, st.department)}
                    className="text-[#7B2635] hover:underline font-bold"
                  >
                    Request with {st.name.split(' ')[0]} →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
