import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads directories if they don't exist
const categoryUploadDir = "./uploads/categories";
const brandUploadDir = "./uploads/brands";
const productUploadDir = "./uploads/products";

if (!fs.existsSync(categoryUploadDir)) {
  fs.mkdirSync(categoryUploadDir, { recursive: true });
}

if (!fs.existsSync(brandUploadDir)) {
  fs.mkdirSync(brandUploadDir, { recursive: true });
}

if (!fs.existsSync(productUploadDir)) {
  fs.mkdirSync(productUploadDir, { recursive: true });
}

// Configure storage for categories
const categoryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, categoryUploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: category-icon/image-timestamp-randomstring.ext
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fieldPrefix = file.fieldname === "icon" ? "icon" : "image";
    cb(
      null,
      `category-${fieldPrefix}-${uniqueSuffix}${path.extname(
        file.originalname
      )}`
    );
  },
});

// Configure storage for brands
const brandStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, brandUploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: brand-logo-timestamp-randomstring.ext
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `brand-logo-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Configure storage for products
const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, productUploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: product-thumbnail-timestamp-randomstring.ext
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `product-thumbnail-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  console.log("File upload attempt:", {
    fieldname: file.fieldname,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
  });

  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/avif",
  ];

  const allowedExtensions = /\.(jpeg|jpg|png|gif|webp|svg|avif)$/i;

  const hasValidExtension = allowedExtensions.test(file.originalname);
  const hasValidMimeType = allowedMimeTypes.includes(
    file.mimetype.toLowerCase()
  );

  console.log("Validation results:", {
    hasValidExtension,
    hasValidMimeType,
    mimeTypeLower: file.mimetype.toLowerCase(),
  });

  if (hasValidMimeType && hasValidExtension) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, GIF, WEBP, SVG, and AVIF are allowed."
      )
    );
  }
};

// Multer upload configuration for categories
const categoryUpload = multer({
  storage: categoryStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Multer upload configuration for brands
const brandUpload = multer({
  storage: brandStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Multer upload configuration for products
const productUpload = multer({
  storage: productStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Export upload middleware for different scenarios
export const uploadCategoryImages = categoryUpload.fields([
  { name: "icon", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

export const uploadBrandLogo = brandUpload.single("logo");

export const uploadProductThumbnail = productUpload.single("thumbnail");

export const uploadSingleImage = categoryUpload.single("image");

export default categoryUpload;
