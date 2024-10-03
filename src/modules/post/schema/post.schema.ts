import { Document, Schema } from 'mongoose';
import { BaseModel } from 'src/common/baseModel/base-model.schema';

export const CommentSchema = new Schema(
  {
    commentatorName: { type: String },
    comment: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export interface IPost extends BaseModel, Document {
  type: 'music' | 'text' | 'video' | 'equip' | 'image' | 'event';
  description: string;
  user: string;
  location: string;
  title: string;
  author: string;
  text: string;
  image: string;
  date: string;
  comments: {
    commentatorName: string;
    comment: string;
  }[];
}

export const PostModelName = 'Post';

export const PostSchema = new Schema(
  {
    type: { type: String },
    description: { type: String },
    user: { type: String },
    location: { type: String },
    comments: { type: [CommentSchema] },
    title: { type: String, required: true },
    author: { type: String, required: true },
    text: { type: String },
    image: { type: String },
    date: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
