import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TaskCommentsController } from './task-comments.controller';
import { ProjectsModule } from '../projects/projects.module';
import { CommentAuthorGuard } from '../common/guards/comment-author.guard';

@Module({
  imports: [ProjectsModule],
  controllers: [CommentsController, TaskCommentsController],
  providers: [CommentsService, CommentAuthorGuard],
})
export class CommentsModule {}