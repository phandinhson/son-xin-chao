import { createClient } from "@supabase/supabase-js";

// Browser client (dùng trong admin pages client-side)
// Dùng fallback để tránh crash khi build (env vars chưa được inject)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"
);

// Admin client với service role (chỉ dùng trong API routes server-side)
export const supabaseAdmin = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

// Types
export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
};

export type Portfolio = {
  id: string;
  title: string;
  industry: string;
  category: "SEO" | "Ads" | "Website";
  result: string;
  detail: string;
  tags: string[];
  metric_before: string;
  metric_after: string;
  metric_unit: string;
  icon: string;
  color: string;
  sort_order: number;
  active: boolean;
  created_at: string;
};

export type Pricing = {
  id: string;
  name: string;
  icon: string;
  price: string;
  unit: string;
  description: string;
  features: string[];
  not_included: string[];
  is_popular: boolean;
  cta_text: string;
  sort_order: number;
};

export type SiteSetting = {
  key: string;
  value: string;
  updated_at: string;
};
