/**
 * Proxy API: reenvía /api/* al backend sin redirect.
 * Evita CORS y headers duplicados (el cliente siempre llama a mismo origen).
 */
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL || 'https://app.inxora.com'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params)
}

export async function OPTIONS(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params)
}

async function proxyRequest(
  request: NextRequest,
  { path }: { path: string[] }
) {
  const pathStr = path.join('/')
  const search = request.nextUrl.searchParams.toString()
  const url = `${BACKEND_URL.replace(/\/$/, '')}/api/${pathStr}${search ? `?${search}` : ''}`

  const headers = new Headers()
  request.headers.forEach((value, key) => {
    if (
      !['host', 'connection', 'content-length'].includes(key.toLowerCase())
    ) {
      headers.set(key, value)
    }
  })

  let body: string | undefined
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    try {
      body = await request.text()
    } catch {
      body = undefined
    }
  }

  try {
    const res = await fetch(url, {
      method: request.method,
      headers,
      body,
    })

    const data = await res.text()
    return new NextResponse(data, {
      status: res.status,
      statusText: res.statusText,
      headers: {
        'Content-Type': res.headers.get('Content-Type') || 'application/json',
      },
    })
  } catch (err) {
    console.error('[API Proxy] Error:', err)
    return NextResponse.json(
      { error: 'Proxy request failed', message: String(err) },
      { status: 502 }
    )
  }
}
