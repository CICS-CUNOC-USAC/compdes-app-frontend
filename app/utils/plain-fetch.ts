import { COOKIE_TOKEN_KEY } from "~/plugins/01.authCookie"

export const $api = $fetch.create({
  // baseURL: `${import.meta.env.VITE_API_HOST}`,
  baseURL: "https://compdes.cunoc.edu.gt/api/api/v1",
  onRequest({ options }) {
    const token = useCookie(COOKIE_TOKEN_KEY).value
    options.headers.set('Authorization', `Bearer ${token}`)
  },
  onRequestError(error) {
  },
  onResponseError(error) {
  }
})