# Quick Start Guide - Stripe Payment Integration

## 🚀 Getting Started in 5 Minutes

### Step 1: Get Your Stripe Keys (2 minutes)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Sign up or log in
3. Navigate to **Developers** → **API keys**
4. Copy both keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### Step 2: Configure Environment Variables (1 minute)

Create a `.env.local` file in the root directory:

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_paste_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_paste_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_we_will_get_this_in_step_3

# App URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Step 3: Set Up Webhooks for Local Testing (2 minutes)

#### Option A: Using Stripe CLI (Recommended)

1. Install Stripe CLI:
   ```bash
   # Windows (using Scoop)
   scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
   scoop install stripe
   
   # macOS
   brew install stripe/stripe-cli/stripe
   ```

2. Login and forward webhooks:
   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

3. Copy the webhook secret (starts with `whsec_`) and add it to `.env.local`

#### Option B: Skip Webhooks (For Quick Testing)

If you just want to test the payment flow without order creation:
- Leave `STRIPE_WEBHOOK_SECRET` empty
- Payments will work, but orders won't be saved to database
- You can add webhooks later

### Step 4: Start Your App

```bash
npm run dev
```

### Step 5: Test a Payment

1. Go to `http://localhost:3000`
2. Browse products and click "Buy Now"
3. Proceed to checkout
4. Fill in shipping information
5. Select "Credit/Debit Card" payment method
6. Click "Place Order"
7. Use test card: **4242 4242 4242 4242**
   - Expiry: Any future date (e.g., 12/34)
   - CVV: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)

## ✅ You're Done!

Your payment integration is now live! 

## 🧪 More Test Cards

- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Requires Authentication:** 4000 0025 0000 3155
- **Insufficient Funds:** 4000 0000 0000 9995

## 📚 Next Steps

- Read [STRIPE_SETUP.md](./STRIPE_SETUP.md) for detailed configuration
- Set up production webhooks before going live
- Configure email notifications
- Add refund functionality

## 🆘 Troubleshooting

**Payment not working?**
- Check that both Stripe keys are in `.env.local`
- Restart your dev server after adding environment variables
- Make sure you're using test mode keys (prefix `pk_test_` and `sk_test_`)

**Order not created?**
- Ensure webhook secret is configured
- Check that Stripe CLI is running (`stripe listen`)
- Verify MongoDB connection is working

## 🔒 Security Notes

- Never commit `.env.local` to git (it's already in `.gitignore`)
- Use test keys for development
- Switch to live keys only in production
- Always verify webhook signatures (already implemented)

---

**Need help?** Check the detailed guide in [STRIPE_SETUP.md](./STRIPE_SETUP.md)
