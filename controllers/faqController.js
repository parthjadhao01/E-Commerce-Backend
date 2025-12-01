import ProductFaq from "../models/product/ProductFaqModel.js";

export const createFaq = async (req, res) => {
  try {
    const { productId, question, answer, order } = req.body;
    if (!productId || !question || !answer) {
      return res
        .status(400)
        .json({ message: "productId, question, and answer are required" });
    }
    const faq = await ProductFaq.create({ productId, question, answer, order });
    res.status(201).json(faq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFaqs = async (req, res) => {
  try {
    const { productId } = req.query;
    const filter = productId ? { productId } : {};
    const faqs = await ProductFaq.find(filter);
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFaq = async (req, res) => {
  try {
    const faq = await ProductFaq.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    res.json(faq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateFaq = async (req, res) => {
  try {
    const { question, answer, order } = req.body;
    const faq = await ProductFaq.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    if (question) faq.question = question;
    if (answer) faq.answer = answer;
    if (order !== undefined) faq.order = order;
    await faq.save();
    res.json(faq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteFaq = async (req, res) => {
  try {
    const faq = await ProductFaq.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    res.json({ message: "FAQ deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
