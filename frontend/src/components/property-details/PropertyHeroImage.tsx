import React from 'react';
import { getImageUrl } from '../../utils/getImageUrl';

interface PropertyHeroImageProps {
  image?: string;
}

const PropertyHeroImage: React.FC<PropertyHeroImageProps> = ({ image }) => {
  const heroImage = getImageUrl(image);
  
  return (
    <div className="bg-[#F2EFE9] py-8">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="relative aspect-[1280/440] rounded-2xl overflow-hidden shadow-xl">
          <img 
            src={heroImage}
            alt="Property"
            className="w-full h-full object-cover"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default PropertyHeroImage;