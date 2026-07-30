// src/hooks/usePageTracker.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

export function usePageTracker() {
  const location = useLocation();

  useEffect(() => {
    const trackVisit = async () => {
      // Create or fetch persistent unique Visitor ID
      let visitorId = localStorage.getItem('tytan_visitor_id');
      if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem('tytan_visitor_id', visitorId);
      }

      // Record visit once per session/mount
      const { error } = await supabase.from('page_visits').insert([{
        page_path: location.pathname,
        visitor_id: visitorId
      }]);

      if (error) console.error('Could not record page visit:', error);
    };

    trackVisit();
  }, [location.pathname]);
}
