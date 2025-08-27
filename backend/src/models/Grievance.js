import mongoose from "mongoose";

const statuses = ["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED", "ESCALATED"];
const categories = ["Ragging", "Discrimination", "Academic", "Harassment", "Other"];
const priorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

const actionSchema = new mongoose.Schema(
  {
    by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    roleAtAction: { type: String },
    action: { type: String }, // e.g., "CREATED", "COMMENT", "STATUS_CHANGE", "ESCALATE"
    note: { type: String },
    at: { type: Date, default: Date.now }
  },
  { _id: false }
);

const grievanceSchema = new mongoose.Schema(
  {
    institutionId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: categories, default: "Other" },
    priority: { type: String, enum: priorities, default: "MEDIUM" },

    // anonymity & ownership
    isAnonymous: { type: Boolean, default: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional if anonymous

    // routing & status
    status: { type: String, enum: statuses, default: "PENDING", index: true },
    assignedRole: { type: String, default: "HOD" },     // current responsible party
    assignedDepartment: { type: String },               // for department scoping
    assignedToUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // SLA / escalation timestamps
    lastActionAt: { type: Date, default: Date.now },
    escalations: [
      {
        fromRole: String,
        toRole: String,
        at: { type: Date, default: Date.now },
        reason: String
      }
    ],

    // audit trail
    timeline: [actionSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Grievance", grievanceSchema);

export const GRIEVANCE_CONSTANTS = {
  statuses,
  categories,
  priorities
};
