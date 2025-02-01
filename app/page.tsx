import React from 'react'
import Navbar from './components/Navbar/Navbar'
import DiverseShirt from './components/diverseShirt/DiverseShirt'
import Explore from './components/explore/Explore'



const page = () => {
  return (
    <>
      <Navbar/>
      <DiverseShirt/>
      <Explore/>
    </>
  )
}

export default page