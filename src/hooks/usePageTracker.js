// src/hooks/usePageTracker.js
import { useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export function usePageTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      // Create or fetch persistent unique Visitor ID
      let visitorId = localStorage.getItem('tytan_visitor_id');
      if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem('tytan_visitor_id', visitorId);
      }

      // Record visit once per session/mount
      await supabase.from('page_visits').insert([{
        page_path: window.location.pathname,
        visitor_id: visitorId
      }]);
    };

    trackVisit();
  }, []);
}