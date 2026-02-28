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
exports.CreateSimpleEventDto = void 0;
exports.ValidateDataFields = ValidateDataFields;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const simple_event_type_enum_1 = require("../enums/simple-event-type.enum");
const class_validator_2 = require("class-validator");
function ValidateDataFields(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_2.registerDecorator)({
            name: 'ValidateDataFields',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(data, args) {
                    const obj = args.object;
                    const type = obj.type;
                    if (type !== 'medication' && type !== 'brand' && type !== 'eartag')
                        return true;
                    if (typeof data !== 'object' || data === null)
                        return false;
                    if (type === 'medication') {
                        const requiredKeys = ['medicationName', 'dosage', 'lot'];
                        const dataKeys = Object.keys(data);
                        const hasAllKeys = requiredKeys.every((k) => dataKeys.includes(k));
                        if (!hasAllKeys)
                            return false;
                        return requiredKeys.every((key) => typeof data[key] === 'string' && data[key].trim().length > 0);
                    }
                    if (type === 'eartag') {
                        const left = typeof data.eartagLeft === 'string' ? data.eartagLeft.trim() : '';
                        const right = typeof data.eartagRight === 'string' ? data.eartagRight.trim() : '';
                        return left.length > 0 || right.length > 0;
                    }
                    return true;
                },
                defaultMessage(args) {
                    const obj = args.object;
                    if (obj.type === 'medication') {
                        return `Para type "medication", 'data' debe incluir 'medicationName', 'dosage' y 'lot', y todos deben ser strings no vacíos`;
                    }
                    if (obj.type === 'eartag') {
                        return `Para type "eartag", 'data' debe incluir 'eartagLeft' o 'eartagRight' con valor no vacío`;
                    }
                    return `Los campos en 'data' no pueden estar vacíos para el tipo ${obj.type}`;
                },
            },
        });
    };
}
class CreateSimpleEventDto {
    idMassiveEvent;
    type;
    data;
}
exports.CreateSimpleEventDto = CreateSimpleEventDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del evento masivo al que pertenece este simpleEvent',
        example: 'uuid-massive-event-123',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSimpleEventDto.prototype, "idMassiveEvent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de evento simple',
        enum: ['weight', 'eartag', 'tracker', 'brand', 'castration', 'medication'],
        example: 'medication',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(simple_event_type_enum_1.SimpleEventType),
    __metadata("design:type", String)
], CreateSimpleEventDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Datos específicos del evento simple. Para eartag: { eartagLeft: "ET-001", eartagRight: "ET-002" }. Para brand: { idBrand: "abc123" }. Para medication: { medicationName: "med123", dosage: "1ml/50kg", lot: "123" }',
        example: { medicationName: 'med123', dosage: '1ml/50kg', lot: '123' },
    }),
    (0, class_validator_1.IsOptional)(),
    ValidateDataFields(),
    __metadata("design:type", Object)
], CreateSimpleEventDto.prototype, "data", void 0);
//# sourceMappingURL=create-simple-event.dto.js.map