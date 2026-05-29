import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

const supabase = createClient(
  'https://hybvsgxqstnxamdkijsk.supabase.co',
  'sb_publishable_PawpVpaKL2oGSMNT92IzkA_wjiORWQ4'
)

async function test() {
  const result = {}
  
  let { data: users, error: e1 } = await supabase.from('users').select('*').limit(1);
  result.users = { data: users, error: e1 }

  let { data: projects, error: e2 } = await supabase.from('projects').select('*').limit(1);
  result.projects = { data: projects, error: e2 }

  let { data: activities, error: e3 } = await supabase.from('activities').select('*').limit(1);
  result.activities = { data: activities, error: e3 }
  
  let { data: challenges, error: e4 } = await supabase.from('challenges').select('*').limit(1);
  result.challenges = { data: challenges, error: e4 }
  
  fs.writeFileSync('schema_output.txt', JSON.stringify(result, null, 2), 'utf-8');
}

test()
