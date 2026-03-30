import { supabase } from './src/lib/supabase';

async function listFiles() {
  const { data, error } = await supabase.storage.from('images').list();
  if (error) {
    console.error('Error listing "images" bucket:', error);
  } else {
    console.log('Files in "images" bucket:', data.map(f => f.name));
  }
}

listFiles();
