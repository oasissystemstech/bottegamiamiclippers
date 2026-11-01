import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  MessageCircle, 
  Scissors, 
  ShieldCheck, 
  Heart, 
  CheckCircle,
  Star,
  UserCheck,
  ChevronRight
} from 'lucide-react';
import { SalonService, StaffProfile, BusinessSettings, ServiceDepartment } from '../types';
import { AppImage } from '../components/AppImage';

interface SalonMasseusePageProps {
  services: SalonService[];
  staff: StaffProfile[];
  openBookingModal: (serviceId?: string, dept?: ServiceDepartment) => void;
  settings: BusinessSettings;
  initialDepartment?: 'all' | 'beauty_salon' | 'massage' | 'barbershop';
}

export const SalonMasseusePage: React.FC<SalonMasseusePageProps> = ({
  services,
  staff,
  openBookingModal,
  settings,
  initialDepartment = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'beauty_salon' | 'massage' | 'barbershop'>(initialDepartment);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter services by active tab
  const tabServices = services.filter(s => {
    if (activeTab === 'all') return true;
    return s.department === activeTab;
  });

  // Unique categories for current tab
  const availableCategories = ['all', ...Array.from(new Set(tabServices.map(s => s.category)))];

  // Final filtered list
  const displayedServices = selectedCategory === 'all'
    ? tabServices
    : tabServices.filter(s => s.category === selectedCategory);

  // Filter staff by department
  const tabStaff = staff.filter(st => {
    if (activeTab === 'all') return true;
    return st.department === activeTab;
  });

  const handleWhatsAppEnquiry = (service: SalonService) => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const message = `Hello Miami Clipper & Spa! I would like to enquire about: "${service.title}" ($${service.priceUSD} USD / ${service.priceLRD.toLocaleString()} LRD). What appointment slots are open?`;
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16 bg-[#F5F0E8] dark:bg-[#161110] text-[#28201E] dark:text-[#EDE3D5] transition-colors">
      
      {/* Editorial Sanctuary Header Banner */}
      <div className="relative rounded-3xl bg-[#EDE3D5] dark:bg-[#201918] border border-[#DDD1C0] dark:border-[#332624] p-6 sm:p-12 overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2">
              <span className="w-8 h-[2px] bg-[#7B2635]"></span>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2635] dark:text-[#E07A8B]">
                Miami Clipper Beauty Salon, Massage & Barbershop
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#28201E] dark:text-[#EDE3D5] leading-tight">
              Grooming, Beauty <span className="italic font-serif text-[#7B2635] dark:text-[#E07A8B]">&</span> Therapeutic Renewal
            </h1>

            <p className="text-sm sm:text-base text-[#5A4D48] dark:text-[#A89D96] leading-relaxed max-w-2xl">
              Monrovia’s premier holistic personal care destination at Oldroad Junction. Unwind with restorative Swedish and deep tissue body massage, indulge in high-tech hydrotherapy pedicure pod treatments, and enjoy precision razor fading and beard artistry in our UV-sterilized gentlemen's parlour.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                onClick={() => openBookingModal(undefined, activeTab === 'all' ? 'massage' : activeTab)}
                className="px-6 py-3.5 rounded-lg bg-[#7B2635] hover:bg-[#641F2B] text-[#F5F0E8] font-semibold text-xs tracking-wider uppercase transition-colors shadow-sm flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#B38A45]" /> Request Appointment
              </button>
              
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Miami Clipper & Spa, I would like to enquire about booking a massage, hair styling, or barbershop session today.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-lg bg-[#F5F0E8] dark:bg-[#1A1413] border border-[#DDD1C0] dark:border-[#3E302E] text-[#28201E] dark:text-[#EDE3D5] text-xs font-semibold hover:border-[#7B2635] transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#7B2635] dark:text-[#E07A8B]" /> Inquire on WhatsApp
              </a>
            </div>

            {/* Quality Standard Badges */}
            <div className="pt-4 border-t border-[#DDD1C0] dark:border-[#332624] grid grid-cols-3 gap-3 text-xs text-[#5A4D48] dark:text-[#A89D96]">
              <div>
                <strong className="text-[#28201E] dark:text-[#EDE3D5] block font-semibold">Spa Pod Capsule</strong>
                <span className="text-[11px] text-[#6B5E59] dark:text-[#7A6E6A]">Motorized back rolling & whirlpool</span>
              </div>
              <div>
                <strong className="text-[#28201E] dark:text-[#EDE3D5] block font-semibold">UV Sterilization</strong>
                <span className="text-[11px] text-[#6B5E59] dark:text-[#7A6E6A]">Clinical tool hygiene for every cut</span>
              </div>
              <div>
                <strong className="text-[#28201E] dark:text-[#EDE3D5] block font-semibold">Dual Currency</strong>
                <span className="text-[11px] text-[#6B5E59] dark:text-[#7A6E6A]">Clear USD & LRD pricing</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            <div className="h-56 sm:h-64 rounded-2xl overflow-hidden border border-[#DDD1C0] dark:border-[#332624] bg-[#D5C7B5] dark:bg-[#1A1413] shadow-xs">
              <AppImage 
                src={settings.sectionImages?.['salon.pedicure_pod'] || "/images/salon/pedicure-pod-capsule.jpeg"} 
                alt="Miami Clipper Luxury Spa Pedicure Pod Capsule" 
                departmentIcon="salon"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-56 sm:h-64 rounded-2xl overflow-hidden border border-[#DDD1C0] dark:border-[#332624] bg-[#D5C7B5] dark:bg-[#1A1413] shadow-xs mt-4">
              <AppImage 
                src={settings.sectionImages?.['barbershop.stations'] || "/images/barbershop/barber-stations-uv.jpeg"} 
                alt="Miami Barbershop UV Sterilization Stations" 
                departmentIcon="barbershop"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Primary Department Selector Tabs */}
      <div className="space-y-4">
        <div className="border-b border-[#E3D9CC]">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-px">
            <button
              onClick={() => { setActiveTab('all'); setSelectedCategory('all'); }}
              className={`pb-3.5 px-3 text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-colors relative ${
                activeTab === 'all'
                  ? 'text-[#7B2635]'
                  : 'text-[#6B5E59] hover:text-[#28201E]'
              }`}
            >
              All Services ({services.length})
              {activeTab === 'all' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#7B2635] rounded-t-full" />
              )}
            </button>

            <button
              onClick={() => { setActiveTab('beauty_salon'); setSelectedCategory('all'); }}
              className={`pb-3.5 px-3 text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-colors relative flex items-center gap-2 ${
                activeTab === 'beauty_salon'
                  ? 'text-[#7B2635]'
                  : 'text-[#6B5E59] hover:text-[#28201E]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#B38A45]" />
              Beauty Salon
              {activeTab === 'beauty_salon' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#7B2635] rounded-t-full" />
              )}
            </button>

            <button
              onClick={() => { setActiveTab('massage'); setSelectedCategory('all'); }}
              className={`pb-3.5 px-3 text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-colors relative flex items-center gap-2 ${
                activeTab === 'massage'
                  ? 'text-[#7B2635]'
                  : 'text-[#6B5E59] hover:text-[#28201E]'
              }`}
            >
              <Heart className="w-4 h-4 text-[#7B2635]" />
              Massage & Spa
              {activeTab === 'massage' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#7B2635] rounded-t-full" />
              )}
            </button>

            <button
              onClick={() => { setActiveTab('barbershop'); setSelectedCategory('all'); }}
              className={`pb-3.5 px-3 text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-colors relative flex items-center gap-2 ${
                activeTab === 'barbershop'
                  ? 'text-[#7B2635]'
                  : 'text-[#6B5E59] hover:text-[#28201E]'
              }`}
            >
              <Scissors className="w-4 h-4 text-[#B38A45]" />
              Miami Barbershop
              {activeTab === 'barbershop' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#7B2635] rounded-t-full" />
              )}
            </button>
          </div>
        </div>

        {/* Category Pills (Dynamic according to selected department) */}
        {availableCategories.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {availableCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#7B2635] text-[#F5F0E8] font-semibold shadow-xs'
                    : 'bg-[#EDE3D5] text-[#4A3F3B] border border-[#DDD1C0] hover:text-[#28201E] hover:bg-[#E3D6C5]'
                }`}
              >
                {cat === 'all' ? 'All Treatment Types' : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Services Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#28201E]">
            {activeTab === 'all' && 'Complete Menu of Services'}
            {activeTab === 'beauty_salon' && 'Beauty Salon & Hair Care Treatments'}
            {activeTab === 'massage' && 'Massage & Restorative Spa Therapies'}
            {activeTab === 'barbershop' && 'Miami Barbershop Men’s Grooming'}
          </h2>
          <span className="text-xs text-[#6B5E59]">
            {displayedServices.length} {displayedServices.length === 1 ? 'service' : 'services'} available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedServices.map((service) => (
            <div
              key={service.id}
              className="rounded-2xl bg-[#EDE3D5] dark:bg-[#201918] border border-[#DDD1C0] dark:border-[#332624] p-6 flex flex-col justify-between space-y-4 hover:border-[#7B2635] transition-all group shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold text-[#7B2635] dark:text-[#E07A8B] uppercase tracking-wider px-2 py-0.5 rounded bg-[#F5F0E8] dark:bg-[#1A1413] border border-[#DDD1C0] dark:border-[#3E302E]">
                    {service.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-[#6B5E59] dark:text-[#A89D96]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{service.durationMinutes} min</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-base font-bold text-[#28201E] dark:text-[#EDE3D5] group-hover:text-[#7B2635] dark:group-hover:text-[#E07A8B] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-[#5A4D48] dark:text-[#A89D96] leading-relaxed mt-1.5">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#DDD1C0] dark:border-[#332624] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-[#28201E] dark:text-[#EDE3D5] tabular-nums block">
                      ${service.priceUSD.toFixed(2)} USD
                    </span>
                    <span className="text-xs text-[#6B5E59] dark:text-[#A89D96] tabular-nums">
                      {service.priceLRD.toLocaleString()} LRD
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleWhatsAppEnquiry(service)}
                      title="Enquire on WhatsApp"
                      className="p-2 rounded-lg bg-[#F5F0E8] dark:bg-[#1A1413] border border-[#DDD1C0] dark:border-[#3E302E] text-[#7B2635] dark:text-[#E07A8B] hover:bg-[#E5DAC9] dark:hover:bg-[#2A201E] transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openBookingModal(service.id, service.department)}
                      className="px-3.5 py-2 rounded-lg bg-[#7B2635] hover:bg-[#641F2B] text-[#F5F0E8] text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SPECIAL DEPARTMENT SPOTLIGHTS ================= */}
      
      {/* 1. Pedicure Spa Pod Feature */}
      <section className="rounded-3xl bg-[#EDE3D5] border border-[#DDD1C0] p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2635]">
            Featured Wellness Technology
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-normal text-[#28201E]">
            Futuristic Luxury Pedicure Spa Pod Capsule
          </h2>
          <p className="text-sm text-[#5A4D48] leading-relaxed">
            Experience our specialized ergonomic pod capsule featuring motorized shiatsu back-rolling massage, warm hydrotherapy foot whirlpool with sanitizing circulation, dead sea salt exfoliation, and precision nail care while you relax with herbal tea or order a refreshing drink from Bottega.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-[#4A3F3B]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#7B2635]" /> Ozone Hydro Circulation
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#7B2635]" /> Motorized Shiatsu Roller
            </span>
            <span className="font-bold text-[#7B2635]">$25.00 USD / 4,900 LRD</span>
          </div>
          <div className="pt-2">
            <button
              onClick={() => openBookingModal('srv-3', 'beauty_salon')}
              className="px-5 py-2.5 rounded-lg bg-[#7B2635] hover:bg-[#641F2B] text-[#F5F0E8] font-semibold text-xs tracking-wider uppercase transition-colors"
            >
              Book Spa Pod Session
            </button>
          </div>
        </div>
        <div className="md:col-span-5 h-64 rounded-2xl overflow-hidden border border-[#DDD1C0] bg-[#D5C7B5]">
          <AppImage 
            src="/images/salon/pedicure-pod-capsule.jpeg" 
            alt="Futuristic Pedicure Spa Pod Capsule" 
            departmentIcon="salon"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 2. Miami Barbershop UV Sterilization Feature */}
      <section className="rounded-3xl bg-[#EDE3D5] border border-[#DDD1C0] p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-5 h-64 rounded-2xl overflow-hidden border border-[#DDD1C0] bg-[#D5C7B5] order-2 md:order-1">
          <AppImage 
            src="/images/barbershop/barber-stations-uv.jpeg" 
            alt="Miami Barbershop UV Sterilizer System" 
            departmentIcon="barbershop"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:col-span-7 space-y-3 order-1 md:order-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2635]">
            Master Barber Hygiene Protocol
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-normal text-[#28201E]">
            Clinical UV Sterilization & Japanese Steel Razors
          </h2>
          <p className="text-sm text-[#5A4D48] leading-relaxed">
            Every clipper blade, guard, and comb passes through our high-intensity ultraviolet sterilization chambers between clients. We use brand new single-use Japanese razor blades for each hot towel shave and razor edge finish, ensuring unrivaled safety and peace of mind.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-[#4A3F3B]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#7B2635]" /> Certified UV-C Sterilization
            </span>
            <span className="flex items-center gap-1.5">
              <Scissors className="w-4 h-4 text-[#7B2635]" /> Disposable Feather Blades
            </span>
          </div>
          <div className="pt-2">
            <button
              onClick={() => openBookingModal(undefined, 'barbershop')}
              className="px-5 py-2.5 rounded-lg bg-[#7B2635] hover:bg-[#641F2B] text-[#F5F0E8] font-semibold text-xs tracking-wider uppercase transition-colors"
            >
              Book Barber Chair
            </button>
          </div>
        </div>
      </section>

      {/* Staff & Specialists Directory */}
      <section className="space-y-8">
        <div className="max-w-xl space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2635]">
            Certified Team
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-normal text-[#28201E]">
            Meet Your Therapists, Stylists & Barbers
          </h2>
          <p className="text-sm text-[#5A4D48]">
            Experienced professionals committed to attentive hospitality, technical mastery, and personalized care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tabStaff.map((person) => (
            <div 
              key={person.id}
              className="rounded-2xl bg-[#EDE3D5] border border-[#DDD1C0] p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#7B2635] bg-[#D5C7B5] shrink-0">
                    <AppImage 
                      src={person.photo} 
                      alt={person.name} 
                      departmentIcon={person.department === 'barbershop' ? 'barbershop' : 'salon'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-[#28201E]">{person.name}</h3>
                    <p className="text-xs text-[#7B2635] font-semibold">{person.role}</p>
                    <span className="text-[11px] text-[#6B5E59] block mt-0.5 capitalize">
                      {person.department.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#5A4D48] leading-relaxed">
                  {person.bio}
                </p>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-[#28201E] uppercase tracking-wider block">
                    Specialties:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {person.specialties.map((spec, i) => (
                      <span 
                        key={i}
                        className="px-2 py-0.5 rounded bg-[#F5F0E8] border border-[#DDD1C0] text-[11px] text-[#4A3F3B]"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#DDD1C0] flex items-center justify-between text-xs">
                <span className="text-[#6B5E59] text-[11px]">
                  {person.workingHours}
                </span>
                <button
                  onClick={() => openBookingModal(undefined, person.department)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#7B2635] text-[#F5F0E8] font-semibold text-xs hover:bg-[#641F2B] transition-colors"
                >
                  Book with {person.name.split(' ')[0]}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Instructions & Assurance */}
      <section className="rounded-3xl bg-[#28201E] text-[#EDE3D5] p-8 sm:p-12 space-y-6">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B38A45]">
            Appointment Guidelines
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-normal text-[#F5F0E8]">
            Walk-ins Welcomed, Reservations Recommended
          </h2>
          <p className="text-sm text-[#A89D96] leading-relaxed">
            While we gladly accommodate walk-in guests whenever chairs or treatment rooms are open, we strongly advise requesting your slot in advance, especially for therapeutic massage, spa pod treatments, and weekend barber services.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="p-4 rounded-xl bg-[#1E1716] border border-[#3E3432] space-y-1.5">
            <h4 className="text-sm font-semibold text-[#F5F0E8]">1. Select Service & Specialist</h4>
            <p className="text-xs text-[#A89D96]">Choose your desired treatment, duration, and preferred therapist or barber.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#1E1716] border border-[#3E3432] space-y-1.5">
            <h4 className="text-sm font-semibold text-[#F5F0E8]">2. Pick Date & Preferred Time</h4>
            <p className="text-xs text-[#A89D96]">Provide your contact details and any special wellness or styling requests.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#1E1716] border border-[#3E3432] space-y-1.5">
            <h4 className="text-sm font-semibold text-[#F5F0E8]">3. Instant Confirmation</h4>
            <p className="text-xs text-[#A89D96]">Receive personal appointment confirmation and directions via WhatsApp.</p>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap items-center gap-4">
          <button
            onClick={() => openBookingModal()}
            className="px-6 py-3.5 rounded-lg bg-[#7B2635] hover:bg-[#641F2B] text-[#F5F0E8] font-semibold text-xs tracking-wider uppercase transition-colors"
          >
            Open Appointment Form
          </button>
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Miami Clipper, I would like to check appointment availability for today.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3.5 rounded-lg bg-transparent border border-[#B38A45]/40 text-[#B38A45] hover:bg-[#B38A45]/10 text-xs font-semibold transition-colors flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" /> Message Desk on WhatsApp
          </a>
        </div>
      </section>

    </div>
  );
};
