import { Schema, model, models, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  firstName: string;
  email: string;
  phone: string;
  password?: string;
  meNumber: string;
  roles: string[];
}

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address."],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required."],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      select: false, // no return password field by default
    },
    meNumber: {
      type: String,
      required: true,
      unique: true,
    },
    roles: {
      type: [String],
      default: ["customer"],
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error: any) {
    return next(error);
  }
});

const User = models.User || model<IUser>("User", UserSchema);

export default User;
