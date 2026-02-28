import { CreateLotDto } from './create-lot.dto';
export declare class CreatePurchaseDto {
    idProvider: string;
    purchaseDate: string;
    lots: CreateLotDto[];
}
