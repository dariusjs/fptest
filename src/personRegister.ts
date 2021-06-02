import { either as E } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { PersonType, Person } from './types/iots';

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
console.log(JSON.stringify(validate, null, 2));
