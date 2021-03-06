'use strict';

import THREE from 'three';

export default class CubeElSecond extends THREE.Object3D {
  

  constructor() {
    super();
    this.count = 0;
    this.activeTop = 0;
    this.activeBot = 0;
    this.phaseTop = 1;
    this.phaseBot = 1;

    this.geom = new THREE.BoxGeometry( 10 , 4, 4 );
    this.mat = new THREE.MeshBasicMaterial({color: 0xf3f1ef});
    this.mesh = new THREE.Mesh(this.geom, this.mat);

    this.add(this.mesh);
  }

  update (average, pos) {

    if (average * 0.01 > 0.4 && average * 0.01 < 0.5 ) {
      this.activeTop = 1;
    }

    if (average * 0.01 > 0.6 && average * 0.01 < 0.7 ) {
      this.activeBot = 1;
    }

    if (pos == 'top' && this.phaseTop == 1 && this.activeTop == 1 || pos == 'bot' && this.phaseBot == 2 && this.activeBot == 1) {
      this.position.x += 5;
      this.position.y += 5;

      if (this.position.x == 180) {

          this.activeTop = 0;
          this.activeBot = 0;

          if (pos == 'top') {
            if (this.phaseTop == 1) {
              this.phaseTop = 2;
            } else {
              this.phaseTop = 1;
            }
          } else {
            if (this.phaseBot == 2) {
              this.phaseBot = 1;
            } else {
              this.phaseBot = 2;
            }
          }
      }
    } else if (pos == 'bot' && this.phaseBot &&  this.activeBot == 1 || pos == 'top' && this.phaseTop == 2 && this.activeTop == 1) {
      this.position.x -= 5;
      this.position.y -= 5;

      if (this.position.x == -280) {
          this.activeBot = 0;
          this.activeTop = 0;

          if (pos == 'top') {
            if (this.phaseTop == 2) {
              this.phaseTop = 1;
            } else {
              this.phaseTop = 2;
            }
          } else {
            if (this.phaseBot == 1) {
              this.phaseBot = 2;
            } else {
              this.phaseBot = 1;
            }
          }
      }
    }
  }
}