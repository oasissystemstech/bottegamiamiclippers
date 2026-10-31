import React from 'react';
import { 
  ArrowRight, 
  UtensilsCrossed, 
  Wine, 
  Sparkles, 
  Scissors, 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { 
  BusinessSettings, 
  MenuItem, 
  SalonService, 
  EventItem, 
  GalleryItem 
} from '../types';

interface HomePageProps {
  settings: BusinessSettings;
  menuItems: MenuItem[];
  services: SalonService[];
  events: EventItem[];
  gallery: GalleryItem[];
  setCurrentTab: (tab: string) => void;
  openBookingModal: (serviceId?: string, dept?: any) => void;
  addToCart: (item: MenuItem) => void;
  openLightbox: (index: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  menuItems,
  services,
  events,
  gallery,
  setCurrentTab,
  openBookingModal,
  addToCart,
  openLightbox,
}) => {
  const featuredFoods = menuItems.filter(i => i.isFeatured && i.section === 'restaurant').slice(0, 3);
  const featuredDrinks = menuItems.filter(i => i.isFeatured && i.section !== 'restaurant').slice(0, 3);
  const featuredServices = services.filter(s => s.isPopular).slice(0, 4);
  const upcomingEvents = events.filter(e => e.isPublished && !e.isArchived).slice(0, 3);
  const previewGallery = gallery.slice(0, 6);

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 bg-[#F5F0E8] text-[#28201E]">
      
      {/* ================= 1. EDITORIAL HERO SECTION ================= */}
      <section className="relative pt-6 sm:pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="flex items-center gap-2 text-xs font-medium text-[#7B2635] tracking-widest uppercase">
              <span>Oldroad Junction</span>
              <span aria-hidden="true" className="text-[#B38A45]">·</span>
              <span>Monrovia, Liberia</span>
              <span aria-hidden="true" className="text-[#B38A45]">·</span>
              <span className="text-[#6B5E59]">Hospitality House</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#28201E] leading-[1.12] text-balance">
              Good Food. <br className="hidden sm:inline" />
              <span className="italic font-serif text-[#7B2635]">Great Company.</span> <br />
              Beautiful Experiences.
            </h1>

            <p className="text-base sm:text-lg text-[#5A4D48] max-w-xl leading-relaxed font-normal">
              From memorable meals and relaxed evenings to beauty and grooming experiences, discover everything Bottega Restro & Miami Clipper has to offer under one roof.
            </p>

            {/* Purposeful Calls to Action */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setCurrentTab('restaurant-bar')}
                className="px-6 py-3.5 rounded-lg bg-[#7B2635] hover:bg-[#641F2B] active:bg-[#4A131E] text-[#F5F0E8] font-semibold text-xs tracking-wider uppercase transition-all shadow-sm hover:shadow flex items-center gap-2"
              >
                <UtensilsCrossed className="w-4 h-4 text-[#B38A45]" />
                Explore Our Menu
              </button>

              <button
                onClick={() => {
                  const target = document.getElementById('departments-section');
                  target?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3.5 rounded-lg bg-[#EDE3D5] hover:bg-[#E3D6C5] text-[#28201E] font-semibold text-xs tracking-wider uppercase border border-[#D9CEBF] transition-colors"
              >
                Discover Our Experiences
              </button>

              <button
                onClick={() => openBookingModal()}
                className="px-5 py-3.5 rounded-lg bg-transparent hover:bg-[#EDE3D5] text-[#7B2635] font-semibold text-xs tracking-wider uppercase border border-[#7B2635]/40 transition-colors"
              >
                Book an Appointment
              </button>
            </div>

            {/* Quiet Editorial Footnote */}
            <div className="pt-4 border-t border-[#E3D9CC] flex flex-wrap items-center gap-6 text-xs text-[#6B5E59]">
              <div>
                <strong className="text-[#28201E] font-semibold block">Opening Hours</strong>
                <span>8:00 AM – Late Night Daily</span>
              </div>
              <div className="hidden sm:block w-px h-8 bg-[#E3D9CC]" />
              <div>
                <strong className="text-[#28201E] font-semibold block">Four Experiences</strong>
                <span>Restaurant · Lounge · Salon · Barbershop</span>
              </div>
            </div>
          </div>

          {/* Photographic Composition Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-[#EDE3D5] bg-[#EDE3D5]">
              <img 
                src="/public/assets/aistudio/WhatsApp_Image_2026-10-31_at_10.14.37_d40dccc2.jpeg" 
                alt="Bottega Restro & Miami Clipper Lounge Booths" 
                className="w-full h-[420px] sm:h-[480px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#28201E]/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[11px] font-medium tracking-widest uppercase text-[#B38A45]">Flagship Venue</span>
                <p className="font-display text-lg text-white font-medium mt-0.5">Atmospheric dining & evening lounge</p>
                <p className="text-xs text-[#EDE3D5]/80 mt-1">Oldroad Junction, Monrovia</p>
              </div>
            </div>

            {/* Overlapping Secondary Image Accent */}
            <div className="hidden sm:block absolute -bottom-8 -left-8 w-44 h-44 rounded-xl overflow-hidden border-4 border-[#F5F0E8] shadow-lg bg-[#EDE3D5]">
              <img 
                src="/public/assets/aistudio/WhatsApp_Image_2026-10-31_at_10.14.38__1__1599b6f5.jpeg" 
                alt="Miami Clipper Luxury Pedicure Spa Capsule" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ================= 2. OUR EXPERIENCE: ASYMMETRICAL EDITORIAL LAYOUT ================= */}
      <section id="departments-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2635]">
            Our Experiences
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#28201E] leading-tight">
            Four specialized destinations in one welcoming space.
          </h2>
          <p className="text-sm text-[#5A4D48] leading-relaxed">
            Every department at Bottega Restro & Miami Clipper is operated with dedicated staff and pride in craft, welcoming you for dining, relaxation, celebrations, and personal grooming.
          </p>
        </div>

        {/* Chapter 01: Bottega Restaurant (Wide Horizontal Feature) */}
        <div className="bg-[#EDE3D5] rounded-3xl p-6 sm:p-10 border border-[#DDD1C0] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 h-72 sm:h-96 rounded-2xl overflow-hidden bg-[#DDD1C0]">
            <img 
              src="/public/assets/aistudio/WhatsApp_Image_2026-10-31_at_10.14.37__5__a55c9ef0.jpeg" 
              alt="Bottega Restaurant Dining Area and Cuisine" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-5 space-y-5">
            <div className="text-xs font-semibold text-[#7B2635] tracking-wider uppercase">
              01 · The Dining Room
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-normal text-[#28201E]">
              Bottega Restaurant
            </h3>
            <p className="text-sm text-[#5A4D48] leading-relaxed">
              Serving celebrated authentic Liberian delicacies — including authentic Nimba County dishes every Thursday and Saturday — alongside sizzling grilled whole fish, jollof rice, gourmet burgers, thin-crust pizzas, and rich local soups.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => setCurrentTab('restaurant-bar')}
                className="px-5 py-2.5 rounded-lg bg-[#7B2635] text-[#F5F0E8] font-semibold text-xs tracking-wider uppercase hover:bg-[#641F2B] transition-colors"
              >
                View Full Menu
              </button>
              <button
                onClick={() => setCurrentTab('ordering')}
                className="text-xs font-bold text-[#7B2635] hover:underline flex items-center gap-1"
              >
                Order Online <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Chapter 02: Bar Lounge & Outside Terrace (Contrast Rich Dark Feature) */}
        <div className="bg-[#28201E] text-[#EDE3D5] rounded-3xl p-6 sm:p-10 border border-[#3E3432] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-5 order-2 lg:order-1">
            <div className="text-xs font-semibold text-[#B38A45] tracking-wider uppercase">
              02 · Evening Atmosphere
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-normal text-[#F5F0E8]">
              Main Bar Lounge & Outside Terrace
            </h3>
            <p className="text-sm text-[#C8BEB5] leading-relaxed">
              Two distinct settings under one roof. Unwind inside in mood-lit plush VIP booths with fine wines, imported spirits, and handcrafted cocktails, or step out onto the lively open-air terrace for cold beers and live sports screenings.
            </p>
            <div className="text-xs text-[#B38A45] font-medium">
              Separate Main Bar & Outside Bar price lists in original USD & LRD
            </div>
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => setCurrentTab('restaurant-bar')}
                className="px-5 py-2.5 rounded-lg bg-[#B38A45] text-[#28201E] font-bold text-xs tracking-wider uppercase hover:bg-[#C59B27] transition-colors"
              >
                Explore Bar Selections
              </button>
              <button
                onClick={() => setCurrentTab('events')}
                className="text-xs font-medium text-[#EDE3D5] hover:text-[#B38A45] flex items-center gap-1"
              >
                Nightlife Calendar <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="lg:col-span-7 h-72 sm:h-96 rounded-2xl overflow-hidden bg-[#1B1514] order-1 lg:order-2">
            <img 
              src="/public/assets/aistudio/WhatsApp_Image_2026-10-31_at_10.14.37__2__16dbc009.jpeg" 
              alt="Bottega Outdoor Bar Terrace at Oldroad Junction" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Chapters 03 & 04: Salon & Barbershop (Two Paired Complementary Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Chapter 03: Miami Clipper Salon & Spa */}
          <div className="bg-[#EDE3D5] rounded-3xl p-6 sm:p-8 border border-[#DDD1C0] flex flex-col justify-between space-y-6">
            <div className="h-64 rounded-2xl overflow-hidden bg-[#DDD1C0]">
              <img 
                src="/public/assets/aistudio/WhatsApp_Image_2026-10-31_at_10.14.38__1__1599b6f5.jpeg" 
                alt="Miami Clipper Luxury Spa Capsule and Pedicure Station" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-3 flex-1">
              <div className="text-xs font-semibold text-[#7B2635] tracking-wider uppercase">
                03 · Wellness & Beauty
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-normal text-[#28201E]">
                Miami Clipper Beauty Salon & Massage
              </h3>
              <p className="text-sm text-[#5A4D48] leading-relaxed">
                A serene space dedicated to restorative self-care. Featuring Swedish and deep-tissue therapeutic massage, our automated luxury pedicure capsule with back massage, hydrotherapy foot spas, and professional women’s hair styling.
              </p>
            </div>
            <div className="pt-4 border-t border-[#DDD1C0] flex items-center justify-between">
              <button
                onClick={() => setCurrentTab('salon-massage')}
                className="text-xs font-bold text-[#7B2635] hover:underline"
              >
                View Services & Staff →
              </button>
              <button
                onClick={() => openBookingModal(undefined, 'massage')}
                className="px-4 py-2 rounded-lg bg-[#7B2635] text-[#F5F0E8] font-semibold text-xs tracking-wider uppercase hover:bg-[#641F2B] transition-colors"
              >
                Book Appointment
              </button>
            </div>
          </div>

          {/* Chapter 04: Miami Barbershop */}
          <div className="bg-[#EDE3D5] rounded-3xl p-6 sm:p-8 border border-[#DDD1C0] flex flex-col justify-between space-y-6">
            <div className="h-64 rounded-2xl overflow-hidden bg-[#DDD1C0]">
              <img 
                src="/public/assets/aistudio/WhatsApp_Image_2026-10-31_at_10.14.38__2__ba5554bd.jpeg" 
                alt="Miami Clipper Barbershop Stations and Grooming Chairs" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-3 flex-1">
              <div className="text-xs font-semibold text-[#7B2635] tracking-wider uppercase">
                04 · Gentleman’s Grooming
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-normal text-[#28201E]">
                Miami Barbershop
              </h3>
              <p className="text-sm text-[#5A4D48] leading-relaxed">
                Precision haircutting and grooming by master barbers. Flawless skin fades, beard trimming, razor contouring, hot essential oil towels, and medical-grade UV sterilization on all tools for your peace of mind.
              </p>
            </div>
            <div className="pt-4 border-t border-[#DDD1C0] flex items-center justify-between">
              <button
                onClick={() => setCurrentTab('barbershop')}
                className="text-xs font-bold text-[#7B2635] hover:underline"
              >
                View Haircuts & Rates →
              </button>
              <button
                onClick={() => openBookingModal(undefined, 'barbershop')}
                className="px-4 py-2 rounded-lg bg-[#28201E] text-[#EDE3D5] font-semibold text-xs tracking-wider uppercase hover:bg-[#1B1514] transition-colors"
              >
                Book Barber Slot
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* ================= 3. FOOD AND DRINKS FEATURE ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E3D9CC] pb-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2635]">
              Culinary Selections
            </span>
            <h2 className="font-display text-3xl font-normal text-[#28201E]">
              Fresh Flavors, Honest Ingredients
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab('restaurant-bar')}
            className="text-xs font-semibold text-[#7B2635] hover:text-[#641F2B] flex items-center gap-1.5 uppercase tracking-wider"
          >
            Browse Full Dining & Bar Catalog <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Featured Food Items (Editorial Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredFoods.map((item) => (
            <div 
              key={item.id}
              className="bg-[#EDE3D5] rounded-2xl overflow-hidden border border-[#DDD1C0] flex flex-col justify-between group transition-all"
            >
              <div className="h-52 overflow-hidden relative bg-[#D5C7B5]">
                <img 
                  src={item.image || '/public/assets/aistudio/WhatsApp_Image_2026-10-31_at_10.14.37__5__a55c9ef0.jpeg'} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs text-[#7B2635] font-semibold uppercase tracking-wider">{item.category}</span>
                    <span className="text-sm font-bold text-[#28201E] tabular-nums">
                      {item.currency === 'USD' ? `$${item.price.toFixed(2)} USD` : `${item.price.toLocaleString()} LRD`}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#28201E] mt-1">{item.name}</h3>
                  <p className="text-xs text-[#5A4D48] mt-2 leading-relaxed">{item.description}</p>
                </div>
                <div className="pt-4 border-t border-[#DDD1C0] flex items-center justify-between">
                  <span className="text-[11px] text-[#6B5E59]">Kitchen Prepared</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#7B2635] hover:bg-[#641F2B] text-[#F5F0E8] font-semibold text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#B38A45]" /> Add to Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Drink Offerings Horizontal Plaque */}
        <div className="bg-[#EDE3D5] rounded-2xl p-6 border border-[#DDD1C0] grid grid-cols-1 sm:grid-cols-3 gap-4">
          {featuredDrinks.map((drink) => (
            <div key={drink.id} className="flex items-center gap-3.5 p-3 rounded-xl bg-[#F5F0E8] border border-[#DDD1C0]">
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-[#DDD1C0]">
                <img 
                  src={drink.image || '/public/assets/aistudio/WhatsApp_Image_2026-10-31_at_10.14.37__6__2f1053fa.jpeg'} 
                  alt={drink.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-[#28201E] truncate">{drink.name}</h4>
                <p className="text-[11px] text-[#7B2635] font-semibold tabular-nums mt-0.5">
                  {drink.currency === 'USD' ? `$${drink.price.toFixed(2)} USD` : `${drink.price.toLocaleString()} LRD`}
                </p>
              </div>
              <button
                onClick={() => addToCart(drink)}
                className="p-1.5 rounded-md bg-[#EDE3D5] hover:bg-[#7B2635] hover:text-white text-xs font-bold text-[#28201E] border border-[#D9CEBF] transition-colors"
                title="Add drink to order"
              >
                +
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 4. BEAUTY & GROOMING FEATURE ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E3D9CC] pb-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2635]">
              Wellness & Self-Care
            </span>
            <h2 className="font-display text-3xl font-normal text-[#28201E]">
              Restorative Body Treatments & Master Cuts
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab('salon-massage')}
            className="text-xs font-semibold text-[#7B2635] hover:text-[#641F2B] flex items-center gap-1.5 uppercase tracking-wider"
          >
            All Salon & Spa Services <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((srv) => (
            <div 
              key={srv.id}
              className="p-6 rounded-2xl bg-[#EDE3D5] border border-[#DDD1C0] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-[#6B5E59]">
                  <span className="capitalize">{srv.department.replace('_', ' ')}</span>
                  <span className="tabular-nums font-medium">{srv.durationMinutes} min</span>
                </div>
                <h3 className="font-display text-base font-bold text-[#28201E] leading-snug">{srv.title}</h3>
                <p className="text-xs text-[#5A4D48] line-clamp-3 leading-relaxed">{srv.description}</p>
              </div>

              <div className="pt-4 border-t border-[#DDD1C0] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#28201E] tabular-nums block">
                    ${srv.priceUSD} USD
                  </span>
                  <span className="text-[11px] text-[#6B5E59] tabular-nums">
                    {srv.priceLRD.toLocaleString()} LRD
                  </span>
                </div>
                <button
                  onClick={() => openBookingModal(srv.id, srv.department)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#7B2635] hover:bg-[#641F2B] text-[#F5F0E8] text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 5. UPCOMING EVENTS & ENTERTAINMENT ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E3D9CC] pb-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2635]">
              Lounge & Nightlife
            </span>
            <h2 className="font-display text-3xl font-normal text-[#28201E]">
              Upcoming Evenings & Gatherings
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab('events')}
            className="text-xs font-semibold text-[#7B2635] hover:text-[#641F2B] flex items-center gap-1.5 uppercase tracking-wider"
          >
            All Events & Promotions <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {upcomingEvents.map((evt) => (
            <div 
              key={evt.id}
              className="rounded-2xl bg-[#EDE3D5] border border-[#DDD1C0] overflow-hidden flex flex-col justify-between group"
            >
              <div className="h-52 overflow-hidden relative bg-[#D5C7B5]">
                <img 
                  src={evt.image} 
                  alt={evt.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded bg-[#28201E]/90 text-[11px] font-semibold text-[#EDE3D5] tracking-wider uppercase">
                  {evt.tag}
                </div>
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#7B2635] font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{evt.date} · {evt.startTime}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#28201E] mt-2">{evt.title}</h3>
                  <p className="text-xs text-[#5A4D48] mt-2 line-clamp-3 leading-relaxed">{evt.description}</p>
                </div>

                <div className="pt-4 border-t border-[#DDD1C0] flex items-center justify-between text-xs">
                  <span className="text-[#6B5E59] font-medium truncate max-w-[150px]">{evt.ticketInfo}</span>
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello Bottega, I would like to reserve a table/booth for: ${evt.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7B2635] hover:underline font-semibold flex items-center gap-1"
                  >
                    Reserve on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 6. PHOTO GALLERY PREVIEW ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E3D9CC] pb-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2635]">
              Photo Essay
            </span>
            <h2 className="font-display text-3xl font-normal text-[#28201E]">
              Moments & Spaces at Oldroad Junction
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab('gallery')}
            className="text-xs font-semibold text-[#7B2635] hover:text-[#641F2B] flex items-center gap-1.5 uppercase tracking-wider"
          >
            Explore Complete Gallery ({gallery.length} Photos) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Varied Dimension Gallery Mosaic */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {previewGallery.map((item, idx) => (
            <div 
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group relative h-48 rounded-xl overflow-hidden cursor-pointer border border-[#DDD1C0] bg-[#DDD1C0]"
            >
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#28201E]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-xs font-medium text-white truncate">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 7. GUEST IMPRESSIONS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2635]">
            Guest Reflections
          </span>
          <h2 className="font-display text-3xl font-normal text-[#28201E]">
            Patron Experiences
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-[#EDE3D5] border border-[#DDD1C0] space-y-4">
            <div className="flex text-[#B38A45] gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-sm text-[#4A3F3B] leading-relaxed italic font-serif">
              "The Thursday Nimba cuisine at Bottega is simply unmatched in Monrovia. The tenderness of the smoked meat and authentic country seasoning took me straight home. Outstanding service!"
            </p>
            <div className="pt-3 border-t border-[#DDD1C0]">
              <h4 className="text-xs font-bold text-[#28201E]">Kofi Barclay</h4>
              <p className="text-[11px] text-[#6B5E59]">Monrovia Business Consultant</p>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-[#EDE3D5] border border-[#DDD1C0] space-y-4">
            <div className="flex text-[#B38A45] gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-sm text-[#4A3F3B] leading-relaxed italic font-serif">
              "Miami Clipper’s luxury pedicure spa pod is state-of-the-art. While getting the automated massage and hydrotherapy foot bath, I could order a fresh cocktail from Bottega bar right next door."
            </p>
            <div className="pt-3 border-t border-[#DDD1C0]">
              <h4 className="text-xs font-bold text-[#28201E]">Fatima Shannon</h4>
              <p className="text-[11px] text-[#6B5E59]">Executive Patron</p>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-[#EDE3D5] border border-[#DDD1C0] space-y-4">
            <div className="flex text-[#B38A45] gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-sm text-[#4A3F3B] leading-relaxed italic font-serif">
              "Best barbers in Oldroad hands down. Prince gave me a clean razor skin fade with a hot steamed towel that stayed sharp for two weeks. Clean, UV-sterilized clippers and great energy."
            </p>
            <div className="pt-3 border-t border-[#DDD1C0]">
              <h4 className="text-xs font-bold text-[#28201E]">Emmanuel Sirleaf</h4>
              <p className="text-[11px] text-[#6B5E59]">Regular Barbershop Client</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 8. SOCIAL MEDIA COMMUNITY ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#EDE3D5] border border-[#DDD1C0] p-8 sm:p-14 text-center space-y-6">
          <div className="max-w-xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2635]">
              Connect With Us
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-normal text-[#28201E]">
              Follow the Lifestyle & Energy
            </h2>
            <p className="text-sm text-[#5A4D48] leading-relaxed">
              Watch live grill preparations, matchday atmosphere, barber fade transformations, and guest highlights on our official channels.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={settings.socialLinks.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg bg-[#F5F0E8] hover:bg-white border border-[#DDD1C0] text-xs font-semibold text-[#28201E] transition-all flex items-center gap-2"
            >
              Follow on TikTok <ExternalLink className="w-3.5 h-3.5 text-[#7B2635]" />
            </a>
            <a
              href={settings.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg bg-[#F5F0E8] hover:bg-white border border-[#DDD1C0] text-xs font-semibold text-[#28201E] transition-all flex items-center gap-2"
            >
              Follow on Instagram <ExternalLink className="w-3.5 h-3.5 text-[#7B2635]" />
            </a>
            <a
              href={settings.socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg bg-[#F5F0E8] hover:bg-white border border-[#DDD1C0] text-xs font-semibold text-[#28201E] transition-all flex items-center gap-2"
            >
              Like on Facebook <ExternalLink className="w-3.5 h-3.5 text-[#7B2635]" />
            </a>
          </div>
        </div>
      </section>

      {/* ================= 9. LOCATION & HOURS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 rounded-3xl bg-[#EDE3D5] border border-[#DDD1C0]">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2635]">
              Visit Us in Monrovia
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-normal text-[#28201E]">
              Oldroad Junction, Monrovia, Liberia
            </h3>
            <p className="text-sm text-[#5A4D48] leading-relaxed">
              Conveniently located at the bustling Oldroad Junction with secure parking, guarded premises, and vibrant indoor and terrace seating.
            </p>
            <div className="space-y-2 text-xs text-[#4A3F3B] pt-2 font-medium">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#7B2635]" /> {settings.address}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#7B2635]" /> Daily Service from 8:00 AM until Late Night
              </p>
            </div>
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setCurrentTab('contact')}
                className="px-5 py-2.5 rounded-lg bg-[#7B2635] text-[#F5F0E8] font-semibold text-xs tracking-wider uppercase hover:bg-[#641F2B] transition-colors"
              >
                Directions & Contact Desk
              </button>
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Bottega, I would like directions to your location at Oldroad Junction.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg bg-[#F5F0E8] border border-[#DDD1C0] text-[#28201E] text-xs font-semibold hover:border-[#7B2635] transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 text-[#7B2635]" /> Ask on WhatsApp
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-[#DDD1C0] bg-[#DDD1C0]">
            <img 
              src="/public/assets/aistudio/WhatsApp_Image_2026-10-31_at_10.14.37__4__af5f9ded.jpeg" 
              alt="Bottega Restro Oldroad Junction Street View" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#28201E]/80 via-transparent to-transparent flex items-end p-5">
              <span className="text-xs font-medium text-white">Oldroad Junction Landmark Entrance</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
