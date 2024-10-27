import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { server } from '../mocks/server'
import { delay, http, HttpResponse } from 'msw'
import ProductDetail from '../../src/components/ProductDetail'
import { db } from '../mocks/db'
import { Product } from '../../src/entities'
import { de } from '@faker-js/faker'
import AllProviders from '../AllProviders'

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

        render(<ProductDetail productId={productId} />, {wrapper: AllProviders})

        // we pass the name and price to convert to a regular expression, to avoid our test improperly formatting the elements in the DOM
        expect(await screen.findByText(new RegExp(product!.name))).toBeInTheDocument();
        expect(await screen.findByText(new RegExp(product!.price.toString()))).toBeInTheDocument();
    })

    it('should render message if product not found', async () => {
        //overwrite the for fetching a particular product
        server.use(http.get('/products/1', () => HttpResponse.json(null)))

        render(<ProductDetail productId={1} />, {wrapper: AllProviders})

        expect(await screen.findByText(/not found/i)).toBeInTheDocument();
    })

    it('should render error message if product id is invalid', async () => {
        // don't need to call the back end since if productId is invalid, we just set error and return  
        render(<ProductDetail productId={0} />, {wrapper: AllProviders})

        expect(await screen.findByText(/invalid productid/i)).toBeInTheDocument();
    })

    it('should render an error if data fetching fails', async () => {
        server.use(http.get('/products/1', () => HttpResponse.error()))

        render(<ProductDetail productId={1} />, {wrapper: AllProviders})

        expect(await screen.findByText(/error/i)).toBeInTheDocument();
    })

    it('should render a loading indicator when fetching data', async () => {
        server.use(http.get('/product/1', async () => {
            await delay();
            return HttpResponse.json([])
        }))

        render(<ProductDetail productId={1} />, {wrapper: AllProviders})

        expect(await screen.findByText(/loading/i)).toBeInTheDocument();
    })

    it('should remove the loading indicator after data is fetched', async () => {
        render(<ProductDetail productId={1} />, {wrapper: AllProviders})

        await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
    })

    it('should remove the loading indicator after data is fetched', async () => {
        server.use(http.get('/products/1', async () => {
            await delay();
            return HttpResponse.json([])
        }))

        render(<ProductDetail productId={1} />, {wrapper: AllProviders})

        await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
    })
})