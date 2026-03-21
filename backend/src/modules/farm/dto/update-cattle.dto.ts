import { PartialType } from '@nestjs/mapped-types';
import { CreateCattleDto } from './create-cattle.dto';

export class UpdateCattleDto extends PartialType(CreateCattleDto) {}
