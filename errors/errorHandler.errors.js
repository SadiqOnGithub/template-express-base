import { AppError } from './index.js'

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 400)
}

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message)
  const message = `Invalid input data. ${errors.join('. ')}`
  return new AppError(message, 400)
}

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401)

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401)

// const handleNotBeforeError = (err) => {
//   const message = `Token not active. Please try again after ${err.date}.`
//   return new AppError(message, 401)
// }

const sendErrorResponse = (err, res, isProduction = false) => {
  if (isProduction) {
    if (err.isOperational) {
      // For operational errors, send the status and message
      res.status(err.statusCode).json({ status: err.status, message: err.message })
    } else {
      // For non-operational errors in production, send a generic message
      console.error('ERROR 💥', err)
      res.status(500).json({ status: 'error', message: 'Something went very wrong!' })
    }
  } else {
    // In development, send full error details
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    })
  }
}

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  let error = { ...err }
  error.message = err.message

  // Apply specific error handling
  if (error.name === 'CastError') error = handleCastErrorDB(error)
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error)
  if (error.name === 'JsonWebTokenError') error = handleJWTError()
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError()
  // if (error.name === 'NotBeforeError') error = handleNotBeforeError(error)

  // Mark known errors as operational
  error.isOperational = error instanceof AppError

  const isProduction = process.env.NODE_ENV === 'production'
  sendErrorResponse(error, res, isProduction)
}

export default errorHandler
