'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiHeart, FiShoppingCart, FiStar, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import styles from './productDetail.module.css';

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  images: string[];
  category: string;
  brand?: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  attributes?: Record<string, any>;
  priceAfterDiscount?: number;
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (response.ok) {
          const result = await response.json();
          setProduct(result.data || result);
          
          // Check if product is in wishlist
          const savedWishlist = localStorage.getItem('wishlist');
          if (savedWishlist) {
            const wishlistIds = JSON.parse(savedWishlist);
            setIsInWishlist(wishlistIds.includes(result.data?._id || result._id));
          }
        } else {
          toast.error('Product not found');
          router.push('/products');
        }
      } catch (error) {
        console.error('Failed to load product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadProduct();
    }
  }, [params.id, router]);

  const toggleWishlist = () => {
    if (!product) return;

    const savedWishlist = localStorage.getItem('wishlist');
    let wishlistIds = savedWishlist ? JSON.parse(savedWishlist) : [];

    if (isInWishlist) {
      wishlistIds = wishlistIds.filter((id: string) => id !== product._id);
      setIsInWishlist(false);
      toast.success('Removed from wishlist');
    } else {
      wishlistIds.push(product._id);
      setIsInWishlist(true);
      toast.success(`Added ${product.name} to wishlist`);
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlistIds));

    // Sync with backend
    fetch('/api/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wishlist: wishlistIds }),
    }).catch(err => console.error('Failed to sync wishlist:', err));

    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { wishlist: wishlistIds } }));
  };

  const handleAddToCart = () => {
    if (!product) return;

    try {
      const existing = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = existing.find((item: any) => item.id === product._id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        existing.push({
          id: product._id,
          name: product.name,
          price: product.priceAfterDiscount || product.price,
          quantity: quantity,
          image: product.images?.[0] || '/icon.svg',
        });
      }

      localStorage.setItem('cart', JSON.stringify(existing));
      toast.success(`Added ${quantity} ${product.name} to cart`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Product not found</div>
      </div>
    );
  }

  const finalPrice = product.priceAfterDiscount || product.price;
  const savings = product.discount ? product.price - finalPrice : 0;

  return (
    <div className={styles.container}>
      <button onClick={() => router.back()} className={styles.backButton}>
        <FiArrowLeft /> Back
      </button>

      <div className={styles.productGrid}>
        {/* Image Gallery */}
        <div className={styles.imageSection}>
          <div className={styles.mainImage}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images?.[selectedImage] || '/icon.svg'}
              alt={product.name}
            />
            <button
              onClick={toggleWishlist}
              className={styles.wishlistButton}
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <FiHeart
                style={{
                  fill: isInWishlist ? '#ef4444' : 'none',
                  stroke: isInWishlist ? '#ef4444' : '#9ca3af',
                  transition: 'all 0.2s ease-in-out',
                }}
              />
            </button>
          </div>
          {product.images && product.images.length > 1 && (
            <div className={styles.thumbnails}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`${styles.thumbnail} ${selectedImage === idx ? styles.activeThumbnail : ''}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`${product.name} ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={styles.infoSection}>
          <div className={styles.category}>{product.category}</div>
          <h1 className={styles.productName}>{product.name}</h1>
          {product.brand && <div className={styles.brand}>by {product.brand}</div>}

          {/* Rating */}
          <div className={styles.rating}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  style={{
                    fill: i < Math.floor(product.rating) ? '#fbbf24' : 'none',
                    stroke: i < Math.floor(product.rating) ? '#fbbf24' : '#d1d5db',
                  }}
                />
              ))}
            </div>
            <span className={styles.ratingText}>
              {product.rating.toFixed(1)} ({product.numReviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className={styles.priceSection}>
            <div className={styles.currentPrice}>${finalPrice.toFixed(2)}</div>
            {product.discount && product.discount > 0 && (
              <div className={styles.priceDetails}>
                <span className={styles.originalPrice}>${product.price.toFixed(2)}</span>
                <span className={styles.discount}>-{product.discount}% OFF</span>
                <span className={styles.savings}>Save ${savings.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className={styles.stock}>
            {product.countInStock > 0 ? (
              <span className={styles.inStock}>
                ✓ In Stock ({product.countInStock} available)
              </span>
            ) : (
              <span className={styles.outOfStock}>✗ Out of Stock</span>
            )}
          </div>

          {/* Description */}
          <div className={styles.description}>
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {/* Attributes */}
          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <div className={styles.attributes}>
              <h3>Specifications</h3>
              <div className={styles.attributesList}>
                {Object.entries(product.attributes).map(([key, value]) => (
                  <div key={key} className={styles.attributeItem}>
                    <span className={styles.attributeKey}>{key}:</span>
                    <span className={styles.attributeValue}>{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          {product.countInStock > 0 && (
            <div className={styles.quantitySection}>
              <label>Quantity:</label>
              <div className={styles.quantityControls}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                  disabled={quantity >= product.countInStock}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button
              onClick={handleAddToCart}
              className={styles.addToCartButton}
              disabled={product.countInStock === 0}
            >
              <FiShoppingCart /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className={styles.buyNowButton}
              disabled={product.countInStock === 0}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
