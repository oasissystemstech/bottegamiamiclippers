import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  UtensilsCrossed, 
  Clock, 
  MapPin 
} from 'lucide-react';
import { MenuItem, BusinessSettings, CartItem } from '../types';

interface OrderingPageProps {
  menuItems: MenuItem[];
  cart: CartItem[];
  addToCart: (item: MenuItem, variant?: string, instructions?: string) => void;
  openCart: () => void;
  settings: BusinessSettings;
}

export const OrderingPage: React.FC<OrderingPageProps> = ({
  menuItems,
  cart,
  addToCart,
  openCart,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [instructionInputs, setInstructionInputs] = useState<Record<string, string>>({});
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const foodItems = menuItems.filter(i => i.isAvailable);
  const categories = ['all', 'Local Specialties', 'Grill & BBQ', 'Rice & Grains', 'Burgers & Sandwiches', 'Pizza', 'Soups', 'Beers & Ciders'];

  const displayedItems = activeCategory === 'all'
    ? foodItems
    : foodItems.filter(i => i.category === activeCategory || (activeCategory === 'Beers & Ciders' && i.section === 'outside_bar'));

  const cartTotalUSD = cart.reduce((acc, i) => i.menuItem.currency === 'USD' ? acc + (i.menuItem.price * i.quantity) : acc, 0);
  const cartTotalLRD = cart.reduce((acc, i) => i.menuItem.currency === 'LRD' ? acc + (i.menuItem.price * i.quantity) : acc, 0);

  const handleAdd = (item: MenuItem) => {
    const variant = selectedVariants[item.id] || (item.variants ? item.variants[0] : undefined);
    const instruction = instructionInputs[item.id] || undefined;
    addToCart(item, variant, instruction);
    setInstructionInputs(prev => ({ ...prev, [item.id]: '' }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-[#F5F0E8] text-[#28201E]">
      
      {/* Editorial Header Banner */}
      <div className="relative rounded-3xl bg-[#EDE3D5] border border-[#DDD1C0] p-6 sm:p-10 overflow-hidden">
        <div className="max-w-2xl space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2635]">
            Direct Kitchen Ordering
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-normal text-[#28201E]">
            Fresh from Bottega to Your Table or Doorstep
          </h1>
          <p className="text-sm text-[#5A4D48] leading-relaxed">
            Prepared to order from authentic Liberian ingredients, charcoal grills, and our wood-inspired kitchen. Available for dine-in pickup, takeaway, and delivery across Monrovia.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#5A4D48] font-medium">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#7B2635]" /> 20–35 min preparation
            </span>
            <span aria-hidden="true" className="text-[#C8BEB5]">·</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#7B2635]" /> Monrovia delivery available
            </span>
            <span aria-hidden="true" className="text-[#C8BEB5]">·</span>
            <span className="text-[#7B2635] font-semibold">Live WhatsApp Confirmation</span>
          </div>
        </div>

        {/* Floating Cart Widget on Desktop */}
        {cart.length > 0 && (
          <div className="mt-6 sm:mt-0 sm:absolute sm:right-8 sm:top-1/2 sm:-translate-y-1/2 p-5 rounded-2xl bg-[#F5F0E8] border border-[#7B2635]/40 shadow-lg max-w-xs w-full space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#28201E]">
              <span>Cart ({cart.length} item{cart.length === 1 ? '' : 's'})</span>
              <span className="text-[#7B2635] tabular-nums font-semibold">
                {cartTotalUSD > 0 && `$${cartTotalUSD.toFixed(2)} USD `}
                {cartTotalLRD > 0 && `${cartTotalLRD.toLocaleString()} LRD`}
              </span>
            </div>
            <button
              onClick={openCart}
              className="w-full py-2.5 px-3 rounded-lg bg-[#7B2635] hover:bg-[#641F2B] text-[#F5F0E8] font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <ShoppingBag className="w-4 h-4 text-[#B38A45]" /> Checkout Order
            </button>
          </div>
        )}
      </div>

      {/* Category Filter Controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-[#E3D9CC]">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
              activeCategory === cat
                ? 'bg-[#7B2635] text-[#F5F0E8] font-semibold shadow-xs'
                : 'bg-[#EDE3D5] text-[#4A3F3B] border border-[#DDD1C0] hover:text-[#28201E] hover:bg-[#E3D6C5]'
            }`}
          >
            {cat === 'all' ? 'All Dishes' : cat}
          </button>
        ))}
      </div>

      {/* Food Ordering Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {displayedItems.map(item => {
          const chosenVariant = selectedVariants[item.id] || (item.variants ? item.variants[0] : undefined);
          const currentInstruction = instructionInputs[item.id] || '';

          return (
            <div 
              key={item.id}
              className="rounded-2xl bg-[#EDE3D5] border border-[#DDD1C0] p-6 flex flex-col justify-between space-y-4 hover:border-[#7B2635] transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-[#7B2635] uppercase tracking-wider font-semibold block">
                      {item.category}
                    </span>
                    <h3 className="font-display text-base font-bold text-[#28201E] mt-0.5">{item.name}</h3>
                  </div>
                  <span className="text-xs font-bold text-[#28201E] tabular-nums whitespace-nowrap bg-[#F5F0E8] px-2.5 py-1 rounded-md border border-[#DDD1C0]">
                    {item.currency === 'USD' ? `$${item.price.toFixed(2)} USD` : `${item.price.toLocaleString()} LRD`}
                  </span>
                </div>

                <p className="text-xs text-[#5A4D48] leading-relaxed">
                  {item.description}
                </p>

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
                          className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                            chosenVariant === v
                              ? 'bg-[#7B2635] text-white font-semibold'
                              : 'bg-[#F5F0E8] text-[#4A3F3B] hover:bg-[#E3D6C5]'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-1">
                  <input
                    type="text"
                    placeholder="Preparation notes (e.g. no onions, extra pepper)"
                    value={currentInstruction}
                    onChange={(e) => setInstructionInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#F5F0E8] border border-[#DDD1C0] text-[11px] text-[#28201E] placeholder-[#8A7D77] focus:border-[#7B2635] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#DDD1C0] flex items-center justify-between">
                <span className="text-[11px] text-[#6B5E59]">
                  {item.preparationTime ? `Est. ${item.preparationTime}` : 'Fresh to order'}
                </span>
                <button
                  onClick={() => handleAdd(item)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#7B2635] hover:bg-[#641F2B] text-[#F5F0E8] font-semibold text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#B38A45]" /> Add to Order
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
            <span className="text-xs text-[#6B5E59] block font-medium">{cart.length} item{cart.length === 1 ? '' : 's'}</span>
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
