// core/utils.js
export function canonicalizeMessage(obj) {
  const order = (o) => {
    if (Array.isArray(o)) return o.map(order);
    if (o && typeof o === 'object') {
      return Object.keys(o).sort().reduce((acc,k)=>{ acc[k]=order(o[k]); return acc; }, {});
    }
    return o;
  };
  return JSON.stringify(order(obj));
}
