import mongoose, { Document, Model } from "mongoose";

export interface ICreator extends Document {
  name: string;
  bio: string;
  socialLink: string;
  profilePicture: string;
  walletAddress: string;
}

const CreatorSchema = new mongoose.Schema<ICreator>({
  name: { type: String, required: true },
  bio: { type: String, required: true },
  socialLink: { type: String, required: true },
  profilePicture: { type: String, required: true },
  walletAddress: { type: String, required: true, unique: true },
});

const Creator: Model<ICreator> =
  mongoose.models.Creator || mongoose.model<ICreator>("Creator", CreatorSchema);

export default Creator;
