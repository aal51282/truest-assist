import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IItem extends Document {
  modulesDone: number;
  leaderboardScore?: number;
  owner: mongoose.Types.ObjectId; // Reference to the user who owns this item
  createdAt: Date; // Automatically generated timestamp when the item is created
  updatedAt: Date; // Automatically updated timestamp when the item is updated
}

const ItemSchema: Schema<IItem> = new Schema<IItem>(
  {
    modulesDone: {
      type: Number,
      required: [true, 'Please provide the number of modules done'],
      min: [1, 'Modules done must be at least 1'],
    },
    leaderboardScore: {
      type: Number,
      min: [1, 'Leaderboard score must be at least 1'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Item: Model<IItem> =
  mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);

export default Item;
