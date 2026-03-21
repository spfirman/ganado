import { Expose } from 'class-transformer';

export class CattleResponseDto {
  @Expose()
  id: string;

  @Expose()
  idDevice: string;

  @Expose()
  deveui: string;

  @Expose()
  sysNumber: string;

  @Expose()
  number: string;

  @Expose()
  brand: string;

  @Expose()
  characteristics: string[];

  @Expose()
  receivedAt: string;

  @Expose()
  receivedWeight: number;

  @Expose()
  purchaseWeight: number;

  @Expose()
  comments: string;

  @Expose()
  purchasedFrom: string;

  @Expose()
  purchasePrice: number;

  @Expose()
  purchaseCommission: number;

  @Expose()
  negotiatedPricePerKg: number;

  @Expose()
  lotPricePerWeight: number;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
