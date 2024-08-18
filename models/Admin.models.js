import dotenv from 'dotenv'
dotenv.config()
import { model, Schema } from 'mongoose'

import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const adminSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      unique: true,
      trim: true,
      // minlength: 3,
      // maxlength: 30,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      // minlength: 8,
      select: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
)

// Pre-save hook to hash password
adminSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next()

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10)
    // Hash the password along with our new salt
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to check if password is correct
adminSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

// Method to generate access token
adminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, username: this.username },
    process.env.ACCESS_TOKEN_SECRET, // prettier-ignore
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  )
}

// Method to generate refresh token
adminSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET, // prettier-ignore
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  )
}

const Admin = model('Admin', adminSchema)

export default Admin
