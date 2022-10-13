import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScriptExampleRepository } from './script-example.repository';
import { ScriptController } from './script.controller';
import { ScriptRepository } from './script.repository';
import { ScriptService } from './script.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScriptRepository, ScriptExampleRepository]),
  ],
  controllers: [ScriptController],
  providers: [ScriptService]
})
export class ScriptModule {}
