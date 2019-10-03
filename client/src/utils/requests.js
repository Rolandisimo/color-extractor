import {
  BASE_URL,
  COLORS,
} from "../consts"

export const getColorsFromImage = async (url) => {
  return fetch(`${BASE_URL}${COLORS}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url }),
  });
}
