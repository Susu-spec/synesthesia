import React from 'react'
import { useLocation } from 'react-router-dom'
import Sketch from './Sketch'


const VisualizerPage = () => {
    const location = useLocation();
    const { songInput } = location.state;
  
    console.log(location.state);

  return (
    <div>
        <Sketch songInput={songInput}></Sketch>
    </div>
  )
}

export default VisualizerPage