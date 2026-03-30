const URL_BUCKETS = 'https://scpqrphfgevrmzmsladg.supabase.co/storage/v1/bucket';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjcHFycGhmZ2V2cm16bXNsYWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4ODQ5OTIsImV4cCI6MjA5MDQ2MDk5Mn0.VEeaNQH4Ft7z0lH1g7PcOmV22KLwcjdHuHyKbNgvgjs';

async function listBucketsAndFiles() {
  console.log('Listing all buckets...');
  try {
    const resBucket = await fetch(URL_BUCKETS, {
      method: 'GET',
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
      }
    });

    if (!resBucket.ok) {
      console.error(`Error listing buckets: ${resBucket.status} ${resBucket.statusText}`);
      return;
    }

    const buckets = await resBucket.json();
    console.log('Buckets found:', buckets.map(b => b.name));

    for (const bucket of buckets) {
      console.log(`\nChecking bucket: "${bucket.name}"...`);
      const resFiles = await fetch(`https://scpqrphfgevrmzmsladg.supabase.co/storage/v1/object/list/${bucket.name}`, {
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

      if (!resFiles.ok) {
        console.error(`Error listing files in "${bucket.name}": ${resFiles.status} ${resFiles.statusText}`);
        continue;
      }

      const files = await resFiles.json();
      if (files && files.length > 0) {
        console.log(`Files in "${bucket.name}" bucket:`);
        files.forEach(f => {
          console.log(`- ${f.name} (Size: ${f.metadata?.size || 'unknown'} bytes, Type: ${f.metadata?.mimetype || 'unknown'})`);
        });
      } else {
        console.log(`No files found in "${bucket.name}" bucket.`);
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

listBucketsAndFiles();
