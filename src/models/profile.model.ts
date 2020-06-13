import { model, Schema } from 'mongoose';

export const ProfileModel = model(
  'profile',
  new Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: 'user', unique: true },
      company: { type: String },
      website: { type: String },
      location: { type: String },
      skills: { type: [String], required: true },
      bio: { type: String },
      githubUsername: { type: String },
      experience: [
        {
          title: { type: String, required: true },
          company: { type: String, required: true },
          location: { type: String },
          from: { type: Date, required: true },
          to: { type: Date },
          current: { type: Boolean, default: false },
          description: { type: String }
        }
      ],
      education: [
        {
          school: { type: String, required: true },
          degree: { type: String, required: true },
          fieldofstudy: { type: String, required: true },
          from: { type: Date, required: true },
          to: { type: Date },
          current: { type: Boolean, default: false },
          description: { type: String }
        }
      ],
      socialMedia: {
        youtube: { type: String },
        twitter: { type: String },
        facebook: { type: String },
        linkedin: { type: String },
        instagram: { type: String }
      },
      created: { type: Date, default: Date.now },
      updated: { type: Date, default: Date.now }
    }
  )
);

export interface Profile {
  _id?: string,
  id: string,
  user: string,
  company: string,
  website: string,
  location: string,
  skills: string[],
  bio: string,
  githubUsername: string,
  experience: WorkExperience[],
  education: Education[],
  socialMedia: SocialMedia,
}

export interface WorkExperience {
  title: string,
  company: string,
  location: string,
  from: Date,
  to: Date,
  current: boolean,
  description: string,
}

export interface Education {
  school: string,
  degree: string,
  fieldOfStudy: string,
  from: Date,
  to: Date,
  current: boolean,
  description: string,
}

export interface SocialMedia {
  youtube: string,
  twitter: string,
  facebook: string,
  linkedin: string,
  instagram: string,
}