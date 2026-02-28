"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateConfigurationTable1710000000016 = void 0;
class CreateConfigurationTable1710000000016 {
    name = 'CreateConfigurationTable1710000000016';
    async up(queryRunner) {
        await queryRunner.query(`
       CREATE TABLE IF NOT EXISTS public.configurations (
         id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
         id_tenant        uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
         code             varchar(100) NOT NULL,
         is_system_config boolean NOT NULL DEFAULT false,
         name             varchar(100) NOT NULL,
         description      varchar(255),
         value            varchar(255),
         value_type       varchar(255),
         created_at       timestamp NOT NULL DEFAULT now(),
         updated_at       timestamp NOT NULL DEFAULT now(),
         updated_by       uuid REFERENCES public.users(id) ON DELETE SET NULL
       );
     `);
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_configuration_tenant_code ON public.configurations (id_tenant, lower(code));`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_configuration_tenant ON public.configurations (id_tenant);`);
        await queryRunner.query(`
      INSERT INTO public.configurations (id_tenant, code, is_system_config, name, description, value, value_type, created_at, updated_at)
      SELECT t.id, 
            'next_cattle_sysnumber', 
            true,
            'Next cattle Sysnumber', 
            'Next sysnumber assignment for new cattle', 
            '1', 
            'number',
            now(),
            now()
      FROM public.tenants t
      WHERE NOT EXISTS (
        SELECT 1 
        FROM public.configurations c 
        WHERE c.id_tenant = t.id 
          AND lower(c.code) = 'next_cattle_sysnumber'
      );
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS public.configurations;`);
        await queryRunner.query(`DROP INDEX IF EXISTS uq_configuration_tenant_code;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_configuration_tenant;`);
    }
}
exports.CreateConfigurationTable1710000000016 = CreateConfigurationTable1710000000016;
//# sourceMappingURL=1710000000016-CreateConfigurationTable.js.map