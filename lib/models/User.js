
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    provider: {
      type: String,
      enum: ['google', 'email'],
      default: 'google',
    },
    nickname: {
      type: String,
      trim: true,
      maxlength: 40,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 300,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      maxlength: 80,
      default: '',
    },
    website: {
      type: String,
      trim: true,
      maxlength: 200,
      default: '',
    },
    twitter: {
      type: String,
      trim: true,
      maxlength: 50,
      default: '',
    },
    instagram: {
      type: String,
      trim: true,
      maxlength: 50,
      default: '',
    },
    profileImage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
