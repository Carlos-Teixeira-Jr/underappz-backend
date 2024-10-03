import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModelName, PostSchema } from './schema/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PostModelName,
        schema: PostSchema
      }
    ])
  ],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
