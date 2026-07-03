import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ خطأ: يجب تعيين متغيرات البيئة VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigrations() {
  console.log('🚀 بدء تشغيل الترحيلات...\n');

  const migrationsDir = join(process.cwd(), 'supabase', 'migrations');
  const files = readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.log('✅ لا توجد ترحيلات للتشغيل');
    return;
  }

  for (const file of files) {
    console.log(`📄 تشغيل: ${file}`);
    const sql = readFileSync(join(migrationsDir, file), 'utf-8');

    const { error } = await supabase.rpc('run_sql', { sql });

    if (error) {
      console.error(`❌ خطأ في ${file}:`, error.message);
    } else {
      console.log(`✅ تم بنجاح: ${file}\n`);
    }
  }

  console.log('🎉 انتهت الترحيلات بنجاح!');
}

runMigrations().catch((err) => {
  console.error('❌ خطأ غير متوقع:', err);
  process.exit(1);
});
