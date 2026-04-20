import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

function unauthorizedResponse() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Dashboard"',
    },
  })
}

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const adminUser = process.env.ADMIN_DASHBOARD_USER
  const adminPassword = process.env.ADMIN_DASHBOARD_PASSWORD

  if (!adminUser || !adminPassword) {
    return NextResponse.json(
      { error: 'Admin credentials are not configured. Set ADMIN_DASHBOARD_USER and ADMIN_DASHBOARD_PASSWORD.' },
      { status: 500 },
    )
  }

  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return unauthorizedResponse()
  }

  const encodedCredentials = authHeader.split(' ')[1] ?? ''
  const decodedCredentials = atob(encodedCredentials)
  const [username, password] = decodedCredentials.split(':')

  if (username !== adminUser || password !== adminPassword) {
    return unauthorizedResponse()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
