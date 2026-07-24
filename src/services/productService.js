import { supabase } from './supabaseClient';

// Get All Categories
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data;
};

// Get All Products
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data;
};

// Get Products By Category Slug
export const getProductsByCategory = async (categorySlug) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('categorySlug', categorySlug);

  if (error) {
    console.error('Error fetching category products:', error);
    return [];
  }
  return data;
};