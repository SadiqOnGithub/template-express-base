import dotenv from 'dotenv'
dotenv.config()
import { AppError } from '#errors'
import { Admin } from '#models'
import { authValidators } from '#validators'
import jwt from 'jsonwebtoken'

const cookieOptions = (days = 7) => {
  const options = {
    httpOnly: true,
    maxAge: days * 24 * 60 * 60 * 1000, // 7 days
  }

  if (process.env.NODE_ENV === 'production') {
    options.secure = true
    options.sameSite = true
  }
  return options
}

const adminRegister = async (req, res) => {
  // 1. Validate input
  const { error } = authValidators.loginSchemaTesting.validate(req.body)
  if (error) {
    throw new AppError(error.details[0].message, 400)
  }

  const { username, password } = req.body

  // 2. Check if admin already exists
  const existingAdmin = await Admin.findOne({ username }).collation({ locale: 'en', strength: 2 })
  if (existingAdmin) {
    throw new AppError('Username already exists', 409)
  }

  // 3. Create new admin
  const newAdmin = new Admin({
    username,
    password, // password will be hashed by the pre-save hook in the Admin model
  })

  // 4. Save admin to database
  await newAdmin.save()

  // 5. Generate tokens
  const accessToken = newAdmin.generateAccessToken()
  const refreshToken = newAdmin.generateRefreshToken()

  // 6. Save refresh token to database
  newAdmin.refreshToken = refreshToken
  await newAdmin.save({ validateBeforeSave: false })

  // 7. Set refresh token as HTTP-Only cookie
  res.cookie('jwt', refreshToken, cookieOptions())

  // 8. Send response
  res.status(201).json({
    username: newAdmin.username,
    accessToken,
  })
}

const adminLogin = async (req, res) => {
  // 1. Validate input
  const { error } = authValidators.loginSchemaTesting.validate(req.body)
  if (error) {
    throw new AppError(error.details[0].message, 400)
  }

  const { username, password } = req.body

  // 2. Find the admin
  const admin = await Admin.findOne({ username }).select('+password')
  if (!admin) {
    throw new AppError('username not found', 401)
  }

  // 3. Check password
  const isPasswordCorrect = await admin.isPasswordCorrect(password)
  if (!isPasswordCorrect) {
    throw new AppError('incorrect password', 401)
  }

  // 4. Generate tokens
  const accessToken = admin.generateAccessToken()
  const refreshToken = admin.generateRefreshToken()

  // 5. Save refresh token to database (optional, but recommended)
  admin.refreshToken = refreshToken
  await admin.save({ validateBeforeSave: false })

  // 6. Set refresh token as HTTP-Only cookie
  res.cookie('jwt', refreshToken, cookieOptions())

  // 7. Send response
  res.status(200).json({
    username: admin.username,
    accessToken,
  })
}

const refresh = async (req, res) => {
  const cookies = req.cookies

  if (!cookies?.jwt) throw new AppError('No refresh token found', 401)

  const refreshToken = cookies.jwt // + 'asdfsdf'

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
  // if throw error then will be handled in gobal error handler

  const foundUser = await Admin.findById(decoded._id)

  if (!foundUser) throw new AppError('User not found', 401)

  const accessToken = foundUser.generateAccessToken()

  res.json({ accessToken })
}

export default {
  adminRegister,
  adminLogin,
  refresh,
}
