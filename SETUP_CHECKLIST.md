# Stripe Payment Setup Checklist

Use this checklist to set up and test your Stripe payment integration.

## 📋 Pre-Setup Checklist

- [ ] Node.js and npm installed
- [ ] MongoDB running (for order storage)
- [ ] Application runs successfully (`npm run dev`)
- [ ] Can add items to cart and view checkout page

## 🔑 Step 1: Get Stripe Account & Keys (5 minutes)

- [ ] Go to https://stripe.com and create account
- [ ] Verify email address
- [ ] Navigate to **Developers** → **API keys**
- [ ] Copy **Publishable key** (starts with `pk_test_`)
- [ ] Copy **Secret key** (starts with `sk_test_`)
- [ ] Keep these keys safe (you'll need them next)

## ⚙️ Step 2: Configure Environment (2 minutes)

- [ ] Create `.env.local` file in project root
- [ ] Add the following variables:
  ```env
  STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
  STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
  NEXT_PUBLIC_BASE_URL=http://localhost:3000
  ```
- [ ] Replace `YOUR_KEY_HERE` with actual Stripe keys
- [ ] Save the file
- [ ] Restart your dev server

## 🔌 Step 3: Set Up Webhooks (Choose One)

### Option A: Full Setup with Stripe CLI (Recommended)

- [ ] Install Stripe CLI:
  - **Windows:** `scoop install stripe`
  - **macOS:** `brew install stripe/stripe-cli/stripe`
  - **Linux:** Download from GitHub releases
- [ ] Login to Stripe: `stripe login`
- [ ] Start webhook forwarding:
  ```bash
  stripe listen --forward-to localhost:3000/api/stripe/webhook
  ```
- [ ] Copy the webhook secret (starts with `whsec_`)
- [ ] Add webhook secret to `.env.local`
- [ ] Restart dev server
- [ ] Keep the `stripe listen` command running in a separate terminal

### Option B: Quick Test (Skip Webhooks)

- [ ] Leave `STRIPE_WEBHOOK_SECRET` empty in `.env.local`
- [ ] Note: Payments will work, but orders won't be saved
- [ ] You can add webhooks later

## 🚀 Step 4: Start Application

- [ ] Open terminal in project directory
- [ ] Run `npm run dev`
- [ ] Application starts on http://localhost:3000
- [ ] No errors in console
- [ ] If using webhooks, keep `stripe listen` running in another terminal

## 🧪 Step 5: Test Payment Flow

### Basic Flow Test
- [ ] Navigate to http://localhost:3000
- [ ] Browse to products page
- [ ] Click "Buy Now" on any product
- [ ] Verify item appears in cart
- [ ] Click "Proceed to Checkout"
- [ ] Fill in shipping information:
  - [ ] Full Name
  - [ ] Email
  - [ ] Phone
  - [ ] Address
  - [ ] City
  - [ ] State
  - [ ] ZIP Code
- [ ] Select "Credit/Debit Card" payment method
- [ ] Click "Place Order"

### Stripe Checkout Test
- [ ] Redirected to Stripe Checkout page
- [ ] Page loads correctly
- [ ] See order summary on Stripe page
- [ ] Enter test card: `4242 4242 4242 4242`
- [ ] Enter expiry: `12/34` (any future date)
- [ ] Enter CVV: `123` (any 3 digits)
- [ ] Enter ZIP: `12345` (any 5 digits)
- [ ] Click "Pay" button
- [ ] Payment processes successfully

### Success Flow Test
- [ ] Redirected back to your app
- [ ] Land on `/orders` page
- [ ] See success message
- [ ] Success toast notification appears
- [ ] If webhooks enabled: Check database for new order
- [ ] If webhooks enabled: Check `stripe listen` terminal for webhook event

## ✅ Verification Checklist

### In Your Application
- [ ] Success message displays on orders page
- [ ] Cart is cleared after payment
- [ ] No errors in browser console
- [ ] No errors in terminal/server logs

### In Stripe Dashboard
- [ ] Go to https://dashboard.stripe.com
- [ ] Navigate to **Payments**
- [ ] See the test payment listed
- [ ] Payment status is "Succeeded"
- [ ] Amount matches your order total

### In Database (if webhooks enabled)
- [ ] Open MongoDB
- [ ] Check `orders` collection
- [ ] New order document exists
- [ ] Order has correct:
  - [ ] User ID
  - [ ] Items
  - [ ] Shipping address
  - [ ] Payment status: "paid"
  - [ ] Payment method: "card"
  - [ ] Total amount

## 🧪 Additional Test Scenarios

### Test Different Cards
- [ ] Success: `4242 4242 4242 4242`
- [ ] Decline: `4000 0000 0000 0002`
- [ ] Authentication Required: `4000 0025 0000 3155`

### Test Edge Cases
- [ ] Try submitting without shipping info → Should show error
- [ ] Try with empty cart → Should show empty cart message
- [ ] Cancel payment on Stripe page → Should return to checkout
- [ ] Test with multiple items in cart
- [ ] Test with different quantities

### Test Cash on Delivery (COD)
- [ ] Select "Cash on Delivery" payment method
- [ ] Complete checkout
- [ ] Order created directly (no Stripe redirect)
- [ ] Payment status is "pending"

## 🐛 Troubleshooting

### Payment Not Working?
- [ ] Check `.env.local` has correct Stripe keys
- [ ] Restart dev server after adding env variables
- [ ] Check browser console for errors
- [ ] Verify using test mode keys (prefix `pk_test_` and `sk_test_`)

### Webhook Not Receiving Events?
- [ ] Ensure `stripe listen` is running
- [ ] Check webhook secret matches in `.env.local`
- [ ] Restart dev server after adding webhook secret
- [ ] Check `stripe listen` terminal for events

### Order Not Created?
- [ ] Verify webhook is configured
- [ ] Check MongoDB is running
- [ ] Check server logs for errors
- [ ] Verify database connection string

### Redirect Issues?
- [ ] Check `NEXT_PUBLIC_BASE_URL` is correct
- [ ] Ensure no trailing slash in URL
- [ ] Verify success/cancel URLs in Stripe dashboard

## 📊 Success Criteria

You've successfully set up Stripe when:

✅ You can complete a test payment  
✅ Stripe Checkout loads correctly  
✅ Payment succeeds with test card  
✅ You're redirected back to your app  
✅ Success message displays  
✅ Payment appears in Stripe Dashboard  
✅ Order is created in database (if webhooks enabled)  
✅ No errors in console or logs  

## 🎉 Next Steps After Success

- [ ] Read `STRIPE_SETUP.md` for production setup
- [ ] Review `PAYMENT_FLOW.md` to understand architecture
- [ ] Test all payment scenarios
- [ ] Set up email notifications (optional)
- [ ] Configure production webhooks before going live
- [ ] Switch to live keys when ready for production

## 📚 Documentation Reference

- **Quick Start:** `QUICK_START.md` - 5-minute setup guide
- **Detailed Setup:** `STRIPE_SETUP.md` - Comprehensive guide
- **Architecture:** `PAYMENT_FLOW.md` - Technical documentation
- **Summary:** `IMPLEMENTATION_SUMMARY.md` - What was built

## 🆘 Need Help?

If you encounter issues:

1. Check the troubleshooting section above
2. Review error messages in console/terminal
3. Check Stripe Dashboard logs
4. Verify all environment variables
5. Ensure all dependencies are installed
6. Restart dev server and try again

---

**Ready to start?** Begin with Step 1! ☝️
