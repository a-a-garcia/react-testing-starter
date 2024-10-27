import { render, screen } from '@testing-library/react'
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'
import ProductDetail from '../../src/components/ProductDetail'
import { products } from '../mocks/data'

describe('ProductDetail', () => {
    it('should render the list of products', async () => {
        render(<ProductDetail productId={1} />)

        // we pass the name and price to convert to a regular expression, to avoid our test improperly formatting the elements in the DOM
        expect(await screen.findByText(new RegExp(products[0].name))).toBeInTheDocument();
        expect(await screen.findByText(new RegExp(products[0].price.toString()))).toBeInTheDocument();
    })

    it('should render message if product not found', async () => {
        //overwrite the for fetching a particular product
        server.use(http.get('/products/4', () => HttpResponse.json(null)))

        render(<ProductDetail productId={4} />)

        expect(await screen.findByText(/not found/i)).toBeInTheDocument();
    })

    it('should render error message if product id is invalid', async () => {
        // don't need to call the back end since if productId is invalid, we just set error and return  
        render(<ProductDetail productId={0} />)

        expect(await screen.findByText(/invalid productid/i)).toBeInTheDocument();
    })
})