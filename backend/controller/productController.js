import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
// import imagekit from "../config/imagekit.js"; // Commented out - using localStorage approach instead
import Property from "../models/propertyModel.js";

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads');

const addproperty = async (req, res) => {
    try {
        const { title, location, price, beds, baths, sqft, type, availability, description, amenities, phone, googleMapLink } = req.body;

        // Validate required fields
        if (!title || !location || !price || !beds || !baths || !sqft || !type || !availability || !description) {
            return res.status(400).json({ 
                message: "Missing required fields", 
                success: false,
                missingFields: {
                    title: !title,
                    location: !location,
                    price: !price,
                    beds: !beds,
                    baths: !baths,
                    sqft: !sqft,
                    type: !type,
                    availability: !availability,
                    description: !description
                }
            });
        }

        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        if (images.length === 0) {
            return res.status(400).json({ 
                message: "At least one image is required", 
                success: false 
            });
        }

        // Save images to uploads folder and return file paths
        const imageUrls = await Promise.all(
            images.map(async (item) => {
                try {
                    // Create uploads directory if it doesn't exist
                    if (!fs.existsSync(uploadsDir)) {
                        fs.mkdirSync(uploadsDir, { recursive: true });
                    }

                    // Generate unique filename
                    const timestamp = Date.now();
                    const random = Math.floor(Math.random() * 10000);
                    const ext = path.extname(item.originalname);
                    const filename = `property-${timestamp}-${random}${ext}`;
                    const filepath = path.join(uploadsDir, filename);

                    // Save file to uploads folder
                    const fileBuffer = fs.readFileSync(item.path);
                    fs.writeFileSync(filepath, fileBuffer);

                    // Delete temp file
                    fs.unlink(item.path, (err) => {
                        if (err) console.log("Error deleting temp file: ", err);
                    });

                    // Return relative URL path instead of base64
                    return `/uploads/${filename}`;
                } catch (error) {
                    console.error("Error saving image to uploads folder:", error);
                    throw new Error(`Image save failed: ${error.message}`);
                }
            })
        );

        // Create a new product
        const product = new Property({
            title,
            location,
            price,
            beds,
            baths,
            sqft,
            type,
            availability,
            description,
            amenities: amenities ? (typeof amenities === 'string' ? JSON.parse(amenities) : amenities) : [],
            image: imageUrls,
            phone,
            googleMapLink: googleMapLink || ''
        });

        // Save the product to the database
        const savedProduct = await product.save();

        res.json({ 
            message: "Product added successfully", 
            success: true,
            productId: savedProduct._id 
        });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ 
            message: "Server Error", 
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    }
};

const listproperty = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20; // Default 20 per page
        const skip = (page - 1) * limit;

        // Build query based on user role
        const query = {
            $or: [{ status: 'active' }, { status: { $exists: false } }],
        };

        // If builder, only show their properties
        if (req.user && req.user.role === 'builder') {
            query.postedBy = req.user._id;
        }
        // Superadmin sees all (no additional filter)

        // Get total count for pagination metadata
        const totalProperties = await Property.countDocuments(query);
        const totalPages = Math.ceil(totalProperties / limit);

        // Get properties with pagination
        const property = await Property.find(query)
            .sort({ createdAt: -1 }) // Most recent first
            .limit(limit)
            .skip(skip);

        res.json({
            property,
            success: true,
            pagination: {
                currentPage: page,
                totalPages,
                totalProperties,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
                limit
            }
        });
    } catch (error) {
        console.log("Error listing products: ", error);
        res.status(500).json({ message: "Server Error", success: false });
    }
};

const removeproperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.body.id);
        if (!property) {
            return res.status(404).json({ message: "Property not found", success: false });
        }
        return res.json({ message: "Property removed successfully", success: true });
    } catch (error) {
        console.log("Error removing product: ", error);
        return res.status(500).json({ message: "Server Error", success: false });
    }
};

const updateproperty = async (req, res) => {
    try {
        const { id, title, location, price, beds, baths, sqft, type, availability, description, amenities, phone, googleMapLink } = req.body;

        const property = await Property.findById(id);
        if (!property) {
            console.log("Property not found with ID:", id); // Debugging line
            return res.status(404).json({ message: "Property not found", success: false });
        }

        if (!req.files) {
            // No new images provided
            property.title = title;
            property.location = location;
            property.price = price;
            property.beds = beds;
            property.baths = baths;
            property.sqft = sqft;
            property.type = type;
            property.availability = availability;
            property.description = description;
            property.amenities = amenities;
            property.phone = phone;
            property.googleMapLink = googleMapLink || '';
            // Keep existing images
            await property.save();
            return res.json({ message: "Property updated successfully", success: true });
        }

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        // Save images to uploads folder
        const imageUrls = await Promise.all(
            images.map(async (item) => {
                try {
                    // Create uploads directory if it doesn't exist
                    if (!fs.existsSync(uploadsDir)) {
                        fs.mkdirSync(uploadsDir, { recursive: true });
                    }

                    // Generate unique filename
                    const timestamp = Date.now();
                    const random = Math.floor(Math.random() * 10000);
                    const ext = path.extname(item.originalname);
                    const filename = `property-${timestamp}-${random}${ext}`;
                    const filepath = path.join(uploadsDir, filename);

                    // Save file to uploads folder
                    const fileBuffer = fs.readFileSync(item.path);
                    fs.writeFileSync(filepath, fileBuffer);

                    // Delete temp file
                    fs.unlink(item.path, (err) => {
                        if (err) console.log("Error deleting temp file: ", err);
                    });

                    // Return relative URL path
                    return `/uploads/${filename}`;
                } catch (error) {
                    console.error("Error saving image to uploads folder:", error);
                    throw new Error(`Image save failed: ${error.message}`);
                }
            })
        );

        property.title = title;
        property.location = location;
        property.price = price;
        property.beds = beds;
        property.baths = baths;
        property.sqft = sqft;
        property.type = type;
        property.availability = availability;
        property.description = description;
        property.amenities = amenities;
        property.image = imageUrls;
        property.phone = phone;
        property.googleMapLink = googleMapLink || '';

        await property.save();
        res.json({ message: "Property updated successfully", success: true });
    } catch (error) {
        console.log("Error updating product: ", error);
        res.status(500).json({ message: "Server Error", success: false });
    }
};

const singleproperty = async (req, res) => {
    try {
        const { id } = req.params;
        const property = await Property.findById(id);
        if (!property) {
            return res.status(404).json({ message: "Property not found", success: false });
        }
        // Block public access to listings that are not yet approved or have been
        // rejected/expired. Legacy docs without a status field are always visible.
        if (property.status && property.status !== 'active') {
            return res.status(404).json({ message: "Property not found", success: false });
        }
        res.json({ property, success: true });
    } catch (error) {
        console.log("Error fetching property:", error);
        res.status(500).json({ message: "Server Error", success: false });
    }
};

export { addproperty, listproperty, removeproperty, updateproperty , singleproperty};