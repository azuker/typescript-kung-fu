import { CannotCreateOrUpdate, CannotUpdate, CannotCreate,
  StripRestSpec, CreateDto, UpdateDto } from './dtos';

/*
// What would you do if you needed to represent slightly different shapes of the same entity?

interface ContactDto {
  id: number;
  name: string;
  likes: number;
  title: string;
  age?: number;
}
interface CreateContactDto {
  name: string;
  title: string;
  age?: number;
}
interface UpdateContactDto {
  likes: number;
  title: string;
  age?: number;
}

Can play with keys..
type UpdateContactDto = {
  [P in Exclude<keyof ContactDto, 'id' | 'name'>]: ContactDto[P];
}
*/

interface ContactRest {
  id: CannotCreateOrUpdate<number>;
  name: CannotUpdate<string>;
  likes: CannotCreate<number>;
  title: string;
  age?: number;
}

interface Contact extends StripRestSpec<ContactRest> {}
interface ContactCreateDto extends CreateDto<ContactRest> {}
interface ContactUpdateDto extends UpdateDto<ContactRest> {}

export function showcase() {
  const c: Contact = null as any;
  // ok
  c.id = 2;

  const c2: ContactCreateDto = null as any;
  // not compile: id not exists
  // c2.id = 2;
  // ok
  c2.name = 'asdasd';

  const c3: ContactUpdateDto = null as any;
  // not compile: readonly
  // c3.id = 2;
  // c3.name = 'asda';
  // ok
  c3.likes = 2;
  c3.age = 2;
}
