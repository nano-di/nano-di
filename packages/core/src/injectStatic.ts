import { listStaticMethods } from "./util";

/**
 * Picks STATIC dependencies from a Class (or object, JS doesn't care) and returns a custom object with only those functions.
 * @description Creates an Object with functions on keys matching the names of the picked methods. The lazy, call-forwarding nature of the output of this method allows the output of this method to be used as input of `stubDependencies` without the risk or triggering unwanted _"static"_ initialization code. That makes for improved testing ergonomics AND provides Typescript-level protection against circular reference issues.
 * @param Class The class from whichs instance to pick methods from
 * @param methods an array of method names to pick
 * @param instantiator @optional a function that returns an instance of the class. Defaults to a `() => new Class()`. Useful for Classes with non-empty constructor signatures`.
 * @returns an object with functions on keys matching the names of the picked methods, to which all calls will be forwarded a single, lazily created instance of the class.
 */
export const injectStatic = <T, TKeys extends keyof T = keyof T>(
  StaticClass: T,
  methods?: TKeys[],
) => {
  const consideredMethods = methods || listStaticMethods<T, TKeys>(StaticClass);

  return consideredMethods.reduce((all, methodName) => {
    if (typeof StaticClass[methodName] !== 'function') {
      return all;
    }

    return ({
      ...all,
      [methodName]: (...args: any[]) => (StaticClass[methodName] as unknown as Function).apply(StaticClass, args),
    });
  }, {}) as {
    [key in TKeys]: T[key];
  };
};