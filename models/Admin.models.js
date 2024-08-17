import { model, Schema } from 'mongoose'

import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const adminSchema = Schema({
  username: String,
  password: String,
})

adminSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

adminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, username: this.username },
    process.env.ACCESS_TOKEN_SECRET, // prettier-ignore
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  )
}

adminSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET, // prettier-ignore
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  )
}

const Admin = model('Admin', adminSchema)

export default Admin
