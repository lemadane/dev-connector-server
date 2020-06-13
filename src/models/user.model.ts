import { model, Schema } from 'mongoose';

export const UserModel = model(
  'user',
  new Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      avatar: { type: String },
      created: { type: Date, required: true, default: new Date() },
      updated: { type: Date, required: true, default: new Date() },
      active: { type: Boolean, required: true, dafault: true },
    }
  )
);

export interface User {
  _id?: string,
  id: string,
  name: string,
  email: string,
  password: string,
  avatar: string,
  created: Date,
  updated: Date,
  active: boolean,
}