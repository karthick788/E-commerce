# Payment Flow Architecture

## Complete Payment Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                                 │
└─────────────────────────────────────────────────────────────────────┘

1. Browse Products
   └─> /products/page.tsx
       └─> User clicks "Buy Now" button
           └─> handleBuyNow() adds item to cart
               └─> Redirects to /cart

2. View Cart
   └─> /cart/page.tsx
       └─> User reviews items
           └─> Clicks "Proceed to Checkout"
               └─> Redirects to /checkout

3. Checkout Page
   └─> /checkout/page.tsx
       ├─> User fills shipping information
       ├─> Selects payment method (Card or COD)
       └─> Clicks "Place Order"
           │
           ├─> IF Payment Method = "Card" (Stripe)
           │   └─> handlePlaceOrder()
           │       ├─> Validates shipping info
           │       ├─> Calls /api/stripe/checkout
           │       │   └─> Creates Stripe Checkout Session
           │       │       ├─> Line items (products)
           │       │       ├─> Shipping fee
           │       │       ├─> Tax
           │       │       └─> Customer info
           │       ├─> Clears local cart
           │       └─> Redirects to Stripe Checkout
           │           └─> User enters card details on Stripe
           │               ├─> Payment successful
           │               │   └─> Stripe webhook triggered
           │               │       └─> /api/stripe/webhook
           │               │           └─> Creates order in database
           │               │               └─> Redirects to /orders?success=true
           │               │
           │               └─> Payment failed
           │                   └─> Redirects to /checkout?canceled=true
           │
           └─> IF Payment Method = "COD"
               └─> handlePlaceOrder()
                   ├─> Validates shipping info
                   ├─> Calls /api/orders
                   │   └─> Creates order directly in database
                   ├─> Clears local cart
                   └─> Redirects to /orders?success=true

4. Order Confirmation
   └─> /orders/page.tsx
       └─> Shows success message
           └─> Displays order details

┌─────────────────────────────────────────────────────────────────────┐
│                         TECHNICAL FLOW                               │
└─────────────────────────────────────────────────────────────────────┘

Frontend (Client)                Backend (API)                 Stripe
─────────────────────           ─────────────────            ─────────

User clicks "Place Order"
        │
        ├─> POST /api/stripe/checkout
        │   {
        │     items: [...],
        │     shippingInfo: {...},
        │     subtotal, tax, shipping, total
        │   }
        │                              │
        │                              ├─> Validates user session
        │                              ├─> Validates request data
        │                              ├─> Creates line items
        │                              │
        │                              └─> stripe.checkout.sessions.create()
        │                                  {
        │                                    payment_method_types: ['card'],
        │                                    line_items: [...],
        │                                    mode: 'payment',
        │                                    success_url: '/orders?success=true',
        │                                    cancel_url: '/checkout?canceled=true',
        │                                    metadata: { userId, items, shipping... }
        │                                  }
        │                                                  │
        │                                                  └─> Creates session
        │                              │                       Returns session ID & URL
        │                              │
        │   <── Returns { sessionId, url }
        │
        ├─> Clears localStorage cart
        │
        └─> window.location.href = url ──────────────────────> Stripe Checkout Page
                                                                       │
                                                                       ├─> User enters card
                                                                       ├─> Validates card
                                                                       └─> Processes payment
                                                                              │
                                                                              ├─> Success
                                                                              │   └─> Triggers webhook
                                                                              │       │
                                        POST /api/stripe/webhook <───────────┘
                                        {
                                          type: 'checkout.session.completed',
                                          data: { object: session }
                                        }
                                                │
                                                ├─> Verifies webhook signature
                                                ├─> Extracts metadata
                                                ├─> Creates order in MongoDB
                                                │   {
                                                │     userId,
                                                │     items,
                                                │     shippingAddress,
                                                │     paymentMethod: 'card',
                                                │     paymentStatus: 'paid',
                                                │     paymentIntentId,
                                                │     status: 'processing'
                                                │   }
                                                │
                                                └─> Returns { received: true }
                                                                              │
User redirected to /orders?success=true <────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         FILE STRUCTURE                               │
└─────────────────────────────────────────────────────────────────────┘

src/
├── app/
│   ├── products/
│   │   └── page.tsx                    # Product listing with "Buy Now"
│   ├── cart/
│   │   └── page.tsx                    # Shopping cart
│   ├── checkout/
│   │   └── page.tsx                    # Checkout form & payment selection
│   ├── orders/
│   │   └── page.tsx                    # Order confirmation & history
│   └── api/
│       ├── stripe/
│       │   ├── checkout/
│       │   │   └── route.ts            # Creates Stripe checkout session
│       │   └── webhook/
│       │       └── route.ts            # Handles Stripe webhooks
│       └── orders/
│           └── route.ts                # Creates orders (for COD)
├── models/
│   └── Order.ts                        # MongoDB order schema
└── lib/
    ├── authOptions.ts                  # NextAuth configuration
    └── db.ts                           # Database connection

┌─────────────────────────────────────────────────────────────────────┐
│                         DATA MODELS                                  │
└─────────────────────────────────────────────────────────────────────┘

Cart Item (localStorage):
{
  id: string,
  name: string,
  price: number,
  quantity: number,
  image: string
}

Shipping Info:
{
  fullName: string,
  email: string,
  phone: string,
  address: string,
  city: string,
  state: string,
  zipCode: string,
  country: string
}

Order (MongoDB):
{
  userId: ObjectId,
  items: [{
    productId: string,
    name: string,
    price: number,
    quantity: number,
    image: string
  }],
  shippingAddress: {
    fullName, email, phone, address,
    city, state, postalCode, country
  },
  paymentMethod: 'card' | 'cod',
  paymentStatus: 'pending' | 'paid' | 'failed',
  paymentIntentId: string (for Stripe),
  itemsPrice: number,
  taxPrice: number,
  shippingPrice: number,
  totalPrice: number,
  status: 'pending' | 'processing' | 'shipped' | 'delivered',
  createdAt: Date,
  updatedAt: Date
}

┌─────────────────────────────────────────────────────────────────────┐
│                         ENVIRONMENT VARIABLES                        │
└─────────────────────────────────────────────────────────────────────┘

Required for Stripe Integration:
- STRIPE_SECRET_KEY                     # Server-side Stripe key
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY    # Client-side Stripe key
- STRIPE_WEBHOOK_SECRET                 # Webhook signature verification
- NEXT_PUBLIC_BASE_URL                  # App URL for redirects

┌─────────────────────────────────────────────────────────────────────┐
│                         SECURITY FEATURES                            │
└─────────────────────────────────────────────────────────────────────┘

✓ Webhook signature verification (prevents fake webhooks)
✓ User authentication check (requires login)
✓ Server-side session validation
✓ Secure environment variables (never exposed to client)
✓ HTTPS required in production
✓ PCI compliance through Stripe (no card data stored)
✓ CSRF protection via NextAuth
✓ Input validation on all endpoints

┌─────────────────────────────────────────────────────────────────────┐
│                         ERROR HANDLING                               │
└─────────────────────────────────────────────────────────────────────┘

Checkout Page:
- Missing shipping info → Toast error
- Stripe load failure → Error message
- Network error → Toast error
- Payment canceled → Redirect to checkout with message

API Routes:
- Unauthorized → 401 response
- Invalid data → 400 response
- Stripe error → 500 response with error message
- Webhook verification failed → 400 response

Webhook:
- Invalid signature → Reject request
- Missing metadata → Log error, return 400
- Database error → Log error, return 500
- Success → Return 200 with { received: true }
