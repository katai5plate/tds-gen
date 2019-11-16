module.exports = (moduleName, dist = "./") => {
  const stringify = require("json-stringify-safe");
  const replace = opt => (k, v) => {
    const type = typeof v;
    for (let r of Object.entries(opt)) {
      const [rk, rv] = r;
      if (type === rk) return rv(k, v);
    }
    return opt.default(k, v);
  };
  const ast = stringify(
    require(moduleName),
    replace({
      object: (k, v) => v,
      function: (k, v) => v.toString(),
      default: (k, v) => typeof v
    }),
    2
  );
  require("fs").writeFileSync(
    require("path").resolve(dist, `${moduleName}.json`),
    ast
  );
  const isFunction = x => !!x.match(/function/m) || !!x.match(/=>/m);
  const isCamel = x =>
    x.charAt(0) === x.charAt(0).toUpperCase() &&
    x !== x.toUpperCase() &&
    !x.match(/_/);
  const dts = Object.entries(JSON.parse(ast))
    .map(([k, v]) => {
      const type = typeof v;
      if (type === "object") {
        if (Array.isArray(v)) {
          return `export const ${k}: [${v.join(", ")}];`;
        }
        // return `export interface ${k} ${JSON.stringify(v)};`;
        return `export const ${k}: {};\n${Object.entries(
          JSON.parse(stringify(v))
        )
          .map(x => `// ${x[0]}: ${stringify(x[1])}`)
          .join("\n")}`;
      }
      if (isFunction(v))
        return [
          isCamel(k)
            ? `export const ${k}: React.Component<any, any, any>;`
            : `export const ${k}: Function;`,
          ...v.split("\n").map((x, i) => {
            // if (i === 0) return `// export const ${k} = ${x}`;
            return `// ${x}`;
          })
        ].join("\n");
      return `export const ${k}: ${v};`;
    })
    .join("\n");
  require("fs").writeFileSync(
    require("path").resolve(dist, `${moduleName}.d.ts`),
    dts
  );
};
