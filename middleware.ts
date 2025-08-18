import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Se não houver sessão e o usuário tentar acessar /pedidos, redireciona para /login
  if (!session && request.nextUrl.pathname.startsWith('/pedidos')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Se houver sessão e o usuário tentar acessar /login, redireciona para /pedidos
  if (session && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/pedidos', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/pedidos/:path*',
    '/login',
  ],
}
