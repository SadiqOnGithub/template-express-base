import { AppError } from '#errors'
import { Admin } from '#models'
import jwt from 'jsonwebtoken'

const adminLogin = (req, res) => {
  res.send('api is working !!!!!!')
}

const refresh = async (req, res) => {
  const cookies = req.cookies

  if (!cookies?.jwt) throw new AppError('No refresh token found', 401)

  const refreshToken = cookies.jwt

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
  const foundUser = await Admin.findById(decoded._id)

  if (!foundUser) throw new AppError('User not found', 401)

  const accessToken = foundUser.generateAccessToken()

  res.json({ accessToken })
}

export default {
  adminLogin,
  refresh,
}
