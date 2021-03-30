import * as t from 'io-ts';

export const Data = t.type({
  data: t.array(t.Int),
  metadata: t.string
});

export type DataType = t.TypeOf<typeof Data>;
