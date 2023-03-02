type OmitOfType<T extends {}, K> = {
  [P in keyof T as T[P] extends K ? never : P]: T[P];
};

declare const brand: unique symbol;
type Brand<T, TBrand> = T & { [brand]: TBrand };

export type CannotCreate<T = unknown> = Brand<T, 'CannotCreate'>;
export type CannotUpdate<T = unknown> = Brand<T, 'CannotUpdate'>;
export type CannotCreateOrUpdate<T = unknown> = Brand<T, 'CannotCreateOrUpdate'>;

type StripRestSpec<T> = {
  [P in keyof T]:
    T[P] extends CannotCreateOrUpdate<infer U3> ? U3 :
    T[P] extends CannotCreate<infer U1> ? U1 :
    T[P] extends CannotUpdate<infer U2> ? U2 :
    T[P];
};

export type Dto<T extends {}> = StripRestSpec<T>;
export type CreateDto<T extends {}> = StripRestSpec<OmitOfType<T, CannotCreate | CannotCreateOrUpdate>>;
export type UpdateDto<T extends {}> = StripRestSpec<OmitOfType<T, CannotUpdate | CannotCreateOrUpdate>>;
