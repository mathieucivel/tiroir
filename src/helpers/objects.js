export function flattenObject(object, prefix = '') {
  if (!object) return;
  return Object.keys(object).reduce(
    (prev, element) =>
      object[element] &&
      typeof object[element] === 'object' &&
      !Array.isArray(object[element])
        ? {...prev, ...flattenObject(object[element], `${prefix}${element}.`)}
        : {...prev, ...{[`${prefix}${element}`]: object[element]}},
    {},
  );
}
