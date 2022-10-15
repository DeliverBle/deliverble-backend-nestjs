export const util = {
  success: (status: number, message: string, data?: any, data2?: any) => {
      return {
          status,
          success: true,
          message,
          data,
          data2,
      };
  },
  fail: (status: number, message: string, data?: any) => {
      return {
          status,
          success: false,
          message,
          data
      };
  },
};
