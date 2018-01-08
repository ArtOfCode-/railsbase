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

/**
 * Helper to enable code execution for a single route only.
 * @param path A string or regex, containing the path that the provided functions should execute on.
 * @param enter A function that will be executed on document-ready for the specified route.
 * @param exit A function that will be executed onbeforeunload for the specified route.
 *
 * Usage:
 *
 *     route('/hello-world', () => alert('Hello World!'), () => alert('Goodbye World!'));
 *     route(/\/(hello|goodbye)-world/, getGreeting, getSalutation);
 */
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

/**
 * Shortcut for $(document).ready(...). This will execute code on ALL ROUTES - it's not specific to a route or controller.
 * For that, use utils.route.
 * @param cb A callback function to execute at document-ready.
 */
export function onLoad(cb) {
  $(document).on('ready', cb);
}

/**
 * Initializes a new global object and assigns the specified object to it. Uses Object.assign, will retain any already-existing
 * object of the specified global name.
 * @param k The name of the new global to initialize
 * @param a An object containing properties to assign to the new global.
 *
 * Usage:
 *
 *     Object.globalAssign('myFancyGlobal', { sayHello: () => 'Hello' });
 *     myFancyGlobal.sayHello();    // => 'Hello'
 */
Object.globalAssign = (k, a) => {
  if (typeof(window[k]) !== 'object') {
    window[k] = {};
  }
  Object.assign(window[k], a);
};

/**
 * Array.prototype.forEach for objects.
 * @param o The object to loop over.
 * @param f A callback to call for each element of the object. Will be passed two parameters, key and value.
 *
 * Usage:
 *
 *     Object.each(window, (k, v) => debug(k, v));
 */
Object.each = (o, f) => {
  const keys = Object.keys(o);
  keys.forEach((k) => {
    f(k, o[k]);
  });
};

/**
 * Array.prototype.filter for objects.
 * @param o The object to filter.
 * @param f A callback to call for each element. Should return true or false - elements for which f returns true will be
 *          included in the results returned.
 * @returns {Object} An object containing only those elements specified by the callback.
 *
 * Usage:
 *
 *     Object.filter(window, (k, v) => k.indexOf('alert') > -1);    // => { alert: <native function alert> }
 */
Object.filter = (o, f) => {
  const matches = {};
  Object.each(o, (k, v) => {
    if (f(k, v)) {
      matches[k] = v;
    }
  });
  return matches;
};

/**
 * Array.prototype.map for objects.
 * @param o The object to map through.
 * @param f A callback to call for each element. The return value of f will be added to the results and returned.
 * @returns {Array} An array containing the return values of the callback.
 *
 * Usage:
 *
 *     const o = { a: [1, 2], b: [3, 4] };
 *     Object.map(o, (k, v) => v[0] + v[1]);    // => [3, 7]
 */
Object.map = (o, f) => {
  const results = [];
  Object.each(o, (k, v) => {
    results.push(f(k, v));
  });
  return results;
};

/**
 * Flatten a two-dimensional array.
 * @param a The array to flatten.
 *
 * Usage:
 *
 *     Array.flatten([[1, 2], [3, 4]]);    // => [1, 2, 3, 4]
 */
Array.flatten = (a) => a.reduce((a, b) => a.concat(b), []);