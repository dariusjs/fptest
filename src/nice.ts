import * as t from 'io-ts';
import * as L from 'monocle-ts/lib/Lens';
import { pipe } from 'fp-ts/lib/function';

const Contents = t.type({
  animal: t.string,
  name: t.string
});

export const Metadata = t.type({
  age: t.number,
  healthy: t.string,
  contents: t.array(Contents)
});

export const Data = t.type({
  data: t.array(t.number),
  metadata: Metadata
});

export type DataType = t.TypeOf<typeof Data>;
export type MetaDataType = t.TypeOf<typeof Metadata>;
export type ContentsType = t.TypeOf<typeof Contents>;

const data = {
  data: [5, 5, 15, 7, 3],
  metadata: {
    age: 5,
    healthy: 'yes',
    contents: [
      { animal: 'cat', name: 'meowmix' },
      { animal: 'dog', name: 'woofy' },
      { animal: 'parrot', name: 'tweety' }
    ]
  }
};

const filterCat = (s: ContentsType[]): ContentsType[] =>
  s.filter((x) => x.animal === 'cat');
const lenseData3 = pipe(
  L.id<DataType>(),
  L.prop('metadata'),
  L.prop('contents'),
  L.modify(filterCat)
);

console.log(JSON.stringify(lenseData3(data), null, 2));
