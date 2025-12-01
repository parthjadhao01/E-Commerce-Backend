import ShippingRule from "../models/shippingCostModel/ShippingRuleModel.js";

// ==================== CREATE SHIPPING RULE ====================
export const createShippingRule = async (req, res) => {
  try {
    const {
      title,
      minOrderValue,
      maxOrderValue,
      shippingCost,
      country,
      state,
      postalCodes,
      status,
    } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!country || !country.trim()) {
      return res.status(400).json({
        success: false,
        message: "Country is required",
      });
    }

    if (minOrderValue < 0) {
      return res.status(400).json({
        success: false,
        message: "Minimum order value cannot be negative",
      });
    }

    if (maxOrderValue < 0) {
      return res.status(400).json({
        success: false,
        message: "Maximum order value cannot be negative",
      });
    }

    if (maxOrderValue <= minOrderValue) {
      return res.status(400).json({
        success: false,
        message: "Maximum order value must be greater than minimum order value",
      });
    }

    if (shippingCost < 0) {
      return res.status(400).json({
        success: false,
        message: "Shipping cost cannot be negative",
      });
    }

    const rule = new ShippingRule({
      title: title.trim(),
      minOrderValue,
      maxOrderValue,
      shippingCost,
      country: country.trim(),
      state: state ? state.trim() : null,
      postalCodes: postalCodes || [],
      status: status !== undefined ? status : true,
    });

    await rule.save();

    res.status(201).json({
      success: true,
      message: "Shipping rule created successfully",
      data: rule,
    });
  } catch (error) {
    console.error("Error creating shipping rule:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== GET ALL SHIPPING RULES ====================
export const getAllShippingRules = async (req, res) => {
  try {
    const rules = await ShippingRule.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rules.length,
      data: rules,
    });
  } catch (error) {
    console.error("Error fetching shipping rules:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== GET SHIPPING RULE BY ID ====================
export const getShippingRuleById = async (req, res) => {
  try {
    const rule = await ShippingRule.findById(req.params.id);

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: "Shipping rule not found",
      });
    }

    res.status(200).json({
      success: true,
      data: rule,
    });
  } catch (error) {
    console.error("Error fetching shipping rule:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== UPDATE SHIPPING RULE ====================
export const updateShippingRule = async (req, res) => {
  try {
    const {
      title,
      minOrderValue,
      maxOrderValue,
      shippingCost,
      country,
      state,
      postalCodes,
      status,
    } = req.body;

    // Find existing rule
    const existingRule = await ShippingRule.findById(req.params.id);
    if (!existingRule) {
      return res.status(404).json({
        success: false,
        message: "Shipping rule not found",
      });
    }

    // Validation
    if (title !== undefined && (!title || !title.trim())) {
      return res.status(400).json({
        success: false,
        message: "Title cannot be empty",
      });
    }

    if (country !== undefined && (!country || !country.trim())) {
      return res.status(400).json({
        success: false,
        message: "Country cannot be empty",
      });
    }

    if (minOrderValue !== undefined && minOrderValue < 0) {
      return res.status(400).json({
        success: false,
        message: "Minimum order value cannot be negative",
      });
    }

    if (maxOrderValue !== undefined && maxOrderValue < 0) {
      return res.status(400).json({
        success: false,
        message: "Maximum order value cannot be negative",
      });
    }

    const finalMinValue =
      minOrderValue !== undefined ? minOrderValue : existingRule.minOrderValue;
    const finalMaxValue =
      maxOrderValue !== undefined ? maxOrderValue : existingRule.maxOrderValue;

    if (finalMaxValue <= finalMinValue) {
      return res.status(400).json({
        success: false,
        message: "Maximum order value must be greater than minimum order value",
      });
    }

    if (shippingCost !== undefined && shippingCost < 0) {
      return res.status(400).json({
        success: false,
        message: "Shipping cost cannot be negative",
      });
    }

    // Update rule
    const rule = await ShippingRule.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title: title.trim() }),
        ...(minOrderValue !== undefined && { minOrderValue }),
        ...(maxOrderValue !== undefined && { maxOrderValue }),
        ...(shippingCost !== undefined && { shippingCost }),
        ...(country && { country: country.trim() }),
        ...(state !== undefined && { state: state ? state.trim() : null }),
        ...(postalCodes !== undefined && { postalCodes }),
        ...(status !== undefined && { status }),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Shipping rule updated successfully",
      data: rule,
    });
  } catch (error) {
    console.error("Error updating shipping rule:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== DELETE SHIPPING RULE ====================
export const deleteShippingRule = async (req, res) => {
  try {
    const rule = await ShippingRule.findByIdAndDelete(req.params.id);

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: "Shipping rule not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Shipping rule deleted successfully",
      data: rule,
    });
  } catch (error) {
    console.error("Error deleting shipping rule:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
