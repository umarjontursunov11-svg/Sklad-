const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../web/.env.local' });
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  require('dotenv').config({ path: './.env' });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('--- OmniStock PRO Supabase Verification & Seed Script ---');

if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes('your-project')) {
  console.error('Error: Please provide valid NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log(`Connecting to: ${supabaseUrl.replace(/(https:\/\/[^.]+).*/, '$1.supabase.co')}`);

  // 1. Verify tables
  const tables = ['roles', 'warehouses', 'users', 'products', 'stock', 'stock_movements', 'invoices', 'invoice_items', 'correction_requests', 'login_logs', 'report_logs'];
  console.log('\n1. Checking database tables...');
  for (const table of tables) {
    const { count, error } = await supabaseAdmin.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.error(`  ❌ Table "${table}" error: ${error.message}`);
    } else {
      console.log(`  ✅ Table "${table}" exists and is accessible.`);
    }
  }

  // 2. Query Roles
  console.log('\n2. Verifying standardized roles...');
  const { data: roles, error: rolesErr } = await supabaseAdmin.from('roles').select('*');
  if (rolesErr) {
    console.error('  ❌ Error fetching roles:', rolesErr.message);
  } else {
    console.log(`  Found ${roles.length} roles:`, roles.map(r => r.name).join(', '));
  }

  // 3. Provision / Seed real auth.users & public.users
  console.log('\n3. Provisioning verified staff accounts in auth.users...');
  const staffToProvision = [
    {
      email: 'admin@warehouse.io',
      password: 'AdminPassword2026!',
      role: 'admin',
      name: 'Tursunov Umarjon (Admin)',
      full_name: 'Tursunov Umarjon',
      username: 'admin',
      employee_id: 'EMP-0001',
      must_change_password: false,
    },
    {
      email: 'manager@warehouse.io',
      password: 'ManagerPass2026!',
      role: 'warehouse_manager',
      name: 'Sherzod Karimov (Manager)',
      full_name: 'Sherzod Karimov',
      username: 'manager',
      employee_id: 'EMP-1001',
      must_change_password: true,
    },
    {
      email: 'receiver@warehouse.io',
      password: 'ReceiverPass2026!',
      role: 'receiver',
      name: 'Jasur Alimov (Receiver)',
      full_name: 'Jasur Alimov',
      username: 'receiver',
      employee_id: 'EMP-2001',
      must_change_password: true,
    },
    {
      email: 'dispatcher@warehouse.io',
      password: 'DispatcherPass2026!',
      role: 'dispatcher',
      name: 'Dilshod Raximov (Dispatcher)',
      full_name: 'Dilshod Raximov',
      username: 'dispatcher',
      employee_id: 'EMP-3001',
      must_change_password: true,
    }
  ];

  const roleMap = new Map();
  if (roles) {
    roles.forEach(r => roleMap.set(r.name, r.id));
  }

  // Fetch warehouse for assignment
  const { data: whs } = await supabaseAdmin.from('warehouses').select('id').limit(1);
  const defaultWhId = whs && whs[0] ? whs[0].id : null;

  for (const staff of staffToProvision) {
    let authId = null;
    const roleId = roleMap.get(staff.role);

    // Check if user already exists in auth
    const { data: usersList } = await supabaseAdmin.auth.admin.listUsers();
    const existing = usersList?.users?.find(u => u.email?.toLowerCase() === staff.email.toLowerCase());

    if (existing) {
      authId = existing.id;
      console.log(`  Existing auth user found: ${staff.email} (${authId})`);
      await supabaseAdmin.auth.admin.updateUserById(authId, {
        password: staff.password,
        user_metadata: {
          name: staff.name,
          role: staff.role,
          username: staff.username,
        }
      });
    } else {
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: staff.email,
        password: staff.password,
        email_confirm: true,
        user_metadata: {
          name: staff.name,
          role: staff.role,
          username: staff.username,
        }
      });
      if (createErr) {
        console.error(`  ❌ Failed to create ${staff.email}:`, createErr.message);
        continue;
      }
      authId = created.user.id;
      console.log(`  ✅ Created auth user: ${staff.email} (${authId})`);
    }

    // Upsert into public.users
    const { error: upsertErr } = await supabaseAdmin.from('users').upsert({
      id: authId,
      name: staff.name,
      full_name: staff.full_name,
      email: staff.email,
      username: staff.username,
      employee_id: staff.employee_id,
      role_id: roleId,
      assigned_warehouse_id: defaultWhId,
      must_change_password: staff.must_change_password,
    });

    if (upsertErr) {
      console.error(`  ❌ Failed to upsert public.users for ${staff.email}:`, upsertErr.message);
    } else {
      console.log(`  ✅ Linked public.users row created for: ${staff.name} [Role: ${staff.role}]`);
    }
  }

  console.log('\n--- Verification & Seed Completed Successfully ---');
}

main().catch(console.error);
