export const SUPABASE_SQL_MIGRATION = `-- ==============================================================================
-- BOTTEGA RESTRO & MIAMI CLIPPER — SUPABASE POSTGRESQL SCHEMA MIGRATION
-- Location: Oldroad Junction, Monrovia, Liberia
-- Departments: Bottega Restaurant, Bar Lounge, Miami Clipper Salon, Miami Barbershop
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('super_admin', 'content_editor', 'orders_staff', 'receptionist');
  CREATE TYPE currency_code AS ENUM ('USD', 'LRD');
  CREATE TYPE order_type AS ENUM ('dine_in', 'takeaway', 'delivery');
  CREATE TYPE order_status AS ENUM ('new', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled');
  CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'rescheduled', 'declined', 'completed');
  CREATE TYPE service_department AS ENUM ('beauty_salon', 'massage', 'barbershop');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. WEBSITE SETTINGS
CREATE TABLE IF NOT EXISTS public.website_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name TEXT NOT NULL DEFAULT 'Bottega Restro & Miami Clipper',
  tagline TEXT,
  address TEXT NOT NULL DEFAULT 'Oldroad Junction, Monrovia, Liberia',
  phone TEXT NOT NULL DEFAULT '+231 77 449 9840',
  whatsapp_number TEXT NOT NULL DEFAULT '231774499840',
  email TEXT NOT NULL DEFAULT 'info@bottegarestro.com',
  opening_hours JSONB NOT NULL DEFAULT '{}'::jsonb,
  social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
  hero_title TEXT,
  hero_headline TEXT,
  hero_subtext TEXT,
  logo_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. MENU CATEGORIES & PRODUCTS
CREATE TABLE IF NOT EXISTS public.menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  section TEXT NOT NULL, -- 'restaurant', 'main_bar', 'outside_bar', 'wines', 'cocktails', etc.
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.menu_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  section TEXT NOT NULL,
  category_name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  currency currency_code NOT NULL DEFAULT 'USD',
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  variants JSONB DEFAULT '[]'::jsonb,
  preparation_time TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. FOOD ORDERS & ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.food_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_ref TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  order_type order_type NOT NULL DEFAULT 'dine_in',
  delivery_address TEXT,
  order_notes TEXT,
  total_usd NUMERIC(10, 2) DEFAULT 0,
  total_lrd NUMERIC(10, 2) DEFAULT 0,
  status order_status NOT NULL DEFAULT 'new',
  payment_status TEXT DEFAULT 'pending_verification',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.food_orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  currency currency_code NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  selected_variant TEXT,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. SALON & BARBERSHOP SERVICES
CREATE TABLE IF NOT EXISTS public.salon_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department service_department NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 45,
  price_usd NUMERIC(10, 2) NOT NULL DEFAULT 0,
  price_lrd NUMERIC(10, 2) NOT NULL DEFAULT 0,
  description TEXT,
  image_url TEXT,
  requires_specialist BOOLEAN DEFAULT FALSE,
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. STAFF PROFILES & AVAILABILITY
CREATE TABLE IF NOT EXISTS public.staff_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  department service_department NOT NULL,
  role TEXT NOT NULL,
  photo_url TEXT,
  specialties TEXT[] DEFAULT ARRAY[]::TEXT[],
  bio TEXT,
  working_days TEXT[] DEFAULT ARRAY[]::TEXT[],
  working_hours TEXT DEFAULT '9:00 AM - 8:00 PM',
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. APPOINTMENT BOOKINGS
CREATE TABLE IF NOT EXISTS public.appointment_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_ref TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  email TEXT,
  department service_department NOT NULL,
  service_id UUID REFERENCES public.salon_services(id) ON DELETE RESTRICT,
  service_title TEXT NOT NULL,
  staff_id UUID REFERENCES public.staff_profiles(id) ON DELETE SET NULL,
  staff_name TEXT,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  additional_notes TEXT,
  status booking_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. EVENTS & PROMOTIONS
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT,
  image_url TEXT,
  location TEXT DEFAULT 'Bottega Restro & Lounge',
  ticket_info TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  is_archived BOOLEAN DEFAULT FALSE,
  tag TEXT DEFAULT 'Special',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. GALLERY
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. CONTACT ENQUIRIES
CREATE TABLE IF NOT EXISTS public.contact_enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read website_settings" ON public.website_settings FOR SELECT USING (true);
CREATE POLICY "Public read menu_items" ON public.menu_items FOR SELECT USING (is_available = true);
CREATE POLICY "Public read salon_services" ON public.salon_services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read staff_profiles" ON public.staff_profiles FOR SELECT USING (is_available = true);
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (is_published = true);
CREATE POLICY "Public read gallery_items" ON public.gallery_items FOR SELECT USING (true);

-- Public controlled submission policies
CREATE POLICY "Public insert orders" ON public.food_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert order_items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert bookings" ON public.appointment_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert enquiries" ON public.contact_enquiries FOR INSERT WITH CHECK (true);

-- Staff authenticated access
CREATE POLICY "Staff full access website_settings" ON public.website_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff full access menu_items" ON public.menu_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff full access food_orders" ON public.food_orders FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff full access order_items" ON public.order_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff full access bookings" ON public.appointment_bookings FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff full access services" ON public.salon_services FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff full access staff" ON public.staff_profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff full access events" ON public.events FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff full access gallery" ON public.gallery_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff full access enquiries" ON public.contact_enquiries FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff full access audit_logs" ON public.audit_logs FOR ALL TO authenticated USING (true);
`;

export const FUTURE_BMS_INTEGRATION_SPEC = {
  architectureOverview: `
Bottega Restro & Miami Clipper operates as an independent public web portal with a decoupled REST/Webhook integration bridge for the upcoming Business Management System (BMS).

Integration Points:
1. Catalog Sync (BMS -> Website): BMS transmits approved menu items, availability status, and dual-currency price updates.
2. Orders Transmission (Website -> BMS): New online orders are pushed via HMAC-authenticated webhook to BMS Kitchen Display and POS with order reference and customer details.
3. Appointments Bridge (Website <-> BMS): Website pushes pending appointment requests for massage, salon, and barber services; BMS checks staff shifts and returns confirmation/status callbacks.
4. Bar Price List Synchronization: Separate BMS endpoints for Main Bar vs Outside Bar to ensure real-time inventory deduction and pricing alignment.
`,
  endpoints: [
    {
      method: 'POST',
      path: '/api/v1/bms/orders/sync',
      description: 'Pushes verified online food order to BMS kitchen queue and POS receipt printer.',
      samplePayload: {
        orderRef: 'BOT-2026-7841',
        channel: 'website_ordering',
        customer: { name: 'Marcus Barclay', phone: '+231 88 650 1234' },
        type: 'delivery',
        currencyAmounts: { USD: 34.00, LRD: 0 },
        items: [{ sku: 'food-3', qty: 1, variant: 'Medium Croaker' }]
      }
    },
    {
      method: 'POST',
      path: '/api/v1/bms/bookings/sync',
      description: 'Pushes massage/salon appointment to BMS appointment calendar.',
      samplePayload: {
        bookingRef: 'MIA-2026-3301',
        department: 'massage',
        serviceId: 'srv-1',
        staffId: 'staff-1',
        requestedDate: '2026-11-02',
        timeSlot: '02:00 PM'
      }
    },
    {
      method: 'GET',
      path: '/api/v1/bms/catalog/diff',
      description: 'Pulls current availability flags and price changes from BMS for Main Bar, Outside Bar, and Kitchen.'
    }
  ]
};
