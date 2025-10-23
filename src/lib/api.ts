export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const BASE_HEADERS = (headers: Headers) => {
  headers.set("Accept", "application/json");

  return headers;
};
