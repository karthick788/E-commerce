import { Schema, model, models, Document, Types } from 'mongoose';

export interface IOrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
  product: Types.ObjectId;
}

export interface IShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface IPaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  paymentResult?: IPaymentResult;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true, min: 1 },
        image: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        product: { 
          type: Schema.Types.ObjectId, 
          ref: 'Product', 
          required: true 
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['stripe', 'paypal', 'razorpay', 'cod'],
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    itemsPrice: { 
      type: Number, 
      required: true, 
      default: 0.0 
    },
    taxPrice: { 
      type: Number, 
      required: true, 
      default: 0.0 
    },
    shippingPrice: { 
      type: Number, 
      required: true, 
      default: 0.0 
    },
    totalPrice: { 
      type: Number, 
      required: true, 
      default: 0.0 
    },
    isPaid: { 
      type: Boolean, 
      required: true, 
      default: false 
    },
    paidAt: { 
      type: Date 
    },
    isDelivered: { 
      type: Boolean, 
      required: true, 
      default: false 
    },
    deliveredAt: { 
      type: Date 
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total price before saving
orderSchema.pre('save', function (next) {
  // Calculate items price
  this.itemsPrice = this.orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // Calculate shipping price (example: free for orders over $100, else $10)
  this.shippingPrice = this.itemsPrice > 100 ? 0 : 10;

  // Calculate tax (example: 10% tax)
  this.taxPrice = Number((this.itemsPrice * 0.1).toFixed(2));

  // Calculate total price
  this.totalPrice = Number(
    (this.itemsPrice + this.shippingPrice + this.taxPrice).toFixed(2)
  );

  next();
});

export default models.Order || model<IOrder>('Order', orderSchema);
