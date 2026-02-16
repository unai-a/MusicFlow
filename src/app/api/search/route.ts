import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

interface SearchResult {
  videoId: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration: string;
  url: string;
}

function extractVideoId(url: string): string | null {
  // Match various YouTube URL patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

function parseDuration(text: string): string {
  // Try to extract duration from text like "Duration: 3:45"
  const durationMatch = text.match(/(\d+:\d+(?::\d+)?)/);
  if (durationMatch) {
    return durationMatch[1];
  }
  return '';
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    console.log('Searching for:', query);

    const zai = await ZAI.create();

    // Use broader search queries without strict site: filter
    const searchQueries = [
      `${query} youtube`,
      `${query} official video youtube`,
    ];

    let allResults: SearchResult[] = [];
    const seenVideoIds = new Set<string>();

    for (const searchQuery of searchQueries) {
      try {
        console.log('Trying search query:', searchQuery);
        const searchResults = await zai.functions.invoke('web_search', {
          query: searchQuery,
          num: 15,
        });

        console.log('Search results type:', typeof searchResults, Array.isArray(searchResults));

        if (Array.isArray(searchResults)) {
          console.log('Found', searchResults.length, 'raw results');
          for (const item of searchResults) {
            const videoId = extractVideoId(item.url);
            console.log('URL:', item.url, '-> VideoId:', videoId);
            
            if (videoId && !seenVideoIds.has(videoId)) {
              seenVideoIds.add(videoId);
              
              // Clean up title by removing " - YouTube" suffix
              let title = item.name.replace(/\s*-\s*YouTube\s*$/, '');
              
              // Extract channel name from snippet if available
              let channel = item.host_name.replace('www.', '');
              
              // Try to get a better channel name from snippet
              const snippetParts = item.snippet.split('·');
              if (snippetParts.length > 1) {
                channel = snippetParts[0].trim();
              }

              allResults.push({
                videoId,
                title,
                channel,
                thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                duration: parseDuration(item.snippet),
                url: item.url,
              });
            }
          }
        }
      } catch (e) {
        console.error('Search query failed:', searchQuery, e);
      }
    }

    console.log('Total unique results:', allResults.length);

    return NextResponse.json({ results: allResults.slice(0, 15) });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search for videos' },
      { status: 500 }
    );
  }
}
