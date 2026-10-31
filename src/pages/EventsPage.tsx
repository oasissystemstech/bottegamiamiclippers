import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Tag, 
  MessageCircle, 
  Clock,
  Sparkles
} from 'lucide-react';
import { EventItem, BusinessSettings } from '../types';
import { AppImage } from '../components/AppImage';

interface EventsPageProps {
  events: EventItem[];
  settings: BusinessSettings;
}

export const EventsPage: React.FC<EventsPageProps> = ({ events, settings }) => {
  const [viewFilter, setViewFilter] = useState<'upcoming' | 'archived'>('upcoming');

  const displayedEvents = events.filter(e => {
    if (viewFilter === 'upcoming') {
      return e.isPublished && !e.isArchived;
    }
    return e.isArchived;
  });

  const handleRSVP = (event: EventItem) => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const message = `Hello Bottega Restro & Lounge! I would like to RSVP or reserve a table/VIP booth for the upcoming event: "${event.title}" on ${event.date} (${event.startTime}). Please let me know available seating!`;
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#F5F0E8] text-[#28201E] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Editorial Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-[1px] bg-[#C85B35]"></span>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C85B35]">
              Live Entertainment & Gatherings
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#28201E] font-normal tracking-tight leading-[1.1]">
            Events & Special Nights <br />
            <span className="italic font-light text-[#7B2635]">at Oldroad Junction</span>
          </h1>

          <p className="text-sm sm:text-base text-[#28201E]/80 font-light leading-relaxed">
            From Thursday and Saturday authentic Nimba cultural feasts to Friday Afrobeats rooftop sessions and terrace Premier League broadcasts under the stars.
          </p>
        </div>

        {/* Filter Switch */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE3D5] pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewFilter('upcoming')}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                viewFilter === 'upcoming'
                  ? 'bg-[#7B2635] text-[#F5F0E8] shadow-xs'
                  : 'bg-transparent text-[#28201E]/70 border border-[#EDE3D5] hover:text-[#28201E] hover:bg-white/50'
              }`}
            >
              Upcoming Experiences
            </button>
            <button
              onClick={() => setViewFilter('archived')}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                viewFilter === 'archived'
                  ? 'bg-[#7B2635] text-[#F5F0E8] shadow-xs'
                  : 'bg-transparent text-[#28201E]/70 border border-[#EDE3D5] hover:text-[#28201E] hover:bg-white/50'
              }`}
            >
              Past Events Archive
            </button>
          </div>

          <span className="text-xs text-[#28201E]/60 font-light">
            Showing {displayedEvents.length} {viewFilter === 'upcoming' ? 'scheduled' : 'past'} gathering{displayedEvents.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Event Cards */}
        {displayedEvents.length === 0 ? (
          <div className="text-center py-20 bg-[#EDE3D5]/40 border border-[#EDE3D5] space-y-4">
            <Calendar className="w-10 h-10 text-[#C85B35] mx-auto opacity-60" />
            <h3 className="font-serif text-2xl font-normal text-[#28201E]">No Gatherings Currently Listed</h3>
            <p className="text-xs sm:text-sm text-[#28201E]/70 font-light max-w-md mx-auto">
              We are curating our next roster of weekend DJ lineups, acoustic lounge sessions, and festive holiday tastings. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedEvents.map(evt => (
              <div
                key={evt.id}
                className="bg-[#EDE3D5]/40 border border-[#EDE3D5] overflow-hidden flex flex-col justify-between group hover:bg-[#EDE3D5] transition-all duration-300 shadow-xs"
              >
                <div className="h-60 relative overflow-hidden bg-[#EDE3D5]">
                  <AppImage
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-[#F5F0E8]/95 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#7B2635] border border-[#EDE3D5] z-10">
                    {evt.tag}
                  </div>
                </div>

                <div className="p-7 space-y-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#C85B35] font-semibold tracking-wider">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{evt.date} · {evt.startTime} {evt.endTime ? `- ${evt.endTime}` : ''}</span>
                    </div>

                    <h3 className="font-serif text-2xl font-normal text-[#28201E] leading-snug">
                      {evt.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#28201E]/80 font-light leading-relaxed line-clamp-3">
                      {evt.description}
                    </p>

                    <div className="pt-3 border-t border-[#EDE3D5] text-xs text-[#28201E]/70 space-y-1.5 font-light">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#B38A45]" /> {evt.location}
                      </p>
                      <p className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-[#B38A45]" /> {evt.ticketInfo}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-[#EDE3D5] flex items-center justify-between">
                    <span className="text-[11px] text-[#28201E]/60 uppercase tracking-wider font-light">
                      {viewFilter === 'archived' ? 'Concluded' : 'Table Reservation'}
                    </span>
                    
                    {viewFilter === 'upcoming' && (
                      <button
                        onClick={() => handleRSVP(evt)}
                        className="px-4 py-2.5 bg-[#7B2635] hover:bg-[#641F2B] text-[#F5F0E8] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" /> RSVP Table
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
