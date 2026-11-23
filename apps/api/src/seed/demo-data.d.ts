// The web app's demo data (@/demo/*) is TypeScript and typechecked here as
// it is imported. A few demo modules still import JS from the web app's
// components (e.g. the fashion type ids); without allowJs that JS is untyped,
// so it is declared here. A component converted to TS is typed as usual.
declare module "@/components/*";
