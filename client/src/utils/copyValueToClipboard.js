export function copyValueToClipboard(value) {
  const target = document.createElement("input");
  document.body.appendChild(target);
  target.id = "target";
  target.value = value;
  target.select();
  document.execCommand("copy");
  document.body.removeChild(target);
}
