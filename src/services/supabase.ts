import { createClient } from '@supabase/supabase-js';
import { Order, AppointmentBooking, ContactEnquiry, MenuItem, BusinessSettings } from '../types';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://sdlyhrzhhccinvxvswou.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkbHlocnpoaGNjaW52eHZzd291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0NTUzMzQsImV4cCI6MjEwOTAzMTMzNH0.tQnb6bXzGhsY40iaFgMN9xg1Qzqeuis5x_R02vVp3Mg';

// Clean standard Supabase base URL (strip trailing /rest/v1/ if present)
const normalizedUrl = SUPABASE_URL.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');

export const supabase = createClient(normalizedUrl, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const SupabaseService = {
  /**
   * Health check to test Supabase connection and table presence
   */
  async checkConnection(): Promise<{ connected: boolean; message: string; projectRef: string; timestamp: string }> {
    const projectRef = 'sdlyhrzhhccinvxvswou';
    try {
      const start = performance.now();
      const { data, error } = await supabase.from('website_settings').select('business_name').limit(1);
      const latency = Math.round(performance.now() - start);

      if (error) {
        // Check if error is table not created yet vs bad auth
        if (error.code === '42P01' || error.message.includes('relation') || error.message.includes('does not exist')) {
          return {
            connected: true,
            message: `Connected to Supabase project (${latency}ms)! Database tables need to be created by executing /supabase/schema.sql in the SQL Editor.`,
            projectRef,
            timestamp: new Date().toISOString(),
          };
        }
        return {
          connected: false,
          message: `Connection error: ${error.message}`,
          projectRef,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        connected: true,
        message: `Connected to Supabase live database (${latency}ms). Schema & tables are active!`,
        projectRef,
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      return {
        connected: false,
        message: `Failed to reach Supabase: ${err.message || String(err)}`,
        projectRef,
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Sync online food order into Supabase
   */
  async syncOrder(order: Order): Promise<boolean> {
    try {
      // 1. Insert parent order
      const { data: orderRow, error: orderError } = await supabase
        .from('food_orders')
        .insert({
          order_ref: order.orderRef,
          customer_name: order.customerName,
          phone: order.phone,
          whatsapp: order.whatsapp,
          order_type: order.orderType,
          delivery_address: order.deliveryAddress,
          order_notes: order.orderNotes,
          total_usd: order.totalUSD,
          total_lrd: order.totalLRD,
          status: order.status,
          payment_status: order.paymentStatus,
        })
        .select()
        .single();

      if (orderError) {
        console.warn('Supabase order insert note:', orderError.message);
        return false;
      }

      // 2. Insert itemized lines
      if (orderRow && order.items.length > 0) {
        const orderItems = order.items.map(item => ({
          order_id: orderRow.id,
          item_name: item.name,
          unit_price: item.price,
          currency: item.currency,
          quantity: item.quantity,
          selected_variant: item.selectedVariant || null,
          special_instructions: item.specialInstructions || null,
        }));

        await supabase.from('order_items').insert(orderItems);
      }

      return true;
    } catch (err) {
      console.warn('Supabase syncOrder error (local storage preserved):', err);
      return false;
    }
  },

  /**
   * Sync appointment booking into Supabase
   */
  async syncBooking(booking: AppointmentBooking): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('appointment_bookings')
        .insert({
          booking_ref: booking.bookingRef,
          customer_name: booking.customerName,
          phone: booking.phone,
          whatsapp: booking.whatsapp,
          email: booking.email || null,
          department: booking.department,
          service_title: booking.serviceTitle,
          staff_name: booking.staffName,
          preferred_date: booking.preferredDate,
          preferred_time: booking.preferredTime,
          additional_notes: booking.additionalNotes || null,
          status: booking.status,
        });

      if (error) {
        console.warn('Supabase booking insert note:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase syncBooking error (local storage preserved):', err);
      return false;
    }
  },

  /**
   * Sync customer contact enquiry into Supabase
   */
  async syncEnquiry(enquiry: ContactEnquiry): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('contact_enquiries')
        .insert({
          name: enquiry.name,
          contact: enquiry.contact,
          category: enquiry.category,
          message: enquiry.message,
          status: enquiry.status || 'new',
        });

      if (error) {
        console.warn('Supabase enquiry insert note:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase syncEnquiry error (local storage preserved):', err);
      return false;
    }
  },

  /**
   * Fetch live menu items from Supabase if table exists
   */
  async fetchLiveMenuItems(): Promise<MenuItem[] | null> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) return null;

      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description || '',
        section: row.section,
        category: row.category_name,
        price: Number(row.price),
        currency: row.currency,
        image: row.image_url,
        isAvailable: row.is_available,
        isFeatured: row.is_featured,
        variants: Array.isArray(row.variants) ? row.variants : [],
        preparationTime: row.preparation_time,
      }));
    } catch (err) {
      console.warn('Supabase fetchLiveMenuItems error (local catalog active):', err);
      return null;
    }
  },

  /**
   * Upload an image to Supabase Storage bucket 'website-media'
   * Falls back gracefully if bucket does not yet exist
   */
  async uploadStorageImage(
    folder: string,
    file: File | Blob,
    fileName: string
  ): Promise<{ success: boolean; url?: string; publicUrl?: string; error?: string }> {
    try {
      const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const cleanFolder = folder.replace(/^\/+|\/+$/g, '');
      const storagePath = `${cleanFolder}/${Date.now()}_${sanitizedName}`;

      const { data, error } = await supabase.storage
        .from('website-media')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      const { data: publicUrlData } = supabase.storage
        .from('website-media')
        .getPublicUrl(data.path);

      return {
        success: true,
        url: publicUrlData.publicUrl,
        publicUrl: publicUrlData.publicUrl,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || String(err),
      };
    }
  },

  /**
   * Remove an image from Supabase Storage bucket
   */
  async deleteStorageImage(path: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from('website-media')
        .remove([path]);
      return !error;
    } catch {
      return false;
    }
  },
};
