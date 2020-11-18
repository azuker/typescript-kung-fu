import { CannotCreateOrUpdate, CannotUpdate, CannotCreate,
  StripRestSpec, CreateDto, UpdateDto } from './dtos';

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

declare const contactBare: Contact;
declare const createContact: ContactCreateDto;
declare const updateContact: ContactUpdateDto;

export function showcase() {
  // ok
  contactBare.id = 2;

  // not compile: not exists
  // createContact.id = 2;
  // ok
  createContact.name = 'asdasd';

  // not compile: not exists
  // updateContact.id = 2;
  // updateContact.name = 'asda';
  // ok
  updateContact.likes = 2;
  updateContact.age = 2;
}
