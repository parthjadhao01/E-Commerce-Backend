import ProductSeo from "../models/product/ProductSeoModel.js";

export const createSeo = async (req, res) => {
  try {
    const {
      productId,
      metaTitle,
      metaDescription,
      keywords,
      slug,
      canonicalUrl,
    } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }
    if (!slug) {
      return res.status(400).json({ message: "slug is required" });
    }
    const seo = await ProductSeo.create({
      productId,
      metaTitle,
      metaDescription,
      keywords,
      slug,
      canonicalUrl,
    });
    res.status(201).json(seo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSeos = async (req, res) => {
  try {
    const { productId } = req.query;
    const filter = productId ? { productId } : {};
    const seos = await ProductSeo.find(filter);
    res.json(seos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSeo = async (req, res) => {
  try {
    const seo = await ProductSeo.findById(req.params.id);
    if (!seo) return res.status(404).json({ message: "SEO not found" });
    res.json(seo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSeo = async (req, res) => {
  try {
    const {
      metaTitle,
      metaDescription,
      keywords,
      slug,
      canonicalUrl,
    } = req.body;
    const seo = await ProductSeo.findById(req.params.id);
    if (!seo) return res.status(404).json({ message: "SEO not found" });
    if (metaTitle !== undefined) seo.metaTitle = metaTitle;
    if (metaDescription !== undefined) seo.metaDescription = metaDescription;
    if (keywords !== undefined) seo.keywords = keywords;
    if (slug !== undefined) seo.slug = slug;
    if (canonicalUrl !== undefined) seo.canonicalUrl = canonicalUrl;
    await seo.save();
    res.json(seo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteSeo = async (req, res) => {
  try {
    const seo = await ProductSeo.findByIdAndDelete(req.params.id);
    if (!seo) return res.status(404).json({ message: "SEO not found" });
    res.json({ message: "SEO deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
