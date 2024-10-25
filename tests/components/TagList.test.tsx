import { render, screen, waitFor } from '@testing-library/react'
import TagList from '../../src/components/TagList';

describe('TagList', () => {
    it('should render tags', async () => {
        render(<TagList />);
        
        //utility function - it will call the callback repetitively until it times out (every 15ms by default, up to 1000ms)
        //you should not have any code that would cause side effects in this callback
        // await waitFor(() => {
        //     const listItems = screen.getAllByRole('listitem')
        //     expect(listItems.length).toBeGreaterThan(0);
        // })

        //alternative to waitFor
        const listItems = await screen.findAllByRole('listitem');
        expect(listItems.length).toBeGreaterThan(0);
    })
})