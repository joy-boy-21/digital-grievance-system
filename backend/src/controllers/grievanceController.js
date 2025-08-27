import { validationResult } from "express-validator";
import Grievance, { GRIEVANCE_CONSTANTS } from "../models/Grievance.js";
import { shouldEscalate, nextRole, mockNotifications } from "../utils/escalationEngine.js";

/**
 * POST /api/grievances
 * Anyone can submit (anonymous allowed), but we still scope to institutionId.
 * Body: { title, description, category, priority, isAnonymous, institutionId, assignedDepartment? }
 */
export const createGrievance = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const {
    title,
    description,
    category = "Other",
    priority = "MEDIUM",
    isAnonymous = true,
    institutionId,
    assignedDepartment
  } = req.body;

  const payload = {
    title,
    description,
    category,
    priority,
    isAnonymous,
    institutionId,
    assignedDepartment,
    assignedRole: "HOD",
    status: "PENDING",
    timeline: [{ action: "CREATED", note: "Grievance created" }]
  };

  if (!isAnonymous && req.user) payload.studentId = req.user._id;

  const g = await Grievance.create(payload);
  res.status(201).json(g);
};

/**
 * GET /api/grievances
 * Role-scoped listing:
 *  - STUDENT: own (if not anonymous) + those submitted anonymously can't be listed by student in this demo
 *  - HOD: department + institution
 *  - DEAN/CHANCELLOR/ADMIN: institution-wide
 * Filters: status, category, priority
 */
export const getGrievances = async (req, res) => {
  const { status, category, priority, department } = req.query;
  const q = { institutionId: req.user.institutionId };

  if (status) q.status = status;
  if (category) q.category = category;
  if (priority) q.priority = priority;

  if (req.user.role === "STUDENT") {
    // show their identified grievances
    q.studentId = req.user._id;
  } else if (req.user.role === "HOD") {
    q.$or = [{ assignedRole: "HOD" }, { assignedDepartment: req.user.department }];
  } else if (req.user.role === "DEAN") {
    // dean sees anything assigned to DEAN or below within institution
  } else if (req.user.role === "CHANCELLOR") {
    // full institution visibility
  } else if (req.user.role === "ADMIN") {
    // full institution visibility
  }

  if (department) q.assignedDepartment = department;

  const list = await Grievance.find(q).sort({ createdAt: -1 });
  res.json(list);
};

/**
 * GET /api/grievances/:id
 * Access: must belong to same institution. Students can only see their own (non-anon) record.
 */
export const getGrievanceById = async (req, res) => {
  const g = await Grievance.findById(req.params.id);
  if (!g || g.institutionId !== req.user.institutionId) {
    return res.status(404).json({ message: "Grievance not found" });
  }
  if (req.user.role === "STUDENT" && (!g.studentId || String(g.studentId) !== String(req.user._id))) {
    return res.status(403).json({ message: "Forbidden" });
  }
  res.json(g);
};

/**
 * PUT /api/grievances/:id/status
 * Body: { status, note? }
 * Roles: HOD/DEAN/CHANCELLOR/ADMIN
 */
export const updateStatus = async (req, res) => {
  const { status, note } = req.body;
  if (!GRIEVANCE_CONSTANTS.statuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const g = await Grievance.findById(req.params.id);
  if (!g || g.institutionId !== req.user.institutionId) {
    return res.status(404).json({ message: "Grievance not found" });
  }

  g.status = status;
  g.lastActionAt = new Date();
  g.timeline.push({ by: req.user._id, roleAtAction: req.user.role, action: "STATUS_CHANGE", note });
  await g.save();

  res.json(g);
};

/**
 * PUT /api/grievances/:id/escalate
 * Moves assignedRole up the chain when SLA breached (or manual trigger).
 * Roles: HOD/DEAN/CHANCELLOR/ADMIN (HOD can escalate to DEAN, etc.)
 * Body: { reason? }
 */
export const escalateGrievance = async (req, res) => {
  const { reason } = req.body || {};
  const g = await Grievance.findById(req.params.id);
  if (!g || g.institutionId !== req.user.institutionId) {
    return res.status(404).json({ message: "Grievance not found" });
  }

  // guard: CHANCELLOR is top
  const targetRole = nextRole(g.assignedRole);
  if (targetRole === g.assignedRole) {
    return res.status(400).json({ message: "Already at top level" });
  }

  g.escalations.push({
    fromRole: g.assignedRole,
    toRole: targetRole,
    reason: reason || (shouldEscalate(g) ? "SLA breach" : "Manual escalation")
  });
  g.assignedRole = targetRole;
  g.status = "ESCALATED";
  g.lastActionAt = new Date();
  g.timeline.push({ by: req.user._id, roleAtAction: req.user.role, action: "ESCALATE", note: reason });

  await g.save();

  // mock notifications
  const notices = mockNotifications({
    toRole: targetRole,
    institutionId: g.institutionId,
    grievanceId: g._id,
    title: g.title
  });

  res.json({ grievance: g, notifications: notices });
};
