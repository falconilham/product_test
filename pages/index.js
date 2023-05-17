
import React, { useState } from 'react';
import Image from 'next/image';
import { Container, Grid, Paper, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { Text } from '../component';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetcher } from '../utils/request';
import { useRouter } from 'next/router';
// import useSWR from 'swr';

const PAGE_LIMIT = 10;

function Home({ products, total, categories }) {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [totalFilteredProduct, setTotalFilteredProduct] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [productList, setProductList] = useState(products);
  const [filteredProducts, setFilteredProduct] = useState([])
  const [listcategories, setCategories] = useState(categories);

  const hasMore = productList.length < total
  const usedProducts = selectedCategory ? filteredProducts : productList

  const fetchMoreData = async () => {
    if (selectedCategory) {
      const data = await fetcher(`/products/category/${selectedCategory}?limit=${PAGE_LIMIT}&skip=${filteredProducts.length}`);
      const newProducts = data?.products || [];
      if (newProducts.length > 0) {
        setFilteredProduct([...filteredProducts, ...newProducts]);
        setPage(page + 1);
      }
    } else {
      const data = await fetcher(`/products?limit=${PAGE_LIMIT}&skip=${productList.length}`);
      const newProducts = data?.products || [];
      const newCategories = [...new Set(newProducts.map((product) => product.category))];
      if (newProducts.length > 0) {
        setProductList([...productList, ...newProducts]);
        setPage(page + 1);
      }
      const mergeCategory = [...listcategories, ...newCategories]
      setCategories(mergeCategory);
    }

  };
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    // Filter products based on selected category
    const filteredProducts = productList.filter((product) => product.category === category);
    setFilteredProduct(filteredProducts);
  };

  const handleSortChange = (event) => {
    const sortOption = event.target.value;
    setSortBy(sortOption);

    // Sort products based on selected sorting option
    let sortedProducts = [...usedProducts];
    if (sortOption === 'asc') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'desc') {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    if (selectedCategory) {
      setFilteredProduct(sortedProducts);
    } else { 
      setProductList(sortedProducts)
    }
  };

  return (
    <Container>
      <InfiniteScroll
        dataLength={productList.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p>No more products to load.</p>}
      >
        <Grid paddingY={3} justifyContent="space-between" container spacing={2} rowSpacing={2} rowGap={5}>
          <Grid item>
            <FormControl style={{ width: 200 }}>
              <InputLabel>Select Category</InputLabel>
              <Select value={selectedCategory} onChange={handleCategoryChange}>
                <MenuItem value="">All Categories</MenuItem>
                {listcategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl style={{ width: 200 }}>
            <InputLabel>Sort By</InputLabel>
              <Select value={sortBy} onChange={handleSortChange} label='Sort By'>
                <MenuItem value="">Sort By</MenuItem>
                <MenuItem value="asc">Price - Low to High</MenuItem>
                <MenuItem value="desc">Price - High to Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>

        </Grid>
        <Grid padding={1} justifyContent="space-between" container spacing={2} rowSpacing={2} rowGap={5}>
          {usedProducts.map(({ brand, thumbnail, title, id }) => (
            <Paper style={{cursor: 'pointer'}} key={id} onClick={() => router.push(`/product/${id}`)}>
              <Image src={thumbnail} alt={brand} width={200} height={200} layout='intrinsic' priority />
              <Text>{title}</Text>
            </Paper>
          ))}
        </Grid>
      </InfiniteScroll>
    </Container>
  )
}

export async function getServerSideProps({ query }) {
  const { limit = PAGE_LIMIT, skip = 0 } = query;
  const data = await fetcher(`/products?limit=${limit}&skip=${skip}`);
  const products = data?.products || [];
  // Extract categories from products array
  const categories = [...new Set(products.map((product) => product.category))];
  const total = data?.total || 0
  return {
    props: {
      products,
      total,
      categories
    },
  };
}

export default Home;
