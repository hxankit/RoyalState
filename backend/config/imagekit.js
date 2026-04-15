import ImageKit from 'imagekit';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

// COMMENTED OUT - Using base64 storage instead for development
// const imagekit = new ImageKit({
//   publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
//   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
//   urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
// });

// if (!process.env.IMAGEKIT_PUBLIC_KEY) {
//   throw new Error('Missing IMAGEKIT_PUBLIC_KEY');
// }

// if (!process.env.IMAGEKIT_PRIVATE_KEY) {
//   throw new Error('Missing IMAGEKIT_PRIVATE_KEY');
// }

// if (!process.env.IMAGEKIT_URL_ENDPOINT) {
//   throw new Error('Missing IMAGEKIT_URL_ENDPOINT');
// }

// console.log("ImageKit connected successfully!");

// Mock ImageKit for development - using base64 approach
const imagekit = {
  upload: async (config) => {
    console.log("ImageKit disabled - using base64 storage instead");
    return { url: 'base64-data-url' };
  }
};

export default imagekit;