//  Send any success response

const success = (message, data, statusCode) => {
  return {
    status: statusCode,
    message,
    data,
  };
};

// Send any error response

const error = (message, statusCode) => {
  // List of common HTTP request code
  const codes = [200, 201, 400, 401, 404, 403, 422, 500];

  // Get matched code
  const findCode = codes.find((code) => code == statusCode);

  if (!findCode) statusCode = 500;
  else statusCode = findCode;

  return {
    message,
    status: statusCode,
  };
};

//  Send any validation response

const validation = (errors) => {
  return {
    message: "Validation errors",
    error: true,
    code: 422,
    errors,
  };
};

export { success, error, validation };
