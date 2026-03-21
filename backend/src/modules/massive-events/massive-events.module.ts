import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MassiveEvent } from './entities/massive-events.entity';
import { SimpleEvent } from './entities/simple-event.entity';
import { AnimalSimpleEvent } from './entities/animal-simple-event.entity';
import { MassiveEventRepository } from './repositories/massive-event.repository';
import { SimpleEventRepository } from './repositories/simple-event.repository';
import { AnimalSimpleEventRepository } from './repositories/animal-simple-event.repository';
import { MassiveEventService } from './services/massive-event.service';
import { SimpleEventService } from './services/simple-event.service';
import { MassiveEventController } from './controllers/massive-event.controller';
import { SimpleEventController } from './controllers/simple-event.controller';
import { FarmModule } from '../farm/farm.module';
import { ApplicationPermissionsModule } from '../../common/application-permissions/application-permissions.module';

@Module({
  imports: [
    forwardRef(() => FarmModule),
    ApplicationPermissionsModule,
    TypeOrmModule.forFeature([MassiveEvent, SimpleEvent, AnimalSimpleEvent]),
  ],
  controllers: [MassiveEventController, SimpleEventController],
  providers: [
    MassiveEventRepository,
    SimpleEventRepository,
    AnimalSimpleEventRepository,
    MassiveEventService,
    SimpleEventService,
  ],
  exports: [
    MassiveEventRepository,
    SimpleEventRepository,
    AnimalSimpleEventRepository,
    MassiveEventService,
    SimpleEventService,
  ],
})
export class MassiveEventsModule {}
