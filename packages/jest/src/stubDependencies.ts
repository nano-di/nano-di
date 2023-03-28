import { DependencyMap } from '@nano-di/core';

type StubbedOutput<T> = {
  [key in keyof T]: {
    [subkey in keyof T[key]]: jest.Mock;
  }
};

/**
 * Creates a stubbed version of a DependencyMap.
 * @description Creates a stubbed version of a DependencyMap. The stubbed version is a copy of the input map, with all functions replaced by Sinon stubs. This is useful for testing, as it allows you to easily assert that a function was called with the correct arguments, and to control its result value.
 * @param input the DependencyMap to be stubbed
 * @returns the stubbed dependency map
 */
export const stubDependencies = <T>(
  input: DependencyMap<T>,
) => {
  const stubs = {} as StubbedOutput<T>;

  const keys = Object.keys(input) as (keyof DependencyMap<T>)[];

  keys.forEach(key => {
    if (input[key] === null) {
      return;
    }

    stubs[key] = {} as StubbedOutput<T>[keyof T];

    const subKeys = Object.keys(input[key]!) as (keyof DependencyMap<T>[keyof DependencyMap<T>])[];

    subKeys.forEach(subkey => {
      stubs[key][subkey] = jest.fn();
    });
  });

  return stubs;
};