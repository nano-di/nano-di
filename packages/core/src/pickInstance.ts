import { listInstanceMethods } from "./util";

/**
 * Picks dependencies from a Class instance and returns a custom object with only those functions.
 * @description Creates an Object with functions on keys matching the names of the picked methods. The lazy instantiation of the class through call forwarding allows the output of this method to be safely used as input of `stubDependencies` without bootstraping the constructor code. That improves testing ergonomics AND provides TS-powered compile-time protection against circular reference issues.
 * @param Class The class from whichs instance to pick methods from
 * @param methods an array of method names to pick
 * @param instantiator @optional a function that returns an instance of the class. Defaults to a `() => new Class(config)`. Useful for Classes with unconventional constructor signatures`.
 * @returns an object with functions on keys matching the names of the picked methods, to which all calls will be forwarded a single, lazily created instance of the class.
 */
export const pickInstance = <T, TKeys extends keyof T = keyof T>(
  Class: { new(...args: any[]): T },
  methodListOrInstantiator?: TKeys[] | (() => T),
  instantiator?: (() => T),
) => {
  let instance: T | null = null;

  const methodList = methodListOrInstantiator && Array.isArray(methodListOrInstantiator)
    ? methodListOrInstantiator
    : null;

  const instantiatorFn = typeof methodListOrInstantiator === 'function'
    ? methodListOrInstantiator
    : instantiator || (() => new Class());

  const getInstance = () => {
    if (!instance) {
      instance = instantiatorFn();
    }

    return instance;
  };

  const consideredMethods = methodList || listInstanceMethods<T, TKeys>(Class);

  return consideredMethods.reduce((all, methodName) => ({
    ...all,
    [methodName]: (...args: any[]) => {
      const availableInstance = getInstance();

      return (availableInstance[methodName] as unknown as Function).apply(availableInstance, args);
    },
  }), {}) as {
      [key in TKeys]: T[key]
    };
};