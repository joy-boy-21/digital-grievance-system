import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const roles = ["STUDENT", "HOD", "DEAN", "CHANCELLOR", "ADMIN"];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: roles, default: "STUDENT" },
    institutionId: { type: String, required: true }, // scope per institution
    department: { type: String },                     // useful for HOD routing
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

export default mongoose.model("User", userSchema);
export const USER_ROLES = roles;
