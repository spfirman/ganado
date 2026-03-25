/**
 * Seed script: create or update the admin user for a given tenant.
 *
 * Usage:
 *   npx ts-node -r tsconfig-paths/register src/database/seed-admin.ts
 *
 * Requires the same .env that the app uses (FA_DB_HOST, etc.).
 */
import { DataSource } from 'typeorm';
import { dataSourceOptions } from './data-source';
import * as bcrypt from 'bcrypt';

const ADMIN_USERNAME = process.env.SEED_ADMIN_USERNAME || 'steve';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD; // required
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'steve@gpcb.com.co';
const ADMIN_FIRST = process.env.SEED_ADMIN_FIRST_NAME || 'Steve';
const ADMIN_LAST = process.env.SEED_ADMIN_LAST_NAME || 'Firman';
const COMPANY_USERNAME = process.env.SEED_COMPANY_USERNAME || 'gpcb_ranch';

async function main() {
  if (!ADMIN_PASSWORD) {
    console.error('ERROR: SEED_ADMIN_PASSWORD env var is required.');
    process.exit(1);
  }

  const ds = new DataSource(dataSourceOptions);
  await ds.initialize();

  try {
    // 1. Find the tenant
    const tenant = await ds.query(
      `SELECT id, name, company_username FROM tenants WHERE company_username = $1 LIMIT 1`,
      [COMPANY_USERNAME],
    );
    if (!tenant.length) {
      console.error(`Tenant with company_username '${COMPANY_USERNAME}' not found.`);
      const all = await ds.query(`SELECT id, company_username, name FROM tenants`);
      console.log('Available tenants:', all);
      process.exit(1);
    }
    const tenantId = tenant[0].id;
    console.log(`Tenant found: ${tenant[0].name} (${tenantId})`);

    // 2. Find the SYS_ADMIN role
    const roles = await ds.query(
      `SELECT id, code, name FROM roles WHERE code = 'SYS_ADMIN' LIMIT 1`,
    );
    if (!roles.length) {
      console.error('SYS_ADMIN role not found. Available roles:');
      const all = await ds.query(`SELECT id, code, name FROM roles`);
      console.log(all);
      process.exit(1);
    }
    const roleId = roles[0].id;
    console.log(`Role found: ${roles[0].name} (${roleId})`);

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // 4. Upsert the user
    const existing = await ds.query(
      `SELECT id FROM users WHERE username = $1 AND id_tenant = $2 LIMIT 1`,
      [ADMIN_USERNAME, tenantId],
    );

    let userId: string;
    if (existing.length) {
      userId = existing[0].id;
      await ds.query(
        `UPDATE users SET pass_word = $1, active = true, email = $2, first_name = $3, last_name = $4 WHERE id = $5`,
        [hashedPassword, ADMIN_EMAIL, ADMIN_FIRST, ADMIN_LAST, userId],
      );
      console.log(`User '${ADMIN_USERNAME}' updated (${userId})`);
    } else {
      const result = await ds.query(
        `INSERT INTO users (id, username, pass_word, email, first_name, last_name, id_tenant, active)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, true)
         RETURNING id`,
        [ADMIN_USERNAME, hashedPassword, ADMIN_EMAIL, ADMIN_FIRST, ADMIN_LAST, tenantId],
      );
      userId = result[0].id;
      console.log(`User '${ADMIN_USERNAME}' created (${userId})`);
    }

    // 5. Ensure user has the SYS_ADMIN role
    const existingRole = await ds.query(
      `SELECT 1 FROM user_roles WHERE id_user = $1 AND id_role = $2 LIMIT 1`,
      [userId, roleId],
    );
    if (!existingRole.length) {
      await ds.query(
        `INSERT INTO user_roles (id_user, id_role) VALUES ($1, $2)`,
        [userId, roleId],
      );
      console.log('SYS_ADMIN role assigned.');
    } else {
      console.log('SYS_ADMIN role already assigned.');
    }

    console.log('\nDone. User can now log in with:');
    console.log(`  username: ${ADMIN_USERNAME}`);
    console.log(`  company_username: ${COMPANY_USERNAME}`);
  } finally {
    await ds.destroy();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
