module.exports = {
  successRespone: (res, status, message, data, options = {}) => {
    const response = {
      status,
      message,
      data,
      ...options,
    };
    return res.status(status).json(response);
  },
  errorRespone: (res, status, message, options = {}) => {
    const response = {
      status,
      message,
      ...options,
    };
    return res.status(status).json(response);
  },
};
