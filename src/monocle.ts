interface Street {
  num: number;
  name: string;
}
interface Address {
  city: string;
  street: Street;
}
interface Company {
  name: string;
  address: Address;
}
interface Employee {
  name: string;
  company: Company;
}

const employee: Employee = {
  name: 'john',
  company: {
    name: 'awesome inc',
    address: {
      city: 'london',
      street: {
        num: 23,
        name: 'high street'
      }
    }
  }
};

const capitalize = (s: string): string =>
  s.substring(0, 1).toUpperCase() + s.substring(1);

const employeeCapitalized = {
  ...employee,
  company: {
    ...employee.company,
    address: {
      ...employee.company.address,
      street: {
        ...employee.company.address.street,
        name: capitalize(employee.company.address.street.name)
      }
    }
  }
};

import * as assert from 'assert';
import * as L from 'monocle-ts/lib/Lens';
import { pipe } from 'fp-ts/lib/function';

const capitalizeName = pipe(
  L.id<Employee>(),
  L.prop('company'),
  L.prop('address'),
  L.prop('street'),
  L.prop('name'),
  L.modify(capitalize)
);
console.log(JSON.stringify(capitalizeName, null, 2));

console.log(JSON.stringify(capitalizeName(employee), null, 2));

// assert.deepStrictEqual(capitalizeName(employee), employeeCapitalized);

import * as O from 'monocle-ts/lib/Optional';
import { some, none } from 'fp-ts/lib/Option';

const firstLetterOptional: O.Optional<string, string> = {
  getOption: (s) => (s.length > 0 ? some(s[0]) : none),
  set: (a) => (s) => (s.length > 0 ? a + s.substring(1) : s)
};

const firstLetter = pipe(
  L.id<Employee>(),
  L.prop('company'),
  L.prop('address'),
  L.prop('street'),
  L.prop('name'),
  L.composeOptional(firstLetterOptional)
);

assert.deepStrictEqual(
  pipe(
    firstLetter,
    O.modify((s) => s.toUpperCase())
  )(employee),
  employeeCapitalized
);

import { Lens } from 'monocle-ts';

const name = Lens.fromPath<Employee>()([
  'company',
  'address',
  'street',
  'name'
]);

const hmm = name.modify(capitalize)(employee);
console.log(JSON.stringify(hmm, null, 2));
