import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(taskId: string, authorId: string, dto: CreateCommentDto) {
    // On vérifie que la task existe (le guard a déjà vérifié l'appartenance au projet)
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      select: { id: true },
    });
    if (!task) throw new NotFoundException('Task not found');

    return this.prisma.comment.create({
      data: { content: dto.content, taskId, authorId },
      include: {
        author: { select: { id: true, email: true, name: true } },
      },
    });
  }

  async findAllForTask(taskId: string) {
    return this.prisma.comment.findMany({
      where: { taskId },
      include: {
        author: { select: { id: true, email: true, name: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(commentId: string, dto: UpdateCommentDto) {
    return this.prisma.comment.update({
      where: { id: commentId },
      data: dto,
      include: {
        author: { select: { id: true, email: true, name: true } },
      },
    });
  }

  async remove(commentId: string) {
    await this.prisma.comment.delete({ where: { id: commentId } });
    return { success: true };
  }
}