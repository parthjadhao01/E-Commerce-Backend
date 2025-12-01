import ProductGallery from "../models/product/ProductGalleryModel.js";

// Get or create gallery for a product
export const getProductGallery = async (req, res) => {
  try {
    const { productId } = req.params;
    let gallery = await ProductGallery.findOne({ productId });

    if (!gallery) {
      // Create empty gallery if doesn't exist
      gallery = await ProductGallery.create({ productId, images: [] });
    }

    res.json(gallery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add image to product gallery
export const addImageToGallery = async (req, res) => {
  try {
    const { productId } = req.params;
    const { url, alt } = req.body;

    if (!url) {
      return res.status(400).json({ message: "url is required" });
    }

    let gallery = await ProductGallery.findOne({ productId });

    if (!gallery) {
      gallery = await ProductGallery.create({
        productId,
        images: [{ url, alt: alt || "" }],
      });
    } else {
      gallery.images.push({ url, alt: alt || "" });
      await gallery.save();
    }

    res.status(201).json(gallery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update specific image in gallery
export const updateImageInGallery = async (req, res) => {
  try {
    const { productId, imageIndex } = req.params;
    const { url, alt } = req.body;

    const gallery = await ProductGallery.findOne({ productId });
    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }

    const index = parseInt(imageIndex);
    if (index < 0 || index >= gallery.images.length) {
      return res.status(400).json({ message: "Invalid image index" });
    }

    if (url) gallery.images[index].url = url;
    if (alt !== undefined) gallery.images[index].alt = alt;

    await gallery.save();
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete specific image from gallery
export const deleteImageFromGallery = async (req, res) => {
  try {
    const { productId, imageIndex } = req.params;

    const gallery = await ProductGallery.findOne({ productId });
    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }

    const index = parseInt(imageIndex);
    if (index < 0 || index >= gallery.images.length) {
      return res.status(400).json({ message: "Invalid image index" });
    }

    gallery.images.splice(index, 1);
    await gallery.save();

    res.json(gallery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete entire gallery for a product
export const deleteProductGallery = async (req, res) => {
  try {
    const { productId } = req.params;
    const gallery = await ProductGallery.findOneAndDelete({ productId });

    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }

    res.json({ message: "Gallery deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
