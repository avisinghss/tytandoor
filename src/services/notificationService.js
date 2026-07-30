import { supabase } from './supabaseClient';

/**
 * Ask the server to send a web-push notification to registered admin devices.
 * A failed notification must never make a customer form submission fail.
 */
export async function notifyAdmins({ title, body, targetTab }) {
  const { error } = await supabase.functions.invoke('send-push', {
    body: { title, body, targetTab },
  });

  if (error) {
    console.warn('The form was saved, but the admin push notification was not sent.', error);
  }
}
