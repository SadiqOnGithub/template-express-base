import { AppError } from '#errors'
import { Admin } from '#models'
import { validateLoginInput } from '#validators'
import jwt from 'jsonwebtoken'

const adminLogin = async (req, res) => {
  // 1. Validate input
  const { error } = validateLoginInput(req.body)
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
  // admin.refreshToken = refreshToken
  // await admin.save({ validateBeforeSave: false })

  // 6. Set refresh token as HTTP-Only cookie
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })

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
  adminLogin,
  refresh,
}
