"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImproveColorsAndCharacteristics1710000000019 = void 0;
class ImproveColorsAndCharacteristics1710000000019 {
    name = 'ImproveColorsAndCharacteristics1710000000019';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE public.cattle DROP COLUMN IF EXISTS color_description;`);
        await queryRunner.query(`ALTER TABLE public.cattle DROP COLUMN IF EXISTS color_main;`);
        await queryRunner.query(`ALTER TABLE public.cattle DROP COLUMN IF EXISTS color_feature;`);
        await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'colors_enum') THEN
          CREATE TYPE "colors_enum" AS ENUM (
            'BLACK', 'WHITE', 'BROWN', 'BLACK_BROWN', 'LIGHT_BROWN', 'GREY'
          );
        END IF;
      END $$;
    `);
        await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'characteristics_enum') THEN
          CREATE TYPE "characteristics_enum" AS ENUM (
            'BLACK_BELLY', 'WHITE_BELLY', 'BROWN_BELLY', 'LIGHT_BROWN_BELLY', 'GREY_BELLY',
            'BLACK_HEAD', 'WHITE_HEAD', 'BROWN_HEAD', 'LIGHT_BROWN_HEAD', 'GREY_HEAD',
            'BLACK_HALF_HEAD', 'WHITE_HALF_HEAD', 'BROWN_HALF_HEAD', 'LIGHT_BROWN_HALF_HEAD', 'GREY_HALF_HEAD',
            'BLACK_LEGS', 'WHITE_LEGS', 'BROWN_LEGS', 'LIGHT_BROWN_LEGS', 'GREY_LEGS',
            'BLACK_FEET', 'WHITE_FEET', 'BROWN_FEET', 'LIGHT_BROWN_FEET', 'GREY_FEET',
            'BLACK_SPOTS', 'BROWN_SPOTS', 'LIGHT_BROWN_SPOTS', 'GREY_SPOTS',
            'BLACK_PATTERN', 'BROWN_PATTERN'
          );
        END IF;
      END $$;
    `);
        await queryRunner.query(`
      ALTER TABLE public.cattle
      ADD COLUMN IF NOT EXISTS color colors_enum;
    `);
        await queryRunner.query(`
      UPDATE public.cattle c
      SET color = CASE
        WHEN lower(col.name) = 'black' THEN 'BLACK'::colors_enum
        WHEN lower(col.name) = 'white' THEN 'WHITE'::colors_enum
        WHEN lower(col.name) = 'brown' THEN 'BROWN'::colors_enum
        WHEN lower(col.name) = 'brown and black' THEN 'BLACK_BROWN'::colors_enum
        WHEN lower(col.name) = 'light brown' THEN 'LIGHT_BROWN'::colors_enum
        WHEN lower(col.name) = 'grey' THEN 'GREY'::colors_enum
        ELSE 'WHITE'::colors_enum
      END
      FROM public.colors col
      WHERE c.id_color IS NOT NULL
        AND col.id = c.id_color;
    `);
        await queryRunner.query(`
      UPDATE public.cattle
      SET color = 'WHITE'::colors_enum
      WHERE color IS NULL;
    `);
        await queryRunner.query(`
      ALTER TABLE public.cattle
      ALTER COLUMN color SET DEFAULT 'WHITE';
    `);
        await queryRunner.query(`
      ALTER TABLE public.cattle
      ALTER COLUMN color SET NOT NULL;
    `);
        await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_schema='public' AND table_name='cattle_characteristics'
        ) THEN
          CREATE TABLE public.cattle_characteristics (
            id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            id_tenant      uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
            id_cattle      uuid NOT NULL REFERENCES public.cattle(id) ON DELETE CASCADE,
            characteristic characteristics_enum NOT NULL,
            created_at     timestamp NOT NULL DEFAULT now()
          );

          CREATE UNIQUE INDEX ux_cattle_characteristics_unique
          ON public.cattle_characteristics (id_cattle, characteristic);

          CREATE INDEX idx_cattle_characteristics_tenant
          ON public.cattle_characteristics (id_tenant, id_cattle);
        END IF;
      END $$;
    `);
        await queryRunner.query(`
      ALTER TABLE public.cattle_characteristics
      ADD COLUMN IF NOT EXISTS characteristic characteristics_enum;
    `);
        await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema='public'
            AND table_name='cattle_characteristics'
            AND column_name='id_characteristic'
        ) THEN
          -- Map existing id_characteristic -> enum via characteristics.name
          UPDATE public.cattle_characteristics cc
          SET characteristic = CASE
            WHEN lower(chr.name) = 'black belly' THEN 'BLACK_BELLY'::characteristics_enum
            WHEN lower(chr.name) = 'black half head' THEN 'BLACK_HALF_HEAD'::characteristics_enum
            WHEN lower(chr.name) = 'black head' THEN 'BLACK_HEAD'::characteristics_enum
            WHEN lower(chr.name) = 'black legs' THEN 'BLACK_LEGS'::characteristics_enum
            WHEN lower(chr.name) = 'black pattern' THEN 'BLACK_PATTERN'::characteristics_enum

            WHEN lower(chr.name) = 'grey belly' THEN 'GREY_BELLY'::characteristics_enum

            WHEN lower(chr.name) = 'white belly' THEN 'WHITE_BELLY'::characteristics_enum
            WHEN lower(chr.name) = 'white head' THEN 'WHITE_HEAD'::characteristics_enum
            WHEN lower(chr.name) = 'white feet' THEN 'WHITE_FEET'::characteristics_enum

            WHEN lower(chr.name) = 'brown pattern' THEN 'BROWN_PATTERN'::characteristics_enum
            WHEN lower(chr.name) = 'brown spots' THEN 'BROWN_SPOTS'::characteristics_enum
            WHEN lower(chr.name) = 'brown and white spot on head' THEN 'BROWN_SPOTS'::characteristics_enum
            WHEN lower(chr.name) = 'brown' THEN 'BROWN_PATTERN'::characteristics_enum

            -- Special case:
            WHEN lower(chr.name) = 'white belly and head' THEN 'WHITE_BELLY'::characteristics_enum
            ELSE NULL
          END
          FROM public.characteristics chr
          WHERE chr.id = cc.id_characteristic;

          -- Insert extra row WHITE_HEAD for "White belly and head"
          -- ✅ IMPORTANT FIX:
          -- Use the characteristics.id of "White head" (same tenant) as id_characteristic
          -- so we don't violate the existing unique (id_cattle, id_characteristic).
          INSERT INTO public.cattle_characteristics (id_tenant, id_cattle, id_characteristic, characteristic, created_at)
          SELECT
            cc.id_tenant,
            cc.id_cattle,
            chr_head.id AS id_characteristic,
            'WHITE_HEAD'::characteristics_enum,
            cc.created_at
          FROM public.cattle_characteristics cc
          INNER JOIN public.characteristics chr_bh
            ON chr_bh.id = cc.id_characteristic
          INNER JOIN public.characteristics chr_head
            ON chr_head.id_tenant = cc.id_tenant
           AND lower(chr_head.name) = 'white head'
          WHERE lower(chr_bh.name) = 'white belly and head'
            AND NOT EXISTS (
              SELECT 1
              FROM public.cattle_characteristics cc2
              WHERE cc2.id_cattle = cc.id_cattle
                AND cc2.id_characteristic = chr_head.id
            );

          -- Remove unmapped rows to avoid failing when we enforce NOT NULL on characteristic
          DELETE FROM public.cattle_characteristics
          WHERE characteristic IS NULL;
        END IF;
      END $$;
    `);
        await queryRunner.query(`
      ALTER TABLE public.cattle_characteristics
      ALTER COLUMN characteristic SET NOT NULL;
    `);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_cattle_characteristics_chr;`);
        await queryRunner.query(`DROP INDEX IF EXISTS ux_cattle_characteristics_unique;`);
        await queryRunner.query(`
      DO $$
      DECLARE
        fk_name text;
      BEGIN
        SELECT conname INTO fk_name
        FROM pg_constraint
        WHERE conrelid = 'public.cattle_characteristics'::regclass
          AND contype = 'f'
          AND confrelid = 'public.characteristics'::regclass
        LIMIT 1;

        IF fk_name IS NOT NULL THEN
          EXECUTE format('ALTER TABLE public.cattle_characteristics DROP CONSTRAINT %I', fk_name);
        END IF;
      END $$;
    `);
        await queryRunner.query(`
      ALTER TABLE public.cattle_characteristics
      DROP COLUMN IF EXISTS id_characteristic;
    `);
        await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS ux_cattle_characteristics_unique
      ON public.cattle_characteristics (id_cattle, characteristic);
    `);
        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_cattle_characteristics_tenant
      ON public.cattle_characteristics (id_tenant, id_cattle);
    `);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_cattle_id_color;`);
        await queryRunner.query(`ALTER TABLE public.cattle DROP COLUMN IF EXISTS id_color;`);
        await queryRunner.query(`DROP INDEX IF EXISTS ux_colors_tenant_name_ci;`);
        await queryRunner.query(`DROP TABLE IF EXISTS public.colors;`);
        await queryRunner.query(`DROP INDEX IF EXISTS ux_characteristics_tenant_name_ci;`);
        await queryRunner.query(`DROP TABLE IF EXISTS public.characteristics;`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE public.cattle ADD COLUMN IF NOT EXISTS color_description varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE public.cattle ADD COLUMN IF NOT EXISTS color_main varchar(25) NULL`);
        await queryRunner.query(`ALTER TABLE public.cattle ADD COLUMN IF NOT EXISTS color_feature varchar(25) NULL`);
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
      INSERT INTO public.colors (id_tenant, name, is_active)
      SELECT t.id AS id_tenant, v.name, true
      FROM public.tenants t
      CROSS JOIN (
        SELECT 'Black'  AS name
        UNION ALL SELECT 'White'
        UNION ALL SELECT 'Brown'
        UNION ALL SELECT 'Brown and black'
        UNION ALL SELECT 'Light brown'
        UNION ALL SELECT 'Grey'
      ) v
      ON CONFLICT (id_tenant, lower(name)) DO NOTHING;
    `);
        await queryRunner.query(`
      ALTER TABLE public.cattle
      ADD COLUMN IF NOT EXISTS id_color uuid NULL REFERENCES public.colors(id) ON DELETE SET NULL;
    `);
        await queryRunner.query(`
      UPDATE public.cattle c
      SET id_color = col.id
      FROM public.colors col
      WHERE col.id_tenant = c.id_tenant
        AND lower(col.name) = lower(
          CASE c.color
            WHEN 'BLACK' THEN 'Black'
            WHEN 'WHITE' THEN 'White'
            WHEN 'BROWN' THEN 'Brown'
            WHEN 'BLACK_BROWN' THEN 'Brown and black'
            WHEN 'LIGHT_BROWN' THEN 'Light brown'
            WHEN 'GREY' THEN 'Grey'
          END
        );
    `);
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
      INSERT INTO public.characteristics (id_tenant, name, group_name, is_active)
      SELECT t.id AS id_tenant, v.name, NULL, true
      FROM public.tenants t
      CROSS JOIN (
        SELECT 'Black belly' AS name
        UNION ALL SELECT 'White belly'
        UNION ALL SELECT 'Brown belly'
        UNION ALL SELECT 'Light brown belly'
        UNION ALL SELECT 'Grey belly'

        UNION ALL SELECT 'Black head'
        UNION ALL SELECT 'White head'
        UNION ALL SELECT 'Brown head'
        UNION ALL SELECT 'Light brown head'
        UNION ALL SELECT 'Grey head'

        UNION ALL SELECT 'Black half head'
        UNION ALL SELECT 'White half head'
        UNION ALL SELECT 'Brown half head'
        UNION ALL SELECT 'Light brown half head'
        UNION ALL SELECT 'Grey half head'

        UNION ALL SELECT 'Black legs'
        UNION ALL SELECT 'White legs'
        UNION ALL SELECT 'Brown legs'
        UNION ALL SELECT 'Light brown legs'
        UNION ALL SELECT 'Grey legs'

        UNION ALL SELECT 'Black feet'
        UNION ALL SELECT 'White feet'
        UNION ALL SELECT 'Brown feet'
        UNION ALL SELECT 'Light brown feet'
        UNION ALL SELECT 'Grey feet'

        UNION ALL SELECT 'Black spots'
        UNION ALL SELECT 'Brown spots'
        UNION ALL SELECT 'Light brown spots'
        UNION ALL SELECT 'Grey spots'

        UNION ALL SELECT 'Black pattern'
        UNION ALL SELECT 'Brown pattern'
      ) v
      ON CONFLICT (id_tenant, lower(name)) DO NOTHING;
    `);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_cattle_characteristics_tenant;`);
        await queryRunner.query(`DROP INDEX IF EXISTS ux_cattle_characteristics_unique;`);
        await queryRunner.query(`
      ALTER TABLE public.cattle_characteristics
      ADD COLUMN IF NOT EXISTS id_characteristic uuid;
    `);
        await queryRunner.query(`
      UPDATE public.cattle_characteristics cc
      SET id_characteristic = chr.id
      FROM public.characteristics chr
      WHERE chr.id_tenant = cc.id_tenant
        AND lower(chr.name) = lower(
          CASE cc.characteristic
            WHEN 'BLACK_BELLY' THEN 'Black belly'
            WHEN 'WHITE_BELLY' THEN 'White belly'
            WHEN 'BROWN_BELLY' THEN 'Brown belly'
            WHEN 'LIGHT_BROWN_BELLY' THEN 'Light brown belly'
            WHEN 'GREY_BELLY' THEN 'Grey belly'

            WHEN 'BLACK_HEAD' THEN 'Black head'
            WHEN 'WHITE_HEAD' THEN 'White head'
            WHEN 'BROWN_HEAD' THEN 'Brown head'
            WHEN 'LIGHT_BROWN_HEAD' THEN 'Light brown head'
            WHEN 'GREY_HEAD' THEN 'Grey head'

            WHEN 'BLACK_HALF_HEAD' THEN 'Black half head'
            WHEN 'WHITE_HALF_HEAD' THEN 'White half head'
            WHEN 'BROWN_HALF_HEAD' THEN 'Brown half head'
            WHEN 'LIGHT_BROWN_HALF_HEAD' THEN 'Light brown half head'
            WHEN 'GREY_HALF_HEAD' THEN 'Grey half head'

            WHEN 'BLACK_LEGS' THEN 'Black legs'
            WHEN 'WHITE_LEGS' THEN 'White legs'
            WHEN 'BROWN_LEGS' THEN 'Brown legs'
            WHEN 'LIGHT_BROWN_LEGS' THEN 'Light brown legs'
            WHEN 'GREY_LEGS' THEN 'Grey legs'

            WHEN 'BLACK_FEET' THEN 'Black feet'
            WHEN 'WHITE_FEET' THEN 'White feet'
            WHEN 'BROWN_FEET' THEN 'Brown feet'
            WHEN 'LIGHT_BROWN_FEET' THEN 'Light brown feet'
            WHEN 'GREY_FEET' THEN 'Grey feet'

            WHEN 'BLACK_SPOTS' THEN 'Black spots'
            WHEN 'BROWN_SPOTS' THEN 'Brown spots'
            WHEN 'LIGHT_BROWN_SPOTS' THEN 'Light brown spots'
            WHEN 'GREY_SPOTS' THEN 'Grey spots'

            WHEN 'BLACK_PATTERN' THEN 'Black pattern'
            WHEN 'BROWN_PATTERN' THEN 'Brown pattern'
          END
        );
    `);
        await queryRunner.query(`
      ALTER TABLE public.cattle_characteristics
      ALTER COLUMN id_characteristic SET NOT NULL;
    `);
        await queryRunner.query(`
      ALTER TABLE public.cattle_characteristics
      ADD CONSTRAINT fk_cattle_characteristics_characteristic
      FOREIGN KEY (id_characteristic)
      REFERENCES public.characteristics(id)
      ON DELETE RESTRICT;
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
      ALTER TABLE public.cattle_characteristics
      DROP COLUMN IF EXISTS characteristic;
    `);
        await queryRunner.query(`
      ALTER TABLE public.cattle
      DROP COLUMN IF EXISTS color;
    `);
        await queryRunner.query(`DROP TYPE IF EXISTS characteristics_enum;`);
        await queryRunner.query(`DROP TYPE IF EXISTS colors_enum;`);
    }
}
exports.ImproveColorsAndCharacteristics1710000000019 = ImproveColorsAndCharacteristics1710000000019;
//# sourceMappingURL=1710000000019-ImproveColorsAndCharacteristics.js.map