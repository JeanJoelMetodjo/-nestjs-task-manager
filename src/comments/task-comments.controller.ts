import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ProjectMemberGuard } from '../common/guards/project-member.guard';

@ApiTags('comments')
@ApiBearerAuth()
@UseGuards(ProjectMemberGuard)
@Controller('tasks/:taskId/comments')
export class TaskCommentsController {
  constructor(private comments: CommentsService) {}

  @Post()
  create(
    @Param('taskId') taskId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.comments.create(taskId, userId, dto);
  }

  @Get()
  findAll(@Param('taskId') taskId: string) {
    return this.comments.findAllForTask(taskId);
  }
}