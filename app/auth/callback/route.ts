import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    console.error('[Auth Callback] OAuth error:', error)
    return NextResponse.redirect(`${origin}/?auth=error`)
  }

  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (!exchangeError) {
      return NextResponse.redirect(`${origin}/feed`)
    }
    console.error('[Auth Callback] Session exchange error:', exchangeError)
  }

  return NextResponse.redirect(`${origin}/?auth=error`)
}
