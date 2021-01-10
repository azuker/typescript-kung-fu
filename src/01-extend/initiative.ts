// // MobX State Tree-like Type-ahead
// // tslint:disable
// declare const types: any;

// export const User = types
//   .model({
//     firstName: types.string,
//     lastName: types.string,
//   })
//   .views((self: { firstName: string; lastName: string; }) => ({
//     get fullName() {
//       return `${self.firstName} ${self.lastName}`;
//     },
//   }),
// );

// // 'self' is typed, it actually has firstName and lastName (not any)
