const FIREBASE_CODE_MESSAGES = {
  "permission-denied": "You don't have permission to do that.",
};

export const getErrorMessage = (error, fallbackMessage = "Something went wrong.") => {
  if (error?.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error?.code && FIREBASE_CODE_MESSAGES[error.code]) {
    return FIREBASE_CODE_MESSAGES[error.code];
  }
  if (error?.message) {
    return error.message;
  }
  return fallbackMessage;
};
