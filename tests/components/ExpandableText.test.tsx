import { render, screen } from '@testing-library/react';
import ExpandableText from '../../src/components/ExpandableText';
import userEvent from '@testing-library/user-event';

describe('ExpandableText', () => {
    const limit = 255;
    const longText = 'a'.repeat(limit + 1);
    const truncatedText = longText.substring(0, limit) + "...";

    //test rendering
    it('should render the full text if less than 255 characters', () => {
        const text: string = "Test";
        render(<ExpandableText text={text}/>);

        screen.getByText(text);

        expect(screen.getByText(text)).toBeInTheDocument();
    });

    it('should truncate the text if more than 255 chars', () => {
        render(<ExpandableText text={longText}/>);

        expect(screen.getByText(truncatedText)).toBeInTheDocument();

        const button = screen.getByRole('button')
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent(/more/i);
    });

    //test user interaction
    it('should truncate the text if more than 255 chars', async () => {
        render(<ExpandableText text={longText}/>);

        const button = screen.getByRole('button')
        expect(button).toBeInTheDocument();
        const user = userEvent.setup();
        await user.click(button);

        // its ok to assert both of these in the same test since they are highly related - logically apart of particular state of our component
        expect(screen.getByText(longText)).toBeInTheDocument();
        expect(button).toHaveTextContent(/less/i);
    });

    it('should collapse text when show less button is clicked', async () => {
        //set up - paint the relevant part of the DOM
        render(<ExpandableText text={longText}/>);
        const showMoreButton = screen.getByRole('button', { name: /more/i})
        expect(showMoreButton).toBeInTheDocument();
        const user = userEvent.setup();
        await user.click(showMoreButton);

        //act - what happens ?
        const showLessButton = screen.getByRole('button', { name: /less/i});
        await user.click(showLessButton);

        //assert - what should happen ?
        expect(screen.getByText(truncatedText)).toBeInTheDocument();
        expect(showMoreButton).toHaveTextContent(/more/i);
    });
})