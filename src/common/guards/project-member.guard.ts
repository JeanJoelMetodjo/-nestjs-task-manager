import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ProjectRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export const PROJECT_ROLES_KEY = 'projectRoles';

@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if (!user) throw new ForbiddenException();

    const projectId = await this.resolveProjectId(req.params);
    if (!projectId) throw new ForbiddenException('Cannot resolve project');

    const membership = await this.prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: user.id, projectId } },
    });

    if (!membership) {
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
        select: { id: true },
      });
      if (!project) throw new NotFoundException('Project not found');
      throw new ForbiddenException('Not a member of this project');
    }

    const requiredRoles = this.reflector.getAllAndOverride<ProjectRole[]>(
      PROJECT_ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    if (requiredRoles && !requiredRoles.includes(membership.role)) {
      throw new ForbiddenException(`Requires role: ${requiredRoles.join(', ')}`);
    }

    req.membership = membership;
    req.projectId = projectId;
    return true;
  }

  private async resolveProjectId(params: any): Promise<string | null> {
    // Cas 1 : projectId direct dans l'URL
    if (params.projectId) return params.projectId;
    if (params.id) return params.id;

    // Cas 2 : on a un taskId, on remonte au projet
    if (params.taskId) {
      const task = await this.prisma.task.findUnique({
        where: { id: params.taskId },
        select: { projectId: true },
      });
      if (!task) throw new NotFoundException('Task not found');
      return task.projectId;
    }

    // Cas 3 : on a un commentId, on remonte au projet via la task
    if (params.commentId) {
      const comment = await this.prisma.comment.findUnique({
        where: { id: params.commentId },
        select: { task: { select: { projectId: true } } },
      });
      if (!comment) throw new NotFoundException('Comment not found');
      return comment.task.projectId;
    }

    return null;
  }
}