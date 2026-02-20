// Temporarily disabled to fix blank page - module import error
// This file was causing "Cannot find module" error in route-builder.ts

export async function GET(request) {
  return new Response('Route temporarily disabled', { status: 503 });
}

export async function POST(request) {
  return new Response('Route temporarily disabled', { status: 503 });
}
