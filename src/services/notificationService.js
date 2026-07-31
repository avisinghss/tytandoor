import { supabase } from './supabaseClient';

/**
 * Store an alert. A database webhook sends push messages server-to-server.
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

}
