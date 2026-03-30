const FILENAME = 'Anandhu S.png';
const BUCKET = 'images';
const PROJECT_URL = 'https://scpqrphfgevrmzmsladg.supabase.co';
const PUBLIC_URL = `${PROJECT_URL}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(FILENAME)}`;

async function checkFile() {
  console.log(`Checking direct access to: ${PUBLIC_URL}`);
  try {
    const response = await fetch(PUBLIC_URL, { method: 'HEAD' });
    if (response.ok) {
      console.log(`SUCCESS: File "${FILENAME}" is accessible!`);
      console.log(`Size: ${response.headers.get('content-length')} bytes`);
      console.log(`Type: ${response.headers.get('content-type')}`);
    } else {
      console.error(`FAILURE: File "${FILENAME}" is NOT accessible. Status: ${response.status} ${response.statusText}`);
      const body = await response.text();
      console.error('Response Body:', body);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

checkFile();
