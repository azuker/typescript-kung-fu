import { Subject } from 'rxjs';
import { log } from '../utils/log';
import { OmitSubjectProps, ExtractSubjectProps,
  TransformPropsToObservables, TransformPropsToFuncOrProp,
  TransformSubjectPropsToObservables, ReadonlyGraph } from './store1';
import { CannotCreateOrUpdate, CannotUpdate, CannotCreate,
  StripRestSpec, CreateDto, UpdateDto } from './dtos';

interface PostSlim {
  id: number;
  name: string;
  date: Date;
  liked: Subject<boolean>;
}

interface Post extends PostSlim {
  func: () => void;
  foo: { name: string };
  linkedArray: Post[];
  linkedMap: Map<number, Post>;
  linkedSet: Set<Post>;
  funcReturnsPost(): Post;
  funcWithPost(c: (p: Post, p2?: number, p3?: { name: string }) => void): void;
}

// DTO's sample

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

export function showcaseStore() {
  // all props except subjects
  const o1: OmitSubjectProps<PostSlim> = null as any;

  // only subject props
  const o2: ExtractSubjectProps<PostSlim> = null as any;

  // all props as observables
  const o3: TransformPropsToObservables<PostSlim> = null as any;

  // all props as prop or factory
  const o4: TransformPropsToFuncOrProp<PostSlim> = null as any;

  // all subjects as observables
  const o5: TransformSubjectPropsToObservables<PostSlim> = null as any;

  // readonly graph
  const p: ReadonlyGraph<Post> = null as any;
  // p.id = 2;
  // p.date = new Date();
  // p.func = null;
  // p.foo.name = 'asdas';
  // p.linkedArray[0].foo.name = 'sdad';
  // p.linkedMap.get(2)!.name = 'asdasd';
  // p.linkedSet.forEach(v => v.name = 'asda');
  // p.funcReturnsPost().name = 'asdas';
  // p.funcWithPost((p, p2, p3) => {
  //   p.name = 'asda';
  //   p3.name = 'as';
  // });

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

  log('View code only for TypeScript advanced typing');

  // const service = new ContextStoreService();
  // const masked = service.maskAs<Post>();
}
