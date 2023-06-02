import { JestMockedDependencies } from "./types";

export const mockDependencies = <T extends Record<string, unknown>>(
  dependencyMap: T,
): JestMockedDependencies<T> => {
  const stubbedDependencyMap = {} as JestMockedDependencies<T>;

  for (const key in dependencyMap) {
    const value = dependencyMap[key];

    if (typeof value === 'function') {
      stubbedDependencyMap[key as keyof JestMockedDependencies<T>] = jest.fn() as JestMockedDependencies<T>[keyof T];
    } else if (typeof value === 'object') {
      stubbedDependencyMap[key as keyof JestMockedDependencies<T>] = mockDependencies(value as any) as JestMockedDependencies<T>[keyof T];
    } else {
      throw new Error(`Cannot stub non-object, non-function value: ${value}`);
    }
  }

  return stubbedDependencyMap;
};
