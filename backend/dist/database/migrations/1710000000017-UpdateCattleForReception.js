"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCattleForReception1710000000017 = void 0;
class UpdateCattleForReception1710000000017 {
    constructor() {
        this.name = 'UpdateCattleForReception1710000000017';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE public.cattle ALTER COLUMN purchased_from DROP NOT NULL;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_cattle_id_color;`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_cattle_id_color ON public.cattle (id_tenant, id_color);`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_cattle_status;`);
        await queryRunner.query(`DROP INDEX IF EXISTS ix_cattle_tenant_number;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_cattle_tenant_sys_number;`);
        await queryRunner.query(`CREATE UNIQUE INDEX uq_cattle_tenant_sysnumber ON public.cattle (id_tenant, sys_number)`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_purchase_receptions_tenant_purchase`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_cattle_characteristics_chr`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_cattle_char_tenant_cattle ON public.cattle_characteristics (id_tenant, id_cattle)`);
        await queryRunner.query(`DROP INDEX IF EXISTS ux_cattle_characteristics_unique`);
        await queryRunner.query(`CREATE UNIQUE INDEX ux_cattle_characteristics_unique ON public.cattle_characteristics (id_tenant, id_cattle, id_characteristic)`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_purchase_tenant ON public.purchases (id_tenant)`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_massive_event_tenant ON public.massive_events (id_tenant)`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_simple_event_tenant ON public.simple_events (id_tenant)`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_simple_event_tenant_massiveEvent ON public.simple_events (id_tenant, id_massive_event)`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_purchase_receptions_mass_event;`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_animal_simp_even_tentant_cattle ON public.animal_simple_event (id_tenant, id_animal)`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS idx_cattle_id_color;`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_cattle_id_color ON public.cattle (id_color);`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_cattle_status ON public.cattle (status);`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS ix_cattle_tenant_number ON public.cattle (id_tenant, number);`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_cattle_tenant_sys_number ON public.cattle (id_tenant, sys_number);`);
        await queryRunner.query(`DROP INDEX IF EXISTS uq_cattle_tenant_sysnumber;`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_purchase_receptions_tenant_purchase ON public.purchase_receptions (id_tenant, id_purchase)`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_cattle_char_tenant_cattle`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_cattle_characteristics_chr ON public.cattle_characteristics (id_characteristic)`);
        await queryRunner.query(`DROP INDEX IF EXISTS ux_cattle_characteristics_unique`);
        await queryRunner.query(`CREATE UNIQUE INDEX ux_cattle_characteristics_unique ON public.cattle_characteristics (id_cattle, id_characteristic)`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_purchase_tenant`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_massive_event_tenant`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_simple_event_tenant`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_simple_event_tenant_masiveEvent`);
        await queryRunner.query(`
        CREATE INDEX IF NOT EXISTS idx_purchase_receptions_mass_event
        ON public.purchase_receptions (id_massive_event);
      `);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_animal_simp_even_tentant_cattle`);
    }
}
exports.UpdateCattleForReception1710000000017 = UpdateCattleForReception1710000000017;
//# sourceMappingURL=1710000000017-UpdateCattleForReception.js.map