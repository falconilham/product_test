import React, { useState, useEffect } from 'react';
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
  const [productList, setProductList] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [listcategories, setCategories] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await fetcher(`/products?limit=${PAGE_LIMIT}&skip=${productList.length}`);
    const newProducts: Product[] = data?.products || [];
    const newCategories = [...new Set(newProducts.map((product) => product.category))];

    setProductList([...productList, ...newProducts]);
    setCategories([...listcategories, ...newCategories]);
    setHasMore(newProducts.length >= PAGE_LIMIT);
  };

  const fetchMoreData = () => {
    if (!hasMore) return;

    if (selectedCategory) {
      fetchFilteredData();
    } else {
      fetchData();
    }
  };

  const fetchFilteredData = async () => {
    const data = await fetcher(`/products/category/${selectedCategory}?limit=${PAGE_LIMIT}&skip=${filteredProducts.length}`);
    const newProducts: Product[] = data?.products || [];

    setFilteredProducts([...filteredProducts, ...newProducts]);
    setHasMore(newProducts.length >= PAGE_LIMIT);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const category = event.target.value;
    setSelectedCategory(category);
    const filteredProducts = productList.filter((product) => product.category === category);
    setFilteredProducts(filteredProducts);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const sortOption = event.target.value;
    setSortBy(sortOption);

    let sortedProducts = [...usedProducts];
    if (sortOption === 'asc') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'desc') {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    if (selectedCategory) {
      setFilteredProducts(sortedProducts);
    } else {
      setProductList(sortedProducts);
    }
  };

  const usedProducts = selectedCategory ? filteredProducts : productList;

  return (
    <Container>
      <InfiniteScroll
        dataLength={usedProducts.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        {/* <Grid item> */}
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
          <Grid item xs={12} md={12}>
            <Grid container spacing={2}>
              {usedProducts.map((product) => (
                <Grid key={product.id} item xs={12} sm={6} md={3}>
                  <Paper style={{cursor: 'pointer'}} key={product?.id} onClick={() => router.push(`/product/${product?.id}`)}>
                    <Image src={product.thumbnail} alt={product.title} width={500} height={500} />
                    <Typography variant="subtitle1" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.title}</Typography>
                    <Typography variant="body1">${product.price}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        {/* </Grid> */}
      </InfiniteScroll>
    </Container>
  );
}

export default Home;