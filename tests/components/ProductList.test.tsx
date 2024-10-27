import { render, screen } from '@testing-library/react'
import ProductList from '../../src/components/ProductList'
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'
import exp from 'constants'

describe('ProductList', () => {
    it('should render the list of products', async () => {
        render(<ProductList />)

        //query elements by role
        //getAllByRole will fail because there are no list items until items finish loading, so use a find method
        const items = await screen.findAllByRole('listitem')

        expect(items.length).toBeGreaterThan(0);
    })

    it('should render no products available if no product is found', async () => {
        // we do this to simulate an empty response from the server
        server.use(http.get('/products', () => HttpResponse.json([])))
        
        render(<ProductList />)

        //again notice we're using a find method since it's an async operation
        expect(await screen.findByText(/no products/i)).toBeInTheDocument();
    });
})