module.exports.CustomError = class CustomError extends Error {
  constructor(code, message) {
    super();
    this.message = message;
    this.code = code;
  }
  toString() {
    return `code : ${code}\n message: ${this.message}`;
  }
};
