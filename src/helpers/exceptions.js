
export class CustomError extends Error {
  constructor(message = 'Something went wrong', status = 500) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    // Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends CustomError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

export class InternalServerError extends CustomError {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}


