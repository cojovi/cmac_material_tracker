import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase Configuration
 *
 * This module provides two Supabase clients for server-side operations:
 * 1. supabaseAdmin - Admin client with service role key for privileged operations
 * 2. getSupabaseClient() - Factory function for user-scoped clients with RLS enforcement
 */

// Environment variable validation
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  throw new Error(
    'Missing SUPABASE_URL environment variable. Please add it to your .env file.\n' +
    'Get this from: Supabase Dashboard > Project Settings > API > Project URL'
  );
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    'Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Please add it to your .env file.\n' +
    'Get this from: Supabase Dashboard > Project Settings > API > service_role key (secret)\n' +
    'WARNING: Keep this key secret! It bypasses Row Level Security.'
  );
}

if (!SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing SUPABASE_ANON_KEY environment variable. Please add it to your .env file.\n' +
    'Get this from: Supabase Dashboard > Project Settings > API > anon public key'
  );
}

/**
 * Admin Supabase Client
 *
 * Uses the service role key which bypasses Row Level Security (RLS).
 * Use this ONLY for:
 * - Administrative operations
 * - Background jobs
 * - System-level tasks
 * - Operations that need to bypass RLS
 *
 * DO NOT use for user-facing operations as it bypasses all security policies.
 */
export const supabaseAdmin: SupabaseClient = createClient(
  SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    db: {
      schema: 'public',
    },
  }
);

/**
 * Create a user-scoped Supabase client
 *
 * This factory function creates a Supabase client with a user's access token,
 * ensuring Row Level Security (RLS) policies are enforced.
 *
 * @param accessToken - User's JWT access token from authentication
 * @returns SupabaseClient configured for the authenticated user
 *
 * @example
 * ```typescript
 * // In Express middleware
 * const userClient = getSupabaseClient(req.user.accessToken);
 * const { data, error } = await userClient
 *   .from('materials')
 *   .select('*')
 *   .eq('company_id', req.user.companyId);
 * ```
 */
export function getSupabaseClient(accessToken: string): SupabaseClient {
  if (!accessToken || typeof accessToken !== 'string') {
    throw new Error(
      'Invalid access token provided to getSupabaseClient. ' +
      'Expected a non-empty string JWT token.'
    );
  }

  return createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    db: {
      schema: 'public',
    },
  });
}

/**
 * Type exports for better type inference
 */
export type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Helper function to check Supabase connection health
 *
 * @returns Promise<boolean> - true if connection is healthy
 */
export async function checkSupabaseHealth(): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from('materials').select('count').limit(1);
    return !error;
  } catch (err) {
    console.error('Supabase health check failed:', err);
    return false;
  }
}

/**
 * Helper function to verify user authentication
 *
 * @param accessToken - User's JWT access token
 * @returns Promise with user data or null if invalid
 */
export async function verifyUserToken(accessToken: string) {
  try {
    const client = getSupabaseClient(accessToken);
    const { data: { user }, error } = await client.auth.getUser();

    if (error) {
      console.error('Token verification failed:', error.message);
      return null;
    }

    return user;
  } catch (err) {
    console.error('Token verification error:', err);
    return null;
  }
}
