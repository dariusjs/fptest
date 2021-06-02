# Encoding and Decoding Data with io-ts

## Introduction

In some situations, you may be dealing with untrusted data that comes into your system when using Typescript. As Javascript does not perform runtime checks and Typescript is mostly useful during development you may need additional validation. You may run into situations where numbers are sent as integers or you may want to ensure default values exist. Such situations may arise when the source is a legacy system and your validation toolset is not good enough.

There are quite a few choices in the Javascript world to solve this. Number.isInteger can solve some of this as well as various validation libraries. In the following examples we will go through using https://github.com/gcanti/io-ts


## Setting up Types

Types are central to io-ts. There are also additional types available in https://github.com/gcanti/io-ts-types. In the following example we will create a Person Register and add some attributes to show how io-ts can help us.

When importing the io-ts library, we can start setting up our types. The t.type allows us to setup what is the equivalent to a Typescript Type.

A very basic example could look like this.
```
export const Person = t.type({
  name: t.string
});
```

There are also some helpers like "NumberFromString" that can be used from io-ts-types which will take care of converting strings to numbers. This can ensure uniformity of your data. An example is below where we process age into a number.

```
export const Person = t.type({
  name: t.string
  age: NumberFromString
});
```

Of course the source system may just be producing all sorts of stuff, so we can further use the t.union to give some options on what may come in. The OverWriteEmptyObjectToZero helper I've written ensures we have a default value of 0 if for some reason {} was a put in.

``` typescript
const Pets = t.type({
  animal: t.string,
  name: t.string
});

export const Metadata = t.type({
  age: t.union([NumberFromString, t.number, t.string]),
  healthy: t.string,
  pets: t.array(Pets)
});

export const Name = t.type({
  firstName: t.string,
  lastName: t.string
});

export const Person = t.type({
  name: Name,
  data: t.array(
    t.union([
      NumberFromString,
      OverWriteEmptyObjectToZero,
      t.number,
      t.string,
      t.object
    ])
  ),
  metadata: Metadata
});

export type PersonType = t.TypeOf<typeof Person>;
export type NameType = t.TypeOf<typeof Name>;
export type MetaDataType = t.TypeOf<typeof Metadata>;
export type PetsType = t.TypeOf<typeof Pets>;
```

Finally at the end of the excerpt above, we can export the types so they are available as native Typescript Types.

## Validating data

io-ts can be closely tied in with https://github.com/gcanti/fp-ts. The look and feel of fp-ts is very similair to Scala's functions. Some functions that we will use are the pipe which sequences actions, and the fold which is akin to pattern matching.

So using the above example of our types we can create a validator which will process our data structure. What is central to fold, is the idea of being right, or wrong where wrong is denoted as left.


``` typescript
function validateData(data: PersonType): PersonType {
  return pipe(
    Person.decode(data),
    E.fold(
      (error) => {
        throw error;
      },
      (data: PersonType) => {
        return data;
      }
    )
  );
}
```

So with the above function we can now throw some broken data structures at it for validation. Using a sample structure below we see that we have a mix of inconvenient types the 'data' array, as well as a string for age when we may want a number.

``` typescript
const data: PersonType = {
  name: { firstName: 'John', lastName: 'Citizen' },
  data: ['5', '10', 5, {}],
  metadata: {
    age: '5',
    healthy: 'yes',
    pets: [
      { animal: 'cat', name: 'meowmix' },
      { animal: 'dog', name: 'woofy' },
      { animal: 'parrot', name: 'tweety' }
    ]
  }
};
const validate: PersonType = validateData(data);
```

The output of validate is now showing up as a workable piece of data that we expect.

``` typescript
{
  "name": {
    "firstName": "John",
    "lastName": "Citizen"
  },
  "data": [
    5,
    10,
    5,
    0
  ],
  "metadata": {
    "age": 5,
    "healthy": "yes",
    "pets": [
      {
        "animal": "cat",
        "name": "meowmix"
      },
      {
        "animal": "dog",
        "name": "woofy"
      },
      {
        "animal": "parrot",
        "name": "tweety"
      }
    ]
  }
}
```

Hope this was helpful, this just scratches the surface of what io-ts can provide. I hope some of these concepts eventually make into Javascript one day.