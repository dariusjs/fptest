import * as t from 'io-ts';

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
