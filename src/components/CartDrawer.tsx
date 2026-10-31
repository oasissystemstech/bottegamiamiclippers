import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  CheckCircle2, 
  MessageCircle, 
  ArrowRight
} from 'lucide-react';
import { CartItem, OrderType, BusinessSettings, Order } from '../types';
import { StorageService } from '../services/storage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  settings: BusinessSettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  updateQuantity,
  removeFromCart,
  clearCart,
  settings,
}) => {
  const [orderType, setOrderType] = useState<OrderType>('dine_in');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate separate totals preserving currencies
  const totalUSD = cart.reduce((acc, item) => {
    if (item.menuItem.currency === 'USD') {
      return acc + (item.menuItem.price * item.quantity);
    }
    return acc;
  }, 0);

  const totalLRD = cart.reduce((acc, item) => {
    if (item.menuItem.currency === 'LRD') {
      return acc + (item.menuItem.price * item.quantity);
    }
    return acc;
  }, 0);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!phone.trim()) {
      setError('Please provide your phone number.');
      return;
    }
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setError('Please provide a delivery address in Monrovia.');
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      whatsapp: (whatsapp.trim() || phone.trim()),
      orderType,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
      orderNotes: orderNotes.trim() || undefined,
      items: cart.map(item => ({
        menuItemId: item.menuItem.id,
        name: item.menuItem.name,
        price: item.menuItem.price,
        currency: item.menuItem.currency,
        quantity: item.quantity,
        selectedVariant: item.selectedVariant,
        specialInstructions: item.specialInstructions,
      })),
      totalUSD,
      totalLRD,
    };

    const newOrder = StorageService.createOrder(orderData);
    setSubmittedOrder(newOrder);
    clearCart();
    setIsSubmitting(false);
  };

  const handleWhatsAppNotify = (order: Order) => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const itemsList = order.items
      .map(i => `• ${i.quantity}x ${i.name}${i.selectedVariant ? ` (${i.selectedVariant})` : ''} - ${i.currency === 'USD' ? `$${i.price}` : `LRD ${i.price}`}`)
      .join('\n');

    let totalStr = '';
    if (order.totalUSD > 0) totalStr += `$${order.totalUSD.toFixed(2)} USD `;
    if (order.totalLRD > 0) totalStr += `${order.totalLRD.toLocaleString()} LRD`;

    const message = `Hello Bottega Restro! I just placed an online food order.
Order Reference: ${order.orderRef}
Customer: ${order.customerName}
Phone: ${order.phone}
Order Type: ${order.orderType.toUpperCase()}
${order.deliveryAddress ? `Delivery Address: ${order.deliveryAddress}\n` : ''}${order.orderNotes ? `Notes: ${order.orderNotes}\n` : ''}
Items:
${itemsList}

Total: ${totalStr}

Please confirm preparation and delivery details!`;

    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const resetDrawer = () => {
    setSubmittedOrder(null);
    setCustomerName('');
    setPhone('');
    setWhatsapp('');
    setDeliveryAddress('');
    setOrderNotes('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-[#28201E]/60 backdrop-blur-xs transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-8">
        <div className="w-screen max-w-md bg-[#F5F0E8] border-l border-[#EDE3D5] shadow-2xl flex flex-col text-[#28201E]">
          
          {/* Header */}
          <div className="p-5 border-b border-[#EDE3D5] flex items-center justify-between bg-[#F5F0E8]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#7B2635] text-[#F5F0E8] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-normal text-[#28201E]">
                  {submittedOrder ? 'Order Confirmed' : 'Your Order Bag'}
                </h3>
                <p className="text-xs text-[#28201E]/60 font-light">
                  {submittedOrder ? 'Dispatched to Bottega Kitchen Queue' : `${cart.length} item${cart.length === 1 ? '' : 's'} selected`}
                </p>
              </div>
            </div>
            <button
              onClick={submittedOrder ? resetDrawer : onClose}
              className="p-2 text-[#28201E]/50 hover:text-[#28201E] hover:bg-[#EDE3D5] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* SUCCESS VIEW */}
            {submittedOrder ? (
              <div className="space-y-6 text-center py-4 animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-[#25d366]/20 text-[#168a3e] flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                
                <div>
                  <span className="text-[11px] text-[#C85B35] uppercase tracking-widest font-bold">
                    Order Registered
                  </span>
                  <h4 className="font-serif text-2xl font-normal text-[#28201E] mt-1">
                    {submittedOrder.orderRef}
                  </h4>
                  <p className="text-xs text-[#28201E]/80 mt-2 max-w-xs mx-auto font-light">
                    Thank you, <span className="text-[#28201E] font-medium">{submittedOrder.customerName}</span>! Your order has been placed with Bottega Restro.
                  </p>
                </div>

                <div className="p-5 bg-[#EDE3D5]/60 border border-[#EDE3D5] text-left text-xs space-y-2.5 font-light">
                  <div className="flex justify-between text-[#28201E]/70">
                    <span>Order Type:</span>
                    <span className="text-[#28201E] font-medium uppercase">{submittedOrder.orderType}</span>
                  </div>
                  <div className="flex justify-between text-[#28201E]/70">
                    <span>Phone:</span>
                    <span className="text-[#28201E] font-medium">{submittedOrder.phone}</span>
                  </div>
                  {submittedOrder.deliveryAddress && (
                    <div className="flex justify-between text-[#28201E]/70">
                      <span>Delivery:</span>
                      <span className="text-[#28201E] text-right font-medium">{submittedOrder.deliveryAddress}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-[#EDE3D5] flex justify-between font-serif text-sm">
                    <span className="text-[#28201E]">Total Due:</span>
                    <span className="text-[#7B2635] tabular-nums font-bold">
                      {submittedOrder.totalUSD > 0 && `$${submittedOrder.totalUSD.toFixed(2)} USD `}
                      {submittedOrder.totalLRD > 0 && `${submittedOrder.totalLRD.toLocaleString()} LRD`}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-[#25d366]/10 border border-[#25d366]/25 text-left text-xs text-[#28201E] space-y-1">
                  <p className="font-bold text-[#168a3e] flex items-center gap-1.5 font-serif text-sm">
                    <MessageCircle className="w-4 h-4" /> Next Step: Confirm on WhatsApp
                  </p>
                  <p className="text-[11px] leading-relaxed text-[#28201E]/75 font-light">
                    Tap below to send this order summary directly to our kitchen staff on WhatsApp for expedited preparation and delivery dispatch.
                  </p>
                </div>

                <button
                  onClick={() => handleWhatsAppNotify(submittedOrder)}
                  className="w-full py-3.5 px-4 bg-[#25d366] hover:bg-[#20be5a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  Send Order via WhatsApp
                </button>

                <button
                  onClick={resetDrawer}
                  className="w-full py-2.5 text-xs font-semibold text-[#28201E]/60 hover:text-[#28201E] transition-colors"
                >
                  Done / Close Order Bag
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className="w-12 h-12 bg-[#EDE3D5] text-[#28201E]/40 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-xl font-normal text-[#28201E]">Your Order Bag is Empty</h4>
                <p className="text-xs text-[#28201E]/70 max-w-xs mx-auto font-light">
                  Browse our authentic dishes, grilled specialties, stone-baked pizzas, and bar refreshments.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7B2635] hover:underline"
                >
                  Explore Dining Menu <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#28201E]/60 font-light">
                    <span>Itemized Selection</span>
                    <button 
                      onClick={clearCart}
                      className="text-[#C85B35] hover:text-[#641F2B] font-medium transition-colors"
                    >
                      Clear all
                    </button>
                  </div>

                  {cart.map((item) => (
                    <div 
                      key={item.id}
                      className="p-4 bg-[#EDE3D5]/50 border border-[#EDE3D5] space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-serif text-sm font-normal text-[#28201E]">
                            {item.menuItem.name}
                          </h4>
                          {item.selectedVariant && (
                            <span className="text-[11px] text-[#C85B35] font-medium">
                              Variant: {item.selectedVariant}
                            </span>
                          )}
                        </div>
                        <span className="font-serif text-sm font-bold text-[#7B2635] tabular-nums whitespace-nowrap">
                          {item.menuItem.currency === 'USD' ? `$${(item.menuItem.price * item.quantity).toFixed(2)}` : `${(item.menuItem.price * item.quantity).toLocaleString()} LRD`}
                        </span>
                      </div>

                      {item.specialInstructions && (
                        <p className="text-[11px] text-[#28201E]/80 italic bg-white/70 p-2 border border-[#EDE3D5]">
                          "{item.specialInstructions}"
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1 bg-white border border-[#EDE3D5] p-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 text-[#28201E]/70 hover:text-[#28201E] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-[#28201E] tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 text-[#28201E]/70 hover:text-[#28201E] transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-[#28201E]/40 hover:text-[#C85B35] transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal Summary with Dual Currencies */}
                <div className="p-4 bg-[#EDE3D5]/60 border border-[#EDE3D5] space-y-2 text-xs font-light">
                  <div className="flex justify-between text-[#28201E]/75">
                    <span>Subtotal USD Items:</span>
                    <span className="text-[#28201E] font-serif font-bold tabular-nums">
                      ${totalUSD.toFixed(2)} USD
                    </span>
                  </div>
                  <div className="flex justify-between text-[#28201E]/75">
                    <span>Subtotal LRD Items:</span>
                    <span className="text-[#28201E] font-serif font-bold tabular-nums">
                      {totalLRD.toLocaleString()} LRD
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#EDE3D5] text-[11px] text-[#28201E]/60">
                    *Charges are collected in the designated currency upon dining or delivery.
                  </div>
                </div>

                {/* Checkout Customer Form */}
                <form onSubmit={handleSubmitOrder} className="space-y-4 pt-2 font-light text-xs">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#C85B35]">
                    Order Details & Contact
                  </h4>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-600">
                      {error}
                    </div>
                  )}

                  {/* Order Type Selector */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#28201E] mb-1.5">
                      Fulfillment Mode
                    </label>
                    <div className="grid grid-cols-3 gap-2 bg-[#EDE3D5]/60 p-1.5 border border-[#EDE3D5]">
                      {(['dine_in', 'takeaway', 'delivery'] as OrderType[]).map((type) => (
                        <button
                          type="button"
                          key={type}
                          onClick={() => setOrderType(type)}
                          className={`py-2 px-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                            orderType === type
                              ? 'bg-[#7B2635] text-[#F5F0E8] shadow-xs'
                              : 'text-[#28201E]/70 hover:text-[#28201E]'
                          }`}
                        >
                          {type === 'dine_in' ? 'Dine-In' : type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#28201E] mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Marcus Barclay"
                      className="w-full px-4 py-2.5 bg-white border border-[#EDE3D5] text-xs text-[#28201E] focus:border-[#7B2635] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#28201E] mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+231 77..."
                        className="w-full px-4 py-2.5 bg-white border border-[#EDE3D5] text-xs text-[#28201E] focus:border-[#7B2635] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#28201E] mb-1">
                        WhatsApp (if diff.)
                      </label>
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="WhatsApp #"
                        className="w-full px-4 py-2.5 bg-white border border-[#EDE3D5] text-xs text-[#28201E] focus:border-[#7B2635] focus:outline-none"
                      />
                    </div>
                  </div>

                  {orderType === 'delivery' && (
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#28201E] mb-1">
                        Delivery Address in Monrovia *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="e.g. 12th Street Sinkor, Tubman Blvd, Landmark or Gate color"
                        className="w-full px-4 py-2.5 bg-white border border-[#EDE3D5] text-xs text-[#28201E] focus:border-[#7B2635] focus:outline-none resize-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#28201E] mb-1">
                      Kitchen Preparation / Table Notes
                    </label>
                    <input
                      type="text"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="e.g. Table 5 outside, extra pepper sauce, etc."
                      className="w-full px-4 py-2.5 bg-white border border-[#EDE3D5] text-xs text-[#28201E] focus:border-[#7B2635] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 bg-[#7B2635] hover:bg-[#641F2B] text-[#F5F0E8] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-xs"
                  >
                    {isSubmitting ? 'Submitting Order...' : 'Submit Food Order'}
                  </button>
                </form>
              </>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
