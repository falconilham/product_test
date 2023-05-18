import React from 'react';
import Image from 'next/image';
import {GetServerSidePropsContext} from 'next'
import { Container, Grid, Typography, Paper } from '@mui/material';
import Carousel from 'react-material-ui-carousel';

import { fetcher } from '../../utils/request';

type Product = {
  title: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
};

type ProductPageProps = {
  product: Product;
};

function ProductPage({ product }: ProductPageProps) {
  const { title, description, price, images, stock } = product;
  return (
    <Container>
      <Grid container spacing={2}>
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
              <Grid container key={index} justifyContent="center" alignItems="center" style={{ height: '100%' }}>
                <Grid item>
                  <Image src={imageUrl} alt={`Product Image ${index}`} width={500} height={500} />
                </Grid>
              </Grid>
            ))}
          </Carousel>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: '20px' }}>
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
      </Grid>
    </Container>
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