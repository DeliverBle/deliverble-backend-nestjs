import { ForbiddenException } from "@nestjs/common";

export const checkPasswordOfEventInformation = (password: string): void => {
  if (password !== process.env.EVENT_PASSWORD) {
    throw new ForbiddenException;
  }
};
