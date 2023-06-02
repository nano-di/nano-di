export type StubbedDependencies<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R ? sinon.SinonStub<[...A], R> : T[K] extends Record<string, unknown> ? StubbedDependencies<T[K]> : never;
};
