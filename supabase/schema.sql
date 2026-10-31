-- ==============================================================================
-- BOTTEGA RESTRO & MIAMI CLIPPER — SUPABASE POSTGRESQL PRODUCTION SCHEMA
-- Location: Oldroad Junction, Monrovia, Liberia
-- Departments: Bottega Restaurant, Bar Lounge, Miami Clipper Salon, Miami Barbershop
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
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
  tagline TEXT DEFAULT 'Premier Dining, Lounge & Luxury Grooming Destination',
  address TEXT NOT NULL DEFAULT 'Oldroad Junction, Monrovia, Liberia',
  phone TEXT NOT NULL DEFAULT '+231 77 449 9840',
  whatsapp_number TEXT NOT NULL DEFAULT '231774499840',
  email TEXT NOT NULL DEFAULT 'info@bottegarestro.com',
  opening_hours JSONB NOT NULL DEFAULT '{
    "restaurant": "Mon - Sun: 8:00 AM - 11:30 PM",
    "barLounge": "Daily: 4:00 PM - Late Night",
    "outsideBar": "Daily: 2:00 PM - Late Night (Live Sports & Music)",
    "beautySalon": "Mon - Sat: 9:00 AM - 9:00 PM | Sun: 12:00 PM - 8:00 PM",
    "barbershop": "Mon - Sat: 8:30 AM - 10:00 PM | Sun: 11:00 AM - 9:00 PM"
  }'::jsonb,
  social_links JSONB NOT NULL DEFAULT '{
    "tiktok": "https://tiktok.com/@bottegarestrolounge",
    "instagram": "https://instagram.com/bottega_restro_lounge",
    "facebook": "https://facebook.com/bottegarestrolounge"
  }'::jsonb,
  hero_title TEXT DEFAULT 'Bottega Restro & Miami Clipper',
  hero_headline TEXT DEFAULT 'Good Food. Great Company. Beautiful Experiences.',
  hero_subtext TEXT DEFAULT 'Four dedicated departments under one iconic roof at Oldroad Junction. Indulge in gourmet Liberian and continental cuisine, unwind at the indoor and outside bar lounge, and refresh at Miami Clipper Unisex Salon and Barbershop.',
  logo_url TEXT DEFAULT '/public/assets/aistudio/WhatsApp_Image_2026-10-28_at_10.07.05_PM_9115eed5.jpeg',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. MENU CATEGORIES & ITEMS
CREATE TABLE IF NOT EXISTS public.menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  section TEXT NOT NULL, -- 'restaurant', 'main_bar', 'outside_bar', 'wines', 'cocktails'
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.menu_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  section TEXT NOT NULL, -- 'restaurant', 'main_bar', 'outside_bar'
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

CREATE INDEX IF NOT EXISTS idx_menu_items_section ON public.menu_items(section);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON public.menu_items(is_available);

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

CREATE INDEX IF NOT EXISTS idx_food_orders_status ON public.food_orders(status);
CREATE INDEX IF NOT EXISTS idx_food_orders_created ON public.food_orders(created_at DESC);

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

CREATE INDEX IF NOT EXISTS idx_salon_services_dept ON public.salon_services(department);

-- 7. STAFF PROFILES & AVAILABILITY
CREATE TABLE IF NOT EXISTS public.staff_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  department service_department NOT NULL,
  role TEXT NOT NULL,
  photo_url TEXT,
  specialties TEXT[] DEFAULT ARRAY[]::TEXT[],
  bio TEXT,
  working_days TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']::TEXT[],
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

CREATE INDEX IF NOT EXISTS idx_bookings_date_time ON public.appointment_bookings(preferred_date, preferred_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.appointment_bookings(status);

-- 9. EVENTS & PROMOTIONS
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT,
  image_url TEXT,
  location TEXT DEFAULT 'Bottega Restro & Lounge, Oldroad Junction',
  ticket_info TEXT DEFAULT 'Free Admission · VIP Booths by Reservation',
  is_published BOOLEAN DEFAULT TRUE,
  is_archived BOOLEAN DEFAULT FALSE,
  tag TEXT DEFAULT 'Special',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. GALLERY ITEMS
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

-- ==============================================================================
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public Read-Only Access
CREATE POLICY "Public read website_settings" ON public.website_settings FOR SELECT USING (true);
CREATE POLICY "Public read menu_categories" ON public.menu_categories FOR SELECT USING (true);
CREATE POLICY "Public read menu_items" ON public.menu_items FOR SELECT USING (is_available = true);
CREATE POLICY "Public read salon_services" ON public.salon_services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read staff_profiles" ON public.staff_profiles FOR SELECT USING (is_available = true);
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (is_published = true);
CREATE POLICY "Public read gallery_items" ON public.gallery_items FOR SELECT USING (true);

-- Public Submissions (Orders, Appointments, Messages)
CREATE POLICY "Public insert orders" ON public.food_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert order_items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert bookings" ON public.appointment_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert enquiries" ON public.contact_enquiries FOR INSERT WITH CHECK (true);

-- Authenticated Staff Full Access
CREATE POLICY "Staff full access website_settings" ON public.website_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff full access menu_categories" ON public.menu_categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff full access menu_items" ON public.menu_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff full access food_orders" ON public.food_orders FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff full access order_items" ON public.order_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff full access salon_services" ON public.salon_services FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff full access staff_profiles" ON public.staff_profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff full access appointment_bookings" ON public.appointment_bookings FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff full access events" ON public.events FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff full access gallery_items" ON public.gallery_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff full access contact_enquiries" ON public.contact_enquiries FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff full access audit_logs" ON public.audit_logs FOR ALL TO authenticated USING (true);

-- ==============================================================================
-- 14. SEED INITIAL BOTTEGA RESTRO & MIAMI CLIPPER DATA
-- ==============================================================================

-- Initial Settings
INSERT INTO public.website_settings (business_name, tagline, address, phone, whatsapp_number, email)
VALUES (
  'Bottega Restro & Miami Clipper',
  'Premier Dining, Lounge & Luxury Grooming Destination',
  'Oldroad Junction, Monrovia, Liberia',
  '+231 77 449 9840',
  '231774499840',
  'info@bottegarestro.com'
) ON CONFLICT DO NOTHING;

-- Initial Restaurant & Bar Menu Items
INSERT INTO public.menu_items (name, description, section, category_name, price, currency, is_available, is_featured, variants, preparation_time)
VALUES
  ('Authentic Nimba Cuisine Special', 'Traditional Liberian Nimba county delicacy served with tender smoked meats, local country greens, and fragrant steamed country rice. Served fresh on Thursdays and Saturdays.', 'restaurant', 'Local Specialties', 15.00, 'USD', true, true, '["Smoked Meat & Fish", "Fresh Fish & Snails"]'::jsonb, '25-30 min'),
  ('Liberian Jollof Rice with Grilled Chicken', 'Smoky spiced party-style jollof rice cooked in rich tomato broth, served with fried plantains, coleslaw, and quarter seasoned grilled chicken.', 'restaurant', 'Rice & Grains', 12.00, 'USD', true, true, '["Grilled Chicken", "Fried Fish", "Assorted Beef"]'::jsonb, '20 min'),
  ('Bottega Signature Grilled Whole Croaker Fish', 'Freshly seasoned local Croaker fish grilled to golden perfection with spicy pepper sauce, roasted sweet plantains (dodo) or attieke.', 'restaurant', 'Grill & BBQ', 22.00, 'USD', true, true, '["Medium Croaker", "Jumbo Croaker (+$5)"]'::jsonb, '30-40 min'),
  ('Spicy Goat Meat Pepper Soup', 'Slow-simmered, aromatic Liberian pepper soup infused with fragrant herbs, habanero peppers, and tender goat cuts. Served piping hot.', 'restaurant', 'Soups', 10.00, 'USD', true, false, '["Extra Spicy", "Mild Pepper"]'::jsonb, '15 min'),
  ('Hennessy VS Cognac (Bottle)', 'Smooth French Cognac with subtle vanilla and toasted wood notes. Served with chilled mixer carafe and ice service in the Main Lounge.', 'main_bar', 'Cognac & Brandy', 120.00, 'USD', true, true, '["Full 750ml Bottle", "VIP Booth Bucket & 4 Mixers"]'::jsonb, 'Immediate'),
  ('Johnnie Walker Black Label 12 Yrs', 'Iconic blended Scotch whisky with rich notes of dark fruits and smoky signature finish.', 'main_bar', 'Whiskey', 85.00, 'USD', true, false, '["750ml Bottle", "Double Shot on the Rocks ($8)"]'::jsonb, 'Immediate'),
  ('Moët & Chandon Brut Impérial', 'Iconic Champagne with vibrant green apple and citrus fruitiness, fine bubbles, and elegant brioche finish.', 'main_bar', 'Champagne', 150.00, 'USD', true, true, '["Chilled 750ml Bottle"]'::jsonb, 'Immediate'),
  ('Chilled Club Beer (Cold Draught/Bottle)', 'Liberia’s favorite crisp and refreshing lager, served ice-cold at our open-air terrace bar garden.', 'outside_bar', 'Local Beers', 350.00, 'LRD', true, true, '["Single Cold Bottle", "Terrace Matchday Bucket of 6 (1,900 LRD)"]'::jsonb, 'Immediate'),
  ('Guinness Extra Stout (Foreign Extra)', 'Rich, bittersweet dark stout with roasted barley character. Served ice cold on the garden patio.', 'outside_bar', 'Stouts & Ales', 450.00, 'LRD', true, false, '["Chilled Bottle", "Bucket of 5 (2,100 LRD)"]'::jsonb, 'Immediate');

-- Initial Salon, Massage & Barber Services
INSERT INTO public.salon_services (department, category, title, duration_minutes, price_usd, price_lrd, description, is_popular, is_active)
VALUES
  ('massage', 'Body Therapy', 'Swedish Full-Body Relaxation Massage', 60, 45.00, 8550.00, 'Gentle rhythmic gliding strokes using warm botanical aromatherapy oils to dissolve muscle tension and restore circulation.', true, true),
  ('massage', 'Therapeutic', 'Deep Tissue Recovery Therapy', 75, 60.00, 11400.00, 'Targeted deep-pressure therapy addressing stubborn knots and chronic tension in the back, shoulders, and neck.', true, true),
  ('beauty_salon', 'Pedicure & Spa', 'Luxury Automated Pedicure Pod Treatment', 60, 35.00, 6650.00, 'Futuristic pod capsule experience with automated shiatsu back massage rollers, whirlpool warm herbal foot soak, exfoliation, and hot towel foot wrap.', true, true),
  ('beauty_salon', 'Hair Styling', 'Protective Knotless Braids (Medium Length)', 180, 50.00, 9500.00, 'Tension-free scalp-friendly knotless braids crafted with premium extensions. Includes scalp oiling and hot water dip finish.', true, true),
  ('barbershop', 'Haircuts', 'Signature Executive Barber Fade & Razor Edge-Up', 40, 12.00, 2280.00, 'Master taper or skin fade executed with UV-sterilized ceramic clippers, straight-razor crisp edging, and cooling scalp tonic.', true, true),
  ('barbershop', 'Beard Care', 'Hot Towel Beard Sculpting & Oil Conditioning', 30, 8.00, 1520.00, 'Steamed eucalyptus essential-oil towel treatment, razor beard boundary line-up, and organic shea-argan beard butter conditioning.', true, true);

-- Initial Staff Profiles
INSERT INTO public.staff_profiles (name, department, role, specialties, bio, working_days, working_hours, is_available)
VALUES
  ('Fatu Massaquoi', 'massage', 'Senior Licensed Massage Therapist', ARRAY['Swedish Relaxation', 'Deep Tissue', 'Hot Stone Massage'], 'Over 7 years of clinical wellness therapy across West Africa specializing in holistic muscular pain relief.', ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], '9:00 AM - 7:30 PM', true),
  ('Comfort Cooper', 'beauty_salon', 'Lead Hair Stylist & Pedicure Specialist', ARRAY['Knotless Braids', 'Pedicure Pod Operation', 'Lace Weave Installs'], 'Master beautician renowned for intricate braiding patterns and soothing foot spa care.', ARRAY['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], '9:30 AM - 8:00 PM', true),
  ('Prince Tarpeh', 'barbershop', 'Master Barber & Fade Artistry Specialist', ARRAY['Low/Mid/High Skin Fades', 'Razor Line Art', 'Steamed Towel Beard Care'], 'Recognized as one of Oldroad’s most meticulous craftsmen with over a decade of precision barbering experience.', ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], '8:30 AM - 9:30 PM', true);

-- Initial Events
INSERT INTO public.events (title, description, event_date, start_time, end_time, location, ticket_info, tag)
VALUES
  ('Authentic Nimba County Feast Days', 'Every Thursday and Saturday, our head chef prepares authentic Nimba county delicacies with locally sourced smoked meats and country greens.', 'Every Thu & Sat', '12:00 PM', '10:00 PM', 'Bottega Restaurant Main Dining Hall', 'Standard Menu Pricing · Walk-ins Welcome', 'Cultural Feast'),
  ('Afrobeats & Amapiano Rooftop Night', 'Celebrate the weekend with resident DJ spins, chilled Hennessy bottle service, and special VIP booth discounts.', 'Every Friday Night', '09:00 PM', '03:00 AM', 'Bottega Bar Lounge & Terrace', 'Free Admission · VIP Booths by Reservation', 'Nightlife'),
  ('Super Sunday Matchday Terrace Screening', 'Watch the biggest Premier League and Champions League fixtures on our dual HD screens at the breezy outside terrace bar with ice-cold Club Beer bucket deals.', 'Every Sunday', '02:00 PM', '09:30 PM', 'Outside Bar Garden Pergola', 'Free Entry · Matchday Beer Deals', 'Live Sports');
