import { supabase } from './supabaseClient';

/**
 * Ask the server to send a web-push notification to registered admin devices.
 * A failed notification must never make a customer form submission fail.
 */
export async function notifyAdmins({ title, body, targetTab }) {
  const notification = {
    title,
    body,
    target_tab: targetTab,
  };

  const { error: storageError } = await supabase
    .from('admin_notifications')
    .insert([notification]);

  if (storageError) {
    console.warn('The form was saved, but the admin notification was not stored.', storageError);
  }

  const { error: pushError } = await supabase.functions.invoke('send-push', {
    body: { title, body, targetTab },
  });

  if (pushError) {
    console.warn('The form was saved, but the admin push notification was not sent.', pushError);
  }
}
