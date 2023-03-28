export type DepsObject = Record<string, Function>;

export type DependencyMap<T> = {
  [key in keyof T]: {
    [subkey in keyof T[key]]: T[key][subkey];
  } | null;
};
