import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColorAndCharacteristics1710000000015 implements MigrationInterface {
    name = 'AddColorAndCharacteristics1710000000015';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
        await queryRunner.query(`
      INSERT INTO modules (id, code, name, description, access_details) VALUES
      (uuid_generate_v4(), 'RECEPTION', 'Recepción de compra', 'Gestión de recepciones de compra', '{"receptions":"CRUDL","cattles": "CRUDL"}');
    `);
        await queryRunner.query(`
       DO $$
       BEGIN
         IF NOT EXISTS (
           SELECT 1 FROM pg_constraint
           WHERE conrelid = 'public.cattle'::regclass
             AND conname = 'chk_cattle_number_no_leading_zero'
         ) THEN
           ALTER TABLE public.cattle
           ADD CONSTRAINT chk_cattle_number_no_leading_zero
           CHECK (number ~ '^[1-9][0-9]*$');
         END IF;
       END $$;
     `);
        await queryRunner.query(`DROP INDEX IF EXISTS public.uq_cattle_tenant_number;`);
        await queryRunner.query(`DROP INDEX IF EXISTS public.uq_cattle_tenant_number_active;`);
        await queryRunner.query(`
       DO $$
       DECLARE dup_count bigint;
       BEGIN
         SELECT COUNT(*) INTO dup_count
         FROM (
           SELECT id_tenant, number
           FROM public.cattle
           WHERE status = 'ACTIVE'
           GROUP BY id_tenant, number
           HAVING COUNT(*) > 1
         ) t;
         IF dup_count > 0 THEN
           RAISE EXCEPTION 'Hay % duplicados activos (id_tenant, number). Corrige antes de continuar.', dup_count;
         END IF;
       END $$;
     `);
        await queryRunner.query(`
       CREATE UNIQUE INDEX uq_cattle_tenant_number_active
       ON public.cattle (id_tenant, number)
       WHERE status = 'ACTIVE';
     `);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_cattle_status ON public.cattle (status);`);
        await queryRunner.query(`
       CREATE INDEX IF NOT EXISTS idx_cattle_tenant_status
       ON public.cattle (id_tenant, status);
     `);
        await queryRunner.query(`
       CREATE INDEX IF NOT EXISTS idx_cattle_tenant_number
       ON public.cattle (id_tenant, number);
     `);
        await queryRunner.query(`
       CREATE TABLE IF NOT EXISTS public.colors (
         id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
         id_tenant  uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
         name       varchar(50) NOT NULL,
         is_active  boolean NOT NULL DEFAULT true,
         created_at timestamp NOT NULL DEFAULT now(),
         updated_at timestamp NOT NULL DEFAULT now()
       );
     `);
        await queryRunner.query(`
       CREATE UNIQUE INDEX IF NOT EXISTS ux_colors_tenant_name_ci
       ON public.colors (id_tenant, lower(name));
     `);
        await queryRunner.query(`
       ALTER TABLE public.cattle
       ADD COLUMN IF NOT EXISTS id_color uuid NULL REFERENCES public.colors(id) ON DELETE SET NULL;
     `);
        await queryRunner.query(`
      ALTER TABLE public.lots
      ADD COLUMN IF NOT EXISTS received_cattle_count integer NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS received_total_weight numeric(10,2) NOT NULL DEFAULT 0;
    `);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_cattle_id_color ON public.cattle (id_color);`);
        await queryRunner.query(`
       CREATE TABLE IF NOT EXISTS public.characteristics (
         id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
         id_tenant  uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
         name       varchar(100) NOT NULL,
         group_name varchar(50),
         is_active  boolean NOT NULL DEFAULT true,
         created_at timestamp NOT NULL DEFAULT now(),
         updated_at timestamp NOT NULL DEFAULT now()
       );
     `);
        await queryRunner.query(`
       CREATE UNIQUE INDEX IF NOT EXISTS ux_characteristics_tenant_name_ci
       ON public.characteristics (id_tenant, lower(name));
     `);
        await queryRunner.query(`
       CREATE TABLE IF NOT EXISTS public.cattle_characteristics (
         id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
         id_tenant         uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
         id_cattle         uuid NOT NULL REFERENCES public.cattle(id) ON DELETE CASCADE,
         id_characteristic uuid NOT NULL REFERENCES public.characteristics(id) ON DELETE RESTRICT,
         created_at        timestamp NOT NULL DEFAULT now()
       );
     `);
        await queryRunner.query(`
       CREATE UNIQUE INDEX IF NOT EXISTS ux_cattle_characteristics_unique
       ON public.cattle_characteristics (id_cattle, id_characteristic);
     `);
        await queryRunner.query(`
       CREATE INDEX IF NOT EXISTS idx_cattle_characteristics_chr
       ON public.cattle_characteristics (id_characteristic);
     `);
        await queryRunner.query(`
       INSERT INTO public.colors (id_tenant, name)
       SELECT DISTINCT c.id_tenant, btrim(c.color_main)
       FROM public.cattle c
       WHERE c.color_main IS NOT NULL AND btrim(c.color_main) <> ''
       ON CONFLICT (id_tenant, lower(name)) DO NOTHING;
     `);
        await queryRunner.query(`
       UPDATE public.cattle AS ca
       SET id_color = co.id
       FROM public.colors AS co
       WHERE ca.id_tenant = co.id_tenant
         AND ca.color_main IS NOT NULL
         AND lower(btrim(ca.color_main)) = lower(btrim(co.name))
         AND (ca.id_color IS NULL);
     `);
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS public.purchase_receptions (
          id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          id_tenant        uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
          id_purchase      uuid NOT NULL REFERENCES public.purchases(id) ON DELETE RESTRICT,
          id_massive_event uuid NOT NULL REFERENCES public.massive_events(id) ON DELETE RESTRICT,
          received_at      timestamp NOT NULL DEFAULT now(),
          note             text,
          created_at       timestamp NOT NULL DEFAULT now(),
          updated_at       timestamp NOT NULL DEFAULT now()
        );
      `);
        await queryRunner.query(`
        CREATE UNIQUE INDEX ux_purchase_receptions_unique_per_purchase ON public.purchase_receptions (id_tenant, id_purchase);
      `);
        await queryRunner.query(`
        CREATE INDEX IF NOT EXISTS idx_purchase_receptions_tenant_purchase
        ON public.purchase_receptions (id_tenant, id_purchase);
      `);
        await queryRunner.query(`
        CREATE INDEX IF NOT EXISTS idx_purchase_receptions_mass_event
        ON public.purchase_receptions (id_massive_event);
      `);
        await queryRunner.query(`
        CREATE INDEX idx_purchase_receptions_tenant_purchase_mass_event ON public.purchase_receptions (id_tenant, id_purchase, id_massive_event);
      `);
        await queryRunner.query(`
        CREATE INDEX idx_lots_tenant_purchase ON public.lots (id_tenant, id_purchase);
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM role_module_permissions WHERE id_module = (SELECT id FROM modules WHERE code = 'RECEPTION');`);
        await queryRunner.query(`DELETE FROM modules WHERE code = 'RECEPTION';`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_lots_tenant_purchase;`);
        await queryRunner.query(`ALTER TABLE public.lots DROP COLUMN IF EXISTS received_cattle_count;`);
        await queryRunner.query(`ALTER TABLE public.lots DROP COLUMN IF EXISTS received_total_weight;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_purchase_receptions_mass_event;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_purchase_receptions_tenant_purchase;`);
        await queryRunner.query(`DROP TABLE IF EXISTS public.purchase_receptions;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_purchase_receptions_tenant_purchase_mass_event;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_cattle_characteristics_chr;`);
        await queryRunner.query(`DROP INDEX IF EXISTS ux_cattle_characteristics_unique;`);
        await queryRunner.query(`DROP TABLE IF EXISTS public.cattle_characteristics;`);
        await queryRunner.query(`DROP INDEX IF EXISTS ux_characteristics_tenant_name_ci;`);
        await queryRunner.query(`DROP TABLE IF EXISTS public.characteristics;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_cattle_id_color;`);
        await queryRunner.query(`ALTER TABLE public.cattle DROP COLUMN IF EXISTS id_color;`);
        await queryRunner.query(`DROP INDEX IF EXISTS ux_colors_tenant_name_ci;`);
        await queryRunner.query(`DROP TABLE IF EXISTS public.colors;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_cattle_tenant_number;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_cattle_tenant_status;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_cattle_status;`);
        await queryRunner.query(`DROP INDEX IF EXISTS uq_cattle_tenant_number_active;`);
        await queryRunner.query(`
        DO $$
        BEGIN
          IF EXISTS (
            SELECT 1 FROM pg_constraint
            WHERE conrelid = 'public.cattle'::regclass
              AND conname = 'chk_cattle_number_no_leading_zero'
          ) THEN
            ALTER TABLE public.cattle DROP CONSTRAINT chk_cattle_number_no_leading_zero;
          END IF;
        END $$;
      `);
    }
}
