import StockLog from "../models/product/StockLogModel.js";

export const createStockLog = async (req, res) => {
  try {
    const { productId, variantId, type, quantity, source, note } = req.body;
    if (!productId || !type || !quantity || !source) {
      return res.status(400).json({
        message: "productId, type, quantity, and source are required",
      });
    }

    if (!["in", "out"].includes(type)) {
      return res.status(400).json({ message: "type must be 'in' or 'out'" });
    }

    if (!["manual", "order", "return"].includes(source)) {
      return res
        .status(400)
        .json({ message: "source must be 'manual', 'order', or 'return'" });
    }

    const log = await StockLog.create({
      productId,
      variantId: variantId || null,
      type,
      quantity,
      source,
      note: note || "",
    });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStockLogs = async (req, res) => {
  try {
    const { productId, variantId } = req.query;
    const filter = {};
    if (productId) filter.productId = productId;
    if (variantId) filter.variantId = variantId;
    const logs = await StockLog.find(filter)
      .populate("productId", "title sku")
      .populate("variantId", "sku attributes")
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStockLog = async (req, res) => {
  try {
    const log = await StockLog.findById(req.params.id)
      .populate("productId", "title sku")
      .populate("variantId", "sku attributes");
    if (!log) return res.status(404).json({ message: "Stock log not found" });
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateStockLog = async (req, res) => {
  try {
    const { productId, variantId, type, quantity, source, note } = req.body;

    if (type && !["in", "out"].includes(type)) {
      return res.status(400).json({ message: "type must be 'in' or 'out'" });
    }

    if (source && !["manual", "order", "return"].includes(source)) {
      return res
        .status(400)
        .json({ message: "source must be 'manual', 'order', or 'return'" });
    }

    const updateData = {};
    if (productId) updateData.productId = productId;
    if (variantId !== undefined) updateData.variantId = variantId || null;
    if (type) updateData.type = type;
    if (quantity) updateData.quantity = quantity;
    if (source) updateData.source = source;
    if (note !== undefined) updateData.note = note;

    const log = await StockLog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("productId", "title sku")
      .populate("variantId", "sku attributes");

    if (!log) return res.status(404).json({ message: "Stock log not found" });
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteStockLog = async (req, res) => {
  try {
    const log = await StockLog.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ message: "Stock log not found" });
    res.json({ message: "Stock log deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
