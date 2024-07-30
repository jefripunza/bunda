export const execute = async (script: string, args: object) => {
  return await new Function(
    "__req__",
    `let { ${Object.keys(args).join(
      ", "
    )} } = __req__; return (async () => {${script}})();`
  )(args);
};
