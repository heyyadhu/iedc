const URL_BUCKET_INFO = 'https://scpqrphfgevrmzmsladg.supabase.co/storage/v1/bucket/images';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjcHFycGhmZ2V2cm16bXNsYWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4ODQ5OTIsImV4cCI6MjA5MDQ2MDk5Mn0.VEeaNQH4Ft7z0lH1g7PcOmV22KLwcjdHuHyKbNgvgjs';

async function checkBucket() {
  console.log('Checking "images" bucket status...');
  try {
    const res = await fetch(URL_BUCKET_INFO, {
      method: 'GET',
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
      }
    });

    if (res.ok) {
      const bucket = await res.json();
      console.log('Bucket Status:', bucket);
    } else {
      const errorText = await res.text();
      console.error(`Error: ${res.status} ${res.statusText}`, errorText);
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

checkBucket();
