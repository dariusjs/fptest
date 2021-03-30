import { flow } from 'fp-ts/lib/function';
import { either as E } from 'fp-ts';

interface Person {
  name: string;
}
// (name: string) => Either<string, Person>
const makeUser = flow(
  E.fromPredicate(/[a-zA-z]/.test, (name) => `"${name}" is not a valid name!`),
  // applies the function over `Right`, if it is `Right`
  E.map((name): Person => ({ name })),
  // applies the function over `Left`, if it is `Left`
  E.mapLeft((message) => new Error(message))
);
makeUser('jim');
