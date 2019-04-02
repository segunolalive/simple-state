/**
 Proxy-based state management system

 @TODO: Implement a flux-like command (action) dispatch system
*/

export default function createStore(initialState) {
  const STORE_PROXY = typeof Symbol ? Symbol('store-proxy') : 'store-proxy';
  initialState[STORE_PROXY] = true;

  function createProxy(obj) {
    const handlers = {
      get: (target, prop) => {
        if (
          typeof target[prop] === 'object' &&
          target[prop] !== null &&
          !target[prop][STORE_PROXY]
        ) {
          return new Proxy(target[prop], handlers);
        } else {
          return target[prop];
        }
      },
      set(target, property, value, receiver) {
        Reflect.set(...arguments);
        subscribers.forEach(fn => fn(store));
      }
    };
    return new Proxy(obj, handlers);
  }

  const store = createProxy(initialState);

  const subscribers = [];
  const subscribe = fn => {
    subscribers.push(fn);
    fn(store);
    return () => subscribers.filter(sub => sub !== fn);
  };
  return { store, subscribe };
}
