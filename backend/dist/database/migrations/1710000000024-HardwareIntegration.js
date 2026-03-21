"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HardwareIntegration1710000000024 = void 0;
class HardwareIntegration1710000000024 {
    constructor() {
        this.name = 'HardwareIntegration1710000000024';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE cattle ADD COLUMN IF NOT EXISTS eid_tag VARCHAR(30) DEFAULT NULL
    `);
        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_cattle_eid_tag ON cattle(eid_tag) WHERE eid_tag IS NOT NULL
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE weighing_source_enum AS ENUM ('AUTOMATIC', 'MANUAL');
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE weighing_media_type_enum AS ENUM ('ENTRY_PHOTO', 'EXIT_PHOTO', 'VIDEO_CLIP', 'MANUAL_UPLOAD');
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE bridge_device_type_enum AS ENUM ('BRIDGE', 'SCALE', 'RFID_READER', 'CAMERA');
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE bridge_device_status_enum AS ENUM ('ONLINE', 'OFFLINE', 'ERROR');
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS bridge_devices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        id_tenant UUID NOT NULL,
        name VARCHAR(100) NOT NULL,
        type bridge_device_type_enum NOT NULL,
        ip_address VARCHAR(45),
        status bridge_device_status_enum NOT NULL DEFAULT 'OFFLINE',
        last_seen_at TIMESTAMPTZ,
        config_json JSONB NOT NULL DEFAULT '{}',
        api_key VARCHAR(128),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_bridge_devices_tenant ON bridge_devices(id_tenant)`);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS weighings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        id_tenant UUID NOT NULL,
        id_cattle UUID NOT NULL REFERENCES cattle(id),
        eid_tag VARCHAR(30),
        gross_weight_kg NUMERIC(8,2) NOT NULL,
        net_weight_kg NUMERIC(8,2),
        tare_kg NUMERIC(8,2),
        stable_at TIMESTAMPTZ,
        operator_id UUID,
        source weighing_source_enum NOT NULL DEFAULT 'MANUAL',
        bridge_device_id UUID REFERENCES bridge_devices(id),
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_weighings_tenant_created ON weighings(id_tenant, created_at DESC)`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_weighings_tenant_cattle ON weighings(id_tenant, id_cattle)`);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS weighing_media (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        id_tenant UUID NOT NULL,
        weighing_id UUID NOT NULL REFERENCES weighings(id) ON DELETE CASCADE,
        type weighing_media_type_enum NOT NULL,
        url TEXT NOT NULL,
        thumbnail_url TEXT,
        captured_at TIMESTAMPTZ,
        file_size_bytes INTEGER,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS weighing_audit_log (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        id_tenant UUID NOT NULL,
        weighing_id UUID NOT NULL REFERENCES weighings(id),
        field_changed VARCHAR(50) NOT NULL,
        old_value TEXT,
        new_value TEXT,
        changed_by UUID NOT NULL,
        changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_weighing_audit_weighing ON weighing_audit_log(weighing_id)`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS weighing_audit_log`);
        await queryRunner.query(`DROP TABLE IF EXISTS weighing_media`);
        await queryRunner.query(`DROP TABLE IF EXISTS weighings`);
        await queryRunner.query(`DROP TABLE IF EXISTS bridge_devices`);
        await queryRunner.query(`DROP TYPE IF EXISTS bridge_device_status_enum`);
        await queryRunner.query(`DROP TYPE IF EXISTS bridge_device_type_enum`);
        await queryRunner.query(`DROP TYPE IF EXISTS weighing_media_type_enum`);
        await queryRunner.query(`DROP TYPE IF EXISTS weighing_source_enum`);
        await queryRunner.query(`ALTER TABLE cattle DROP COLUMN IF EXISTS eid_tag`);
    }
}
exports.HardwareIntegration1710000000024 = HardwareIntegration1710000000024;
//# sourceMappingURL=1710000000024-HardwareIntegration.js.map