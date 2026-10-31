import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  UtensilsCrossed, 
  Wine, 
  Beer, 
  GlassWater, 
  Sparkles, 
  Search, 
  Clock, 
  MapPin,
  Check,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { MenuItem, BusinessSettings, CartItem } from '../types';
import { AppImage } from '../components/AppImage';

interface OrderingPageProps {
  menuItems: MenuItem[];
  cart: CartItem[];
  addToCart: (item: MenuItem, variant?: string, instructions?: string) => void;
  openCart: () => void;
  settings: BusinessSettings;
  initialCategory?: string;
}

export const OrderingPage: React.FC<OrderingPageProps> = ({
  menuItems,
  cart,
  addToCart,
  openCart,
  settings,
  initialCategory = 'all',
}) => {
  const [activeDepartment, setActiveDepartment] = useState<string>(initialCategory);
  const [foodSubCategory, setFoodSubCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [instructionInputs, setInstructionInputs] = useState<Record<string, string>>({});
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [addedItemAnim, setAddedItemAnim] = useState<string | null>(null);

  // Available items
  const availableItems = useMemo(() => {
    return menuItems.filter(i => i.isAvailable);
  }, [menuItems]);

  // Unified top navigation tabs according to prompt requirements:
  // 1. Restaurant Food
  // 2. Main Bar
  // 3. Outside Bar
  // 4. Wines
  // 5. Cocktails
  // 6. Non-alcoholic Drinks
  // 7. VIP Shots & Bottles
  const departmentTabs = [
    { id: 'all', label: 'All Offerings', icon: Sparkles },
    { id: 'restaurant', label: 'Restaurant Food', icon: UtensilsCrossed },
    { id: 'main_bar', label: 'Main Bar', icon: Wine },
    { id: 'outside_bar', label: 'Outside Bar', icon: Beer },
    { id: 'wines', label: 'Wines', icon: Wine },
    { id: 'cocktails', label: 'Cocktails', icon: Wine },
    { id: 'non_alcoholic', label: 'Non-alcoholic Drinks', icon: GlassWater },
    { id: 'vip_bottles', label: 'VIP Shots & Bottles', icon: Sparkles },
  ];

  const foodSubCategories = [
    'all',
    'Local Specialties',
    'Grill & BBQ',
    'Rice & Grains',
    'Burgers & Sandwiches',
    'Pizza',
    'Soups',
    'Pasta',
  ];

  // Filtering logic
  const filteredItems = useMemo(() => {
    return availableItems.filter(item => {
      // 1. Department filter
      let matchesDepartment = true;
      if (activeDepartment === 'restaurant') {
        matchesDepartment = item.section === 'restaurant';
      } else if (activeDepartment === 'main_bar') {
        matchesDepartment = item.section === 'main_bar';
      } else if (activeDepartment === 'outside_bar') {
        matchesDepartment = item.section === 'outside_bar';
      } else if (activeDepartment === 'wines') {
        matchesDepartment = item.section === 'wines' || item.category?.toLowerCase().includes('wine');
      } else if (activeDepartment === 'cocktails') {
        matchesDepartment = item.section === 'cocktails' || item.category?.toLowerCase().includes('cocktail');
      } else if (activeDepartment === 'non_alcoholic') {
        matchesDepartment = item.section === 'non_alcoholic' || item.category?.toLowerCase().includes('mocktail') || item.category?.toLowerCase().includes('juice') || item.category?.toLowerCase().includes('soft drink');
      } else if (activeDepartment === 'vip_bottles') {
        matchesDepartment = (item.section === 'main_bar' && (item.price >= 50 || item.name.toLowerCase().includes('bottle') || item.name.toLowerCase().includes('hennessy') || item.name.toLowerCase().includes('tequila')));
      }

      if (!matchesDepartment) return false;

      // 2. Food subcategory filter (if active)
      if (activeDepartment === 'restaurant' && foodSubCategory !== 'all') {
        if (item.category !== foodSubCategory) return false;
      }

      // 3. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query) ?? false;
        const matchesCat = item.category?.toLowerCase().includes(query) ?? false;
        const matchesSec = item.section?.toLowerCase().includes(query) ?? false;
        if (!matchesName && !matchesDesc && !matchesCat && !matchesSec) return false;
      }

      return true;
    });
  }, [availableItems, activeDepartment, foodSubCategory, searchQuery]);

  // Cart total calculations
  const cartTotalUSD = cart.reduce((acc, i) => i.menuItem.currency === 'USD' ? acc + (i.menuItem.price * i.quantity) : acc, 0);
  const cartTotalLRD = cart.reduce((acc, i) => i.menuItem.currency === 'LRD' ? acc + (i.menuItem.price * i.quantity) : acc, 0);
  const cartItemCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  const handleAdd = (item: MenuItem) => {
    const variant = selectedVariants[item.id] || (item.variants ? item.variants[0] : undefined);
    const instruction = instructionInputs[item.id] || undefined;
    addToCart(item, variant, instruction);
    setInstructionInputs(prev => ({ ...prev, [item.id]: '' }));

    // Trigger visual checkmark feedback
    setAddedItemAnim(item.id);
    setTimeout(() => {
      setAddedItemAnim(null);
    }, 1200);
  };

  const getSectionBadge = (section: string) => {
    switch (section) {
      case 'restaurant':
        return { label: 'Bottega Kitchen', bg: 'bg-[#7B2635]/10 text-[#7B2635] border-[#7B2635]/20' };
      case 'main_bar':
        return { label: 'Main Bar Lounge', bg: 'bg-[#B38A45]/15 text-[#B38A45] border-[#B38A45]/30' };
      case 'outside_bar':
        return { label: 'Outside Terrace Bar', bg: 'bg-emerald-900/10 text-emerald-800 border-emerald-700/20' };
      case 'cocktails':
        return { label: 'Craft Cocktail', bg: 'bg-rose-900/10 text-rose-800 border-rose-700/20' };
      case 'wines':
        return { label: 'Cellar Wine', bg: 'bg-purple-900/10 text-purple-800 border-purple-700/20' };
      case 'non_alcoholic':
        return { label: 'Non-Alcoholic', bg: 'bg-sky-900/10 text-sky-800 border-sky-700/20' };
      default:
        return { label: 'Bottega', bg: 'bg-[#28201E]/10 text-[#28201E] border-[#28201E]/20' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 sm:space-y-12 bg-[#F5F0E8] text-[#28201E]">
      
      {/* Editorial Header Banner */}
      <div className="relative rounded-3xl bg-[#EDE3D5] border border-[#DDD1C0] p-6 sm:p-10 overflow-hidden shadow-xs">
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-[2px] bg-[#7B2635]"></span>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2635]">
              Unified Online Menu & Bar
            </span>
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl font-normal text-[#28201E] leading-tight">
            Order Gourmet Dishes, Spirits <span className="italic font-serif text-[#7B2635]">&</span> Cold Drinks
          </h1>
          
          <p className="text-sm text-[#5A4D48] leading-relaxed">
            Combine authentic Liberian Nimba cuisine, charcoal grills, pizzas, ice-cold terrace beers, signature cocktails, and premium spirits into a single order. Available for table dine-in service, venue collection, or direct delivery across Monrovia.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#5A4D48] font-medium">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#7B2635]" /> 20–35 min preparation
            </span>
            <span aria-hidden="true" className="text-[#C8BEB5]">·</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#7B2635]" /> Oldroad Junction pickup & Monrovia delivery
            </span>
            <span aria-hidden="true" className="text-[#C8BEB5]">·</span>
            <span className="text-[#7B2635] font-semibold">Instant WhatsApp Order Confirmation</span>
          </div>
        </div>

        {/* Floating Cart Widget on Desktop */}
        {cart.length > 0 && (
          <div className="mt-6 sm:mt-0 sm:absolute sm:right-8 sm:top-1/2 sm:-translate-y-1/2 p-5 rounded-2xl bg-[#F5F0E8] border border-[#7B2635]/40 shadow-lg max-w-xs w-full space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#28201E]">
              <span>Cart ({cartItemCount} item{cartItemCount === 1 ? '' : 's'})</span>
              <span className="text-[#7B2635] tabular-nums font-semibold">
                {cartTotalUSD > 0 && `$${cartTotalUSD.toFixed(2)} USD `}
                {cartTotalLRD > 0 && `${cartTotalLRD.toLocaleString()} LRD`}
              </span>
            </div>
            <button
              onClick={openCart}
              className="w-full py-2.5 px-3 rounded-lg bg-[#7B2635] hover:bg-[#641F2B] text-[#F5F0E8] font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <ShoppingBag className="w-4 h-4 text-[#B38A45]" /> Review & Checkout
            </button>
          </div>
        )}
      </div>

      {/* Top Search & Filter Bar */}
      <div className="space-y-4">
        
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-[#8A7D77] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search food, cocktails, beers, wines, spirits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#EDE3D5] border border-[#DDD1C0] text-xs text-[#28201E] placeholder-[#8A7D77] focus:border-[#7B2635] focus:outline-none focus:bg-[#F5F0E8] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A7D77] hover:text-[#28201E]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Primary Unified Category Tabs */}
        <div className="border-b border-[#E3D9CC]">
          <div className="flex items-center gap-2 overflow-x-auto pb-px scrollbar-none">
            {departmentTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeDepartment === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveDepartment(tab.id);
                    if (tab.id !== 'restaurant') setFoodSubCategory('all');
                  }}
                  className={`pb-3 px-3.5 text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-colors relative flex items-center gap-2 ${
                    isActive
                      ? 'text-[#7B2635]'
                      : 'text-[#6B5E59] hover:text-[#28201E]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#7B2635]' : 'text-[#8A7D77]'}`} />
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#7B2635] rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Subcategories (Visible when Restaurant Food or All is selected) */}
        {(activeDepartment === 'restaurant' || activeDepartment === 'all') && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
            <span className="text-[11px] font-semibold text-[#8A7D77] uppercase tracking-wider mr-1 hidden sm:inline">
              Filter Food:
            </span>
            {foodSubCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setFoodSubCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  foodSubCategory === cat
                    ? 'bg-[#7B2635] text-[#F5F0E8] font-semibold shadow-xs'
                    : 'bg-[#EDE3D5] text-[#4A3F3B] border border-[#DDD1C0] hover:text-[#28201E] hover:bg-[#E3D6C5]'
                }`}
              >
                {cat === 'all' ? 'All Kitchen Dishes' : cat}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Offerings Count & Active Filter Indicator */}
      <div className="flex items-center justify-between text-xs text-[#6B5E59] border-b border-[#E3D9CC] pb-3">
        <span>
          Showing <strong className="text-[#28201E]">{filteredItems.length}</strong> {filteredItems.length === 1 ? 'item' : 'items'}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
        <span className="hidden sm:inline">
          Prices displayed in original menu currencies (USD & LRD)
        </span>
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="rounded-2xl bg-[#EDE3D5] border border-[#DDD1C0] p-12 text-center space-y-4">
          <UtensilsCrossed className="w-8 h-8 text-[#8A7D77] mx-auto" />
          <h3 className="font-display text-lg font-bold text-[#28201E]">No items match your criteria</h3>
          <p className="text-xs text-[#5A4D48] max-w-sm mx-auto">
            Try adjusting your search query or selecting a different category tab above.
          </p>
          <button
            onClick={() => {
              setActiveDepartment('all');
              setFoodSubCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-lg bg-[#7B2635] text-[#F5F0E8] text-xs font-semibold uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Main Grid: Restaurant Food & Bar Drinks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredItems.map(item => {
          const chosenVariant = selectedVariants[item.id] || (item.variants ? item.variants[0] : undefined);
          const currentInstruction = instructionInputs[item.id] || '';
          const badge = getSectionBadge(item.section);
          const isJustAdded = addedItemAnim === item.id;

          return (
            <div 
              key={item.id}
              className="rounded-2xl bg-[#EDE3D5] border border-[#DDD1C0] p-6 flex flex-col justify-between space-y-4 hover:border-[#7B2635] transition-all group"
            >
              <div className="space-y-3">
                
                {/* Optional Photographic Preview */}
                {item.image && (
                  <div className="h-40 rounded-xl overflow-hidden border border-[#DDD1C0] bg-[#D5C7B5]">
                    <AppImage 
                      src={item.image} 
                      alt={item.name} 
                      departmentIcon={item.section === 'restaurant' ? 'restaurant' : 'bar'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badge.bg}`}>
                      {badge.label} · {item.category}
                    </span>
                    <span className="text-xs font-bold text-[#28201E] tabular-nums whitespace-nowrap bg-[#F5F0E8] px-2.5 py-1 rounded-md border border-[#DDD1C0]">
                      {item.currency === 'USD' ? `$${item.price.toFixed(2)} USD` : `${item.price.toLocaleString()} LRD`}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-[#28201E] mt-1 group-hover:text-[#7B2635] transition-colors">
                    {item.name}
                  </h3>
                </div>

                <p className="text-xs text-[#5A4D48] leading-relaxed">
                  {item.description}
                </p>

                {/* Serving / Variant Selector */}
                {item.variants && item.variants.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-semibold text-[#6B5E59] block mb-1">
                      Choose Serving:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.variants.map(v => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setSelectedVariants(prev => ({ ...prev, [item.id]: v }))}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                            chosenVariant === v
                              ? 'bg-[#7B2635] text-white font-semibold shadow-xs'
                              : 'bg-[#F5F0E8] text-[#4A3F3B] hover:bg-[#E3D6C5] border border-[#DDD1C0]'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special Instructions Input */}
                <div className="pt-1">
                  <input
                    type="text"
                    placeholder="Instructions (e.g. extra pepper, chilled glass, no onions)"
                    value={currentInstruction}
                    onChange={(e) => setInstructionInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#F5F0E8] border border-[#DDD1C0] text-[11px] text-[#28201E] placeholder-[#8A7D77] focus:border-[#7B2635] focus:outline-none"
                  />
                </div>
              </div>

              {/* Add to Order Action */}
              <div className="pt-3 border-t border-[#DDD1C0] flex items-center justify-between">
                <span className="text-[11px] text-[#6B5E59]">
                  {item.preparationTime ? `Est. ${item.preparationTime}` : 'Fresh service'}
                </span>
                <button
                  onClick={() => handleAdd(item)}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold text-xs tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-xs ${
                    isJustAdded 
                      ? 'bg-emerald-700 text-white' 
                      : 'bg-[#7B2635] hover:bg-[#641F2B] text-[#F5F0E8]'
                  }`}
                >
                  {isJustAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Added!
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 text-[#B38A45]" /> Add to Order
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Cart Bar for Mobile */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#F5F0E8]/95 backdrop-blur-md border-t border-[#DDD1C0] p-4 sm:hidden flex items-center justify-between shadow-xl">
          <div>
            <span className="text-xs text-[#6B5E59] block font-medium">{cartItemCount} item{cartItemCount === 1 ? '' : 's'} in cart</span>
            <span className="text-xs font-bold text-[#7B2635] tabular-nums">
              {cartTotalUSD > 0 && `$${cartTotalUSD.toFixed(2)} USD `}
              {cartTotalLRD > 0 && `${cartTotalLRD.toLocaleString()} LRD`}
            </span>
          </div>
          <button
            onClick={openCart}
            className="px-4 py-2.5 rounded-lg bg-[#7B2635] text-[#F5F0E8] font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs"
          >
            <ShoppingBag className="w-4 h-4 text-[#B38A45]" /> Review Cart
          </button>
        </div>
      )}

    </div>
  );
};
