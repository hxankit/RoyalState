import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
}


export function useSEO({ title, description }: SEOProps) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | Expanzia Properties`;
    }

    if (description) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = description;
    }

    // Restore default on unmount
    return () => {
      document.title = 'Expanzia Properties - AI-Powered Luxury Real Estate | Find Your Dream Home';
    };
  }, [title, description]);
}
