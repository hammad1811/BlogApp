import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateRefreshToken = function () {
 return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      avatar: this.avatar,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
        _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
    );
}



export const User = mongoose.model("User", userSchema);
