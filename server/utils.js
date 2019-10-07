function formatStringAsStringifiedJson(value) {
  return value.replace(/\'/g, "\"");
}

module.exports = formatStringAsStringifiedJson;
