import { supabase } from './supabaseClient';

/** 1. Submit Product Enquiry */
export async function submitProductEnquiry({ name, phone, productName, category }) {
  const { data, error } = await supabase
    .from('enquiries')
    .insert([
      {
        name,
        phone,
        product_name: productName,
        category: category || 'General',
        status: 'NEW'
      }
    ])
    .select();

  if (error) {
    console.error('Error submitting enquiry:', error.message);
    throw error;
  }
  return data;
}

/** 2. Submit Expert Call Request */
export async function submitCallRequest({ name, phone, productName }) {
  const { data, error } = await supabase
    .from('calls')
    .insert([
      {
        name,
        phone,
        product_name: productName || 'General Callback',
        status: 'PENDING'
      }
    ])
    .select();

  if (error) {
    console.error('Error submitting call request:', error.message);
    throw error;
  }
  return data;
}

/** Fetch product enquiries for Admin */
export async function fetchEnquiriesFromDB() {
  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data;
}

/** Fetch expert calls for Admin */
export async function fetchCallsFromDB() {
  const { data, error } = await supabase
    .from('calls')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data;
}