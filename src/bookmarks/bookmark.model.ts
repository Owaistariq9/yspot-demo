import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const BookMarksSchema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: 'posts' },
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
  },
  { timestamps: true },
);

export interface Bookmarks extends mongoose.Document {
  postId: string;
  userId: string;
}
