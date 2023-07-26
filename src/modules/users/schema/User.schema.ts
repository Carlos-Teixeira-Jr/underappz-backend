import { Schema } from "mongoose";

export const UserModelName = 'User';

export const UserSchema = new Schema({
  username: { type: String },
  name: { type: String },
  email: { type: String },
  password: { type: String },
  picture: { type: String }
})

export interface IUser extends Document {
  username: string,
  name: string,
  email: string,
  password: string,
  picture: string
}