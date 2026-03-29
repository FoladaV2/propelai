import { supabase } from '../lib/supabaseClient';

export interface Listing {
  id?: string;
  created_at?: string;
  user_id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_footage: number;
  property_type: string;
  description?: string;
  status: 'Draft' | 'AI Optimized' | 'Published';
  image_url?: string;
  ai_assets?: {
    instagramCaption?: string;
    linkedInBlurb?: string;
    enhancedImagePrompt?: string;
    enhancedImages?: string[];
  };
}

export const listingService = {
  async getListings() {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Listing[];
  },

  async createListing(listing: Omit<Listing, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('listings')
      .insert([listing])
      .select()
      .single();

    if (error) throw error;
    return data as Listing;
  },

  async updateListing(id: string, updates: Partial<Listing>) {
    const { data, error } = await supabase
      .from('listings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Listing;
  },

  async deleteListing(id: string) {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async uploadPropertyImage(file: File, path: string) {
    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(path, file);

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(data.path);
      
    return publicUrl;
  }
};
