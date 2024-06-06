import { Schema } from "mongoose";

export const UserModelName = 'User'

export const UserSchema = new Schema(
  {
    username: { type: String },
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    picture: { type: String },
    phone: { type: String },
    emailVerificationCode: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationExpiry: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

export interface IUser extends Document {
  _id: Schema.Types.ObjectId
  username: string,
  name: string,
  email: string,
  password: string,
  picture: string,
  phone: string,
  emailVerificationCode: string,
  isEmailVerified: boolean,
  emailVerificationExpiry: Date,
  isActive: boolean,
}