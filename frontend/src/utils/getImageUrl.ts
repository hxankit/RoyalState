/**
 * Convert image paths to full URLs
 * @param imagePath - Image path (e.g., "/uploads/property-xxx.jpg" or absolute URL)
 * @returns Full URL to access the image
 */
export function getImageUrl(imagePath?: string): string {
  if (!imagePath) {
    // Return default placeholder image
    return "https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?w=1200";
  }

  // If it's already an absolute URL or data URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }

  // If it's a relative path, prepend the backend URL
  const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  return `${backendUrl}${imagePath}`;
}
