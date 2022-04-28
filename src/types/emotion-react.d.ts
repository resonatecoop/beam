import "@emotion/react";

declare module "@emotion/react" {
  interface Color {
    main: string;
  }
  export interface Theme {
    colors: { primary: string; text: string; background: string };
  }
}
