import React from 'react'

import Hero from './components/hero'
import DiverseShirt from './components/diverseShirt/DiverseShirt'
// import Explore from './components/explore/Explore'
import Footer from './components/footer/Footer'
import Sponsers from './components/sponsors/Index'

const page = () => {
  return (
    <>
      <Hero />
      {/* <Explore/> */}
      <DiverseShirt/>
      {/* <Explore/> */}
      <Sponsers/>
      <Footer/>
    </>
  )
}

export default page