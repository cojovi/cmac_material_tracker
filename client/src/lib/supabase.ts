import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Client-side Supabase Configuration
 *
 * This module provides the Supabase client for browser-based operations
 * with automatic session management and token refresh.
 */

// Environment variable validation
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  throw new Error(
    'Missing VITE_SUPABASE_URL environment variable.\n' +
    'Please add it to your .env file:\n' +
    'VITE_SUPABASE_URL=https://your-project-ref.supabase.co\n\n' +
    'Get this from: Supabase Dashboard > Project Settings > API > Project URL'
  );
}

if (!SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing VITE_SUPABASE_ANON_KEY environment variable.\n' +
    'Please add it to your .env file:\n' +
    'VITE_SUPABASE_ANON_KEY=your-anon-key\n\n' +
    'Get this from: Supabase Dashboard > Project Settings > API > anon public key'
  );
}

/**
 * Supabase Client Instance
 *
 * This client is configured for browser use with:
 * - Automatic session persistence in localStorage
 * - Automatic token refresh
 * - RLS enforcement based on authenticated user
 *
 * Use this client for all frontend Supabase operations.
 */
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      // Persist session across browser refreshes
      persistSession: true,

      // Automatically refresh tokens before expiry
      autoRefreshToken: true,

      // Detect OAuth redirects
      detectSessionInUrl: true,

      // Use localStorage for session storage
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,

      // Flow type for authentication
      flowType: 'pkce',
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'X-Client-Info': 'material-tracker-client',
      },
    },
  }
);

/**
 * Type exports for better type inference
 */
export type { SupabaseClient, User, Session } from '@supabase/supabase-js';

/**
 * Authentication Helper Functions
 */

/**
 * Get current authenticated user
 * @returns Promise with user data or null if not authenticated
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Failed to get current user:', error.message);
      return null;
    }

    return user;
  } catch (err) {
    console.error('Error getting current user:', err);
    return null;
  }
}

/**
 * Get current session
 * @returns Promise with session data or null if no active session
 */
export async function getCurrentSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Failed to get session:', error.message);
      return null;
    }

    return session;
  } catch (err) {
    console.error('Error getting session:', err);
    return null;
  }
}

/**
 * Sign out the current user
 * @returns Promise<void>
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Failed to sign out:', error.message);
      throw error;
    }
  } catch (err) {
    console.error('Error during sign out:', err);
    throw err;
  }
}

/**
 * Subscribe to authentication state changes
 *
 * @param callback - Function to call when auth state changes
 * @returns Unsubscribe function
 *
 * @example
 * ```typescript
 * const unsubscribe = onAuthStateChange((event, session) => {
 *   console.log('Auth event:', event);
 *   console.log('Session:', session);
 * });
 *
 * // Later, when component unmounts
 * unsubscribe();
 * ```
 */
export function onAuthStateChange(
  callback: (event: string, session: any) => void
) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);

  // Return unsubscribe function
  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Check if user is authenticated
 * @returns Promise<boolean>
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentSession();
  return session !== null;
}

/**
 * Get access token for API calls
 * @returns Promise with access token or null
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    const session = await getCurrentSession();
    return session?.access_token || null;
  } catch (err) {
    console.error('Error getting access token:', err);
    return null;
  }
}

/**
 * Refresh the current session
 * @returns Promise with refreshed session or null
 */
export async function refreshSession() {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();

    if (error) {
      console.error('Failed to refresh session:', error.message);
      return null;
    }

    return session;
  } catch (err) {
    console.error('Error refreshing session:', err);
    return null;
  }
}
