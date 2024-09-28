import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPaymentRequest extends Document {
  productId: Schema.Types.ObjectId;
  reference: string;
  recipient: string;
  amount: number;
  label: string;
  message: string;
  memo: string;
}

const PaymentRequestSchema = new mongoose.Schema<IPaymentRequest>({
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
  reference: { type: String, required: true, unique: true },
  recipient: { type: String, required: true },
  amount: { type: Number, required: true },
  memo: { type: String, required: true },
  label: { type: String, required: true },
  message: { type: String, required: true },
});

const PaymentRequest: Model<IPaymentRequest> =
  mongoose.models.PaymentRequest ||
  mongoose.model<IPaymentRequest>("PaymentRequest", PaymentRequestSchema);

export default PaymentRequest;
