import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { SimpleEventType } from '../enums/simple-event-type.enum';

export function ValidateDataFields(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'ValidateDataFields',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(data: any, args: ValidationArguments) {
          const obj = args.object as any;
          const type = obj.type;
          if (type !== 'medication' && type !== 'brand' && type !== 'eartag') return true;
          if (typeof data !== 'object' || data === null) return false;
          if (type === 'medication') {
            const requiredKeys = ['medicationName', 'dosage', 'lot'];
            const dataKeys = Object.keys(data);
            const hasAllKeys = requiredKeys.every((k) => dataKeys.includes(k));
            if (!hasAllKeys) return false;
            return requiredKeys.every(
              (key) => typeof data[key] === 'string' && data[key].trim().length > 0,
            );
          }
          if (type === 'eartag') {
            const left = typeof data.eartagLeft === 'string' ? data.eartagLeft.trim() : '';
            const right = typeof data.eartagRight === 'string' ? data.eartagRight.trim() : '';
            return left.length > 0 || right.length > 0;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const obj = args.object as any;
          if (obj.type === 'medication') {
            return `Para type "medication", 'data' debe incluir 'medicationName', 'dosage' y 'lot', y todos deben ser strings no vacios`;
          }
          if (obj.type === 'eartag') {
            return `Para type "eartag", 'data' debe incluir 'eartagLeft' o 'eartagRight' con valor no vacio`;
          }
          return `Los campos en 'data' no pueden estar vacios para el tipo ${obj.type}`;
        },
      },
    });
  };
}

export class CreateSimpleEventDto {
  @ApiProperty({
    description: 'ID del evento masivo al que pertenece este simpleEvent',
    example: 'uuid-massive-event-123',
  })
  @IsNotEmpty()
  idMassiveEvent: string;

  @ApiProperty({
    description: 'Tipo de evento simple',
    enum: ['weight', 'eartag', 'tracker', 'brand', 'castration', 'medication'],
    example: 'medication',
  })
  @IsNotEmpty()
  @IsEnum(SimpleEventType)
  type: string;

  @ApiPropertyOptional({
    description:
      'Datos especificos del evento simple. Para eartag: { eartagLeft: "ET-001", eartagRight: "ET-002" }. Para brand: { idBrand: "abc123" }. Para medication: { medicationName: "med123", dosage: "1ml/50kg", lot: "123" }',
    example: { medicationName: 'med123', dosage: '1ml/50kg', lot: '123' },
  })
  @IsOptional()
  @ValidateDataFields()
  data?: any;
}
