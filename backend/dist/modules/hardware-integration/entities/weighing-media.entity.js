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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeighingMedia = void 0;
const typeorm_1 = require("typeorm");
const weighing_entity_1 = require("./weighing.entity");
const weighing_source_enum_1 = require("../enums/weighing-source.enum");
let WeighingMedia = class WeighingMedia {
};
exports.WeighingMedia = WeighingMedia;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WeighingMedia.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_tenant', type: 'uuid' }),
    __metadata("design:type", String)
], WeighingMedia.prototype, "idTenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'weighing_id', type: 'uuid' }),
    __metadata("design:type", String)
], WeighingMedia.prototype, "weighingId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => weighing_entity_1.Weighing, (weighing) => weighing.media, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'weighing_id' }),
    __metadata("design:type", weighing_entity_1.Weighing)
], WeighingMedia.prototype, "weighing", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: weighing_source_enum_1.WeighingMediaType,
        enumName: 'weighing_media_type_enum',
    }),
    __metadata("design:type", String)
], WeighingMedia.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], WeighingMedia.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'thumbnail_url', type: 'text', nullable: true }),
    __metadata("design:type", String)
], WeighingMedia.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'captured_at', type: 'timestamp with time zone', nullable: true }),
    __metadata("design:type", Date)
], WeighingMedia.prototype, "capturedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_size_bytes', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], WeighingMedia.prototype, "fileSizeBytes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], WeighingMedia.prototype, "createdAt", void 0);
exports.WeighingMedia = WeighingMedia = __decorate([
    (0, typeorm_1.Entity)('weighing_media')
], WeighingMedia);
//# sourceMappingURL=weighing-media.entity.js.map