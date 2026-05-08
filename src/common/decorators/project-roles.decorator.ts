import { SetMetadata } from '@nestjs/common';
import { ProjectRole } from '@prisma/client';
import { PROJECT_ROLES_KEY } from '../guards/project-member.guard';

export const ProjectRoles = (...roles: ProjectRole[]) =>
  SetMetadata(PROJECT_ROLES_KEY, roles);