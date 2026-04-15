import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes without conflicts
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in Indian currency format
 * @param {number} price - Price in INR
 * @returns {string} Formatted price (e.g., "₹2.50 Cr", "₹75.0 L", "₹50,000")
 */
export function formatPrice(price) {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
}

/**
 * Format date to readable string
 */
export function formatDate(date) {
  if (!date) return 'N/A';

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'N/A';

  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Truncate text to a given length
 */
export function truncate(text, length = 50) {
  if (!text) return '';
  return text.length > length ? `${text.slice(0, length)}...` : text;
}

/**
 * Convert relative image paths to full URLs
 * @param {string} imagePath - Image path (e.g., "/uploads/property-xxx.jpg" or "http://...")
 * @returns {string} Full URL
 */
export function getImageUrl(imagePath) {
  if (!imagePath) return null;
  
  // If it's already an absolute URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend the backend URL
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  return `${backendUrl}${imagePath}`;
}
