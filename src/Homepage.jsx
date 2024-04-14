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
        gsap.from(elementRef.current, {
            duration: 1,
            y: -20,
            opacity: 0,
        }, {scope: container}),
        gsap.to(elementRef.current, {
            duration: 1,
            x: 0,
            y: 0,
            opacity: 1,
            ease: 'power1.inOut',
        });
    }, {scope: container});

  return (
    <div ref={container} className="bungee center head">
        <h1 ref={elementRef}>Synesthesia</h1>
        <p className='montserrat'>A spherical musical experience.</p>
        <form className="set-width row margin-top" onSubmit={handleSubmit}>
            <div className='center full-width fit-content'>
                <label className="btn montserrat full-width text-center rotate-pos" htmlFor='songInput'>Add Song</label>
                <input
                    className='hidden'
                    type="file" 
                    accept="audio/*"
                    id='songInput'
                    onChange={handleChange}
                    required
                />
            </div>
            <button type='submit' className='btn full-width text-center text-size montserrat rotate-neg margin-right'>Start Visualizer</button>
        </form>
    </div>
  )
}

export default Homepage