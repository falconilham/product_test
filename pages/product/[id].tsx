import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { GetServerSidePropsContext } from 'next';
import { Container, Grid, Typography, Paper } from '@mui/material';
import Carousel from 'react-material-ui-carousel';

import { fetcher } from '../../utils/request';

type Product = {
  title: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  category: string;
};

type SimilarItem = {
  id: string;
  title: string;
  thumbnail: string;
};

type ProductPageProps = {
  product: Product;
};

function ProductPage({ product }: ProductPageProps) {
  const { title, description, price, images, stock, category } = product;
  const [similarItems, setSimilarItems] = useState<SimilarItem[]>([]);

  useEffect(() => {
    const fetchSimilarItems = async () => {
      const data = await fetcher(`/products/category/${category}`);
      setSimilarItems(data?.products);
    };

    fetchSimilarItems();
  }, [category]);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Carousel
            animation="slide"
            indicators={false}
            navButtonsAlwaysVisible={true}
            navButtonsProps={{
              style: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                borderRadius: 0,
              },
            }}
          >
            {images.map((imageUrl, index) => (
              <ImageSlide key={index} imageUrl={imageUrl} alt={`Product Image ${index}`} />
            ))}
          </Carousel>
        </Grid>
        <Grid item xs={12} md={6} alignItems="center" display="grid">
          <Paper elevation={3} sx={{ padding: '20px' }}>
            <Typography variant="h5" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {description}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Price: ${price}
            </Typography>
            <Typography variant="body2" color={stock > 0 ? 'primary' : 'error'}>
              {stock > 0 ? 'In Stock' : 'Out of Stock'}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <SimilarItems items={similarItems} />
        </Grid>
      </Grid>
    </Container>
  );
}

type ImageSlideProps = {
  imageUrl: string;
  alt: string;
};

function ImageSlide({ imageUrl, alt }: ImageSlideProps) {
  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: '100%' }}>
      <Grid item>
        <Image src={imageUrl} alt={alt} width={500} height={400} objectFit="contain" />
      </Grid>
    </Grid>
  );
}

type SimilarItemsProps = {
  items: SimilarItem[];
};

function SimilarItems({ items }: SimilarItemsProps) {
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Similar Items
      </Typography>
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid key={item.id} item xs={12} sm={6} md={4}>
            <Paper>
              <Image src={item.thumbnail} alt={item.title} width={300} height={200} />
              <Typography variant="subtitle1">{item.title}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { id } = query;
  const data: Product = await fetcher(`/products/${id}`);
  return {
    props: {
      product: data,
    },
  };
}

export default ProductPage;
