# Wishlist Testing Instructions

## Quick Test (5 minutes)

### Step 1: Test Products Page
1. Start the dev server: `npm run dev`
2. Navigate to http://localhost:3000/products
3. Click the heart icon on any product
4. **Expected**: Heart turns red, toast notification appears
5. Click the heart again
6. **Expected**: Heart turns gray, toast notification appears
7. Refresh the page
8. **Expected**: Heart state persists (stays red if it was red)

### Step 2: Test Product Detail Page
1. Click on any product card (not the heart)
2. **Expected**: Navigate to product detail page
3. Check the heart icon in the top-right of the image
4. **Expected**: Heart should match the state from products page
5. Click the heart icon
6. **Expected**: State toggles, toast appears
7. Click the back button
8. **Expected**: Return to products page with updated heart state

### Step 3: Test Profile Page
1. Navigate to Profile page (http://localhost:3000/profile)
2. Scroll to "My Wishlist" section
3. **Expected**: See all products you added to wishlist
4. Click on a product in the wishlist
5. **Expected**: Navigate to product detail page
6. Go back to Profile
7. Click "Remove" button on a wishlist item
8. **Expected**: Item disappears, toast notification appears

### Step 4: Test Cross-Page Sync
1. Open Products page in one browser tab
2. Open Profile page in another tab
3. In Products tab: Add a product to wishlist
4. Switch to Profile tab
5. **Expected**: New product appears in wishlist (may need to scroll)
6. In Profile tab: Remove a product
7. Switch to Products tab
8. **Expected**: Heart icon is now empty for that product

### Step 5: Test Backend Persistence
1. Add several products to wishlist
2. Open browser DevTools (F12)
3. Go to Application tab → Local Storage
4. Find the 'wishlist' key
5. **Expected**: See array of product IDs
6. Go to Network tab
7. Filter by "me"
8. Add/remove from wishlist
9. **Expected**: See PATCH request to /api/users/me with wishlist data

## Detailed Testing

### Test localStorage
Open browser console and run:
```javascript
// View current wishlist
console.log('Wishlist:', JSON.parse(localStorage.getItem('wishlist')));

// Clear wishlist
localStorage.removeItem('wishlist');
console.log('Wishlist cleared');

// Refresh page to see empty wishlist
location.reload();
```

### Test Event System
Open console and run:
```javascript
// Listen for wishlist events
window.addEventListener('wishlistUpdated', (e) => {
  console.log('Wishlist updated!', e.detail);
});

// Now add/remove items and watch console
```

### Test API Sync
Open console and run:
```javascript
// Manually trigger sync
fetch('/api/users/me', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ wishlist: ['test-id-1', 'test-id-2'] })
})
.then(r => r.json())
.then(d => console.log('API Response:', d))
.catch(e => console.error('API Error:', e));
```

## Expected Console Output

### When Adding to Wishlist
```
Added [Product Name] to wishlist (toast)
[Network] PATCH /api/users/me 200 OK
```

### When Removing from Wishlist
```
Removed from wishlist (toast)
[Network] PATCH /api/users/me 200 OK
```

### When Loading Profile
```
[Network] GET /api/users/me 200 OK
[Network] GET /api/products/[id] 200 OK (for each wishlist item)
```

## Troubleshooting

### Issue: Heart icon not changing
**Solution**: 
1. Check console for errors
2. Verify product ID is correct
3. Clear localStorage and try again

### Issue: Wishlist not persisting
**Solution**:
1. Check if localStorage is enabled in browser
2. Check console for "Failed to save wishlist" errors
3. Try incognito mode

### Issue: Cross-page sync not working
**Solution**:
1. Check if both tabs are on the same domain
2. Verify event listeners are registered (check console)
3. Try closing and reopening tabs

### Issue: Backend sync failing
**Solution**:
1. Check if user is logged in
2. Check Network tab for 401 errors
3. Verify MongoDB connection
4. Check server logs

## Success Criteria

✅ Heart icons toggle correctly
✅ Toast notifications appear
✅ State persists after refresh
✅ Profile shows all wishlist items
✅ Clicking wishlist items navigates to detail page
✅ Removing from profile updates all pages
✅ Backend API receives updates
✅ localStorage contains correct data
✅ No console errors
✅ Cross-page sync works in real-time

## Performance Check

### Expected Behavior
- UI updates should be instant (< 50ms)
- Toast notifications should appear immediately
- Backend sync happens in background (doesn't block UI)
- Page navigation should be smooth
- No lag when toggling wishlist

### Check Network Tab
- PATCH requests should be < 500ms
- GET requests for products should be < 1s
- No failed requests (all 200 OK)
- No duplicate requests

## Browser Compatibility

Test in:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## Final Verification

Run through all 5 quick tests above. If all pass:
- ✅ Wishlist functionality is working correctly
- ✅ End-to-end connection is established
- ✅ Ready for production use

If any test fails, refer to:
- WISHLIST_DEBUG_GUIDE.md for debugging steps
- WISHLIST_FIXES.md for implementation details
- Console errors for specific issues
