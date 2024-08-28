import { Injectable } from '@nestjs/common';
import { InjectorLoggerService } from '../logger/InjectorLoggerService';
import { LoggerService } from '../logger/logger.service';
import { InjectModel } from '@nestjs/mongoose';
import { IPost, PostModelName } from './schema/post.schema';
import { Error, Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectorLoggerService(PostService.name)
    private readonly logger: LoggerService,
    @InjectModel(PostModelName)
    private readonly postModel: Model<IPost>
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<IPost> {
    try {
      this.logger.log({createPostDto}, 'start create post > [service]');

      const createdPost = await this.postModel.create(createPostDto);

      if (!createdPost) throw new Error('Houve um erro ao criar a postagem.')

      return createdPost;
    } catch (error) {
      this.logger.error({error}, 'error on createPost [service]')
      throw new error
    }
  }
}
