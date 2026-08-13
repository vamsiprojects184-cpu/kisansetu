import { NextRequest, NextResponse } from 'next/server';

const JAVA_BACKEND = 'http://127.0.0.1:8080';

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, params);
}
export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, params);
}
export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, params);
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, params);
}
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

async function proxy(req: NextRequest, paramsPromise: Promise<{ path: string[] }>) {
  const { path: pathSegments } = await paramsPromise;
  const url = new URL(req.url);
  const path = '/' + pathSegments.join('/') + url.search;
  const targetUrl = `${JAVA_BACKEND}${path}`;

  try {
    const headers: Record<string, string> = {};
    req.headers.forEach((v, k) => { headers[k] = v; });
    delete headers['host'];

    const options: RequestInit = { method: req.method, headers };
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      options.body = await req.text();
    }

    const res = await fetch(targetUrl, options);
    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: `Backend unavailable: ${error.message}` }, {
      status: 503, headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}