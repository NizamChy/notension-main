declare module "js-cookie" {
  const Cookies: {
    set: (name: string, value: string, options?: object) => string | undefined;
    remove: (name: string, options?: object) => void;
    [k: string]: unknown;
  };
  export default Cookies;
}
