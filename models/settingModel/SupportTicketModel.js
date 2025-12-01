const mongoose = require("mongoose");
const { Schema } = mongoose;

const SupportTicketSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  subject: String,
  description: String,
  priority: String, // 'low', 'medium', 'high'
  status: String, // 'open', 'in-progress', 'resolved'
  assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SupportTicket", SupportTicketSchema);
