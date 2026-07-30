// src/hooks/useAdminData.js
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const knownRecordIds = useRef(new Set());

  // Fetch Methods
  const fetchEnquiries = useCallback(async () => {
    const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
    if (!error && data) setEnquiries(data);
    return data || [];
  }, []);

  const fetchContactSubmissions = useCallback(async () => {
    const { data, error } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
    if (!error && data) setContactSubmissions(data);
    return data || [];
  }, []);

  const fetchCallRequests = useCallback(async () => {
    const { data, error } = await supabase.from('call_requests').select('*').order('created_at', { ascending: false });
    if (!error && data) setCallRequests(data);
    return data || [];
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
    return data || [];
  }, []);

  // Fetch All Initial Data
  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      const [initialEnquiries, initialContacts, initialCalls, , , , , initialWarrantyClaims] = await Promise.all([
        fetchEnquiries(),
        fetchContactSubmissions(),
        fetchCallRequests(),
        fetchStaff(),
        fetchProjects(),
        fetchProducts(),
        fetchCategories(),
        fetchWarrantyClaims(),
      ]);
      [...initialEnquiries, ...initialContacts, ...initialCalls, ...initialWarrantyClaims]
        .forEach((record) => knownRecordIds.current.add(`${record.id}`));
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

  // Fallback for projects where Realtime has not yet been enabled in Supabase.
  // It only alerts for records created after the dashboard has loaded.
  useEffect(() => {
    if (isLoading) return undefined;

    const notifyIfNew = (records, title, makeBody, targetTab) => {
      records.forEach((record) => {
        const id = `${record.id}`;
        if (!knownRecordIds.current.has(id)) {
          knownRecordIds.current.add(id);
          triggerNotification(title, makeBody(record), targetTab);
        }
      });
    };

    const checkForNewSubmissions = async () => {
      const [enquiriesResult, contactsResult, callsResult, warrantyResult] = await Promise.all([
        supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(25),
        supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(25),
        supabase.from('call_requests').select('*').order('created_at', { ascending: false }).limit(25),
        supabase.from('warranty_claims').select('*').order('created_at', { ascending: false }).limit(25),
      ]);

      const updates = [
        [enquiriesResult, setEnquiries, 'Enquiry', (item) => `You got a new enquiry from ${item.name || 'a customer'}.`, 'enquiries'],
        [contactsResult, setContactSubmissions, 'Contact Submission', (item) => `You got a new contact form submission from ${item.name || 'a user'}.`, 'enquiries'],
        [callsResult, setCallRequests, 'Call Request', (item) => `You got a new call request for ${item.phone || 'a phone number'}.`, 'calls'],
        [warrantyResult, setWarrantyClaims, 'Warranty Claim', (item) => `New claim request from ${item.full_name || 'a customer'}.`, 'warranty'],
      ];

      updates.forEach(([result, setRecords, title, makeBody, targetTab]) => {
        if (!result.error && result.data) {
          notifyIfNew(result.data, title, makeBody, targetTab);
          setRecords(result.data);
        }
      });
    };

    const intervalId = window.setInterval(checkForNewSubmissions, 15000);
    return () => window.clearInterval(intervalId);
  }, [isLoading, triggerNotification]);

  // Realtime Subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('admin-realtime-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'enquiries' }, (payload) => {
        console.log('Realtime INSERT on enquiries:', payload);
        knownRecordIds.current.add(`${payload.new.id}`);
        setEnquiries((prev) => [payload.new, ...prev]);
        triggerNotification('Enquiry', `You got a new enquiry from ${payload.new.name || 'a customer'}.`, 'enquiries');
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contact_submissions' }, (payload) => {
        console.log('Realtime INSERT on contact_submissions:', payload);
        knownRecordIds.current.add(`${payload.new.id}`);
        setContactSubmissions((prev) => [payload.new, ...prev]);
        triggerNotification('Contact Submission', `You got a new contact form submission from ${payload.new.name || 'a user'}.`, 'enquiries');
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'call_requests' }, (payload) => {
        console.log('Realtime INSERT on call_requests:', payload);
        knownRecordIds.current.add(`${payload.new.id}`);
        setCallRequests((prev) => [payload.new, ...prev]);
        triggerNotification('Call Request', `You got a new call request for ${payload.new.phone || 'a phone number'}.`, 'calls');
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'warranty_claims' }, (payload) => {
        console.log('Realtime INSERT on warranty_claims:', payload);
        knownRecordIds.current.add(`${payload.new.id}`);
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
