import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { Maximize2 } from 'lucide-react';
import { AppImage } from '../components/AppImage';

interface GalleryPageProps {
  gallery: GalleryItem[];
  openLightbox: (index: number) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ gallery, openLightbox }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'restaurant', label: 'Restaurant' },
    { id: 'bar_lounge', label: 'Main Bar Lounge' },
    { id: 'outside_bar', label: 'Outside Bar Terrace' },
    { id: 'beauty_salon', label: 'Beauty Salon & Spa' },
    { id: 'barbershop', label: 'Miami Barbershop' },
    { id: 'general', label: 'Venue & Brand' },
  ];

  const filtered = activeCategory === 'all'
    ? gallery
    : gallery.filter(g => g.category === activeCategory);

  return (
    <div className="bg-[#F5F0E8] text-[#28201E] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Editorial Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-[1px] bg-[#C85B35]"></span>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C85B35]">
              Visual Exhibition
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#28201E] font-normal tracking-tight leading-[1.1]">
            Atmosphere & Spaces <br />
            <span className="italic font-light text-[#7B2635]">through the Lens</span>
          </h1>

          <p className="text-sm sm:text-base text-[#28201E]/80 font-light leading-relaxed">
            Take a visual tour through our warm dining hall, backlit illuminated cocktail counter, breezy garden pergola terrace, shiatsu pedicure pod suite, and gentleman’s barbershop parlour at Oldroad Junction.
          </p>
        </div>

        {/* Category Filter Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-[#EDE3D5]">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap shrink-0 transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#7B2635] text-[#F5F0E8] shadow-xs'
                  : 'bg-transparent text-[#28201E]/70 border border-[#EDE3D5] hover:text-[#28201E] hover:bg-white/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Photo Exhibition Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((item, index) => {
            const originalIndex = gallery.findIndex(g => g.id === item.id);

            return (
              <div
                key={item.id}
                onClick={() => openLightbox(originalIndex !== -1 ? originalIndex : index)}
                className="group relative overflow-hidden bg-[#EDE3D5]/40 border border-[#EDE3D5] cursor-pointer hover:bg-[#EDE3D5] transition-all duration-300 flex flex-col"
              >
                <div className="aspect-[4/3] sm:aspect-square relative overflow-hidden bg-[#EDE3D5]">
                  <AppImage
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-[#28201E]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 pointer-events-none">
                    <div className="p-3 bg-[#F5F0E8] text-[#7B2635] shadow-lg">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-1 border-t border-[#EDE3D5] bg-[#EDE3D5]/30">
                  <h4 className="font-serif text-base font-normal text-[#28201E] truncate group-hover:text-[#7B2635] transition-colors">
                    {item.title}
                  </h4>
                  {item.caption && (
                    <p className="text-[11px] text-[#28201E]/70 line-clamp-1 font-light">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
