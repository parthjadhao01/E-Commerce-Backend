import TaxRule from "../models/product/TaxRuleModel.js";

export const createTaxRule = async (req, res) => {
  try {
    const { name, type, value, country, state, status } = req.body;
    if (!name || !type || value === undefined) {
      return res
        .status(400)
        .json({ message: "Name, type, and value are required" });
    }
    const rule = await TaxRule.create({
      name,
      type,
      value,
      country: country || "IN",
      state: state || null,
      status: status !== undefined ? status : true,
    });
    res.status(201).json(rule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTaxRules = async (req, res) => {
  try {
    const rules = await TaxRule.find();
    res.json(rules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTaxRule = async (req, res) => {
  try {
    const rule = await TaxRule.findById(req.params.id);
    if (!rule) return res.status(404).json({ message: "Tax rule not found" });
    res.json(rule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTaxRule = async (req, res) => {
  try {
    const { name, type, value, country, state, status } = req.body;
    const rule = await TaxRule.findById(req.params.id);
    if (!rule) return res.status(404).json({ message: "Tax rule not found" });
    if (name) rule.name = name;
    if (type) rule.type = type;
    if (value !== undefined) rule.value = value;
    if (country) rule.country = country;
    if (state !== undefined) rule.state = state;
    if (status !== undefined) rule.status = status;
    await rule.save();
    res.json(rule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTaxRule = async (req, res) => {
  try {
    const rule = await TaxRule.findByIdAndDelete(req.params.id);
    if (!rule) return res.status(404).json({ message: "Tax rule not found" });
    res.json({ message: "Tax rule deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
