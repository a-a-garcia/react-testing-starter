import { Table } from '@radix-ui/themes';
import React from 'react'
import Skeleton from 'react-loading-skeleton';
import QuantitySelector from './QuantitySelector';
import axios from 'axios';
import { Product } from '../entities';
import { useQuery } from 'react-query';

interface Props {
    // there's no category selected by default, so need to make the prop optional
    selectedCategoryId?: number;
}

const ProductTable = ({ selectedCategoryId } : Props) => {
    const {
        data: products,
        isLoading: isProductsLoading,
        error: errorProducts,
      } = useQuery<Product[], Error>({
        queryKey: ["products"],
        queryFn: () => axios.get<Product[]>("/products").then((res) => res.data),
      });
      

      const skeletons = [1, 2, 3, 4, 5];
  
      if (errorProducts) return <div>Error: {errorProducts.message}</div>;
  
      const visibleProducts = selectedCategoryId
        ? //if a category is selected, we definitely have the products on the client side. So we can safely use `!` here
          products!.filter((p) => p.categoryId === selectedCategoryId)
        : products;
  
      return (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body
            role={isProductsLoading ? "progressbar" : undefined}
            aria-label={isProductsLoading ? "Loading products" : undefined}
          >
            {isProductsLoading &&
              skeletons.map((skeleton) => (
                <Table.Row key={skeleton}>
                  <Table.Cell>
                    <Skeleton />
                  </Table.Cell>
                  <Table.Cell>
                    <Skeleton />
                  </Table.Cell>
                  <Table.Cell>
                    <Skeleton />
                  </Table.Cell>
                </Table.Row>
              ))}
            {!isProductsLoading &&
              visibleProducts!.map((product) => (
                <Table.Row key={product.id}>
                  <Table.Cell>{product.name}</Table.Cell>
                  <Table.Cell>${product.price}</Table.Cell>
                  <Table.Cell>
                    <QuantitySelector product={product} />
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table.Root>
      );
    
}

export default ProductTable
