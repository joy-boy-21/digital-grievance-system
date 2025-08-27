/**
 * Simple rule-based escalation for demo:
 * - If PENDING/IN_PROGRESS and no action for X hours, escalate up the chain.
 * - Chain: HOD -> DEAN -> CHANCELLOR
 * X depends on priority:
 *   LOW: 72h | MEDIUM: 48h | HIGH: 24h | CRITICAL: 8h
 */

const THRESHOLDS_HOURS = {
  LOW: 72,
  MEDIUM: 48,
  HIGH: 24,
  CRITICAL: 8
};

const ROLE_CHAIN = ["HOD", "DEAN", "CHANCELLOR"];

export function shouldEscalate(grievance) {
  if (!["PENDING", "IN_PROGRESS", "ESCALATED"].includes(grievance.status)) return false;
  const hours = THRESHOLDS_HOURS[grievance.priority] ?? 48;
  const last = grievance.lastActionAt ? new Date(grievance.lastActionAt) : new Date(grievance.createdAt);
  const diffHrs = (Date.now() - last.getTime()) / (1000 * 60 * 60);
  return diffHrs >= hours;
}

export function nextRole(currentRole) {
  const idx = ROLE_CHAIN.indexOf(currentRole);
  if (idx === -1) return "HOD";
  return ROLE_CHAIN[Math.min(idx + 1, ROLE_CHAIN.length - 1)];
}

/**
 * mockNotifications: return messages you can log or later integrate
 */
export function mockNotifications({ toRole, institutionId, grievanceId, title }) {
  return [
    `Notify ${toRole} at institution ${institutionId}: Grievance ${grievanceId} "${title}" escalated.`
  ];
}
