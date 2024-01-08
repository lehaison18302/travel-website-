"use strict";

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class BadRequestError extends Error {
  constructor(message = "Bad request Error", statusCode = 403) {
    super(message, statusCode);
  }
}

module.exports = {
  BadRequestError,
};
