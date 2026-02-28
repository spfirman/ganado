import { SimpleEventType } from '../enums/simple-event-type.enum';
import { ValidationOptions } from 'class-validator';
export declare function ValidateDataFields(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
export declare class CreateSimpleEventDto {
    idMassiveEvent: string;
    type: SimpleEventType;
    data?: any;
}
