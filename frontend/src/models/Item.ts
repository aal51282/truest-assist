import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IItem extends Document {
  modulesDone: number;
  leaderboardScore: number;
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<IItem>(
  {
    modulesDone: {
      type: Number,
      required: true,
      default: 0
    },
    leaderboardScore: {
      type: Number,
      required: true,
      default: 0
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Check if model exists before creating a new one
const Item = mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);

export default Item as Model<IItem>; 