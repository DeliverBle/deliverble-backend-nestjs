import { Module } from '@nestjs/common';
import { DummyController } from './dummy.controller';
import { DummyService } from './dummy.service';

@Module({
  controllers: [DummyController],
  providers: [DummyService]
})
export class DummyModule {}
