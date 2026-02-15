import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/";

    if (code) {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && user) {
            // Fetch profile for role-based redirection
            const { data: profile } = await supabase
                .from('profiles')
                .select('role, verification_status')
                .eq('id', user.id)
                .single();

            if (profile?.role === 'agent' && profile?.verification_status !== 'verified') {
                return NextResponse.redirect(`${origin}/agents/verify`);
            }

            if (profile?.role === 'admin') {
                return NextResponse.redirect(`${origin}/admin`);
            }

            return NextResponse.redirect(`${origin}${next === '/' ? '/dashboard' : next}`);
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
