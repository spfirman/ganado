"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CattleRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cattle_entity_1 = require("../entities/cattle.entity");
const cattle_characteristic_entity_1 = require("../entities/cattle-characteristic.entity");
let CattleRepository = class CattleRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async create(cattleDto, manager) {
        const repo = manager?.getRepository(cattle_entity_1.Cattle) ?? this.repository;
        const entity = repo.create(cattleDto);
        return repo.save(entity);
    }
    async save(cattle) {
        return this.repository.save(cattle);
    }
    async saveWithManager(manager, cattle) {
        return manager.save(cattle_entity_1.Cattle, cattle);
    }
    async findOne(idTenant, id, manager) {
        const repo = manager?.getRepository(cattle_entity_1.Cattle) ?? this.repository;
        return repo.findOne({ where: { idTenant, id } });
    }
    async findOneWithManager(manager, idTenant, id) {
        return manager.findOne(cattle_entity_1.Cattle, { where: { idTenant, id } });
    }
    async unsetDevice(idTenant, idDevice, manager) {
        const repo = manager?.getRepository(cattle_entity_1.Cattle) ?? this.repository;
        await repo.update({ idTenant, idDevice }, { idDevice: null });
    }
    async findById(idTenant, id, manager) {
        const repo = manager?.getRepository(cattle_entity_1.Cattle) ?? this.repository;
        return repo.findOne({ where: { idTenant, id } });
    }
    async findByIds(idTenant, ids) {
        return this.repository.find({ where: { idTenant, id: (0, typeorm_2.In)(ids) } });
    }
    async findByIdPurchaseWithoutLot(idTenant, idPurchase, manager) {
        const repo = manager?.getRepository(cattle_entity_1.Cattle) ?? this.repository;
        const qb = repo
            .createQueryBuilder('c')
            .leftJoinAndSelect('c.device', 'd')
            .where('c.idTenant = :idTenant', { idTenant })
            .andWhere('c.idPurchase = :idPurchase', { idPurchase })
            .andWhere('c.idLot IS NULL');
        qb.addSelect(`CASE
        WHEN c.number ~ '^[0-9]+$' THEN c.number::int
        ELSE NULL
      END`, 'number_sort');
        qb.orderBy('number_sort', 'ASC');
        qb.addOrderBy('c.number', 'ASC');
        return qb.getMany();
    }
    async findByIdLot(idTenant, idLot, manager) {
        const repo = manager?.getRepository(cattle_entity_1.Cattle) ?? this.repository;
        const qb = repo
            .createQueryBuilder('c')
            .leftJoinAndSelect('c.device', 'd')
            .where('c.idTenant = :idTenant', { idTenant })
            .andWhere('c.idLot = :idLot', { idLot });
        qb.addSelect(`CASE
        WHEN c.number ~ '^[0-9]+$' THEN c.number::int
        ELSE NULL
      END`, 'number_sort');
        qb.orderBy('number_sort', 'ASC');
        qb.addOrderBy('c.number', 'ASC');
        return qb.getMany();
    }
    async findAll(idTenant) {
        return this.repository.find({
            where: { idTenant },
            relations: ['cattleCharacteristics', 'device'],
            order: { number: 'ASC' },
        });
    }
    async update(idTenant, id, cattleDto, manager) {
        const repo = manager?.getRepository(cattle_entity_1.Cattle) ?? this.repository;
        const m = manager ?? this.repository.manager;
        if (cattleDto.characteristics) {
            await m.delete(cattle_characteristic_entity_1.CattleCharacteristic, { idCattle: id, idTenant: idTenant });
            const charEntities = cattleDto.characteristics.map((charName) => m.create(cattle_characteristic_entity_1.CattleCharacteristic, {
                idTenant: { id: idTenant },
                idCattle: id,
                characteristic: charName,
            }));
            await m.save(cattle_characteristic_entity_1.CattleCharacteristic, charEntities);
            delete cattleDto.characteristics;
        }
        await repo.update({ idTenant, id }, cattleDto);
        return this.findOne(idTenant, id);
    }
    async delete(idTenant, id) {
        await this.repository.delete({ idTenant, id });
    }
    async findBySysNumberAndTenantId(idTenant, sysNumber, manager) {
        const repo = manager?.getRepository(cattle_entity_1.Cattle) ?? this.repository;
        return repo.findOne({ where: { idTenant, sysNumber } });
    }
    async findByNumberAndTenantId(idTenant, number, manager) {
        const repo = manager?.getRepository(cattle_entity_1.Cattle) ?? this.repository;
        return repo.findOne({ where: { idTenant, number } });
    }
    async findOneForUpdateByNumber(idTenant, number, manager) {
        try {
            return manager.getRepository(cattle_entity_1.Cattle).findOne({
                where: { idTenant, number },
                lock: { mode: 'pessimistic_write' },
            });
        }
        catch (err) {
            if (err instanceof typeorm_2.QueryFailedError) {
                const pgCode = err.driverError?.code;
                if (pgCode === '55P03') {
                    throw new common_1.HttpException('Resource is locked', common_1.HttpStatus.LOCKED);
                }
                if (pgCode === '40P01') {
                    throw new common_1.ConflictException('A deadlock occurred, please retry.');
                }
            }
            throw err;
        }
    }
    async findByAnyEartag(idTenant, eartag, manager) {
        const repo = manager?.getRepository(cattle_entity_1.Cattle) ?? this.repository;
        return repo
            .createQueryBuilder('c')
            .where('c.idTenant = :idTenant', { idTenant })
            .andWhere('(c.eartagLeft = :eartag OR c.eartagRight = :eartag)', { eartag })
            .getOne();
    }
    async getBasicInfo(idTenant, manager) {
        const repo = manager?.getRepository(cattle_entity_1.Cattle) ?? this.repository;
        return repo.find({
            where: { idTenant },
            select: {
                id: true,
                number: true,
                sysNumber: true,
            },
        });
    }
    async listPaged(idTenant, query, page, limit, manager) {
        const repo = manager?.getRepository(cattle_entity_1.Cattle) ?? this.repository;
        const qb = repo
            .createQueryBuilder('c')
            .leftJoinAndSelect('c.cattleCharacteristics', 'cc')
            .leftJoinAndSelect('c.device', 'd')
            .addSelect(`CASE WHEN c.number ~ '^[0-9]+$' THEN c.number::int ELSE NULL END`, 'numeric_number')
            .where('c.idTenant = :idTenant', { idTenant })
            .orderBy('c.status', 'ASC')
            .addOrderBy('numeric_number', 'ASC')
            .addOrderBy('c.number', 'ASC')
            .skip((page - 1) * limit)
            .take(limit);
        const [rows, total] = await qb.getManyAndCount();
        return { rows, total };
    }
    async getBasicInfoPaged(input) {
        const { idTenant, limit, cursor, updatedAfter } = input;
        let lastUpdatedAt = null;
        let lastId = null;
        if (cursor) {
            try {
                const decoded = JSON.parse(Buffer.from(cursor, 'base64').toString('utf8'));
                if (decoded?.updatedAt)
                    lastUpdatedAt = new Date(decoded.updatedAt);
                if (decoded?.id)
                    lastId = String(decoded.id);
            }
            catch {
            }
        }
        const qb = this.repository
            .createQueryBuilder('c')
            .where('c.idTenant = :idTenant', { idTenant });
        if (updatedAfter) {
            qb.andWhere('c.updatedAt > :updatedAfter', { updatedAfter });
        }
        if (lastUpdatedAt && lastId) {
            qb.andWhere('(c.updatedAt > :lastUpdatedAt OR (c.updatedAt = :lastUpdatedAt AND c.id > :lastId))', { lastUpdatedAt, lastId });
        }
        qb.select(['c.id', 'c.number', 'c.sysNumber', 'c.updatedAt'])
            .orderBy('c.updatedAt', 'ASC')
            .addOrderBy('c.id', 'ASC')
            .limit(limit + 1);
        const rows = await qb.getMany();
        const hasMore = rows.length > limit;
        const pageItems = hasMore ? rows.slice(0, limit) : rows;
        let nextCursor = null;
        if (hasMore) {
            const last = pageItems[pageItems.length - 1];
            nextCursor = Buffer.from(JSON.stringify({
                updatedAt: last.updatedAt.toISOString(),
                id: last.id,
            }), 'utf8').toString('base64');
        }
        const items = pageItems.map((r) => ({
            idTenant: r.idTenant,
            id: r.id,
            number: r.number,
            sysNumber: r.sysNumber,
        }));
        return {
            items,
            nextCursor,
            hasMore,
            total: null,
        };
    }
    nextCandidateCattleNumber(number) {
        if (!number)
            throw new Error('Cattle number is empty');
        const trailing = number.match(/^(.*?)(\d+)$/);
        if (trailing) {
            const prefix = trailing[1];
            const numericPart = trailing[2];
            const next = (Number(numericPart) + 1)
                .toString()
                .padStart(numericPart.length, '0');
            return `${prefix}${next}`;
        }
        const leading = number.match(/^(\d+)(.*)$/);
        if (leading) {
            const numericPart = leading[1];
            const suffix = leading[2];
            const next = (Number(numericPart) + 1)
                .toString()
                .padStart(numericPart.length, '0');
            return `${next}${suffix}`;
        }
        return `${number}1`;
    }
    async getSuggestNextNumber(idTenant, number, manager) {
        const repo = manager?.getRepository(cattle_entity_1.Cattle) ?? this.repository;
        let candidate = this.nextCandidateCattleNumber(number);
        const MAX_TRIES = 5000;
        for (let i = 0; i < MAX_TRIES; i++) {
            const isTaken = await repo.existsBy({
                idTenant,
                status: cattle_entity_1.CattleStatus.ACTIVE,
                number: candidate,
            });
            if (!isTaken) {
                return candidate;
            }
            candidate = this.nextCandidateCattleNumber(candidate);
        }
        throw new Error(`Could not find a free cattle number after ${MAX_TRIES} attempts starting from "${number}"`);
    }
    async lockForTenant(tenantId, manager) {
        const m = manager ?? this.repository;
        await m.query(`SELECT pg_advisory_xact_lock(hashtext($1))`, [
            `${tenantId}:cattle_number`,
        ]);
    }
    async search(idTenant, query, statuses, manager) {
        const repo = manager?.getRepository(cattle_entity_1.Cattle) ?? this.repository;
        const qb = repo
            .createQueryBuilder('c')
            .leftJoinAndSelect('c.device', 'd')
            .where('c.idTenant = :idTenant', { idTenant })
            .andWhere('c.status IN (:...statuses)', { statuses })
            .andWhere('(c.number ILIKE :query OR c.eartagLeft ILIKE :query OR c.eartagRight ILIKE :query OR d.name ILIKE :query OR d.deveui ILIKE :query)', { query: `%${query}%` })
            .limit(20);
        return qb.getMany();
    }
};
exports.CattleRepository = CattleRepository;
exports.CattleRepository = CattleRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cattle_entity_1.Cattle)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CattleRepository);
//# sourceMappingURL=cattle.repository.js.map