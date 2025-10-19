import React from 'react'
import Banner from '../components/Banner'
import SoftInfoBar from '../components/SoftInfoBar'
import CategoryBar from '../components/CategoryBar'
import FeaturedProducts from '../components/FeaturedProducts'
import NewsletterForm from '../components/NewsletterForm'
import SocialLinks from '../components/SocialLinks'

const Home = () => {
  return (
    <div>
      {/* Banner da loja */}
      <Banner />
      <SoftInfoBar />
      <CategoryBar />
      <FeaturedProducts />
      <NewsletterForm />
      <SocialLinks />
    </div>
  )
}

export default Home
