module.exports = {
  err400: { status: 400, message: "Invalid ID format" },
  err401: { status: 401, message: "Unauthorized error" },
  err403: { status: 403, message: "Forbidden" },
  err404: { status: 404, message: "Item not found" },
  err409: { status: 409, message: "Conflict. Resource already exists." },
  err500: { status: 500, message: "An error occurred on the server" },
};
