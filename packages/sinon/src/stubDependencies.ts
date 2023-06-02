import sinon, { SinonStub } from 'sinon';

import { StubbedDependencies } from './types';

type StubbedOutput<T> = {
  [key in keyof T]: {
    [subkey in keyof T[key]]: SinonStub;
  }
};

/**
 * Creates a stubbed version of a DependencyMap.
 * @description Creates a stubbed version of a DependencyMap. The stubbed version is a copy of the input map, with all functions replaced by Sinon stubs. This is useful for testing, as it allows you to easily assert that a function was called with the correct arguments, and to control its result value.
 * @param input the DependencyMap to be stubbed
 * @returns the stubbed dependency map
 */
export const stubDependencies = <T extends Record<string, unknown>>(
  dependencyMap: T,
): StubbedDependencies<T> => {
  const stubbedDependencyMap = {} as StubbedDependencies<T>;

  for (const key in dependencyMap) {
    const value = dependencyMap[key];

    if (typeof value === 'function') {
      stubbedDependencyMap[key as keyof StubbedDependencies<T>] = sinon.stub() as StubbedDependencies<T>[keyof T];
    } else if (typeof value === 'object') {
      stubbedDependencyMap[key as keyof StubbedDependencies<T>] = stubDependencies(value as any) as StubbedDependencies<T>[keyof T];
    } else {
      throw new Error(`Cannot stub non-object, non-function value: ${value}`);
    }
  }

  return stubbedDependencyMap;
};
