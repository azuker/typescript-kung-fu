# Considerations

- Consider using branded/nominal/opaque types in contracts example

# TypeScript New Features

This repo isn't updated as TS evolves, unfortunately.
Following are specific TS features that were introduced afterwards which could certainly affect the written examples, either by offering shorthands or even rendering it obsolete.

## v4.8

https://devblogs.microsoft.com/typescript/announcing-typescript-4-8/

## v4.7

https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/

- extends Constraints on infer Type Variables
    - `type SomeNum = "100" extends `${infer U extends number}` ? U : never;`
    - E.g.,

    ```ts
    // before:

    type FirstIfString<T> =
    T extends [infer S, ...unknown[]]
        ? S extends string ? S : never
        : never;

    // now:

    type FirstIfString<T> =
    T extends [infer S extends string, ...unknown[]]
        ? S
        : never;
    ```
- Variance annotations for Type Parameters
    - Example

    ```ts
    interface State<in out T> {
      get: () => T;
      set: (value: T) => void;
    }
    ```
    - If you’re working with deeply recursive types, especially if you’re a library author, you may be interested in using these annotations to the benefit of your users. Those annotations can provide wins in both accuracy and type-checking speed, which can even affect their code editing experience. Determining when variance calculation is a bottleneck on type-checking time can be done experimentally, and determined using tooling like our analyze-trace utility

## v4.5

https://devblogs.microsoft.com/typescript/announcing-typescript-4-5/

- Tail-Recursion Elimination on Conditional Types
    - Can use this feature to avoid the recursion error "Type instantiation is excessively deep and possibly infinite."

## v4.1

https://devblogs.microsoft.com/typescript/announcing-typescript-4-1

- Key Remapping in Mapped Types
    - Example

    ```ts
    type Getters<T> = {
        [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
    };

    interface Person {
        name: string;
        age: number;
        location: string;
    }

    type LazyPerson = Getters<Person>;
    ```

    ```ts
    // Remove the 'kind' property
    type RemoveKindField<T> = {
        [K in keyof T as Exclude<K, "kind">]: T[K]
    };

    interface Circle {
        kind: "circle";
        radius: number;
    }

    type KindlessCircle = RemoveKindField<Circle>;
    // same as
    //   type KindlessCircle = {
    //       radius: number;
    //   };
    ```
    - Recursive conditional types
        - Example

        ```ts
        type ElementType<T> =
          T extends ReadonlyArray<infer U> ? ElementType<U> : T;

        function deepFlatten<T extends readonly unknown[]>(x: T): ElementType<T>[] {
          throw "not implemented";
        }

        // All of these return the type 'number[]':
        deepFlatten([1, 2, 3]);
        deepFlatten([[1], [2, 3]]);
        deepFlatten([[1], [[2]], [[[3]]]]);
        ```

## v5.0

https://devblogs.microsoft.com/typescript/announcing-typescript-5-0-beta

- Const Type Parameters
    - As if `as const` was included in specified arguments
    - Works only on certain types and inline arguments (defined when calling the function)
    - Example

    ```ts
    type HasNames = { names: readonly string[] };
    function getNamesExactly<const T extends HasNames>(arg: T): T["names"] {
    //                       ^^^^^
        return arg.names;
    }

    // Inferred type: readonly ["Alice", "Bob", "Eve"]
    // Note: Didn't need to write 'as const' here
    const names = getNamesExactly({ names: ["Alice", "Bob", "Eve"] });
    ```


