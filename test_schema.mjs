import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://hybvsgxqstnxamdkijsk.supabase.co',
  'sb_publishable_PawpVpaKL2oGSMNT92IzkA_wjiORWQ4'
)

async function test() {
  console.log('--- USERS ---');
  let { data: users, error: e1 } = await supabase.from('users').select('*').limit(2);
  console.log(users, e1);

  console.log('--- PROJECTS ---');
  let { data: projects, error: e2 } = await supabase.from('projects').select('*').limit(2);
  console.log(projects, e2);

  console.log('--- ACTIVITIES ---');
  let { data: activities, error: e3 } = await supabase.from('activities').select('*').limit(2);
  console.log(activities, e3);
  
  console.log('--- CHALLENGES ---');
  let { data: challenges, error: e4 } = await supabase.from('challenges').select('*').limit(2);
  console.log(challenges, e4);
}

test()
