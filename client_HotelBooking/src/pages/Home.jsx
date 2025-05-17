import React from 'react'
import Hero from '../components/Hero'
import FeaturedDestination from '../components/FeaturedDestination'
import ExlusiveOffers from '../components/ExlusiveOffers'
import Testimonial from '../components/Testimonial'
import NewsLetter from '../components/NewsLetter'
import Footer from '../components/Footer'
import FavoriteDestination from '../components/FavoriteDestination'

const Home = () => {
  return (
    <>
      <Hero/>
      <FeaturedDestination/>
      <FavoriteDestination/>
      <ExlusiveOffers/>
      <Testimonial/>
      <NewsLetter/>
    </>
  )
}

export default Home
