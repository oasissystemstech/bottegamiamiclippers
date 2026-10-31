import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { BusinessSettings, ContactEnquiry } from '../types';
import { StorageService } from '../services/storage';

interface ContactPageProps {
  settings: BusinessSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [category, setCategory] = useState<ContactEnquiry['category']>('general');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) return;

    setIsSubmitting(true);
    StorageService.createEnquiry({
      name: name.trim(),
      contact: contact.trim(),
      category,
      message: message.trim(),
    });
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleDirectWhatsApp = () => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const msg = `Hello Bottega Restro & Miami Clipper, I am reaching out from your website contact page regarding: [${category.replace('_', ' ').toUpperCase()}].`;
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#F5F0E8] text-[#28201E] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Editorial Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-[1px] bg-[#C85B35]"></span>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C85B35]">
              Concierge & Enquiries · Oldroad Junction
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#28201E] font-normal tracking-tight leading-[1.1]">
            Visit Us or Speak With <br />
            <span className="italic font-light text-[#7B2635]">Our Front Desk Team</span>
          </h1>

          <p className="text-sm sm:text-base text-[#28201E]/80 font-light leading-relaxed">
            Whether you wish to reserve a private dining booth, inquire about catering an upcoming birthday celebration, schedule a restorative massage, or place food delivery, we are at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Contact Cards & Operating Hours */}
          <div className="lg:col-span-6 space-y-8">
            <div className="p-8 sm:p-10 bg-[#EDE3D5]/40 border border-[#EDE3D5] space-y-6">
              <h3 className="font-serif text-2xl font-normal text-[#28201E]">
                Official Contact Directory
              </h3>

              <div className="space-y-4 text-xs font-light">
                <div className="flex items-start gap-4 p-4 bg-white/70 border border-[#EDE3D5]">
                  <MapPin className="w-5 h-5 text-[#C85B35] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-serif text-sm font-bold text-[#28201E] block">Physical Destination</span>
                    <span className="text-[#28201E]/80 leading-relaxed text-xs">{settings.address}</span>
                    <p className="text-[11px] text-[#28201E]/60 mt-1">Prime Oldroad Junction landmark with on-site security and parking.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/70 border border-[#EDE3D5]">
                  <Phone className="w-5 h-5 text-[#C85B35] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-serif text-sm font-bold text-[#28201E] block">Telephone Hotline</span>
                    <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="text-[#7B2635] hover:underline font-bold text-sm">
                      {settings.phone}
                    </a>
                    <p className="text-[11px] text-[#28201E]/60 mt-0.5">Direct reservations and kitchen queries.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/70 border border-[#EDE3D5]">
                  <MessageCircle className="w-5 h-5 text-[#168a3e] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-serif text-sm font-bold text-[#28201E] block">Official WhatsApp Desk</span>
                    <span className="text-[#168a3e] font-bold text-sm">+{settings.whatsappNumber}</span>
                    <p className="text-[11px] text-[#28201E]/60 mt-0.5">Quick order placement, menu advice, and therapist booking.</p>
                    <button
                      onClick={handleDirectWhatsApp}
                      className="mt-3 px-4 py-2 bg-[#25d366] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 hover:bg-[#20be5a] transition-colors shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" /> Open WhatsApp Chat
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/70 border border-[#EDE3D5]">
                  <Mail className="w-5 h-5 text-[#C85B35] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-serif text-sm font-bold text-[#28201E] block">Email Correspondence</span>
                    <a href={`mailto:${settings.email}`} className="text-[#7B2635] hover:underline font-medium text-xs">
                      {settings.email}
                    </a>
                    <p className="text-[11px] text-[#28201E]/60 mt-0.5">For corporate events, private lounge buyouts, and partnerships.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="p-8 bg-[#28201E] text-[#F5F0E8] border border-[#28201E] space-y-5">
              <h3 className="font-serif text-xl font-normal text-[#F5F0E8] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#B38A45]" /> Operating Hours
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light">
                <div className="p-4 bg-[#352c2a] border border-white/10">
                  <span className="font-bold text-[#B38A45] block font-serif text-sm">Bottega Restaurant</span>
                  <span className="text-[#F5F0E8]/75 text-[11px]">{settings.openingHours.restaurant}</span>
                </div>
                <div className="p-4 bg-[#352c2a] border border-white/10">
                  <span className="font-bold text-[#B38A45] block font-serif text-sm">Main & Outside Bar</span>
                  <span className="text-[#F5F0E8]/75 text-[11px]">{settings.openingHours.outsideBar}</span>
                </div>
                <div className="p-4 bg-[#352c2a] border border-white/10">
                  <span className="font-bold text-[#B38A45] block font-serif text-sm">Miami Clipper Salon</span>
                  <span className="text-[#F5F0E8]/75 text-[11px]">{settings.openingHours.beautySalon}</span>
                </div>
                <div className="p-4 bg-[#352c2a] border border-white/10">
                  <span className="font-bold text-[#B38A45] block font-serif text-sm">Miami Barbershop</span>
                  <span className="text-[#F5F0E8]/75 text-[11px]">{settings.openingHours.barbershop}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Enquiry Form */}
          <div className="lg:col-span-6 p-8 sm:p-10 bg-[#EDE3D5]/40 border border-[#EDE3D5] space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C85B35]">
                Direct Message
              </span>
              <h3 className="font-serif text-2xl font-normal text-[#28201E] mt-1">
                Enquiry & Reservation Desk
              </h3>
              <p className="text-xs text-[#28201E]/70 font-light mt-1">
                Your message is securely dispatched directly to our manager’s log for immediate review.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 bg-white border border-[#EDE3D5] text-center space-y-4 animate-in fade-in">
                <div className="w-14 h-14 rounded-full bg-[#25d366]/20 text-[#168a3e] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-2xl font-normal text-[#28201E]">Message Received</h4>
                <p className="text-xs text-[#28201E]/80 font-light max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. Our concierge desk at Oldroad Junction has logged your request and will follow up with you promptly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setContact('');
                    setMessage('');
                  }}
                  className="px-5 py-2.5 bg-[#7B2635] text-[#F5F0E8] text-xs font-bold uppercase tracking-wider hover:bg-[#641F2B] transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-light">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#28201E] mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sando Washington"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#EDE3D5] text-xs text-[#28201E] focus:border-[#7B2635] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#28201E] mb-1.5">
                    Phone Number or Email *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+231 77... or email address"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#EDE3D5] text-xs text-[#28201E] focus:border-[#7B2635] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#28201E] mb-1.5">
                    Enquiry Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-4 py-3 bg-white border border-[#EDE3D5] text-xs text-[#28201E] focus:border-[#7B2635] focus:outline-none"
                  >
                    <option value="general">General Enquiry</option>
                    <option value="restaurant_table">Restaurant Table Reservation</option>
                    <option value="bar_lounge_vip">VIP Bar Lounge Booth Booking</option>
                    <option value="salon_appointment">Massage or Spa Appointment</option>
                    <option value="barber_booking">Miami Barbershop Appointment</option>
                    <option value="event_hosting">Private Event / Birthday Hosting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#28201E] mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we assist you? Include party size, requested date, or specific requests..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#EDE3D5] text-xs text-[#28201E] focus:border-[#7B2635] focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-[#7B2635] hover:bg-[#641F2B] text-[#F5F0E8] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Sending Enquiry...' : 'Submit Message'}
                </button>
              </form>
            )}

          </div>

        </div>

        {/* Google Maps / Location Embed */}
        <section className="p-8 sm:p-10 bg-[#EDE3D5]/40 border border-[#EDE3D5] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDE3D5] pb-4">
            <div>
              <h3 className="font-serif text-2xl font-normal text-[#28201E]">
                Interactive Location Map
              </h3>
              <p className="text-xs text-[#28201E]/70 font-light">Oldroad Junction, Monrovia, Liberia</p>
            </div>
            <a
              href="https://maps.google.com/?q=Oldroad+Junction+Monrovia+Liberia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#7B2635] hover:underline flex items-center gap-1.5 font-bold uppercase tracking-wider"
            >
              Open in Google Maps <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="w-full h-80 overflow-hidden border border-[#EDE3D5] bg-[#EDE3D5] relative">
            <iframe
              title="Bottega Restro & Miami Clipper Location"
              src="https://maps.google.com/maps?q=Oldroad%20Junction%2C%20Monrovia%2C%20Liberia&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </section>

      </div>
    </div>
  );
};
