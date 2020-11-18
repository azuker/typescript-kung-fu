import { OmitPropsOfType, ExcludeKeysOfType, ExtractKeysOfType } from './store1';

export type CannotCreate<T = unknown> = T & { __magicalField1: boolean };
export type CannotUpdate<T = unknown> = T & { __magicalField2: boolean };
export type CannotCreateOrUpdate<T = unknown> = CannotCreate<T> & CannotUpdate<T>;

export type StripRestSpec<T> = {
  [P in keyof T]:
    T[P] extends CannotCreateOrUpdate<infer U3> ? U3 :
    T[P] extends CannotCreate<infer U1> ? U1 :
    T[P] extends CannotUpdate<infer U2> ? U2 :
    T[P];
};

export type CreateDto<T> = StripRestSpec<OmitPropsOfType<T, CannotCreate>>;
export type UpdateDto<T> = StripRestSpec<OmitPropsOfType<T, CannotUpdate>>;

// type RestUpdateableKeys<T> = ExcludeKeysOfType<T, CannotUpdate>;
// type RestUpdateableProps<T> = {
//   [P in RestUpdateableKeys<T>]: T[P];
// }
// type RestNonUpdateableKeys<T> = ExtractKeysOfType<T, CannotUpdate>;
// type RestNonUpdateableProps<T> = {
//   readonly [P in RestNonUpdateableKeys<T>]: T[P];
// }
// export type UpdateDto<T> = StripRestSpec<RestUpdateableProps<T> & RestNonUpdateableProps<T>>;
