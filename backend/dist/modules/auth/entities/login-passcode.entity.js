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
exports.LoginPasscode = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../employee-management/entities/user.entity");
let LoginPasscode = class LoginPasscode {
};
exports.LoginPasscode = LoginPasscode;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LoginPasscode.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], LoginPasscode.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], LoginPasscode.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'code_hash', length: 64 }),
    __metadata("design:type", String)
], LoginPasscode.prototype, "codeHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expires_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], LoginPasscode.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], LoginPasscode.prototype, "used", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], LoginPasscode.prototype, "attempts", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], LoginPasscode.prototype, "createdAt", void 0);
exports.LoginPasscode = LoginPasscode = __decorate([
    (0, typeorm_1.Entity)('login_passcodes')
], LoginPasscode);
//# sourceMappingURL=login-passcode.entity.js.map