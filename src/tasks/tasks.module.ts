import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [ProjectsModule], // pour récupérer ProjectMemberGuard
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}