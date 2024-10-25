import { render, screen } from '@testing-library/react'
import ProductImageGallery from '../../src/components/ProductImageGallery'

describe('ProductImageGallery', () => {
    it('should return null when images array is empty', () => {
        const imageUrls: string[] = [];

        const { container } = render(<ProductImageGallery imageUrls={imageUrls} />)

        expect(container).toBeEmptyDOMElement();
    });

    it('should render the list of images', () => {
        const imageUrls: string[] = [
            'https://example.com/image1.jpg',
            'https://example.com/image2.jpg',
            'https://example.com/image3.jpg'
        ];

        render(<ProductImageGallery imageUrls={imageUrls} />)

        // we cannot filter by src attribute.
        // so we use screen.getAllByRole('img') to get all images
        // this allows you to get all images in the dom
        const images = screen.getAllByRole('img')
        expect(images).toHaveLength(imageUrls.length);
        imageUrls.forEach((url, index) => {
            expect(images[index]).toHaveAttribute('src', url);
        })
    })
})

//Notes:
// Use container when you need direct access to the root DOM node for specific assertions or operations.
// For most common queries and assertions, prefer using the built-in queries provided by React Testing Library (e.g., screen.getByRole, screen.getByText, etc.).
// In your provided test cases, the use of container to check for an empty DOM element is appropriate, while the use of screen.getAllByRole('img') for verifying the rendered images is also correct.