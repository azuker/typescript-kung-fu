# Considerations

- Consider using branded/nominal/opaque types in contracts example

# TypeScript New Features

This repo isn't updated as TS evolves, unfortunately.
Following are specific TS features that were introduced afterwards which could certainly affect the written examples, either by offering shorthands or even rendering it obsolete.

## Misc

- `in/out` Generic Type Arguments (covariant / contravariant) 

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

## v5.2

https://devblogs.microsoft.com/typescript/announcing-typescript-5-2-beta/

- Decorators now have access to simplified metadata (can get and set)
- `using` Declarations and Explicit Resource Management
    - A new built-in symbol called `Symbol.dispose`, and we can create objects with methods named by `Symbol.dispose`
    - Works like using `try/finally`
    - A new `Symbol.asyncDispose`, and it brings us to the next star of the show — await using declarations
    - `DisposableStack` and `AsyncDisposableStack`. These objects are useful for doing both one-off clean-up, along with arbitrary amounts of cleanup. A DisposableStack is an object that has several methods for keeping track of Disposable objects, and can be given functions for doing arbitrary clean-up work. We can also assign them to using variables because — get this — they’re also Disposable

    ```ts
    class TempFile implements Disposable {
        #path: string;
        #handle: number;

        constructor(path: string) {
            this.#path = path;
            this.#handle = fs.openSync(path, "w+");
        }

        // other methods

        [Symbol.dispose]() {
            // Close the file and delete it.
            fs.closeSync(this.#handle);
            fs.unlinkSync(this.#path);
        }
    }

    // without using -

    function doSomeWork() {
        const file = new TempFile(".some_temp_file");

        try {
            // ...
        }
        finally {
            file[Symbol.dispose]();
        }
    }

    // with using -

    function doSomeWork() {
        using file = new TempFile(".some_temp_file");

        // use file...

        if (someCondition()) {
            // do some more work...
            return;
        }
    }
    ```

    ```ts
    async function doWork() {
        // Do fake work for half a second.
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    function loggy(id: string): AsyncDisposable {
        console.log(`Constructing ${id}`);
        return {
            async [Symbol.asyncDispose]() {
                console.log(`Disposing (async) ${id}`);
                await doWork();
            },
        }
    }

    async function func() {
        await using a = loggy("a");
        await using b = loggy("b");
        {
            await using c = loggy("c");
            await using d = loggy("d");
        }
        await using e = loggy("e");
        return;

        // Unreachable.
        // Never created, never disposed.
        await using f = loggy("f");
    }

    func();
    // Constructing a
    // Constructing b
    // Constructing c
    // Constructing d
    // Disposing (async) d
    // Disposing (async) c
    // Constructing e
    // Disposing (async) e
    // Disposing (async) b
    // Disposing (async) a
    ```

    ```ts
    function doSomeWork() {
        const path = ".some_temp_file";
        const file = fs.openSync(path, "w+");

        using cleanup = new DisposableStack();
        cleanup.defer(() => {
            fs.closeSync(file);
            fs.unlinkSync(path);
        });

        // use file...

        if (someCondition()) {
            // do some more work...
            return;
        }

        // ...
    }

    // However, if all you’re interested in is using and await using, you should be able to get away with only polyfilling the built-in symbols. Something as simple as the following should work for most cases:
    Symbol.dispose ??= Symbol("Symbol.dispose");
    Symbol.asyncDispose ??= Symbol("Symbol.asyncDispose");
    ```
