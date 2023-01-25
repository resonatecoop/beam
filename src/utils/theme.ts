export const theme = {
  colors: {
    primary: "#505354",
    primaryHighlight: "#7A7E80",
    text: "#18191A",
    textDark: "#F2F4F5",
    background: "#F2F4F5",
    backgroundDark: "#18191A",
    warning: "#F2F4F5",
    success: "#505354",
  },
};

/**
 * @param color Hex value format: #ffffff or ffffff
 * @param decimal lighten or darken decimal value, between
 */
export const colorShade = (col: string, amt: number) => {
  col = col.replace(/^#/, "");
  if (col.length === 3)
    col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];

  // @ts-ignore
  let [r, g, b] = col.match(/.{2}/g);
  [r, g, b] = [
    parseInt(r, 16) + amt,
    parseInt(g, 16) + amt,
    parseInt(b, 16) + amt,
  ];

  r = Math.max(Math.min(255, r), 0).toString(16);
  g = Math.max(Math.min(255, g), 0).toString(16);
  b = Math.max(Math.min(255, b), 0).toString(16);

  const rr = (r.length < 2 ? "0" : "") + r;
  const gg = (g.length < 2 ? "0" : "") + g;
  const bb = (b.length < 2 ? "0" : "") + b;

  return `#${rr}${gg}${bb}`;
};
