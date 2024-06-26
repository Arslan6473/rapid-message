import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  userName: string;
  email: string;
  password: string;
  varifyCode: string;
  varifyCodeExpiry: Date;
  isVarified: boolean;
  isAcceptingMessage: boolean;
  message: Message[];
}

const userSchema: Schema<User> = new Schema({
  userName: {
    type: String,
    required: [true, "user name is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    match: [/^[^@]+@[^@]+\.[^@]+$/, "please use a valid email"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  varifyCode: {
    type: String,
    required: [true, "varifycode is required"],
  },
  varifyCodeExpiry: {
    type: Date,
    required: [true, "varifycodeexpiry is required"],
  },
  isVarified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  message: [messageSchema],
});

export const User =
  (mongoose.models.users as mongoose.Model<User>) ||
  mongoose.model<User>("user", userSchema);

export const Message =
  (mongoose.models.messages as mongoose.Model<Message>) ||
  mongoose.model<Message>("messages", messageSchema);
