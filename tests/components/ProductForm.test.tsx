import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import ProductForm from '../../src/components/ProductForm'
import AllProviders from '../AllProviders'

describe('ProductForm', () => {
    it('should render form fields', async () => {
        render(<ProductForm onSubmit={vi.fn()}/>, { wrapper: AllProviders })

        // we don't want to use different methods to assert, so we can 1) use find to wait for the form to be rendered
        await screen.findByRole('form')

        // or 2) wait for the loading indicator to be removed
        // await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))

        //assert name field is in the document
        expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument()

        //we don't need to use a find method for the second field since once the first finishes, our form is already rendered
        expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument()

        //dropdown assertion
        expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument()
    })
})