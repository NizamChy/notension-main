declare module "js-cookie" {
  const Cookies: { remove: (name: string, options?: object) => void; [k: string]: unknown };
  export default Cookies;
}
