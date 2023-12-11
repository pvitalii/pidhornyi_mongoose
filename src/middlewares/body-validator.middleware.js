import createHttpError from "http-errors";

export function bodyValidator(requiredBody) {
  return function (req, res, next) {
    const isRequiredPresent = requiredBody.every(key => Object.keys(req.body).includes(key));
    const isAllAllowed = Object.keys(req.body).every(key => requiredBody.includes(key))
    if (!isRequiredPresent || !isAllAllowed) {
      return next(createHttpError.BadRequest(`Body must have following keys: ${requiredBody.join(', ')}`))
    }
    return next();
  }
}