import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(projectId: string, dto: CreateTaskDto) {
    if (dto.assigneeId) {
      await this.assertAssigneeIsMember(projectId, dto.assigneeId);
    }

    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        assigneeId: dto.assigneeId,
        projectId,
      },
      include: {
        assignee: { select: { id: true, email: true, name: true } },
      },
    });
  }

  async findAll(projectId: string, query: TaskQueryDto) {
    return this.prisma.task.findMany({
      where: {
        projectId,
        status: query.status,
        assigneeId: query.assigneeId,
      },
      include: {
        assignee: { select: { id: true, email: true, name: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(projectId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, projectId },
      include: {
        assignee: { select: { id: true, email: true, name: true } },
        comments: {
          include: { author: { select: { id: true, email: true, name: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(projectId: string, taskId: string, dto: UpdateTaskDto) {
    await this.findOne(projectId, taskId); // garantit que la task est bien dans ce projet

    if (dto.assigneeId) {
      await this.assertAssigneeIsMember(projectId, dto.assigneeId);
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: dto,
      include: {
        assignee: { select: { id: true, email: true, name: true } },
      },
    });
  }

  async remove(projectId: string, taskId: string) {
    await this.findOne(projectId, taskId);
    await this.prisma.task.delete({ where: { id: taskId } });
    return { success: true };
  }

  private async assertAssigneeIsMember(projectId: string, userId: string) {
    const membership = await this.prisma.projectMember.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });
    if (!membership) {
      throw new BadRequestException('Assignee must be a member of the project');
    }
  }
}