import createDebug from 'debug';

const debug = createDebug('app:util');

const routes = [];
$(document).on('ready', () => {
  const { pathname } = location;
  for (const route of routes) {
    if (route.pathisRe ? pathname.match(route.path) : route.path === pathname) {
      route.enter.call(null, pathname);
      route.current = true;
    } else if (route.current) {
      route.current = false;
      route.exit.call(null, pathname);
    }
  }
});

$(window).on('beforeunload', () => {
  const route = routes.find(route => route.current) || { exit: () => {} };
  route.current = false;
  route.exit.call(null);
});

export function route(path, enter, exit = () => {}) {
  if (!path || !enter) {
    throw new Error('Expecting at least two arguments to utils.route(), got: ' + JSON.stringify(arguments));
  }
  routes.push({
    path,
    pathisRe: path instanceof RegExp,
    enter,
    exit,
    current: false
  });
}

export function onLoad(cb) {
  $(document).on('ready', cb);
}

Object.globalAssign = (k, a) => {
  if (typeof(window[k]) !== 'object') {
    window[k] = {};
  }
  Object.assign(window[k], a);
};

Object.each = (o, f) => {
  const keys = Object.keys(o);
  keys.forEach((k) => {
    f(k, o[k]);
  });
};

Object.filter = (o, f) => {
  const matches = {};
  Object.each(o, (k, v) => {
    if (f(k, v)) {
      matches[k] = v;
    }
  });
  return matches;
};

Object.map = (o, f) => {
  const results = [];
  Object.each(o, (k, v) => {
    results.push(f(k, v));
  });
  return results;
};

Array.flatten = (a) => a.reduce((a, b) => a.concat(b), []);