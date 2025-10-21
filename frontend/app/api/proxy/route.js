// app/api/proxy/route.js

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const endpoint = searchParams.get('endpoint');

  const ALLOWED = ['syllabus', 'notes', 'pyqs', 'lab', 'books', 'akash', 'videos', 'subjects'];
  if (!ALLOWED.includes(endpoint)) {
    return new Response(JSON.stringify({ error: 'Invalid endpoint' }), { status: 400 });
  }

  // Collect all query params except endpoint
  const query = new URLSearchParams(searchParams);
  query.delete('endpoint');

  const backendUrl = `https://flask-backend-sfbo.onrender.com/${endpoint}?${query.toString()}`;

  try {
    const res = await fetch(backendUrl);
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Backend fetch failed' }), { status: 500 });
  }
}
