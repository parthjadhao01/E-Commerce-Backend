import Attribute from "../models/product/AttributeModel.js";

// Create a new attribute
export const createAttribute = async (req, res) => {
  try {
    const { name, slug, type, values, isFilter, status } = req.body;
    if (!name || !slug || !type) {
      return res
        .status(400)
        .json({ message: "Name, slug, and type are required" });
    }
    // Check for unique slug
    const existing = await Attribute.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: "Slug already exists" });
    }
    const attribute = await Attribute.create({
      name,
      slug,
      type,
      values: values || [],
      isFilter: isFilter !== undefined ? isFilter : true,
      status: status !== undefined ? status : true,
    });
    res.status(201).json(attribute);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all attributes
export const getAttributes = async (req, res) => {
  try {
    const attributes = await Attribute.find();
    res.json(attributes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single attribute by ID
export const getAttribute = async (req, res) => {
  try {
    const attribute = await Attribute.findById(req.params.id);
    if (!attribute)
      return res.status(404).json({ message: "Attribute not found" });
    res.json(attribute);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an attribute
export const updateAttribute = async (req, res) => {
  try {
    const { name, slug, type, values, isFilter, status } = req.body;
    const attribute = await Attribute.findById(req.params.id);
    if (!attribute)
      return res.status(404).json({ message: "Attribute not found" });
    if (slug && slug !== attribute.slug) {
      const existing = await Attribute.findOne({ slug });
      if (existing) {
        return res.status(409).json({ message: "Slug already exists" });
      }
      attribute.slug = slug;
    }
    if (name !== undefined) attribute.name = name;
    if (type !== undefined) attribute.type = type;
    if (values !== undefined) attribute.values = values;
    if (isFilter !== undefined) attribute.isFilter = isFilter;
    if (status !== undefined) attribute.status = status;
    await attribute.save();
    res.json(attribute);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete an attribute
export const deleteAttribute = async (req, res) => {
  try {
    const attribute = await Attribute.findByIdAndDelete(req.params.id);
    if (!attribute)
      return res.status(404).json({ message: "Attribute not found" });
    res.json({ message: "Attribute deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
