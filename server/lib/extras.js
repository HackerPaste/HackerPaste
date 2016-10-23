Array.map = (fn) => array => array.map(fn);

Object.pick = (...props) => obj => {
  if (props.length === 1) {
    return obj[props[0]];
  }
  return props.reduce((res, prop) => {
    res[prop] = obj[prop];
    return res;
  }, {});
};

Object.omit = (...props) => obj => (
  Object.keys(obj).reduce((res, key) => {
    if (obj.hasOwnProperty(key) && !~props.indexOf(key)) {
      res[key] = obj[key];
    }
    return res;
  }, {})
);
