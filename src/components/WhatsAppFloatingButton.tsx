import React, { useState } from 'react';
import { MessageCircle, X, ChevronRight, Utensils, Sparkles, Wine, Calendar } from 'lucide-react';
import { BusinessSettings } from '../types';

interface WhatsAppFloatingButtonProps {
  settings: BusinessSettings;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);

  const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const openWhatsApp = (customMessage: string) => {
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(customMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const quickPrompts = [
    {
      icon: <Utensils className="w-4 h-4 text-[#7B2635]" />,
      label: 'Order Food or Check Daily Specials',
      msg: 'Hello Bottega Restro, I would like to enquire about placing a food order and today’s special dishes.',
    },
    {
      icon: <Sparkles className="w-4 h-4 text-[#C85B35]" />,
      label: 'Request Massage / Salon Booking',
      msg: 'Hello Miami Clipper, I would like to request an appointment for a massage / hair / spa service.',
    },
    {
      icon: <Wine className="w-4 h-4 text-[#B38A45]" />,
      label: 'Reserve Outside Bar / Matchday Table',
      msg: 'Hello Bottega Lounge, I would like to check availability and reserve a table at the outside bar terrace.',
    },
    {
      icon: <Calendar className="w-4 h-4 text-[#7B2635]" />,
      label: 'VIP Lounge Booth or Event Enquiries',
      msg: 'Hello Bottega Restro & Lounge, I am inquiring about booking a VIP booth for an upcoming event.',
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* Contextual Quick Menu Popover */}
      {isOpen && (
        <div className="mb-3 w-80 max-w-[calc(100vw-2rem)] bg-[#F5F0E8] border border-[#EDE3D5] shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-3 text-[#28201E]">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDE3D5]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#25d366] text-white flex items-center justify-center font-bold shadow-sm">
                <MessageCircle className="w-4 h-4 fill-current" />
              </div>
              <div>
                <p className="font-serif text-sm font-normal text-[#28201E]">Bottega & Miami Clipper</p>
                <p className="text-[10px] text-[#168a3e] flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25d366]"></span>
                  Direct Concierge Desk
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-[#28201E]/50 hover:text-[#28201E] hover:bg-[#EDE3D5] transition-colors"
              aria-label="Close WhatsApp options"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-2.5 space-y-1.5">
            <p className="text-[11px] text-[#28201E]/60 px-1 font-light">How can our team assist you?</p>
            {quickPrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => openWhatsApp(item.msg)}
                className="w-full text-left p-2.5 bg-white/70 hover:bg-white border border-[#EDE3D5] hover:border-[#7B2635]/40 transition-all flex items-center justify-between group shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="shrink-0">{item.icon}</div>
                  <span className="text-xs font-medium text-[#28201E] group-hover:text-[#7B2635]">
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#28201E]/40 group-hover:text-[#7B2635] shrink-0" />
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[#EDE3D5]">
            <button
              onClick={() => openWhatsApp('Hello Bottega Restro & Miami Clipper, I would like to chat with customer service.')}
              className="w-full py-2.5 px-3 bg-[#25d366] text-white font-bold text-xs uppercase tracking-wider text-center hover:bg-[#20be5a] shadow-xs transition-colors"
            >
              General WhatsApp Inquiry
            </button>
          </div>
        </div>
      )}

      {/* Persistent Floating Button */}
      <div className="relative group flex items-center gap-2">
        {/* Desktop Tooltip */}
        <span className="hidden md:inline-block px-3 py-1.5 bg-[#F5F0E8] border border-[#EDE3D5] text-xs font-medium text-[#28201E] shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Chat with our Front Desk on WhatsApp
        </span>

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Contact Bottega Restro & Miami Clipper on WhatsApp"
          className="w-14 h-14 rounded-full bg-[#25d366] hover:bg-[#20be5a] text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform duration-200 focus:outline-none"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-7 h-7 fill-white text-white" />
          )}
          
          {/* Attention indicator */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#C85B35] border-2 border-white"></span>
        </button>
      </div>

    </div>
  );
};
