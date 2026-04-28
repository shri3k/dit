export class DitError extends Error {
  constructor(code, message, details) {
    super(message);
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, DitError.prototype);
  }
}
