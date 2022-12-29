export const util = {
  success: (statusCode: number, message: string, data?: any, data2?: any) => {
    return {
      statusCode,
      message,
      data,
      data2,
    };
  },
  fail: (statusCode: number, message: string, data?: any) => {
    return {
      statusCode,
      message,
      data,
    };
  },
};
