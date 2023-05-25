import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Container, Grid, Paper, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent, Typography } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetcher } from '../utils/request';
import { useRouter } from 'next/router';

const PAGE_LIMIT = 10;

interface Product {
  id: string;
  brand: string;
  thumbnail: string;
  title: string;
  category: string;
  price: number;
}

function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [listcategories, setCategories] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const fetchProducts = useCallback(async () => {
    const data = await fetcher(`/products?limit=${PAGE_LIMIT}&skip=${products.length}`);
    const newProducts: Product[] = data?.products || [];
    const newCategories = [...new Set(newProducts.map((product) => product.category))];

    setProducts((prevProducts) => [...prevProducts, ...newProducts]);
    setCategories((prevCategories) => [...prevCategories, ...newCategories]);
    setHasMore(newProducts.length >= PAGE_LIMIT);
  }, [products.length]);

  const fetchFilteredProducts = useCallback(async () => {
    const data = await fetcher(`/products/category/${selectedCategory}?limit=${PAGE_LIMIT}&skip=${filteredProducts.length}`);
    const newProducts: Product[] = data?.products || [];

    setFilteredProducts((prevProducts) => [...prevProducts, ...newProducts]);
    setHasMore(newProducts.length >= PAGE_LIMIT);
  }, [selectedCategory, filteredProducts.length]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const fetchMoreData = () => {
    if (!hasMore) return;

    if (selectedCategory) {
      fetchFilteredProducts();
    } else {
      fetchProducts();
    }
  };

  const handleCategoryChange = useCallback((event: SelectChangeEvent<string>) => {
    const category = event.target.value;
    setSelectedCategory(category);
    const filteredProducts = products.filter((product) => product.category === category);
    setFilteredProducts(filteredProducts);
  }, [products]);

  const handleSortChange = useCallback((event: SelectChangeEvent<string>) => {
    const sortOption = event.target.value;
    setSortBy(sortOption);

    let sortedProducts = [...products];
    if (sortOption === 'asc') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'desc') {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    if (selectedCategory) {
      setFilteredProducts(sortedProducts);
    } else {
      setProducts(sortedProducts);
    }
  }, [products, selectedCategory]);

  const usedProducts = selectedCategory ? filteredProducts : products;

  return (
    <Container>
      <InfiniteScroll
        dataLength={usedProducts.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <Grid container spacing={2} flexDirection="column" rowGap={2}>
          <Grid container justifyContent="space-between" spacing={2}>
            <Grid item xs={12} sm={4} md={4}>
              <FormControl style={{ width: '100%' }}>
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
            <Grid item xs={12} sm={4} md={4}>
              <FormControl style={{ width: '100%' }}>
                <InputLabel>Sort By</InputLabel>
                <Select value={sortBy} onChange={handleSortChange} label='Sort By'>
                  <MenuItem value="">Sort By</MenuItem>
                  <MenuItem value="asc">Price - Low to High</MenuItem>
                  <MenuItem value="desc">Price - High to Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container rowGap={5} columnSpacing={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
            {usedProducts.map((product) => (
              <Grid key={product.id} item xs={12} sm={6} md={4}>
                <Paper style={{ cursor: 'pointer', padding: '16px', height: '100%' }} onClick={() => router.push(`/product/${product?.id}`)}>
                  <div style={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden' }}>
                    <Image src={product.thumbnail} alt={product.title} layout="fill" objectFit="contain" />
                  </div>
                  <Typography variant="subtitle1" style={{ marginTop: '8px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {product.title}
                  </Typography>
                  <Typography variant="body1" style={{ marginTop: '8px' }}>
                    ${product.price}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </InfiniteScroll>
    </Container>
  );
}

export default Home;
