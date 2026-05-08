import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddMemberDto } from './dto/add-member.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        members: {
          create: { userId, role: ProjectRole.OWNER },
        },
      },
      include: {
        members: { include: { user: { select: { id: true, email: true, name: true } } } },
      },
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.project.findMany({
      where: { members: { some: { userId } } },
      include: {
        members: { include: { user: { select: { id: true, email: true, name: true } } } },
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(projectId: string) {
    // L'accès est déjà vérifié par le guard, on peut juste fetch
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: { include: { user: { select: { id: true, email: true, name: true } } } },
        _count: { select: { tasks: true } },
      },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(projectId: string, dto: UpdateProjectDto) {
    return this.prisma.project.update({
      where: { id: projectId },
      data: dto,
    });
  }

  async remove(projectId: string) {
    await this.prisma.project.delete({ where: { id: projectId } });
    return { success: true };
  }

  async addMember(projectId: string, dto: AddMemberDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true, email: true, name: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const exists = await this.prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: user.id, projectId } },
    });
    if (exists) throw new BadRequestException('User already a member');

    return this.prisma.projectMember.create({
      data: {
        userId: user.id,
        projectId,
        role: dto.role ?? ProjectRole.MEMBER,
      },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
  }

  async removeMember(projectId: string, userId: string) {
    const membership = await this.prisma.projectMember.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });
    if (!membership) throw new NotFoundException('Member not found');
    if (membership.role === ProjectRole.OWNER) {
      throw new ForbiddenException('Cannot remove the owner');
    }

    await this.prisma.projectMember.delete({
      where: { userId_projectId: { userId, projectId } },
    });
    return { success: true };
  }
}