import { NextResponse } from 'next/server'
 3
 export async function middleware(request: Request) {
    const url = new URL(request.url);
    const origin = url.origin;
    const pathname = url.pathname;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-url', request.url);
    requestHeaders.set('x-origin', origin);
    requestHeaders.set('x-pathname', pathname);
    requestHeaders.set('x-client', request.headers.get("user-agent") as string);
    
    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        }
    });
    return response;
}