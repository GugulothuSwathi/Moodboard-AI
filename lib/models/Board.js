
import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema({
  hex: { type: String, required: true },
  name: { type: String, required: true },
  emotion: { type: String, default: '' },
}, { _id: false })

const fontSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  reason: { type: String, default: '' },
}, { _id: false });

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  thumbUrl: { type: String, default: '' },
  alt: { type: String, default: '' },
  unsplashId: { type: String, default: '' },
  photographer: { type: String, default: '' },
  photographerUrl: { type: String, default: '' },
}, { _id: false });

const boardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
      maxlength: 500,
    },
    colors: [colorSchema],
    fonts: [fontSchema],
    keywords: [{ type: String }],
    textures: [{ type: String }],
    images: [imageSchema],
    designDirection: {
      type: String,
      default: '',
    },
    isPublic: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

boardSchema.virtual('shareUrl').get(function () {
  return `/board/${this._id}`;
});

const Board = mongoose.models.Board || mongoose.model('Board', boardSchema);

export default Board;
