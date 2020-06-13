import { Schema, model } from "mongoose";

export const PostModel = model(
  'post',
  new Schema(
    {
      user: { type: Schema.Types.ObjectId },
      text: { type: String, required: true },
      name: { type: String },
      avatar: { type: String },
      likes: [
        {
          user: { type: Schema.Types.ObjectId },
        }
      ],
      comments: [
        {
          user: { type: Schema.Types.ObjectId },
          text: { type: String, required: true },
          name: { type: String },
          avatar: { type: String },
          date: { type: Date, default: Date.now },
        }
      ],
      created: { type: Date, default: Date.now },
      updated: { type: Date, default: Date.now },
    }
  )
);

export interface Post {
  user: string,
  text: boolean,
  name: string,
  avatar: string,
  likes: Like[],
  comment: Comment[],
}

export interface Like {
  user: string;
}

export interface Comment {
  user: string,
  text: string,
  name: string,
  avatar: string,
  created: Date,
}