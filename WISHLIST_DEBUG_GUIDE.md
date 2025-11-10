# Wishlist Debugging Guide

## Common Issues and Solutions

### Issue 1: Wishlist Not Persisting
**Symptoms**: Wishlist items disappear after page refresh
**Solution**: Check browser console for localStorage errors

**Debug Steps**:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Check for errors like "Failed to save wishlist to localStorage"
4. Go to Application tab → Local Storage → Check if 'wishlist' key exists

### Issue 2: Wishlist Not Syncing Across Pages
**Symptoms**: Adding to wishlist on one page doesn't update other pages
**Solution**: Verify event listeners are working

**Debug Steps**:
1. Open Console
2. Add this code to test events:
```javascript
window.addEventListener('wishlistUpdated', (e) => {
  console.log('Wishlist updated event received:', e.detail);
});
```
3. Add/remove items from wishlist
4. Check if event is logged

### Issue 3: Backend Sync Failing
**Symptoms**: Wishlist works locally but doesn't persist after logout/login
**Solution**: Check API response

**Debug Steps**:
1. Open Network tab in DevTools
2. Filter by "me" to see API calls
3. Add item to wishlist
4. Check PATCH request to `/api/users/me`
5. Verify request body contains wishlist array
6. Check response status (should be 200)

### Issue 4: Wishlist Icon Not Updating
**Symptoms**: Heart icon doesn't change color when adding to wishlist
**Solution**: Verify state management

**Debug Steps**:
1. Check if product ID matches in localStorage
2. Open Console and run:
```javascript
JSON.parse(localStorage.getItem('wishlist'))
```
3. Verify product ID is in the array

## Testing Checklist

### Products Page
- [ ] Click heart icon → Icon turns red
- [ ] Click again → Icon turns gray
- [ ] Refresh page → Icon state persists
- [ ] Check localStorage → Product ID is in array

### Product Detail Page
- [ ] Heart icon shows correct state on load
- [ ] Click heart → State updates
- [ ] Navigate back to products → Icon updated there too

### Profile Page
- [ ] Wishlist section shows all items
- [ ] Click item → Navigates to detail page
- [ ] Click Remove → Item disappears
- [ ] Check other pages → Item removed everywhere

### Cross-Page Sync
- [ ] Add to wishlist on products page
- [ ] Navigate to profile → Item appears
- [ ] Remove from profile → Icon updates on products page

## Manual Testing Commands

### Check localStorage
```javascript
// View wishlist
console.log(JSON.parse(localStorage.getItem('wishlist')));

// Clear wishlist
localStorage.removeItem('wishlist');

// Set test wishlist
localStorage.setItem('wishlist', JSON.stringify(['test-id-1', 'test-id-2']));
```

### Test Event System
```javascript
// Dispatch test event
window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
  detail: { wishlist: ['test-1', 'test-2'] } 
}));

// Listen for events
window.addEventListener('wishlistUpdated', (e) => {
  console.log('Event received:', e.detail);
});
```

### Check Backend Sync
```javascript
// Test API call
fetch('/api/users/me', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ wishlist: ['product-id-1', 'product-id-2'] })
})
.then(r => r.json())
.then(d => console.log('API Response:', d))
.catch(e => console.error('API Error:', e));
```

## Expected Behavior

### Adding to Wishlist
1. User clicks heart icon
2. Icon immediately turns red (filled)
3. Toast notification appears
4. localStorage updated
5. Backend API called (async)
6. Event dispatched to other components
7. Other pages update if open

### Removing from Wishlist
1. User clicks filled heart or Remove button
2. Icon/item immediately updates
3. Toast notification appears
4. localStorage updated
5. Backend API called (async)
6. Event dispatched to other components
7. Other pages update if open

### Page Load
1. Component mounts
2. Reads wishlist from localStorage
3. Updates UI to show correct state
4. Registers event listener for updates
5. (Profile only) Fetches product details

## Common Errors and Fixes

### Error: "Cannot read property '_id' of undefined"
**Cause**: Product data not loaded yet
**Fix**: Add null checks before accessing product properties

### Error: "Failed to sync wishlist with backend"
**Cause**: User not authenticated or API error
**Fix**: Check if user is logged in, verify API endpoint

### Error: "localStorage is not defined"
**Cause**: Server-side rendering trying to access localStorage
**Fix**: Ensure localStorage access is in useEffect or client-side only

### Error: "Wishlist not updating in real-time"
**Cause**: Event listener not registered or removed prematurely
**Fix**: Verify cleanup function in useEffect

## Performance Optimization

### Current Implementation
- localStorage: Instant read/write
- Backend sync: Fire-and-forget (non-blocking)
- Event system: Synchronous within browser
- Product fetch: Async with Promise.all

### Best Practices
1. Always update UI first (optimistic updates)
2. Sync with backend asynchronously
3. Handle errors gracefully
4. Don't block user interactions

## Troubleshooting Steps

1. **Clear all caches**:
   - Clear browser cache
   - Clear localStorage: `localStorage.clear()`
   - Restart dev server

2. **Check authentication**:
   - Verify user is logged in
   - Check session in DevTools → Application → Cookies

3. **Verify API endpoints**:
   - Check `/api/users/me` returns user data
   - Check `/api/products/[id]` returns product data

4. **Test in incognito mode**:
   - Rules out extension interference
   - Fresh localStorage state

5. **Check console for errors**:
   - React errors
   - Network errors
   - localStorage errors

## Support

If issues persist after following this guide:
1. Check browser console for errors
2. Check Network tab for failed API calls
3. Verify MongoDB connection
4. Check server logs for backend errors
