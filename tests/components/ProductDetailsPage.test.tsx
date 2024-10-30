import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { navigateTo } from '../utils'
import { db } from '../mocks/db';
import { Product } from '../../src/entities';

describe('ProductDetailPage', () => {
    let product: Product;

    beforeAll(() => {
        product = db.product.create();
    })

    afterAll(() => {
        db.product.delete({
            where: {
                id: {
                    equals: product.id
                }
            }
        })
    })

    it('should render product details', async () => {
        navigateTo('/products/' + product.id);

        //preference to keep assertion methods consistent
        await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

        // now we can use the get methods to find elements
    

        expect(screen.getByRole('heading', { name: product.name })).toBeInTheDocument();

        //price is rendered in a p tag so we need to search for it by text
        expect(screen.getByText('$' + product.price)).toBeInTheDocument
    })
})