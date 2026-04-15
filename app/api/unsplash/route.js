import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { searchTerms } = await request.json();
    if (!searchTerms || !Array.isArray(searchTerms)) {
      return NextResponse.json({ error: 'Valid searchTerms array required' }, { status: 400 });
    }

    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!unsplashKey) return NextResponse.json([], { status: 200 });

    const termsToFetch = searchTerms.slice(0, 5);
    const imagePromises = termsToFetch.map(async (term) => {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(term)}&per_page=1&orientation=landscape&content_filter=high`,
        { headers: { Authorization: `Client-ID ${unsplashKey}` } }
      );
      if (!response.ok) return null;
      const data = await response.json();
      const photo = data.results?.[0];
      if (!photo) return null;
      return {
        url: photo.urls.regular,
        thumbUrl: photo.urls.small,
        alt: photo.alt_description || photo.description || term,
        unsplashId: photo.id,
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
      };
    });

    const results = await Promise.all(imagePromises);
    return NextResponse.json(results.filter(Boolean), { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
