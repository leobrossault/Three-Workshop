'use strict';

import THREE from 'three';

export default class Sphere extends THREE.Object3D {

  constructor() {
    super();
    this.count = 0;

    this.geom = new THREE.SphereGeometry( 30 , 30, 30 );
    // this.mat = new THREE.MeshBasicMaterial({color: 0xf3f1ef});
    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        noise: {
          type: "f", 
          value: 0.0
        },
        time: {
            type: "f", 
            value: 0.0
        }
      },
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent,
    });
    this.mesh = new THREE.Mesh(this.geom, this.mat);

    this.add(this.mesh);
  }


  update(average, frequency) {
    var scaleMax = 0.8;
    var scaleMin = 0.4;

    if (average != 0 && average > 60) {
      if (average * 0.01 < scaleMin) {
        this.scale.x = scaleMin;
        this.scale.y = scaleMin;
        this.scale.z = scaleMin;        
      } else if (average * 0.01 > scaleMax) {
        this.scale.x = scaleMax;
        this.scale.y = scaleMax;
        this.scale.z = scaleMax;         
      } else {
        this.scale.x = average * 0.01;
        this.scale.y = average * 0.01;
        this.scale.z = average * 0.01;          
      }
    } else {
      this.scale.x = scaleMin;
      this.scale.y = scaleMin;
      this.scale.z = scaleMin;       
    }

    this.mat.uniforms['time'].value = average / 1000;
  }
}