CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.tracked_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  business_name text NOT NULL,
  product_name text,
  destination_url text NOT NULL,
  commission_rate numeric(5,2) NOT NULL DEFAULT 0,
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tracked_links TO authenticated;
GRANT ALL ON public.tracked_links TO service_role;
ALTER TABLE public.tracked_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage tracked links" ON public.tracked_links FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_tracked_links_updated BEFORE UPDATE ON public.tracked_links
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.link_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id uuid NOT NULL REFERENCES public.tracked_links(id) ON DELETE CASCADE,
  referrer text,
  user_agent text,
  country text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_link_clicks_link_id ON public.link_clicks(link_id);
GRANT SELECT ON public.link_clicks TO authenticated;
GRANT ALL ON public.link_clicks TO service_role;
ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read clicks" ON public.link_clicks FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id uuid NOT NULL REFERENCES public.tracked_links(id) ON DELETE CASCADE,
  amount numeric(12,2) NOT NULL,
  commission numeric(12,2) NOT NULL DEFAULT 0,
  customer_name text,
  note text,
  status text NOT NULL DEFAULT 'pending',
  occurred_on date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_sales_link_id ON public.sales(link_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sales TO authenticated;
GRANT ALL ON public.sales TO service_role;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage sales" ON public.sales FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_sales_updated BEFORE UPDATE ON public.sales
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();