import { render, screen } from '@testing-library/react'
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'
import ProductDetail from '../../src/components/ProductDetail'
import { db } from '../mocks/db'
import { Product } from '../../src/entities'

describe('ProductDetail', () => {
    let productId: number
    beforeAll(() => {
        const product = db.product.create();
        productId = product.id
    })
    afterAll(() => {
       db.product.delete({ where: { id: { equals: productId } } })
    })

    it('should render product details', async () => {
        const product = db.product.findFirst({ where: { id: { equals: productId } } })

        render(<ProductDetail productId={productId} />)

        // we pass the name and price to convert to a regular expression, to avoid our test improperly formatting the elements in the DOM
        expect(await screen.findByText(new RegExp(product!.name))).toBeInTheDocument();
        expect(await screen.findByText(new RegExp(product!.price.toString()))).toBeInTheDocument();
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

    it('should render an error if data fetching fails', async () => {
        server.use(http.get('/products/1', () => HttpResponse.error()))

        render(<ProductDetail productId={1} />)

        expect(await screen.findByText(/error/i)).toBeInTheDocument();
    })
})