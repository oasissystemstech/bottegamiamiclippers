import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { SalonService, StaffProfile, BusinessSettings, AppointmentBooking, ServiceDepartment } from '../types';
import { StorageService } from '../services/storage';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: SalonService[];
  staff: StaffProfile[];
  settings: BusinessSettings;
  preselectedServiceId?: string;
  preselectedDepartment?: ServiceDepartment;
}

const TIME_SLOTS = [
  '09:30 AM', '10:30 AM', '11:30 AM',
  '01:00 PM', '02:00 PM', '03:30 PM',
  '04:30 PM', '05:30 PM', '06:30 PM',
  '07:30 PM', '08:30 PM'
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  services,
  staff,
  settings,
  preselectedServiceId,
  preselectedDepartment = 'massage',
}) => {
  const [selectedDept, setSelectedDept] = useState<ServiceDepartment>(preselectedDepartment);
  const [serviceId, setServiceId] = useState<string>(preselectedServiceId || '');
  const [staffId, setStaffId] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  
  // Default to tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = new Date().toISOString().split('T')[0];
  const [preferredDate, setPreferredDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [preferredTime, setPreferredTime] = useState('02:00 PM');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<AppointmentBooking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Filter services by selected department
  const filteredServices = services.filter(s => s.department === selectedDept);

  // Available staff for this department
  const relevantStaff = staff.filter(st => st.department === selectedDept && st.isAvailable);

  const selectedService = services.find(s => s.id === serviceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!serviceId) {
      setErrorMessage('Please select a service.');
      return;
    }
    if (!customerName.trim() || !phone.trim()) {
      setErrorMessage('Please enter your full name and phone number.');
      return;
    }

    setIsSubmitting(true);

    const chosenStaff = staff.find(st => st.id === staffId);

    const result = StorageService.createBooking({
      customerName: customerName.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || phone.trim(),
      email: email.trim() || undefined,
      department: selectedDept,
      serviceId,
      serviceTitle: selectedService ? selectedService.title : 'Salon Service',
      staffId: staffId || undefined,
      staffName: chosenStaff ? chosenStaff.name : 'Any Available Specialist',
      preferredDate,
      preferredTime,
      additionalNotes: additionalNotes.trim() || undefined,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.message || 'Time slot already taken. Please choose another slot.');
      return;
    }

    if (result.booking) {
      setConfirmedBooking(result.booking);
    }
  };

  const handleWhatsAppFollowUp = (booking: AppointmentBooking) => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const message = `Hello Miami Clipper & Spa! I just requested an appointment on your website:
Booking Ref: ${booking.bookingRef}
Client: ${booking.customerName}
Service: ${booking.serviceTitle}
Specialist: ${booking.staffName || 'Any Available'}
Date: ${booking.preferredDate}
Time: ${booking.preferredTime}
Phone: ${booking.phone}
${booking.additionalNotes ? `Notes: ${booking.additionalNotes}\n` : ''}
Please confirm my appointment slot!`;

    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const resetAndClose = () => {
    setConfirmedBooking(null);
    setErrorMessage(null);
    setCustomerName('');
    setPhone('');
    setWhatsapp('');
    setEmail('');
    setAdditionalNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#28201E]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#F5F0E8] border border-[#EDE3D5] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 text-[#28201E] font-sans">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#EDE3D5] flex items-center justify-between bg-[#F5F0E8]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#7B2635] text-[#F5F0E8] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-normal text-[#28201E]">
                {confirmedBooking ? 'Appointment Requested' : 'Book Miami Clipper & Spa'}
              </h3>
              <p className="text-xs text-[#28201E]/60 font-light">
                Monrovia, Oldroad Junction · Professional Wellness & Grooming
              </p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="p-2 text-[#28201E]/50 hover:text-[#28201E] hover:bg-[#EDE3D5] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-7">
          {confirmedBooking ? (
            <div className="space-y-6 text-center py-2 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-[#25d366]/20 text-[#168a3e] flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[11px] text-[#C85B35] uppercase tracking-widest font-bold">
                  Request Pending Reception Confirmation
                </span>
                <h4 className="font-serif text-2xl font-normal text-[#28201E] mt-1">
                  {confirmedBooking.bookingRef}
                </h4>
                <p className="text-xs text-[#28201E]/80 mt-2 max-w-sm mx-auto font-light">
                  Thank you, <span className="text-[#28201E] font-medium">{confirmedBooking.customerName}</span>. 
                  Our front desk has received your request and will confirm your slot shortly.
                </p>
              </div>

              <div className="p-5 bg-[#EDE3D5]/60 border border-[#EDE3D5] text-left text-xs space-y-2.5 font-light">
                <div className="flex justify-between text-[#28201E]/70">
                  <span>Service:</span>
                  <span className="text-[#28201E] font-serif font-bold text-sm">{confirmedBooking.serviceTitle}</span>
                </div>
                <div className="flex justify-between text-[#28201E]/70">
                  <span>Specialist:</span>
                  <span className="text-[#28201E] font-medium">{confirmedBooking.staffName}</span>
                </div>
                <div className="flex justify-between text-[#28201E]/70">
                  <span>Date & Time:</span>
                  <span className="text-[#7B2635] font-bold">
                    {confirmedBooking.preferredDate} at {confirmedBooking.preferredTime}
                  </span>
                </div>
                <div className="flex justify-between text-[#28201E]/70">
                  <span>Contact:</span>
                  <span className="text-[#28201E] font-medium">{confirmedBooking.phone}</span>
                </div>
              </div>

              <div className="p-4 bg-[#25d366]/10 border border-[#25d366]/30 text-left text-xs text-[#28201E]">
                <p className="font-bold text-[#168a3e] flex items-center gap-1.5 mb-1 font-serif text-sm">
                  <MessageCircle className="w-4 h-4" /> Expedited WhatsApp Confirmation
                </p>
                <p className="text-[11px] text-[#28201E]/75 font-light">
                  Connect directly with our receptionist on WhatsApp to confirm your preferred therapist or ask about customized packages.
                </p>
              </div>

              <button
                onClick={() => handleWhatsAppFollowUp(confirmedBooking)}
                className="w-full py-3.5 px-4 bg-[#25d366] hover:bg-[#20be5a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                Confirm via WhatsApp
              </button>

              <button
                onClick={resetAndClose}
                className="w-full py-2.5 text-xs font-semibold text-[#28201E]/60 hover:text-[#28201E] transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-light text-xs">
              
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-600 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Department Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#28201E] mb-1.5">
                  Choose Department
                </label>
                <div className="grid grid-cols-3 gap-2 bg-[#EDE3D5]/60 p-1.5 border border-[#EDE3D5]">
                  <button
                    type="button"
                    onClick={() => { setSelectedDept('massage'); setServiceId(''); }}
                    className={`py-2 px-3 text-xs font-bold uppercase tracking-wider transition-all ${
                      selectedDept === 'massage'
                        ? 'bg-[#7B2635] text-[#F5F0E8] shadow-xs'
                        : 'text-[#28201E]/70 hover:text-[#28201E]'
                    }`}
                  >
                    Massage & Spa
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedDept('beauty_salon'); setServiceId(''); }}
                    className={`py-2 px-3 text-xs font-bold uppercase tracking-wider transition-all ${
                      selectedDept === 'beauty_salon'
                        ? 'bg-[#7B2635] text-[#F5F0E8] shadow-xs'
                        : 'text-[#28201E]/70 hover:text-[#28201E]'
                    }`}
                  >
                    Beauty Salon
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedDept('barbershop'); setServiceId(''); }}
                    className={`py-2 px-3 text-xs font-bold uppercase tracking-wider transition-all ${
                      selectedDept === 'barbershop'
                        ? 'bg-[#7B2635] text-[#F5F0E8] shadow-xs'
                        : 'text-[#28201E]/70 hover:text-[#28201E]'
                    }`}
                  >
                    Barbershop
                  </button>
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#28201E] mb-1.5">
                  Select Service *
                </label>
                <select
                  required
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#EDE3D5] text-xs text-[#28201E] focus:border-[#7B2635] focus:outline-none"
                >
                  <option value="">-- Choose a service ({filteredServices.length} available) --</option>
                  {filteredServices.map(srv => (
                    <option key={srv.id} value={srv.id}>
                      {srv.title} ({srv.durationMinutes} min) - ${srv.priceUSD} USD / {srv.priceLRD.toLocaleString()} LRD
                    </option>
                  ))}
                </select>
              </div>

              {/* Staff / Specialist Preference */}
              {relevantStaff.length > 0 && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#28201E] mb-1.5">
                    Preferred Specialist / Therapist (Optional)
                  </label>
                  <select
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#EDE3D5] text-xs text-[#28201E] focus:border-[#7B2635] focus:outline-none"
                  >
                    <option value="">Any Available Professional</option>
                    {relevantStaff.map(st => (
                      <option key={st.id} value={st.id}>
                        {st.name} — {st.role}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#28201E] mb-1.5">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={minDateStr}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#EDE3D5] text-xs text-[#28201E] focus:border-[#7B2635] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#28201E] mb-1.5">
                    Preferred Time Slot *
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#EDE3D5] text-xs text-[#28201E] focus:border-[#7B2635] focus:outline-none"
                  >
                    {TIME_SLOTS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer Contact */}
              <div className="pt-3 border-t border-[#EDE3D5] space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#C85B35]">
                  Your Contact Information
                </p>

                <div>
                  <input
                    type="text"
                    required
                    placeholder="Full Name *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#EDE3D5] text-xs text-[#28201E] focus:border-[#7B2635] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#EDE3D5] text-xs text-[#28201E] focus:border-[#7B2635] focus:outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp #"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#EDE3D5] text-xs text-[#28201E] focus:border-[#7B2635] focus:outline-none"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email Address (Optional)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#EDE3D5] text-xs text-[#28201E] focus:border-[#7B2635] focus:outline-none"
                  />
                </div>

                <div>
                  <textarea
                    rows={2}
                    placeholder="Additional notes (e.g. pressure preferences, wedding prep, sensitive skin)"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#EDE3D5] text-xs text-[#28201E] focus:border-[#7B2635] focus:outline-none resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-[#7B2635] hover:bg-[#641F2B] text-[#F5F0E8] font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 mt-2 shadow-xs"
              >
                {isSubmitting ? 'Checking Availability...' : 'Submit Appointment Request'}
              </button>

              <p className="text-[11px] text-[#28201E]/60 text-center font-light">
                *Times are held and confirmed by reception to prevent double booking.
              </p>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
