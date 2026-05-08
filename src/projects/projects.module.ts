import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ProjectMemberGuard } from '../common/guards/project-member.guard';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectMemberGuard],
  exports: [ProjectMemberGuard],
})
export class ProjectsModule {}