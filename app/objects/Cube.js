'use strict';

import THREE from 'three';

export default class Cube extends THREE.Object3D {
  

  constructor() {
    super();
    this.count = 0;

    this.geom = new THREE.CubeGeometry( 100 , 5, 100 );
    this.mat = new THREE.MeshPhongMaterial({color: 0xf3f1ef});
    this.mesh = new THREE.Mesh(this.geom, this.mat);

    this.add(this.mesh);
    var maxVertices = this.geom.vertices.length;
    console.log(this.geom.vertices[2]);
    this.geom.vertices[1].z = 10;
    this.geom.vertices[1].x = -2.5;
    this.geom.vertices[1].y = 10;
  }

  update() {
    this.deform ();
  }

  deform () {

  }
}