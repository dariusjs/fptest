import { isNonEmpty } from 'fp-ts/lib/Array';
import { chain } from 'fp-ts/lib/Either';
import { fromArray, NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { either as E } from 'fp-ts';
import { isNone } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import * as t from 'io-ts';
import { NumberFromString } from 'io-ts-types';

export type ArrayFromObject<C extends t.Mixed> = t.Type<
  NonEmptyArray<t.TypeOf<C>>,
  Array<t.OutputOf<C>>,
  unknown
>;

export function ArrayFromObject<C extends t.Mixed>(
  codec: C,
  name = `NonEmptyArray<${codec.name}>`
): ArrayFromObject<C> {
  const arr = t.array(codec);
  return new t.Type(
    name,
    (u): u is NonEmptyArray<t.TypeOf<C>> => arr.is(u) && isNonEmpty(u),
    (u, c) => {
      u = Array.isArray(u) ? u : [u];
      return pipe(
        arr.validate(u, c),
        chain((as) => {
          const onea = fromArray(as);
          return isNone(onea) ? t.failure(u, c) : t.success(onea.value);
        })
      );
    },
    (nea) => arr.encode(nea)
  );
}

const Pets = t.type({
  animal: t.string,
  name: t.string
});

export const Metadata = t.type({
  age: t.number,
  healthy: t.string,
  pets: t.array(Pets)
});

export const Attributes = t.type({
  firstName: t.string,
  lastName: t.string
});

export const Person = t.type({
  name: ArrayFromObject(Attributes),
  data: t.array(t.union([NumberFromString, t.number])),
  metadata: Metadata
});

export type PersonType = t.TypeOf<typeof Person>;
export type AttributesType = t.TypeOf<typeof Attributes>;
export type MetaDataType = t.TypeOf<typeof Metadata>;
export type PetsType = t.TypeOf<typeof Pets>;

const data = {
  name: { firstName: 'John', lastName: 'Citizen' },
  data: ['5', '10', 5],
  metadata: {
    age: 5,
    healthy: 'yes',
    pets: [
      { animal: 'cat', name: 'meowmix' },
      { animal: 'dog', name: 'woofy' },
      { animal: 'parrot', name: 'tweety' }
    ]
  }
};

const validate: PersonType = pipe(
  Person.decode(data),
  E.fold(
    (error: any) => {
      throw error;
    },
    (data: PersonType) => {
      return data;
    }
  )
);
console.log(JSON.stringify(validate, null, 2));
