import { Module } from '@nestjs/common';
import { AiTestingController } from './ai-testing.controller';

@Module({
  controllers: [AiTestingController],
})
export class AiTestingModule {}
