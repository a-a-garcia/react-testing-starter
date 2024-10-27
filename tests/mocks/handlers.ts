import { http, HttpResponse } from 'msw';

export const handlers = [
    http.get('/categories', () => {
        return HttpResponse.json([
            { id: 1, name: 'Electronics' },
            { id: 2, name: 'Beauty' },
            { id: 1, name: 'Gardening' },
        ])
    }),

    //define a handler for the API call on ProductList.tsx
    http.get('/products', () => {
        return HttpResponse.json([
            { id: 1, name: 'Laptop' },
            { id: 2, name: 'Lipstick' },
            { id: 3, name: 'Shovel' },
        ])
    })
]