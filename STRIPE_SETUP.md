# Stripe Payment Integration Setup Guide

This guide will help you set up Stripe payment integration for your E-commerce platform.

## Prerequisites

- A Stripe account (sign up at https://stripe.com)
- Node.js and npm installed
- Your application running locally or deployed

## Step 1: Get Stripe API Keys

1. Log in to your Stripe Dashboard at https://dashboard.stripe.com
2. Navigate to **Developers** → **API keys**
3. Copy your **Publishable key** (starts with `pk_test_` for test mode)
4. Copy your **Secret key** (starts with `sk_test_` for test mode)

## Step 2: Configure Environment Variables

Create a `.env.local` file in the root of your project (or update your existing `.env` file):

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Important:** 
- Replace the placeholder values with your actual Stripe keys
- Never commit your `.env.local` file to version control
- Use test keys for development (prefix `pk_test_` and `sk_test_`)
- Use live keys only in production (prefix `pk_live_` and `sk_live_`)

## Step 3: Set Up Stripe Webhook (For Local Development)

To test webhooks locally, you need to use the Stripe CLI:

### Install Stripe CLI

**Windows (using Scoop):**
```bash
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

**macOS (using Homebrew):**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux:**
```bash
# Download the latest release from GitHub
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.0/stripe_1.19.0_linux_x86_64.tar.gz
tar -xvf stripe_1.19.0_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

### Forward Webhooks to Your Local Server

1. Login to Stripe CLI:
```bash
stripe login
```

2. Forward webhooks to your local endpoint:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

3. Copy the webhook signing secret (starts with `whsec_`) and add it to your `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

## Step 4: Set Up Webhook in Production

For production deployment:

1. Go to **Developers** → **Webhooks** in your Stripe Dashboard
2. Click **Add endpoint**
3. Enter your endpoint URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
5. Copy the **Signing secret** and add it to your production environment variables

## Step 5: Test the Payment Flow

### Test Card Numbers

Stripe provides test card numbers for testing:

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Requires Authentication:** `4000 0025 0000 3155`

**Test Card Details:**
- Use any future expiration date (e.g., `12/34`)
- Use any 3-digit CVV (e.g., `123`)
- Use any billing postal code (e.g., `12345`)

### Testing Steps

1. Start your development server:
```bash
npm run dev
```

2. In a separate terminal, start the Stripe webhook listener:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

3. Navigate to your application and add items to cart
4. Proceed to checkout
5. Fill in shipping information
6. Select "Card" as payment method
7. Click "Place Order"
8. You'll be redirected to Stripe Checkout
9. Use test card `4242 4242 4242 4242` to complete payment
10. After successful payment, you'll be redirected back to your app

## Step 6: Verify Order Creation

After a successful payment:

1. Check your application's orders page
2. Verify the order appears with status "processing"
3. Check your Stripe Dashboard → **Payments** to see the transaction
4. Check your database to confirm the order was created

## Payment Flow Overview

```
User clicks "Buy Now" 
  → Item added to cart
  → User proceeds to checkout
  → User fills shipping info
  → User clicks "Place Order"
  → App creates Stripe checkout session
  → User redirected to Stripe Checkout
  → User enters card details
  → Stripe processes payment
  → Stripe sends webhook to your app
  → App creates order in database
  → User redirected to success page
```

## Troubleshooting

### Common Issues

**Issue:** "Failed to load Stripe"
- **Solution:** Check that `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set correctly

**Issue:** "Failed to create checkout session"
- **Solution:** Verify `STRIPE_SECRET_KEY` is correct and has proper permissions

**Issue:** Webhook not receiving events
- **Solution:** 
  - Ensure Stripe CLI is running with `stripe listen`
  - Check that `STRIPE_WEBHOOK_SECRET` matches the CLI output
  - Verify your webhook endpoint is accessible

**Issue:** Order not created after payment
- **Solution:** 
  - Check webhook logs in Stripe Dashboard
  - Verify database connection is working
  - Check server logs for errors

## Security Best Practices

1. **Never expose secret keys:** Only use `NEXT_PUBLIC_` prefix for publishable keys
2. **Validate webhooks:** Always verify webhook signatures (already implemented)
3. **Use HTTPS in production:** Stripe requires HTTPS for webhooks
4. **Implement rate limiting:** Protect your API endpoints
5. **Log transactions:** Keep audit logs of all payment activities
6. **Handle errors gracefully:** Provide clear error messages to users

## Going Live

Before going live:

1. Replace test API keys with live keys
2. Set up production webhook endpoint
3. Test with real card in test mode first
4. Enable Stripe Radar for fraud prevention
5. Set up email notifications for successful payments
6. Configure proper error handling and logging
7. Review Stripe's compliance requirements

## Support

- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- Test Cards: https://stripe.com/docs/testing

## Additional Features to Consider

- **Refunds:** Implement refund functionality through Stripe API
- **Subscriptions:** Add recurring payment support
- **Multiple Currencies:** Support international payments
- **Payment Methods:** Add support for Apple Pay, Google Pay, etc.
- **Invoice Generation:** Create PDF invoices for orders
- **Email Notifications:** Send order confirmation emails
