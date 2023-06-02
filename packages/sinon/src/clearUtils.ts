import { StubbedDependencies } from "./types";

export const clearNestedStubs = <T extends Record<string, unknown>>(
  stubbedDeps: StubbedDependencies<T>,
) => {
  for (const key in stubbedDeps) {
    const value = stubbedDeps[key];

    if (typeof value === 'object') {
      clearNestedStubs(value as any);
    } else {
      value.reset();
    }
  }
};