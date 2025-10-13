import { Schema, model, models, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  image?: string;
  emailVerified: boolean;
  provider: 'local' | 'google';
  role: 'user' | 'admin';
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
  };
  wishlist?: Schema.Types.ObjectId[];
  comparePassword: (password: string) => Promise<boolean>;
}

interface IUserModel extends Model<IUser> {}

const userSchema = new Schema<IUser, IUserModel>(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    firstName: {
      type: String,
      trim: true,
      maxlength: [25, 'First name cannot exceed 25 characters']
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [25, 'Last name cannot exceed 25 characters']
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },
    password: { 
      type: String,
      minlength: [8, 'Password must be at least 8 characters long']
    },
    image: {
      type: String,
      default: ''
    },
    address: {
      line1: { type: String, default: '' },
      line2: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      country: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    wishlist: [
      { type: Schema.Types.ObjectId, ref: 'Product' }
    ],
    emailVerified: {
      type: Boolean,
      default: false
    },
    provider: {
      type: String,
      default: 'local',
      enum: ['local', 'google']
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Index
userSchema.index({ email: 1 }, { unique: true });

const User = (models.User as IUserModel) || model<IUser, IUserModel>('User', userSchema);

export default User;
