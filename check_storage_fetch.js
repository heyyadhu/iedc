const URL = 'https://scpqrphfgevrmzmsladg.supabase.co/storage/v1/object/list/images';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjcHFycGhmZ2V2cm16bXNsYWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4ODQ5OTIsImV4cCI6MjA5MDQ2MDk5Mn0.VEeaNQH4Ft7z0lH1g7PcOmV22KLwcjdHuHyKbNgvgjs';

async function listFiles() {
  console.log('Checking bucket: "images"...');
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prefix: '',
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error: ${response.status} ${response.statusText}`, errorText);
      return;
    }

    const data = await response.json();
    console.log('Raw API Response:', JSON.stringify(data, null, 2));
    if (data && data.length > 0) {
      console.log('Processed Files:');
      data.forEach(f => {
        console.log(`- ${f.name} (Size: ${f.metadata?.size || 'unknown'} bytes, Type: ${f.metadata?.mimetype || 'unknown'})`);
      });
    } else {
      console.log('The list returned no results.');
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

listFiles();
