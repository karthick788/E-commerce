import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const saved = localStorage.getItem('wishlist');
        if (saved) {
          const parsed = JSON.parse(saved);
          setWishlist(new Set(parsed));
        }
      } catch (error) {
        console.error('Failed to load wishlist:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();

    // Listen for wishlist updates from other components
    const handleUpdate = () => {
      loadWishlist();
    };

    window.addEventListener('wishlistUpdated', handleUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleUpdate);
  }, []);

  // Add to wishlist
  const addToWishlist = useCallback((productId: string, productName?: string) => {
    const newWishlist = new Set(wishlist);
    newWishlist.add(productId);
    
    // Update state
    setWishlist(newWishlist);
    
    // Save to localStorage
    const wishlistArray = Array.from(newWishlist);
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlistArray));
    } catch (error) {
      console.error('Failed to save wishlist:', error);
      toast.error('Failed to save to wishlist');
      return;
    }
    
    // Sync with backend
    fetch('/api/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wishlist: wishlistArray }),
    }).catch(err => console.error('Failed to sync wishlist:', err));
    
    // Notify other components
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
      detail: { wishlist: wishlistArray } 
    }));
    
    // Show success message
    if (productName) {
      toast.success(`Added ${productName} to wishlist`);
    } else {
      toast.success('Added to wishlist');
    }
  }, [wishlist]);

  // Remove from wishlist
  const removeFromWishlist = useCallback((productId: string) => {
    const newWishlist = new Set(wishlist);
    newWishlist.delete(productId);
    
    // Update state
    setWishlist(newWishlist);
    
    // Save to localStorage
    const wishlistArray = Array.from(newWishlist);
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlistArray));
    } catch (error) {
      console.error('Failed to save wishlist:', error);
      toast.error('Failed to update wishlist');
      return;
    }
    
    // Sync with backend
    fetch('/api/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wishlist: wishlistArray }),
    }).catch(err => console.error('Failed to sync wishlist:', err));
    
    // Notify other components
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
      detail: { wishlist: wishlistArray } 
    }));
    
    // Show success message
    toast.success('Removed from wishlist');
  }, [wishlist]);

  // Toggle wishlist
  const toggleWishlist = useCallback((productId: string, productName?: string) => {
    if (wishlist.has(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId, productName);
    }
  }, [wishlist, addToWishlist, removeFromWishlist]);

  // Check if product is in wishlist
  const isInWishlist = useCallback((productId: string) => {
    return wishlist.has(productId);
  }, [wishlist]);

  // Get wishlist as array
  const getWishlistArray = useCallback(() => {
    return Array.from(wishlist);
  }, [wishlist]);

  return {
    wishlist,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getWishlistArray,
  };
}
