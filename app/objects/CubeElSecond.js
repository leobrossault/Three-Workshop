'use strict';

import THREE from 'three';

export default class CubeElSecond extends THREE.Object3D {
  

  constructor() {
    super();
    this.count = 0;
    this.active = 0;
    this.phase = 1;

    this.geom = new THREE.BoxGeometry( 10 , 4, 4 );
    this.mat = new THREE.MeshBasicMaterial({color: 0xf3f1ef});
    this.mesh = new THREE.Mesh(this.geom, this.mat);

    this.add(this.mesh);
  }

  update (average, pos) {
    if (average * 0.01 > 0.4 && average * 0.01 < 0.6 ) {
      this.active = 1;
    }

    if (pos == 'top' && this.phase == 2) {
      pos = 'bot';
    } else if (this.phase == 2) {
      pos = 'top';
    }

    if (pos == 'top' && this.active == 1) {
      this.position.x += 5;
      this.position.y += 5;

      if (this.position.x == 140) {
          this.active = 0;

          if (this.phase == 2) {
            this.phase = 1;
          } else {
            this.phase = 2;
          }
      }
    } else if (pos == 'bot' &&  this.active == 1) {
      this.position.x -= 5;
      this.position.y -= 5;

      if (this.position.x == -250) {
          this.active = 0;

          if (this.phase == 2) {
            this.phase = 1;
          } else {
            this.phase = 2;
          }
      }
    }
  }
}