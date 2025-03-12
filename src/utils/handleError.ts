export const handleError = (error: Error) => {
  try {
    const errorString = JSON.stringify(error);
    const errorObj = JSON.parse(errorString);

    const errorCode: number | string =
      errorObj.cause?.cause?.code ||
      errorObj.cause?.code ||
      errorObj.code ||
      "UNKNOWN_ERROR";

    const errorMessage =
      errorObj.cause?.shortMessage ||
      errorObj.cause?.cause?.shortMessage ||
      errorObj.message ||
      error.message ||
      "An unknown error occurred";

    return { errorCode, errorMessage };
  } catch (parseError) {
    console.error("Error parsing error object:", parseError);
    return {
      errorCode: "PARSE_ERROR",
      errorMessage: error.message || "An unknown error occurred",
    };
  }
};