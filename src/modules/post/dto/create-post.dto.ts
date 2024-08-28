import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CommentData {
  @IsOptional()
  @IsString()
  commentatorName: string

  @IsOptional()
  @IsString()
  comment: string
}

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  type: 'music' | 'text' | 'video' | 'equip' | 'image' | 'event'

  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  author: string

  @IsNotEmpty()
  @IsString()
  text: string

  @IsNotEmpty()
  @IsString()
  image: string

  @IsNotEmpty()
  @IsString()
  date: string

  @IsOptional()
  @IsArray()
  comments: CommentData[]
}