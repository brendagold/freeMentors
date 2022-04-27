//  Send any success response

const success = (message, data, status) => {
  return {
    
    status,
    message,
    data,
    success: true,
  };
};

// Send any error response

const error = (message, status) => {

  return {
    message,
    status: status,
    success: false,
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
