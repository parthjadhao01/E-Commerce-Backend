import Tag from "../models/product/TagModel.js";

export const createTag = async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ message: "Name and slug are required" });
    }
    const existing = await Tag.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: "Slug already exists" });
    }
    const tag = await Tag.create({ name, slug, description });
    res.status(201).json(tag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return res.status(404).json({ message: "Tag not found" });
    res.json(tag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTag = async (req, res) => {
  try {
    const { name, slug, description, status } = req.body;
    const tag = await Tag.findById(req.params.id);
    if (!tag) return res.status(404).json({ message: "Tag not found" });
    if (slug && slug !== tag.slug) {
      const existing = await Tag.findOne({ slug });
      if (existing) {
        return res.status(409).json({ message: "Slug already exists" });
      }
      tag.slug = slug;
    }
    if (name) tag.name = name;
    if (description !== undefined) tag.description = description;
    if (status !== undefined) tag.status = status;
    await tag.save();
    res.json(tag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) return res.status(404).json({ message: "Tag not found" });
    res.json({ message: "Tag deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
