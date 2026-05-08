import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProjectRole } from '@prisma/client';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ProjectMemberGuard } from '../common/guards/project-member.guard';
import { ProjectRoles } from '../common/decorators/project-roles.decorator';

@ApiTags('projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private projects: ProjectsService) {}

  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateProjectDto) {
    return this.projects.create(userId, dto);
  }

  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.projects.findAllForUser(userId);
  }

  @Get(':id')
  @UseGuards(ProjectMemberGuard)
  findOne(@Param('id') id: string) {
    return this.projects.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ProjectMemberGuard)
  @ProjectRoles(ProjectRole.OWNER)
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projects.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(ProjectMemberGuard)
  @ProjectRoles(ProjectRole.OWNER)
  remove(@Param('id') id: string) {
    return this.projects.remove(id);
  }

  @Post(':id/members')
  @UseGuards(ProjectMemberGuard)
  @ProjectRoles(ProjectRole.OWNER)
  addMember(@Param('id') id: string, @Body() dto: AddMemberDto) {
    return this.projects.addMember(id, dto);
  }

  @Delete(':id/members/:userId')
  @UseGuards(ProjectMemberGuard)
  @ProjectRoles(ProjectRole.OWNER)
  removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.projects.removeMember(id, userId);
  }
}