'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import styles from './auth.module.css';

interface FormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle success message from query params
  useEffect(() => {
    if (searchParams.get('registered') === 'true' && !success) {
      setSuccess('Registration successful! Please sign in with your credentials.');
    }
  }, [searchParams, success]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl: '/'
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.url) {
        window.location.href = result.url; // Use window.location for client-side redirect
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { 
        callbackUrl: '/'
      });
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome Back to E-commerce</h1>
      <p className={styles.paragraph}>
        Please enter your credentials to continue
      </p>

      {/* Error Message */}
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <div className={styles.inputContainer}>
            <FiMail className={styles.inputIcon} />
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <div className={styles.passwordContainer}>
            <div className={styles.inputContainer}>
              <FiLock className={styles.inputIcon} />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.togglePassword}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={loading}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.rememberMe}>
            <input
              type="checkbox"
              id="remember"
              className={styles.checkbox}
              disabled={loading}
            />
            <label htmlFor="remember" className={styles.rememberLabel}>
              Remember me
            </label>
          </div>
          <Link href="/forgot-password" className={styles.forgotPassword}>
            Forgot password?
          </Link>
        </div>

        <div className={styles.formGroup}>
          <button
            type="submit"
            disabled={loading}
            className={`${styles.button} ${loading ? styles.buttonLoading : ''}`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </form>

      <div className={styles.divider}>
        <span className={styles.dividerText}>or continue with</span>
      </div>

      <div className={styles.socialButtons}>
        <button 
          type="button" 
          onClick={handleGoogleSignIn} 
          className={styles.socialButton}
          disabled={loading}
          style={{ width: '100%', maxWidth: '320px' }}
        >
          <svg className={styles.socialIcon} viewBox="0 0 24 24" width="20" height="20">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </div>

      <p className={styles.textCenter}>
        Don't have an account?{' '}
        <Link href="/register" className={styles.link}>
          Sign up
        </Link>
      </p>
    </div>
  );
}
