"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// Server action for login
export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("[LOGIN ACTION] Processing login for email:", email);

  if (!email || !password) {
    console.log("[LOGIN ACTION] Missing email or password");
    redirect("/auth/login?error=" + encodeURIComponent("Please fill in all required fields"));
  }

    console.log("[LOGIN ACTION] Sending login request to API...");
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/login`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

  const redirectTo = "/journal";

    const data = await response.json();
    console.log("[LOGIN ACTION] API response:", data);

    if (!response.ok) {
        console.error("[LOGIN ACTION] Login failed with error:", data.error);
        redirect("/auth/login?error=" + encodeURIComponent(data.error || "Login failed"));
    }

    console.log("[LOGIN ACTION] Login successful, using serverLogin...");

    const cookieStore = await cookies();
    
    // Set cookies with proper security settings
    cookieStore.set('authToken', data.token, {
    httpOnly: false, // Allow client-side access for compatibility
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
    });

    cookieStore.set('userData', JSON.stringify(data.user), {
    httpOnly: false, // Allow client-side access for compatibility
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
    });

    console.log("[SERVER AUTH] Cookies set successfully. Redirecting to:", redirectTo);

    redirect(redirectTo);
}
