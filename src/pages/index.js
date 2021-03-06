import React from 'react'

import Events from '../components/Events'
import HomepageHero from '../components/HomepageHero'
import Layout from '../components/Layout'
import Nav from '../components/Nav'
import Posts from '../components/Posts'

const Index = () => (
  <Layout>
    <HomepageHero />
    <div className="container md:w-full mx-auto px-4">
      <Events />
      <Posts />
    </div>
  </Layout>
)

export default Index
