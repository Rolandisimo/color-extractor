export function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

export function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

const MAX_VALUE_FOR_LIGHT_COLOR = 210;
export const getContrastColor = (hex) => {
  let color = "#fff";
  const { r, g, b } = hexToRgb(hex)

  if (
    r >= MAX_VALUE_FOR_LIGHT_COLOR
    && g >= MAX_VALUE_FOR_LIGHT_COLOR
    && b >= MAX_VALUE_FOR_LIGHT_COLOR
  ) {
    color = "#000";
  }

  return color;
};
