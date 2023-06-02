import { JestMockedDependencies } from './types';

export const clearDependencies = <T extends Record<string, unknown>>(
  stubbedDeps: JestMockedDependencies<T>,
) => {
  for (const key in stubbedDeps) {
    const value = stubbedDeps[key];

    if (typeof value === 'object') {
      clearDependencies(value as any);
    } else {
      value.mockReset();
    }
  }
};