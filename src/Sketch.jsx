import React, { useEffect, useRef, useId } from "react";
// import { ReactP5Wrapper } from "@p5-wrapper/react";
// import AudioInput from "./AudioInput";
// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
import VisualizerPage from "./VisualizerPage";
import * as sketch from "p5";
window.sketch = sketch;
import "p5/lib/addons/p5.sound"


const Sketch = ({ songInput }) => {
  const sketchInstanceRef = useRef(null);
  let sketchInstance;
  const id = useId();

    const s = ( sketch ) => {
      let fft;
      let songInstance;
      let peakDetect;
      let waveform;
      let spectrum;
      let waves;
      let intensity;
      let particles = [];
      let ease = 0;
      let target = 0;
      let current = 0;
      var bassFr;
      var trebleFr;
      let bassTotal;
      let trebleTotal;
      var distance;
      let r = 200;
      let numRings = 20;
      let numParticles = 50;

      sketch.preload = () => {
        songInstance = sketch.loadSound(URL.createObjectURL(songInput)); 
        console.log(songInstance);
      }
    
      sketch.setup = () => {
        sketch.createCanvas(window.innerWidth, window.innerHeight, sketch.WEBGL);
        // console.log("good");
        fft = new sketch.constructor.FFT(0.8, 1024);
        peakDetect = new sketch.constructor.PeakDetect();
        waveform = fft.waveform();
        sketch.angleMode(sketch.DEGREES);
        sketch.colorMode(sketch.HSB);
        sketch.stroke(199, 80, 88);
        sketch.strokeWeight(2);
        particleSystem();
        songInstance.onended(songEnded);
      }
    
      sketch.draw =() => {
          let camZ = sketch.map(sketch.mouseX, 0, sketch.width, -200, 0);
          let camY = sketch.map(sketch.mouseY, 0, ((sketch.height) / 4), 0, 200);
          let fov = sketch.map(sketch.mouseX, sketch.width / 2, sketch.width, 0, 360);
          sketch.perspective(fov, sketch.width / sketch.height, 10, 10000);
          spectrum = fft.analyze();
          peakDetect.update(fft);
          let sum = 0;
          let total = 0;
          for (let i = 0; i < spectrum.length; i++) {
            sum += spectrum[i];
          }
          for (let j = 0; j < waveform.length; j++) {
            total += waveform[j];
          }
          let bass = fft.getEnergy( "bass" );
          let treble  = fft.getEnergy( "treble" );
          bassTotal = bass / 100;
          trebleTotal = treble / 100;
           
          
          bassFr = sketch.map(bassTotal, 0, 255, 0, 100);
          trebleFr = sketch.map(trebleTotal, 0, 255, 0, 100);
          waves = sketch.map((total/waveform.length), -1, 1, 0, 1);
          intensity = sketch.map((sum / spectrum.length), 0, 255, 0, 1);
          
        let vertices = bumpySphere(intensity, peakDetect, bassFr, trebleFr);
        for (let particleRing of particles) {
            for (let particle of particleRing) {
              particle.update(); 
              particle.display(); 
            }
          }
      }
    
      function bumpySphere(intensity, peakDetect, bassFr, trebleFr) {
        let vertices = [];
        let noiseScale = 0.02;
        let amp = 100;
        distance = (bassFr * amp + trebleFr) * noiseScale;
        
        sketch.clear();
        
        
        if (songInstance.isPlaying()) {
          target += 5;
          if(peakDetect.isDetected) {
            target -= 80;
          }
          let angle = sketch.createVector(0, 0, 1);
          let j = target / 5000;
          target += j;
          ease = sketch.sqrt(0.005);
          current = sketch.lerp(current, target, sketch.abs(ease));
          sketch.rotate(current, angle);
        }
        sketch.orbitControl(2, 2);
        for (let phi = 0; phi < 180; phi += 2) {
          sketch.beginShape(sketch.POINTS);
          for (let theta = 0; theta < 360; theta += 2) {
            let x = (r * (1 + ((intensity * 3.5)) * sketch.sin(theta * 5) * sketch.sin(phi * 6))) * sketch.sin(phi) * sketch.cos(theta);
            let y = (r * (1 + ((intensity * 3.5)) * sketch.sin(theta * 5) * sketch.sin(phi * 6))) * sketch.sin(phi) * sketch.sin(theta);
            let z = (r * (1 + ((intensity * 3.5)) * sketch.sin(theta * 5) * sketch.sin(phi * 6))) * sketch.cos(phi);
              x += 1 * distance;
              y += 1 * distance;
              z += 1 * distance;
            
            sketch.vertex(x, y, z);
            vertices.push(sketch.createVector(x, y, z));
          }
          sketch.endShape();
        }
        return vertices;
      }
    
      class Particle {
        constructor(x, y, z) {
          this.position = sketch.createVector(x, y, z);
          this.velocity = p5.Vector.random3D();
          this.rotationAngle = 0;
          this.rotationSpeed = 1;
        }
      
        update() {
          this.velocity.mult(1.05);
          this.position.add(this.velocity);
          let axis = sketch.createVector(0, 0, 1);
          this.rotationAngle += this.rotationSpeed;
          this.position.rotate(this.rotationAngle, axis);
          if (this.position.mag() > 400) {
            this.position.normalize().mult(400);
          }
        }
      
        display() {
          sketch.push();
          sketch.translate(this.position);
          sketch.stroke(255);
          sketch.strokeWeight(2);
          sketch.fill(199, 80, 88);
          sketch.ellipse(0, 0, 2.7);
          sketch.pop();
        }
      }
    
      function songEnded () {
        console.log("song ended")
        target = 0;
      }
    
      function particleSystem () {
        let vertices = bumpySphere(intensity, peakDetect, bassFr, trebleFr);
        let angleOffsets = [];
        for (let ring = 0; ring < numRings; ring++) {
          angleOffsets.push(ring * sketch.TWO_PI / numRings);
        }
      
        for (let ring = 0; ring < numRings; ring++) {
          var particleRing = [];
          let angleOffset = angleOffsets[ring];
      
          for (let i = 0; i < numParticles; i++) {
            let index = sketch.floor(i * vertices.length / numParticles);
            let vert = vertices[index];
            let angle = i * sketch.TWO_PI / numParticles + angleOffset;
            
      
            let x = (vert.x + r) + sketch.cos(angle) * sketch.cos(angle) * (1000);
            let y = (vert.y + r) + sketch.sin(angle) * sketch.sin(angle) * (1000);
            let z = vert.z;
      
            particleRing.push(new Particle(x, y, z));
        }
      
        particles.push(particleRing);
      } 
    
     
    
      sketch.mouseClicked = () => {
        if (songInstance.isPlaying()) {
          songInstance.pause();
        }  else  {
          songInstance.play();
        }
      };
      }
    }
    
  useEffect(() => { 
    sketchInstance = new p5(s);
    sketchInstanceRef.current = sketchInstance;
    console.log(songInput);

    return () => {
      sketchInstanceRef.current.remove();
    };
  }, [songInput]);

  return(null);
} 

export default Sketch;

//   const ske = document.querySelector(".p5CCanvas")
// console.log(ske);
// const top = gsap.timeline({ defaults: { duration: 1}});
//     top.fromTo(ske, { rotation: "0", 
//                                 scale: "1" 
//                               },
//       { rotation: "360", scale: "2", duration: 2, repeat: -1, ease: 'power1.inOut'});
    
//   document.body.appendChild(skeet);
  // console.log("did");
  // useGSAP((gsap) => {
  //    });
  // onst skeet = document.createElement('div');