import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ProjectMemberGuard } from '../common/guards/project-member.guard';
import { CommentAuthorGuard } from '../common/guards/comment-author.guard';

@ApiTags('comments')
@ApiBearerAuth()
@UseGuards(ProjectMemberGuard, CommentAuthorGuard)
@Controller('comments')
export class CommentsController {
  constructor(private comments: CommentsService) {}

  @Patch(':commentId')
  update(@Param('commentId') commentId: string, @Body() dto: UpdateCommentDto) {
    return this.comments.update(commentId, dto);
  }

  @Delete(':commentId')
  remove(@Param('commentId') commentId: string) {
    return this.comments.remove(commentId);
  }
}
