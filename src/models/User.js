import mongoose, { Schema } from "mongoose";
import { hash } from "bcrypt";

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const hashedPassword = await hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.log("error while hashing password", error);
    return next(error);
  }
});

export const User = mongoose.model("User", UserSchema);
