"use server";

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
}

// Get authentication data from server-side cookies
export async function getAuthData(): Promise<{ user: User | null; token: string | null }> {
  console.log("[SERVER AUTH] Getting authentication data from cookies...");
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('authToken')?.value;
    const userData = cookieStore.get('userData')?.value;

    console.log("[SERVER AUTH] Auth token found:", !!authToken);
    console.log("[SERVER AUTH] User data found:", !!userData);

    if (!authToken || !userData) {
      console.log("[SERVER AUTH] No authentication data found");
      return { user: null, token: null };
    }

    const parsedUser = JSON.parse(userData);
    console.log("[SERVER AUTH] Authentication data retrieved:", { user: parsedUser, token: authToken });
    
    return { user: parsedUser, token: authToken };
  } catch (error) {
    console.error("[SERVER AUTH] Error getting auth data:", error);
    return { user: null, token: null };
  }
}

// Clear authentication cookies and redirect to login
export async function serverLogout(redirectTo: string = '/auth/login'): Promise<void> {
  console.log("[SERVER AUTH] Logging out user...");
  
  try {
    const cookieStore = await cookies();
    
    // Clear cookies
    cookieStore.delete('authToken');
    cookieStore.delete('userData');
    
    console.log("[SERVER AUTH] Cookies cleared. Redirecting to:", redirectTo);
    
    // Redirect to login page
  } catch (error) {
    console.error("[SERVER AUTH] Error during logout:", error);
    throw error;
  } finally {
    redirect(redirectTo);
  }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const { user, token } = await getAuthData();
  const authenticated = !!(user && token);
  console.log("[SERVER AUTH] User authenticated:", authenticated);
  return authenticated;
}

// Require authentication - redirect to login if not authenticated
export async function requireAuth(redirectTo: string = '/auth/login'): Promise<{ user: User; token: string }> {
  console.log("[SERVER AUTH] Checking authentication requirement...");
  
  const { user, token } = await getAuthData();
  
  if (!user || !token) {
    console.log("[SERVER AUTH] Authentication required. Redirecting to:", redirectTo);
    redirect(redirectTo);
  }
  
  console.log("[SERVER AUTH] Authentication verified for user:", user);
  return { user: user!, token: token! };
}