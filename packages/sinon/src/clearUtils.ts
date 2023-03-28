import { SinonStub } from 'sinon';

type DepsObject = Record<string, Function>;

export type DepStubMap<T extends DepsObject> = Record<keyof T, SinonStub>;

export const clearAllStubs = <T extends DepsObject>(stubs: DepStubMap<T>): void => {
  Object.values(stubs).forEach(stub => stub.reset());
};

export const clearNestedStubs = (stubs: Record<string, Record<string, Function>>) => {
  Object.values(stubs).forEach(stub => clearAllStubs(stub as any));
};
