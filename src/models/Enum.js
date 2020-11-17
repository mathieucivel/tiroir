export function Enum(obj = {}) {
  const _enum = Object.assign({}, obj);
  const _map = new Map(Object.entries(_enum));

  Object.defineProperties(_enum, {
    toArray: {
      value: () => Array.from(_map).map(e => ({key: e[0], value: e[1]}))
    },
    byValues: {
      value: Array.from(_map).map(e => [e[1], e[0]])
    },
    isValid: {
      value: _val => Array.from(_map.values()).includes(_val)
    }
  });

  return _enum;
}
