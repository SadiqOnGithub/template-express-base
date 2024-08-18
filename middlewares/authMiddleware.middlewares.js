import jwt from 'jsonwebtoken'
import { AppError } from '#errors'

const authMiddleware = (req, res, next) => {
  // 1. Get the token from the Authorization header
  const authHeader = req.headers.authorization || req.headers.Authorization
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('No token provided', 401)
  }
  const token = authHeader.split(' ')[1]
  // 2. Verify the token
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

  // 3. Attach the username and _id to the request object
  req.id = decoded._id
  req.username = decoded.username

  next()
}

export default authMiddleware
