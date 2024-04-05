import React, { useEffect } from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import * as sketch from "p5";
window.sketch = sketch;
import "p5/lib/addons/p5.sound"

const s = ( sketch ) => {
  let song;
  let fft;
  let peakDetect;
  let waveform;
  let spectrum;
  let waves;
  let intensity;
  let particles = [];
  let ease = 0;
  let target = 0;
  let colorIndex = 0; 
  let r = 200;
  let numRings = 20;
  let numParticles = 50;


  // sketch.preload = () => {
    
  // }

  sketch.setup = () => {
    sketch.createCanvas(window.innerWidth, window.innerHeight, sketch.WEBGL);
    song = sketch.loadSound("/assets/jada.mpeg");
    fft = new sketch.constructor.FFT(0.8, 1024);
    peakDetect = new sketch.constructor.PeakDetect();
    waveform = fft.waveform();
    sketch.angleMode(sketch.DEGREES);
    sketch.colorMode(sketch.HSB);
    sketch.stroke(199, 80, 88);
    sketch.strokeWeight(2.7);
    particleSystem();
  }

  sketch.draw =() => {
      let camZ = sketch.map(sketch.mouseX, 0, sketch.width, -200, 0);
      let camY = sketch.map(sketch.mouseY, 0, ((sketch.height) / 4), 0, 200);
      // sketch.camera(0, camY, camZ, 0, 0, 0, 0, 1, 0);
      let fov = sketch.map(sketch.mouseX, sketch.width / 2, sketch.width, 0, 360);
      sketch.perspective(fov, sketch.width / sketch.height, 10, 1000);
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

      waves = sketch.map((total/waveform.length), -1, 1, 0, 1);
      intensity = sketch.map((sum / spectrum.length), 0, 255, 0, 1);
    bumpySphere(intensity, peakDetect);
    for (let particleRing of particles) {
        for (let particle of particleRing) {
          particle.update(); 
          particle.display(); 
        }
      } 
  }

  function bumpySphere(intensity, peakDetect) {
    let vertices = [];
    
    let current = 0;
    sketch.clear();
    
    if (song.isPlaying()) {
      target += 10;
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
    // sketch.background(230, 50, 15);
    sketch.orbitControl(2, 2);
    for (let phi = 0; phi < 180; phi += 2) {
      // sketch.stroke(20);
      sketch.beginShape(sketch.POINTS); //TESS
      for (let theta = 0; theta < 360; theta += 2) {
        let x = (r * (1 + ((intensity * 5)) * sketch.sin(theta * 5) * sketch.sin(phi * 6))) * sketch.sin(phi) * sketch.cos(theta);
        let y = (r * (1 + ((intensity * 5)) * sketch.sin(theta * 5) * sketch.sin(phi * 6))) * sketch.sin(phi) * sketch.sin(theta);
        let z = (r * (1 + ((intensity * 5)) * sketch.sin(theta * 5) * sketch.sin(phi * 6))) * sketch.cos(phi); 
        // if (theta % 90 === 0) { // Change color every 90 degrees (diagonals)
        //   colorIndex++;
        //   sketch.stroke(colorIndex % 2 === 0 ? sketch.color(sketch.random(255)) : sketch.color(sketch.random(100))); // Alternate between two colors
        // }
        // let colorValue = sketch.map(sketch.dist(x, y, z, 0, 0, 0), 0, r * 2, 0, 255);
        // colorValue = sketch.int(colorValue);
        // console.log(colorValue);
        
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
    //   this.size = size;
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

  function particleSystem () {
    var vertices = bumpySphere(intensity, peakDetect);
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
        
  
        let x = (vert.x + 200) + sketch.cos(angle) * sketch.cos(angle) * (1000);
        let y = (vert.y + 200) + sketch.sin(angle) * sketch.sin(angle) * (1000);
        let z = vert.z;
  
        particleRing.push(new Particle(x, y, z));
    }
  
    particles.push(particleRing);
  }  

  sketch.mouseClicked = () => {
    if (song.isPlaying()) {
      song.pause();
    }  else  {
      song.play();
    }
  };


  }
}

const sketchInstance = new p5(s);
function Sketch() {
    return (<ReactP5Wrapper sketch={sketchInstance}></ReactP5Wrapper>
    )
} 

export default Sketch;
