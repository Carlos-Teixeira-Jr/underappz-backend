import { Body, Controller, Post } from '@nestjs/common';
import { InjectorLoggerService } from '../logger/InjectorLoggerService';
import { LoggerService } from '../logger/logger.service';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('post')
export class PostController {
  constructor(
    @InjectorLoggerService(PostController.name)
    private readonly logger: LoggerService,
    private readonly postService: PostService
  ) {}

  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto
  ) {
    this.logger.log({createPostDto}, 'start create post > [controller]');

    const createdPost = await this.postService.createPost(createPostDto)

    return createdPost
  }
}
