import { factory, primaryKey } from '@mswjs/data';
import { faker } from '@faker-js/faker';

export const db = factory({
    product: {
        id: primaryKey(faker.number.int),
        name: faker.commerce.productName,
        // we want to use .number, not .commerce because .commerce returns a string, and our Product entity expects a number
        // needs to be converted to a function because when we call the int function we get an actual number.
        price: () => faker.number.int({ min: 1, max: 100 }),
    }
})