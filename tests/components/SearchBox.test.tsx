import { render, screen } from '@testing-library/react'
import SearchBox from '../../src/components/SearchBox'
import userEvent from '@testing-library/user-event'
vi.mock('../src/components/SearchBox')

describe('SearchBox', () => {
    const renderComponent = () => {
        const onChange = vi.fn();
        render(<SearchBox onChange={onChange}/>)

        return {
            //similar to getByRole, but it also confirms that the element has the correct placeholder text
            input: screen.getByPlaceholderText(/search/i),
            onChange,
            user: userEvent.setup()
        }
    }

    //test rendering
    it('should render the input field for searching', () => {
        //create a mock function
        const { input } = renderComponent();

        //similar to getByRole, but it also confirms that the element has the correct placeholder text
        expect(input).toBeInTheDocument();
    })

    //test implementation
    it('should call the onChange callback when Enter is pressed', async () => {
        const { input, onChange, user } = renderComponent();
        
        //simulate user typing in the input field
        const searchTerm = 'test';
            // this is the syntax for typing in the input field and pressing enter
            // remember user events are asynchronous
        await user.type(input, searchTerm + '{enter}');
        expect(onChange).toHaveBeenCalledWith(searchTerm);
    })

    it('should not call the onChange callback when Enter is if input field is empty', async () => {
        const { input, onChange, user } = renderComponent();
        
        //simulate user typing in the input field
            // this is the syntax for typing in the input field and pressing enter
            // remember user events are asynchronous
        await user.type(input, '{enter}');
        expect(onChange).not.toHaveBeenCalledWith();
    })
})