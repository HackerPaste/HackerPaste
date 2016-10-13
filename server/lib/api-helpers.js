var API = module.exports

API.prep = function (statusCode, response) {
  return function (input) {
    response.status(statusCode).send(input)
  }
}
