'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiHeart } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import styles from './products.module.css';

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  images: string[];
  category: 'Dresses' | 'Mobiles' | 'Shoes' | 'Accessories';
};

const CATEGORIES: Array<Product['category']> = ['Dresses', 'Shoes', 'Accessories', 'Mobiles'];

const categoryFallbackImage: Record<Product['category'], string> = {
  Dresses: '/sample/dress1.jpg',
  Shoes: '/sample/shoes1.jpg',
  Accessories: '/sample/accessory1.jpg',
  Mobiles: '/sample/mobile1.jpg',
};

export default function ProductsPage() {
  const [category, setCategory] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        setWishlist(new Set(JSON.parse(savedWishlist)));
      }
    } catch (error) {
      console.error('Failed to load wishlist', error);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(Array.from(wishlist)));
    } catch (error) {
      console.error('Failed to save wishlist', error);
    }
  }, [wishlist]);

  const toggleWishlist = (productId: string, productName: string) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
        toast.success(`Removed from wishlist`);
      } else {
        newWishlist.add(productId);
        toast.success(`Added ${productName} to wishlist`);
      }
      return newWishlist;
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    const url = category ? `/api/products?category=${encodeURIComponent(category)}` : '/api/products';
    setLoading(true);
    fetch(url, { signal: controller.signal })
      .then(async (res) => {
        const data = await res.json();
        if (data?.data && data.data.length > 0) {
          setProducts(data.data);
          return;
        }
        // Fallback sample items when DB is empty
        const samples: Product[] = [
          {
            _id: 'sample-dress-1',
            name: 'Floral Summer Dress',
            description: 'Lightweight, breathable cotton fabric with floral print.',
            price: 39.99,
            discount: 10,
            images: ['/public/sample/dress1.jpg'],
            category: 'Dresses',
          },
          {
            _id: 'sample-dress-2',
            name: 'Elegant Evening Gown',
            description: 'Maxi gown with satin finish for special occasions.',
            price: 119.0,
            images: ['/public/sample/dress2.jpg'],
            category: 'Dresses',
          },
          {
            _id: 'sample-shoe-1',
            name: 'Running Shoes Pro',
            description: 'Cushioned sole with breathable mesh upper.',
            price: 79.5,
            images: ['/public/sample/shoes1.jpg'],
            category: 'Shoes',
          },
          {
            _id: 'sample-shoe-2',
            name: 'Classic Leather Sneakers',
            description: 'Timeless design with durable leather build.',
            price: 89.99,
            discount: 5,
            images: ['/public/sample/shoes2.jpg'],
            category: 'Shoes',
          },
        ];
        setProducts(samples);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [category]);

  const visible = useMemo(() => {
    if (!category) return products;
    return products.filter((p) => p.category === category);
  }, [products, category]);

  const handleBuyNow = (p: Product) => {
    try {
      const existing = JSON.parse(localStorage.getItem('cart') || '[]');
      const item = {
        id: p._id,
        name: p.name,
        price: p.price,
        quantity: 1,
        image: p.images?.[0] || '/icon.svg',
      };
      const updated = Array.isArray(existing) ? [...existing.filter((x:any)=>x.id!==item.id), item] : [item];
      localStorage.setItem('cart', JSON.stringify(updated));
      router.push('/cart');
    } catch (_) {
      router.push('/cart');
    }
  };

  return (
    <div>
      <div className={styles.toolbar}>
        <h1 className="text-black">Products</h1>
        <div>
          <label htmlFor="category" style={{ marginRight: 8 }}>Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={styles.dropdown}
          >
            <option value="">All</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className={styles.grid}>
          {visible.map((p) => (
            <div key={p._id} className={styles.card}>
              <div className={styles.media}>
                {/* Wishlist button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(p._id, p.name);
                  }}
                  className={styles.wishlistButton}
                  aria-label={wishlist.has(p._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <FiHeart 
                    className={styles.wishlistIcon} 
                    style={{
                      fill: wishlist.has(p._id) ? '#ef4444' : 'none',
                      stroke: wishlist.has(p._id) ? '#ef4444' : '#9ca3af',
                      transition: 'all 0.2s ease-in-out',
                    }} 
                  />
                </button>
                {/* Image fallback */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.img}
                  src={p.images?.[0] || categoryFallbackImage[p.category] || '/icon.svg'}
                  alt={p.name}
                />
              </div>
              <div className={styles.content}>
                <div style={{ color: '#4338ca', fontSize: 12, fontWeight: 600 }}>{p.category}</div>
                <h3 style={{ fontWeight: 700 }}>{p.name}</h3>
                <p style={{ color: '#6b7280', fontSize: 14 }}>{p.description}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
                  <span style={{ fontWeight: 800 }}>${p.price.toFixed(2)}</span>
                  {p.discount ? (
                    <span style={{ fontSize: 12, color: '#16a34a' }}>-{p.discount}%</span>
                  ) : null}
                </div>
                <button className={styles.buyBtn} onClick={() => handleBuyNow(p)}>Buy Now</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
