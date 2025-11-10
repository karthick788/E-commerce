'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import styles from './profile.module.css';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
  };
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    image: '',
    address: {},
  });
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);

  // Load wishlist from localStorage and fetch product details
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        // Get wishlist IDs from localStorage
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          const wishlistIds = JSON.parse(savedWishlist);
          setWishlist(wishlistIds);
          
          // Fetch product details for each wishlist item
          if (wishlistIds.length > 0) {
            const products = await Promise.all(
              wishlistIds.map(async (id: string) => {
                try {
                  const response = await fetch(`/api/products/${id}`);
                  if (response.ok) {
                    const result = await response.json();
                    return result.data || result; // Handle both {data: product} and direct product response
                  }
                  return null;
                } catch (error) {
                  console.error(`Failed to fetch product ${id}:`, error);
                  return null;
                }
              })
            );
            setWishlistProducts(products.filter(p => p !== null));
          } else {
            setWishlistProducts([]);
          }
        }
      } catch (error) {
        console.error('Failed to load wishlist:', error);
      }
    };

    loadWishlist();

    // Listen for wishlist updates from other components
    const handleWishlistUpdate = (event: any) => {
      loadWishlist();
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
  }, []);

  // Load user data on component mount
  useEffect(() => {
    fetch('/api/users/me')
      .then(r => r.json())
      .then((d) => {
        setProfile({
          firstName: d.firstName || '',
          lastName: d.lastName || '',
          email: d.email || '',
          image: d.image || session?.user?.image || '',
          address: d.address || {},
        });
        // Merge backend wishlist with localStorage (localStorage takes priority)
        const localWishlist = localStorage.getItem('wishlist');
        if (!localWishlist && d.wishlist && Array.isArray(d.wishlist) && d.wishlist.length > 0) {
          // Only use backend wishlist if localStorage is empty
          const backendWishlist = d.wishlist.map((w: any) => w._id || w);
          localStorage.setItem('wishlist', JSON.stringify(backendWishlist));
          setWishlist(backendWishlist);
          // Trigger reload of wishlist products
          window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { wishlist: backendWishlist } }));
        }
      })
      .catch(err => console.error('Failed to load user profile:', err));
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    // Remove from state
    const updatedWishlist = wishlist.filter(id => id !== productId);
    setWishlist(updatedWishlist);
    setWishlistProducts(prev => prev.filter(p => p._id !== productId));
    
    // Update localStorage
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { wishlist: updatedWishlist } }));
    
    // Sync with backend
    try {
      await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wishlist: updatedWishlist }),
      });
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Failed to sync wishlist removal:', error);
      toast.error('Failed to update wishlist');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          image: profile.image,
          address: profile.address,
          wishlist: wishlist,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast.success('Profile saved successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.section}>
            <h3>Profile</h3>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: 12 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profile.image || '/icon.svg'} alt="avatar" className={styles.avatar} />
              <div style={{ flex: 1 }}>
                <div className={styles.grid2}>
                  <input className={styles.input} name="firstName" placeholder="First name" value={profile.firstName} onChange={handleInputChange} />
                  <input className={styles.input} name="lastName" placeholder="Last name" value={profile.lastName} onChange={handleInputChange} />
                </div>
                <input className={styles.input} name="email" placeholder="Email" value={profile.email} onChange={handleInputChange} style={{ marginTop: 10 }} />
                <input className={styles.input} name="image" placeholder="Image URL" value={profile.image || ''} onChange={(e)=>setProfile(p=>({...p, image: e.target.value}))} style={{ marginTop: 10 }} />
              </div>
            </div>
          </div>
          <div className={styles.section}>
            <h4>Address</h4>
            <div className={styles.grid2} style={{ marginTop: 10 }}>
              <input className={styles.input} placeholder="Address line 1" value={profile.address?.line1 || ''} onChange={(e)=>setProfile(p=>({ ...p, address: { ...p.address, line1: e.target.value } }))} />
              <input className={styles.input} placeholder="Address line 2" value={profile.address?.line2 || ''} onChange={(e)=>setProfile(p=>({ ...p, address: { ...p.address, line2: e.target.value } }))} />
              <input className={styles.input} placeholder="City" value={profile.address?.city || ''} onChange={(e)=>setProfile(p=>({ ...p, address: { ...p.address, city: e.target.value } }))} />
              <input className={styles.input} placeholder="State" value={profile.address?.state || ''} onChange={(e)=>setProfile(p=>({ ...p, address: { ...p.address, state: e.target.value } }))} />
              <input className={styles.input} placeholder="Postal Code" value={profile.address?.postalCode || ''} onChange={(e)=>setProfile(p=>({ ...p, address: { ...p.address, postalCode: e.target.value } }))} />
              <input className={styles.input} placeholder="Country" value={profile.address?.country || ''} onChange={(e)=>setProfile(p=>({ ...p, address: { ...p.address, country: e.target.value } }))} />
              <input className={styles.input} placeholder="Phone" value={profile.address?.phone || ''} onChange={(e)=>setProfile(p=>({ ...p, address: { ...p.address, phone: e.target.value } }))} />
            </div>
          </div>
          <div className={styles.section}>
            <button className={styles.btn} disabled={loading} onClick={handleSaveProfile as any}>{loading ? 'Saving...' : 'Save Profile'}</button>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.section}>
            <h3>My Wishlist</h3>
            <div className={styles.wishlistGrid} style={{ marginTop: 12 }}>
              {wishlistProducts.length === 0 ? (
                <p style={{ color: '#6b7280' }}>No items in your wishlist yet.</p>
              ) : wishlistProducts.map((product) => (
                <div key={product._id} className={styles.wishlistItem}>
                  <div 
                    style={{ display: 'flex', flex: 1, gap: 12, cursor: 'pointer' }}
                    onClick={() => router.push(`/products/${product._id}`)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className={styles.thumb} src={product?.images?.[0] || '/icon.svg'} alt={product?.name || 'product'} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{product?.name || 'Product'}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{product?.category || ''}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>${product?.price?.toFixed(2) || '0.00'}</div>
                    </div>
                  </div>
                  <button className={styles.btn} onClick={() => handleRemoveFromWishlist(product._id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
