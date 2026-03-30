import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load .env.local manually
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function listFiles() {
  console.log('Checking bucket: "images"...');
  const { data, error } = await supabase.storage.from('images').list();
  if (error) {
    console.error('Error listing "images" bucket:', error);
  } else {
    if (data && data.length > 0) {
      console.log('Files in "images" bucket:');
      data.forEach(f => {
        console.log(`- ${f.name} (Size: ${f.metadata?.size || 'unknown'} bytes, Type: ${f.metadata?.mimetype || 'unknown'})`);
      });
    } else {
      console.log('No files found in "images" bucket.');
    }
  }
}

listFiles();
