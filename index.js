module.exports = (moduleName, dist = "./") => {
  const stringify = require("json-stringify-safe");
  const replace = (k, v) => {
    const type = typeof v;
    if (type === "object") return v;
    if (type === "function") return v.toString();
    return typeof v;
  };
  const json = stringify(require(moduleName), replace, 2);
  require("fs").writeFileSync(
    require("path").resolve(dist, `${moduleName}.json`),
    json
  );
};
