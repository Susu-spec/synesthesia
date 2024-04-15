import React from 'react'
import { useLocation } from 'react-router-dom'
import Sketch from '../sketch/Sketch'


const VisualizerPage = () => {
    const location = useLocation();
    const { songInput } = location.state;

  return (
    <div>
        <Sketch songInput={songInput}></Sketch>
    </div>
  )
}

export default VisualizerPage