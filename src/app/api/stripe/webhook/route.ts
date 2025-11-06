import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { connectToDB } from '@/lib/db';
import Order from '@/models/Order';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // Retrieve the session with line items
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        session.id,
        { expand: ['line_items'] }
      );

      // Extract metadata
      const metadata = session.metadata;
      if (!metadata) {
        console.error('No metadata found in session');
        return NextResponse.json({ error: 'No metadata' }, { status: 400 });
      }

      const userId = metadata.userId;
      const shippingInfo = JSON.parse(metadata.shippingInfo);
      const items = JSON.parse(metadata.items);
      const subtotal = parseFloat(metadata.subtotal);
      const tax = parseFloat(metadata.tax);
      const shipping = parseFloat(metadata.shipping);
      const total = parseFloat(metadata.total);

      // Create order in database
      await connectToDB();

      const order = await Order.create({
        userId,
        items: items.map((item: any) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress: {
          fullName: shippingInfo.fullName,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          postalCode: shippingInfo.zipCode,
          country: shippingInfo.country,
        },
        paymentMethod: 'card',
        paymentStatus: 'paid',
        paymentIntentId: session.payment_intent as string,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
        status: 'processing',
      });

      console.log('✅ Order created successfully:', order._id);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
