import React from 'react';
import { 
  UtensilsCrossed, 
  Wine, 
  Sparkles, 
  Scissors, 
  MapPin, 
  ArrowRight,
  Shield,
  Heart
} from 'lucide-react';
import { BusinessSettings } from '../types';
import { AppImage } from '../components/AppImage';

interface AboutPageProps {
  settings: BusinessSettings;
  setCurrentTab: (tab: string) => void;
  openBookingModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  settings,
  setCurrentTab,
  openBookingModal,
}) => {
  return (
    <div className="bg-[#F5F0E8] text-[#28201E] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Editorial Brand Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-8 h-[1px] bg-[#C85B35]"></span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C85B35]">
                Our Heritage & Vision · Monrovia, Liberia
              </span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#28201E] font-normal tracking-tight leading-[1.1]">
              Monrovia’s Signature <br />
              <span className="italic font-light text-[#7B2635]">Hospitality & Lifestyle Oasis</span>
            </h1>

            <p className="text-sm sm:text-base text-[#28201E]/80 font-light leading-relaxed">
              Located at Oldroad Junction, <strong className="text-[#28201E] font-medium">Bottega Restro & Miami Clipper</strong> is more than a restaurant or a grooming parlour—it is a unified haven where exceptional dining, evening relaxation, and therapeutic body care come together effortlessly.
            </p>

            <p className="text-sm sm:text-base text-[#28201E]/80 font-light leading-relaxed">
              Conceived with genuine Liberian warmth and international hospitality standards, we united four dedicated departments under one roof: authentic culinary dining celebrating regional delicacies like Nimba County feasts, an ambient indoor cocktail lounge and outside garden terrace, a therapeutic spa offering Swedish and deep tissue massages with automated shiatsu pedicure pods, and a gentleman’s master barbershop with certified hospital-grade UV sterilization.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setCurrentTab('restaurant-bar')}
                className="px-6 py-3.5 bg-[#7B2635] text-[#F5F0E8] text-xs font-bold uppercase tracking-wider hover:bg-[#641F2B] transition-colors shadow-xs"
              >
                Explore Dining & Drinks
              </button>
              <button
                onClick={() => setCurrentTab('contact')}
                className="px-5 py-3.5 bg-transparent border border-[#7B2635]/40 text-[#7B2635] text-xs font-bold hover:bg-[#7B2635]/5 transition-colors"
              >
                Find Us on the Map
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-[3/4] overflow-hidden bg-[#EDE3D5] border border-[#EDE3D5] shadow-md">
                <AppImage 
                  src="/images/brand/bottega-logo.jpeg" 
                  alt="Bottega 3D Gold Insignia" 
                  departmentIcon="brand"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square overflow-hidden bg-[#EDE3D5] border border-[#EDE3D5] shadow-xs">
                <AppImage 
                  src="/images/bar/terrace-evening.jpeg" 
                  alt="Outside Terrace Pergola" 
                  departmentIcon="bar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="aspect-square overflow-hidden bg-[#EDE3D5] border border-[#EDE3D5] shadow-xs">
                <AppImage 
                  src="/images/brand/miami-clipper-logo.jpeg" 
                  alt="Miami Clipper Emblem" 
                  departmentIcon="brand"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[3/4] overflow-hidden bg-[#EDE3D5] border border-[#EDE3D5] shadow-md">
                <AppImage 
                  src="/images/barbershop/barbershop-interior.jpeg" 
                  alt="Miami Barbershop Suite" 
                  departmentIcon="barbershop"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Philosophy Pillars */}
        <section className="bg-[#28201E] text-[#F5F0E8] p-8 sm:p-14 border border-[#28201E] space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B38A45]">
              Core Hospitality Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal">
              What Defines Every Moment at Bottega & Miami Clipper
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#332a28] border border-white/10 space-y-4">
              <div className="w-10 h-10 bg-[#7B2635] text-[#F5F0E8] flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-2xl font-normal">Culinary Authenticity</h3>
              <p className="text-xs sm:text-sm text-[#F5F0E8]/75 font-light leading-relaxed">
                We honor true Liberian heritage—sourcing fresh local greens, smoked meats, and palm oils for our revered Nimba County cuisine, paired with stone-baked pizzas and continental grilled steaks.
              </p>
            </div>

            <div className="p-8 bg-[#332a28] border border-white/10 space-y-4">
              <div className="w-10 h-10 bg-[#7B2635] text-[#F5F0E8] flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-2xl font-normal">Uncompromising Hygiene</h3>
              <p className="text-xs sm:text-sm text-[#F5F0E8]/75 font-light leading-relaxed">
                Cleanliness is non-negotiable. Every straight razor blade is single-use, opened fresh. All shears and clipper blades cycle through continuous ultraviolet sterilizer chambers at each station.
              </p>
            </div>

            <div className="p-8 bg-[#332a28] border border-white/10 space-y-4">
              <div className="w-10 h-10 bg-[#7B2635] text-[#F5F0E8] flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-2xl font-normal">Warmth & Connection</h3>
              <p className="text-xs sm:text-sm text-[#F5F0E8]/75 font-light leading-relaxed">
                Whether unwinding on the terrace over cold Club Beer with friends, receiving a therapeutic deep tissue massage, or closing an executive deal in our booth, you are greeted like family.
              </p>
            </div>
          </div>
        </section>

        {/* 4 Departments Breakdown */}
        <section className="space-y-10">
          <div className="border-b border-[#EDE3D5] pb-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C85B35]">
              Unified Excellence
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#28201E] mt-1">
              Four World-Class Experiences Under One Roof
            </h2>
          </div>

          <div className="space-y-8">
            <div className="p-8 bg-[#EDE3D5]/40 border border-[#EDE3D5] flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-80 aspect-[16/10] overflow-hidden shrink-0 bg-[#EDE3D5]">
                <AppImage 
                  src="/images/restaurant/nimba-cuisine-entrance.jpeg" 
                  alt="Bottega Restaurant" 
                  departmentIcon="restaurant"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-3 flex-1">
                <span className="text-[10px] text-[#C85B35] font-bold uppercase tracking-widest">Department 01</span>
                <h3 className="font-serif text-2xl font-normal text-[#28201E]">Bottega Restaurant</h3>
                <p className="text-xs sm:text-sm text-[#28201E]/80 font-light leading-relaxed">
                  Serving wholesome breakfast, midday executive lunches, and vibrant dinners. Savor authentic Nimba County dishes every Thursday and Saturday, grilled sea croaker, spicy pepper soup, and gourmet burgers.
                </p>
                <button 
                  onClick={() => setCurrentTab('restaurant-bar')} 
                  className="text-xs text-[#7B2635] hover:underline font-bold inline-flex items-center gap-1.5 pt-1 uppercase tracking-wider"
                >
                  Explore Restaurant Menu <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-8 bg-[#EDE3D5]/40 border border-[#EDE3D5] flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-80 aspect-[16/10] overflow-hidden shrink-0 bg-[#EDE3D5]">
                <AppImage 
                  src="/images/bar/terrace-pergola-day.jpeg" 
                  alt="Outside Bar Lounge" 
                  departmentIcon="bar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-3 flex-1">
                <span className="text-[10px] text-[#C85B35] font-bold uppercase tracking-widest">Department 02</span>
                <h3 className="font-serif text-2xl font-normal text-[#28201E]">Bottega Bar Lounge & Outside Garden Terrace</h3>
                <p className="text-xs sm:text-sm text-[#28201E]/80 font-light leading-relaxed">
                  Two curated drinking environments: our intimate Main Bar with fine Hennessy, whiskey, and champagne bottle service; and the breezy Outside Terrace screening live Premier League matches with beer bucket deals.
                </p>
                <button 
                  onClick={() => setCurrentTab('restaurant-bar')} 
                  className="text-xs text-[#7B2635] hover:underline font-bold inline-flex items-center gap-1.5 pt-1 uppercase tracking-wider"
                >
                  View Drinks Lists <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-8 bg-[#EDE3D5]/40 border border-[#EDE3D5] flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-80 aspect-[16/10] overflow-hidden shrink-0 bg-[#EDE3D5]">
                <AppImage 
                  src="/images/salon/pedicure-pod-capsule.jpeg" 
                  alt="Beauty Salon & Pod" 
                  departmentIcon="salon"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-3 flex-1">
                <span className="text-[10px] text-[#C85B35] font-bold uppercase tracking-widest">Department 03</span>
                <h3 className="font-serif text-2xl font-normal text-[#28201E]">Miami Clipper Unisex Salon & Therapeutic Spa</h3>
                <p className="text-xs sm:text-sm text-[#28201E]/80 font-light leading-relaxed">
                  A sanctuary of relaxation offering Swedish and deep tissue body massage, protective braids and weave installs, gel nails, and the state-of-the-art pedicure pod capsule with automated shiatsu roller back massage.
                </p>
                <button 
                  onClick={() => setCurrentTab('salon-massage')} 
                  className="text-xs text-[#7B2635] hover:underline font-bold inline-flex items-center gap-1.5 pt-1 uppercase tracking-wider"
                >
                  View Salon & Spa Menu <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-8 bg-[#EDE3D5]/40 border border-[#EDE3D5] flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-80 aspect-[16/10] overflow-hidden shrink-0 bg-[#EDE3D5]">
                <AppImage 
                  src="/images/barbershop/barber-stations-uv.jpeg" 
                  alt="Miami Barbershop" 
                  departmentIcon="barbershop"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-3 flex-1">
                <span className="text-[10px] text-[#C85B35] font-bold uppercase tracking-widest">Department 04</span>
                <h3 className="font-serif text-2xl font-normal text-[#28201E]">Miami Barbershop</h3>
                <p className="text-xs sm:text-sm text-[#28201E]/80 font-light leading-relaxed">
                  Monrovia's sharpest fade and gentleman's grooming suite. Crisp hairline edging, beard oil nourishment, hot steam towels, and master precision scissor craft.
                </p>
                <button 
                  onClick={() => setCurrentTab('barbershop')} 
                  className="text-xs text-[#7B2635] hover:underline font-bold inline-flex items-center gap-1.5 pt-1 uppercase tracking-wider"
                >
                  View Barber Services <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
