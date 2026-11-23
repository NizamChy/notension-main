// Class names of RoundLoader.module.css. Next's own `*.module.css` typing
// lives in the generated (git-ignored) next-env.d.ts, which a plain
// `tsc --noEmit` on a fresh checkout does not have.
declare const styles: {
  readonly root: string;
  readonly box: string;
  readonly ring: string;
  readonly logo: string;
};

export default styles;
