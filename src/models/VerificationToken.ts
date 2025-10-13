// In src/models/VerificationToken.ts
import { Schema, model, models, Document } from 'mongoose';

export interface IVerificationToken extends Document {
  userId: Schema.Types.ObjectId;
  token: string;
  expires: Date;
}

const verificationTokenSchema = new Schema<IVerificationToken>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expires: {
    type: Date,
    required: true,
  },
});

// Create index for token with TTL
verificationTokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

const VerificationToken = models.VerificationToken || 
  model<IVerificationToken>('VerificationToken', verificationTokenSchema);

export default VerificationToken;