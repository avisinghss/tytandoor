// src/hooks/useAdminData.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';

export function useAdminData(triggerNotification) {
  const [isLoading, setIsLoading] = useState(true);

  // Data States
  const [enquiries, setEnquiries] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [callRequests, setCallRequests] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [projects, setProjects] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [warrantyClaims, setWarrantyClaims] = useState([]);

  // Fetch Methods
  const fetchEnquiries = useCallback(async () => {
    const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
    if (!error && data) setEnquiries(data);
  }, []);

  const fetchContactSubmissions = useCallback(async () => {
    const { data, error } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
    if (!error && data) setContactSubmissions(data);
  }, []);

  const fetchCallRequests = useCallback(async () => {
    const { data, error } = await supabase.from('call_requests').select('*').order('created_at', { ascending: false });
    if (!error && data) setCallRequests(data);
  }, []);

  const fetchStaff = useCallback(async () => {
    const { data, error } = await supabase.from('staff').select('*').order('created_at', { ascending: false });
    if (!error && data) setStaffList(data);
  }, []);

  const fetchProjects = useCallback(async () => {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (!error && data) setProjects(data);
  }, []);

  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error && data) setProducts(data);
  }, []);

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
    if (!error && data) setCategories(data);
  }, []);

  const fetchWarrantyClaims = useCallback(async () => {
    const { data, error } = await supabase.from('warranty_claims').select('*').order('created_at', { ascending: false });
    if (!error && data) setWarrantyClaims(data);
  }, []);

  // Fetch All Initial Data
  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchEnquiries(),
        fetchContactSubmissions(),
        fetchCallRequests(),
        fetchStaff(),
        fetchProjects(),
        fetchProducts(),
        fetchCategories(),
        fetchWarrantyClaims(),
      ]);
      setIsLoading(false);
    };
    fetchAll();
  }, [
    fetchEnquiries,
    fetchContactSubmissions,
    fetchCallRequests,
    fetchStaff,
    fetchProjects,
    fetchProducts,
    fetchCategories,
    fetchWarrantyClaims,
  ]);

  // Realtime Subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('admin-realtime-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'enquiries' }, (payload) => {
        console.log('Realtime INSERT on enquiries:', payload);
        setEnquiries((prev) => [payload.new, ...prev]);
        triggerNotification('Enquiry', `You got a new enquiry from ${payload.new.name || 'a customer'}.`, 'enquiries');
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contact_submissions' }, (payload) => {
        console.log('Realtime INSERT on contact_submissions:', payload);
        setContactSubmissions((prev) => [payload.new, ...prev]);
        triggerNotification('Contact Submission', `You got a new contact form submission from ${payload.new.name || 'a user'}.`, 'enquiries');
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'call_requests' }, (payload) => {
        console.log('Realtime INSERT on call_requests:', payload);
        setCallRequests((prev) => [payload.new, ...prev]);
        triggerNotification('Call Request', `You got a new call request for ${payload.new.phone || 'a phone number'}.`, 'calls');
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'warranty_claims' }, (payload) => {
        console.log('Realtime INSERT on warranty_claims:', payload);
        setWarrantyClaims((prev) => [payload.new, ...prev]);
        triggerNotification('Warranty Claim', `New claim request from ${payload.new.full_name || 'a customer'}.`, 'warranty');
      })
      .subscribe((status, err) => {
        console.log(`Supabase Realtime status: ${status}`);
        if (err) console.error('Realtime subscription error:', err);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [triggerNotification]);

  const combinedInquiries = [
    ...enquiries.map((item) => ({ ...item, sourceType: 'enquiry' })),
    ...contactSubmissions.map((item) => ({ ...item, sourceType: 'contact_submission' })),
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return {
    isLoading,
    enquiries,
    contactSubmissions,
    callRequests,
    staffList,
    projects,
    products,
    categories,
    warrantyClaims,
    combinedInquiries,
    setProducts,
    setWarrantyClaims,
    fetchEnquiries,
    fetchContactSubmissions,
    fetchCallRequests,
    fetchStaff,
    fetchProjects,
    fetchProducts,
    fetchCategories,
    fetchWarrantyClaims,
  };
}