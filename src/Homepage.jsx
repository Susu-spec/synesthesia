import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(gsap);

const Homepage = () => {
    const elementRef = useRef();
    const container = useRef();
    const [songInput, setSong] = useState(null);
    const navigate = useNavigate();
    

   
    const handleChange = (event) => {
        setSong(event.target.files[0]);
       
    }

    console.log(songInput);
    const handleSubmit = (event) => {
        event.preventDefault();
        navigate(`/visualizer`, { state: { songInput } });
        console.log(songInput);
    }


    
    // Testing animation
    useGSAP(() => { 
        gsap.to(elementRef.current, {
            duration: 1,
            x: 100,
            y: 50,
            rotation: 360,
            ease: 'power1.inOut',
        });
    }, {scope: container});

  return (
    <div ref={container}>
        <h1 ref={elementRef}>Synesthesia</h1>
        <form onSubmit={handleSubmit}>
            <div ref={elementRef}>
                <label htmlFor='songInput'>Song</label>
                <input
                    type="file" 
                    accept="audio/*"
                    id='songInput'
                    onChange={handleChange}
                    required
                />
            </div>
            <button type='submit'>Start Visualizer</button>
        </form>
    </div>
  )
}

export default Homepage