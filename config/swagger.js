import dotenv from "dotenv";
import swaggerJsDoc from "swagger-jsdoc";

dotenv.config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ecommerce Authentication API",
      version: "1.0.0",
      description: "A complete authentication API for ecommerce applications",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: "Development server",
      },
    ],
    tags: [
      { name: "Auth", description: "Authentication and user endpoints" },
      { name: "Social", description: "Social media authentication endpoints" },
      { name: "Admin", description: "Admin-only endpoints" },
      { name: "Products", description: "Product management endpoints" },
      { name: "Brands", description: "Brand management endpoints" },
      {
        name: "PaymentTransactions",
        description: "Payment transaction endpoints",
      },
      { name: "PartialPayments", description: "Partial payment management" },
      { name: "Wallets", description: "Wallet management" },
      {
        name: "PaymentCallbacks",
        description: "Payment callback log management",
      },
      {
        name: "OrderHistory",
        description: "Tracks every order status change for auditing",
      },
      {
        name: "OrderReturn",
        description: "Manages return requests with item-level return support",
      },
      {
        name: "OrderReplacement",
        description: "Handles product replacement flow separately from returns",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
                stack: {
                  type: "string",
                },
              },
            },
          },
        },
        OrderHistory: {
          type: "object",
          properties: {
            orderId: { type: "string", description: "Order ID" },
            status: { type: "string", description: "Order status" },
            comment: { type: "string", description: "Comment" },
            updatedBy: { type: "string", description: "Admin/staff user ID" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        OrderReturn: {
          type: "object",
          properties: {
            orderId: { type: "string", description: "Order ID" },
            userId: { type: "string", description: "User ID" },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  productId: { type: "string", description: "Product ID" },
                  quantity: { type: "number", description: "Quantity" },
                  reason: { type: "string", description: "Return reason" },
                },
              },
            },
            status: {
              type: "string",
              enum: ["requested", "approved", "rejected", "refunded"],
              description: "Return status",
            },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        OrderReplacement: {
          type: "object",
          properties: {
            orderId: { type: "string", description: "Order ID" },
            userId: { type: "string", description: "User ID" },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  productId: { type: "string", description: "Product ID" },
                  quantity: { type: "number", description: "Quantity" },
                },
              },
            },
            reason: { type: "string", description: "Replacement reason" },
            status: {
              type: "string",
              enum: ["requested", "approved", "shipped", "completed"],
              description: "Replacement status",
            },
            createdAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./routes/*.js",
    "./routes/admin/*.js",
    "./routes/paymentTransaction/*.js",
    "./routes/orderHistory/*.js",
    "./models/*.js",
  ],
};

const swaggerSpec = swaggerJsDoc(options);

export default swaggerSpec;
