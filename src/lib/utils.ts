import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * function that takes a key string like 'name' or 'name.first' and returns a function that takes an object and returns the value of the key in the object
 * @param key - the key to get the value of
 * @param obj - the object to get the value from
 */
export const getObjValue = (key: string | number, obj: any) => {
  const keys = key.toString().split(".");
  let result = obj;
  for (const key of keys) {
    if (result && Object.prototype.hasOwnProperty.call(result, key)) {
      result = result[key];
    } else {
      return undefined;
    }
  }
  return result as string;
};

export function getErrorMessage(error: any) {
  // check if it as axios error and handle accordingly else just return the message
  if (error.response) {
    if (error.response.data) {
      const msg = error.response.data.message;
      if (Array.isArray(msg)) {
        return msg.join(", ");
      }
      return msg;
    }
  } else {
    return error.message;
  }
}