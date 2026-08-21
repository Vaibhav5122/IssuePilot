import mongoose, { type InferSchemaType } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "Email is Required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true },
);

//Hash Password before saving

userSchema.pre("save", async function () {
  if (!this.password || !this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// userSchema.methods.comparePassword = async function (
//   candidatePassword: string,
// ) {
//   if (!this.password) return;
//   return await bcrypt.compare(candidatePassword, this.password);
// };

export type IUser = InferSchemaType<typeof userSchema>;

export const User = mongoose.model("User", userSchema);
