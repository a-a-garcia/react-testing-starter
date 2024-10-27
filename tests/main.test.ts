import { it, expect, describe } from 'vitest';
import { faker } from '@faker-js/faker';

describe('group', () => {
    // it('should', async () => {
    //     const response = await fetch('/categories')
    //     const data = await response.json();
    //     console.log(data);
    //     expect(data).toHaveLength(3);
    //     expect(1).toBeTruthy();
    // })

    it('should', () => {
        console.log({
            name: faker.commerce.productName(),
            // note price is a string
            price: faker.commerce.price({ min: 1, max: 100}),
        })
    })
})