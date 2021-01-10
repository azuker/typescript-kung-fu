// What would you do if you needed to represent slightly different shapes of the same entity?

interface ContactSampleDto {
  id: number;
  name: string;
  likes: number;
  title: string;
  age?: number;
}

declare function getContacts(): Promise<ContactSampleDto[]>;

interface CreateContactSampleDto {
  name: string;
  title: string;
  age?: number;
}

declare function createContact(newContact: CreateContactSampleDto): Promise<ContactSampleDto>;

interface UpdateContactSampleDto {
  likes: number;
  title: string;
  age?: number;
}

declare function updateContact(contactUpdate: UpdateContactSampleDto): Promise<ContactSampleDto>;

// can play with keys of course (opted in or out) - Pick/Omit Exclude/Extract
type UpdateContactDto1 = Omit<ContactSampleDto, 'id' | 'name'>
type UpdateContactDto2 = {
  [P in Exclude<keyof ContactSampleDto, 'id' | 'name'>]: ContactSampleDto[P];
}
