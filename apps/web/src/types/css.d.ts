// Global stylesheets imported for their side effect (app/layout.tsx). Next's
// own types declare this too, but only once next-env.d.ts has been generated
// by `next dev` or `next build`; this keeps a plain `tsc` happy without it.
declare module "*.css";
