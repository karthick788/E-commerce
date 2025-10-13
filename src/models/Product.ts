import { Schema, model, models, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: 'Dresses' | 'Mobiles' | 'Shoes' | 'Accessories';
  brand?: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  isFeatured: boolean;
  discount?: number;
  attributes?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    slug: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true 
    },
    description: { 
      type: String, 
      required: true,
      trim: true 
    },
    price: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    images: [{ 
      type: String, 
      required: true 
    }],
    category: { 
      type: String, 
      required: true,
      enum: ['Dresses', 'Mobiles', 'Shoes', 'Accessories'] 
    },
    brand: { 
      type: String,
      trim: true
    },
    rating: { 
      type: Number, 
      default: 0, 
      min: 0, 
      max: 5 
    },
    numReviews: { 
      type: Number, 
      default: 0 
    },
    countInStock: { 
      type: Number, 
      required: true, 
      min: 0, 
      default: 0 
    },
    isFeatured: { 
      type: Boolean, 
      default: false 
    },
    discount: { 
      type: Number, 
      min: 0, 
      max: 100, 
      default: 0 
    },
    attributes: { 
      type: Schema.Types.Mixed,
      default: {}
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for getting the price after discount
productSchema.virtual('priceAfterDiscount').get(function() {
  if (this.discount && this.discount > 0) {
    return this.price - (this.price * (this.discount / 100));
  }
  return this.price;
});

// Create text index for search
productSchema.index({ 
  name: 'text', 
  description: 'text',
  brand: 'text',
  category: 'text'
});

export default models.Product || model<IProduct>('Product', productSchema);
