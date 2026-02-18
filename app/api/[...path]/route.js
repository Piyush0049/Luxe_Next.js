import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BASE_URL || 'http://localhost:5000/api';

async function handleRequest(request, { params }) {
    // Await params if needed in newer Next.js versions, but usually it's fine here
    const { path } = await params;
    const pathString = path.join('/');

    // Get search params from the original request
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    const url = `${BACKEND_URL}/${pathString}${queryString ? `?${queryString}` : ''}`;

    console.log(`Proxying ${request.method} request to: ${url}`);

    let body;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
        try {
            body = await request.json();
        } catch (e) {
            body = undefined;
        }
    }

    const headers = new Headers();
    // Forward relevant headers
    const headersToForward = ['content-type', 'authorization', 'accept'];
    headersToForward.forEach(header => {
        const value = request.headers.get(header);
        if (value) headers.set(header, value);
    });

    try {
        const response = await fetch(url, {
            method: request.method,
            headers: headers,
            body: body ? JSON.stringify(body) : undefined,
            cache: 'no-store'
        });

        const contentType = response.headers.get('content-type');
        let data;

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        return NextResponse.json(data, {
            status: response.status,
            headers: {
                'Cache-Control': 'no-store, max-age=0'
            }
        });
    } catch (error) {
        console.error('API Proxy Error:', error);
        return NextResponse.json(
            { error: 'Connection to backend failed', details: error.message },
            { status: 502 }
        );
    }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const PATCH = handleRequest;
export const HEAD = handleRequest;
