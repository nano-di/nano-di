export type JestMockedDependencies<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R ? jest.Mock<R, A> : T[K] extends Record<string, unknown> ? JestMockedDependencies<T[K]> : never;
};
