class AppError extends Error {
  constructor(message, statusCode, name = 'AppError') {
    super(message)
    this.statusCode = statusCode
    this.name = name
    this.isOperational = true // Mark the error as operational (i.e., a known type of error in your app)
    Error.captureStackTrace(this, this.constructor)
  }
}

export default AppError
