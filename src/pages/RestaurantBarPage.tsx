import React, { useState, useMemo } from 'react';
import { 
  Search, 
  UtensilsCrossed, 
  Wine, 
  ShoppingBag, 
  MessageCircle, 
  CheckCircle, 
  XCircle, 
  Tag 
} from 'lucide-react';
import { MenuItem, MenuSection, BusinessSettings } from '../types';
import { AppImage } from '../components/AppImage';

interface RestaurantBarPageProps {
  menuItems: MenuItem[];
  addToCart: (item: MenuItem, variant?: string) => void;
  settings: BusinessSettings;
}

export const RestaurantBarPage: React.FC<RestaurantBarPageProps> = ({
  menuItems,
  addToCart,
  settings,
}) => {
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVariantMap, setSelectedVariantMap] = useState<Record<string, string>>({});

  const sections = [
    { id: 'all', label: 'All Offerings' },
    { id: 'restaurant', label: 'Restaurant Dining' },
    { id: 'main_bar', label: 'Main Bar Lounge' },
    { id: 'outside_bar', label: 'Outside Bar Terrace' },
    { id: 'wines', label: 'Wines & Vintages' },
    { id: 'cocktails', label: 'Cocktails' },
    { id: 'non_alcoholic', label: 'Non-Alcoholic' },
  ];

  // Derive unique categories for the active section
  const categories = useMemo(() => {
    const relevant = selectedSection === 'all' 
      ? menuItems 
      : menuItems.filter(i => i.section === selectedSection);
    const set = new Set(relevant.map(i => i.category));
    return ['all', ...Array.from(set)];
  }, [menuItems, selectedSection]);

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesSection = selectedSection === 'all' || item.section === selectedSection;
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSection && matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedSection, selectedCategory, searchQuery]);

  const handleVariantSelect = (itemId: string, variant: string) => {
    setSelectedVariantMap(prev => ({ ...prev, [itemId]: variant }));
  };

  const handleEnquireWhatsApp = (item: MenuItem) => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const priceText = item.currency === 'USD' ? `$${item.price.toFixed(2)} USD` : `${item.price.toLocaleString()} LRD`;
    const message = `Hello Bottega Restro! I would like to enquire about ordering: "${item.name}" (${priceText}). Is it currently available today?`;
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-[#F5F0E8] text-[#28201E]">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2635]">
          Bottega Hospitality
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-normal text-[#28201E]">
          Dining & Beverage Catalogs
        </h1>
        <p className="text-sm text-[#5A4D48] leading-relaxed">
          From slow-simmered Nimba County specialties and charcoal-grilled fish to cold draughts on the terrace and private bottle service in the evening lounge.
        </p>
      </div>

      {/* Currency & Bar Loyalty Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#EDE3D5] border border-[#DDD1C0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5A4D48]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#7B2635]/10 text-[#7B2635] flex items-center justify-center shrink-0">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-[#28201E] block">Dual Currency & Independent Bar Catalogs</span>
            <span>Items are preserved in original USD ($) or Liberian Dollars (LRD). Main Bar and Outside Bar selections are independently managed.</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 rounded-md bg-[#F5F0E8] text-[11px] text-[#7B2635] font-semibold border border-[#DDD1C0]">
            Nimba Specialties: Thu & Sat
          </span>
        </div>
      </div>

      {/* Section Filter & Search */}
      <div className="space-y-4">
        {/* Section Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-[#E3D9CC]">
          {sections.map(sec => (
            <button
              key={sec.id}
              onClick={() => {
                setSelectedSection(sec.id);
                setSelectedCategory('all');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                selectedSection === sec.id
                  ? 'bg-[#7B2635] text-[#F5F0E8] shadow-xs'
                  : 'bg-[#EDE3D5] text-[#4A3F3B] border border-[#DDD1C0] hover:text-[#28201E] hover:bg-[#E3D6C5]'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Sub-categories & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-md text-xs whitespace-nowrap shrink-0 transition-colors font-medium ${
                  selectedCategory === cat
                    ? 'bg-[#28201E] text-[#EDE3D5] font-semibold'
                    : 'bg-[#EDE3D5] text-[#5A4D48] hover:text-[#28201E]'
                }`}
              >
                {cat === 'all' ? 'All Dishes & Drinks' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A7D77]" />
            <input
              type="text"
              placeholder="Search dishes, cocktails, wine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#EDE3D5] border border-[#DDD1C0] text-xs text-[#28201E] placeholder-[#8A7D77] focus:border-[#7B2635] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Menu Cards */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 space-y-3 bg-[#EDE3D5] rounded-2xl border border-[#DDD1C0]">
          <UtensilsCrossed className="w-10 h-10 text-[#8A7D77] mx-auto" />
          <p className="text-sm font-semibold text-[#28201E]">No menu items found matching your filters</p>
          <button
            onClick={() => { setSelectedSection('all'); setSelectedCategory('all'); setSearchQuery(''); }}
            className="text-xs text-[#7B2635] font-semibold hover:underline"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => {
            const chosenVariant = selectedVariantMap[item.id] || (item.variants ? item.variants[0] : undefined);
            
            return (
              <div
                key={item.id}
                className="bg-[#EDE3D5] rounded-2xl border border-[#DDD1C0] overflow-hidden flex flex-col justify-between group hover:border-[#7B2635] transition-all"
              >
                {item.image && (
                  <div className="h-48 relative overflow-hidden bg-[#D5C7B5]">
                    <AppImage
                      src={item.image}
                      alt={item.name}
                      departmentIcon={item.section === 'restaurant' ? 'restaurant' : 'bar'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.isFeatured && (
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded bg-[#7B2635] text-white font-semibold text-[10px] uppercase tracking-wider z-10">
                        Featured
                      </div>
                    )}
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md bg-[#28201E]/90 text-xs font-bold text-[#EDE3D5] tabular-nums z-10">
                      {item.currency === 'USD' ? `$${item.price.toFixed(2)} USD` : `${item.price.toLocaleString()} LRD`}
                    </div>
                  </div>
                )}

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#7B2635] font-semibold uppercase tracking-wider">{item.category}</span>
                      {item.isAvailable ? (
                        <span className="text-emerald-700 flex items-center gap-1 font-semibold text-[11px]">
                          <CheckCircle className="w-3 h-3" /> Available
                        </span>
                      ) : (
                        <span className="text-red-700 flex items-center gap-1 font-semibold text-[11px]">
                          <XCircle className="w-3 h-3" /> Sold Out
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-lg font-bold text-[#28201E] mt-1 group-hover:text-[#7B2635] transition-colors">
                      {item.name}
                    </h3>

                    {!item.image && (
                      <div className="mt-1">
                        <span className="text-xs font-bold text-[#28201E] tabular-nums">
                          {item.currency === 'USD' ? `$${item.price.toFixed(2)} USD` : `${item.price.toLocaleString()} LRD`}
                        </span>
                      </div>
                    )}

                    <p className="text-xs text-[#5A4D48] mt-2 leading-relaxed">
                      {item.description}
                    </p>

                    {item.variants && item.variants.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-[#DDD1C0] space-y-1">
                        <span className="text-[10px] uppercase font-semibold text-[#6B5E59] block">
                          Serving Options:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.variants.map((variant) => (
                            <button
                              key={variant}
                              onClick={() => handleVariantSelect(item.id, variant)}
                              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                                chosenVariant === variant
                                  ? 'bg-[#7B2635] text-white font-semibold'
                                  : 'bg-[#F5F0E8] text-[#4A3F3B] hover:bg-[#E3D6C5]'
                              }`}
                            >
                              {variant}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#DDD1C0] flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleEnquireWhatsApp(item)}
                      className="px-2.5 py-1.5 rounded-md bg-[#F5F0E8] hover:bg-white text-emerald-800 text-xs font-semibold border border-[#DDD1C0] transition-colors flex items-center gap-1"
                      title="Enquire on WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current text-emerald-600" />
                      WhatsApp
                    </button>

                    <button
                      onClick={() => addToCart(item, chosenVariant)}
                      disabled={!item.isAvailable}
                      className="px-3.5 py-1.5 rounded-lg bg-[#7B2635] hover:bg-[#641F2B] disabled:bg-[#DDD1C0] disabled:text-[#8A7D77] text-[#F5F0E8] font-semibold text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#B38A45]" />
                      {item.isAvailable ? 'Add to Order' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
