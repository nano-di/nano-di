export const excludeKeys = (keysToExclude: string[]) => (key: string) => !keysToExclude.includes(key);

export const rootPrototype = Object.getPrototypeOf({});

const instanceClassExcludedKeys = ['constructor', 'length', 'name', 'prototype'];

export const listInstanceMethods = <T, TKeys extends keyof T = keyof T>(
  Class: { new(...args: any[]): T },
): TKeys[] => {
  const currentClassPrototype = Object.getPrototypeOf(Class);
  const parentPrototype = currentClassPrototype.prototype as typeof Class;
  const ownKeys = Object.getOwnPropertyNames(Class.prototype).filter(excludeKeys(instanceClassExcludedKeys)) as TKeys[];

  const parentKeys = parentPrototype && parentPrototype !== rootPrototype
    ? listInstanceMethods<T, TKeys>(currentClassPrototype)
    : [];

  return [
    ...ownKeys,
    ...parentKeys,
  ];
};

const staticClassExcludedKeys = [
  'length',
  'name',
  'prototype',
  'arguments',
  'constructor',
  'bind',
  'caller',
  'apply',
  'call',
  'toString',
];

export const listStaticMethods = <T, TKeys extends keyof T = keyof T>(
  StaticClass: T,
): TKeys[] => {
  const ownPropertyNames = Object.getOwnPropertyNames(StaticClass);
  const parentPrototype = Object.getPrototypeOf(StaticClass) as T;

  const currentKeys = ownPropertyNames.filter(excludeKeys(staticClassExcludedKeys)) as TKeys[];

  const parentKeys = parentPrototype && parentPrototype !== rootPrototype
    ? listStaticMethods<T, TKeys>(parentPrototype)
    : [];

  return [
    ...currentKeys,
    ...parentKeys,
  ];
};
