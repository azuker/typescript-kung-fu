import { Subject } from 'rxjs';
import { OmitSubjectProps, ExtractSubjectProps,
  TransformPropsToObservables, TransformPropsToFuncOrProp,
  TransformSubjectPropsToObservables, ReadonlyGraph } from './store1';

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

export function showcase() {
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

  // const service = new ContextStoreService();
  // const masked = service.maskAs<Post>();
}
