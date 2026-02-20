import { createReadStream, existsSync, statSync } from 'fs';
import { join } from 'path';

export async function GET(request, { params }) {
  try {
    const filename = params.filename;
    const uploadsDir = join(process.cwd(), 'uploads', 'audio');
    const filePath = join(uploadsDir, filename);
    
    // Check if file exists
    if (!existsSync(filePath)) {
      return Response.json({ error: 'File not found' }, { status: 404 });
    }
    
    // Get file stats
    const stats = statSync(filePath);
    
    // Create read stream
    const fileStream = createReadStream(filePath);
    
    // Set headers
    const headers = new Headers({
      'Content-Type': 'audio/wav',
      'Content-Length': stats.size.toString(),
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    });
    
    // Return file stream
    return new Response(fileStream, {
      headers,
      status: 200,
    });
    
  } catch (error) {
    console.error('Audio file serving error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
