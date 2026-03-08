export const getErrorMessage = (error, fallbackMessage = "Something went wrong.") => {
  if (error?.response?.data?.detail) {
    return error.response.data.detail;
  }
  return fallbackMessage;
};
