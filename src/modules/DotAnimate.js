import gsap from 'gsap';

import MathExtra from "./MathExtra";

import * as GsapCore from 'gsap/gsap-core';
import Object3DExtend from './Object3DExtend';
import * as THREE from 'three';



// const fragment = `
// uniform vec3 color;
// uniform sampler2D pointTexture;

// varying vec3 vColor;

// void main() {

//     vec4 color = vec4( color * vColor, 0.8 ) * texture2D( pointTexture, gl_PointCoord );

//     gl_FragColor = color;

// }

// `

// const vertex = `
// attribute float size;‚‚
// attribute vec3 ca;

// varying vec3 vColor;

// void main() {

//     vColor = ca;

//     vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

//     gl_PointSize = size * ( 300.0 / -mvPosition.z );

//     gl_Position = projectionMatrix * mvPosition;

// }
// `

export default class DotAnimate extends Object3DExtend {
    constructor(props) {
        super(props);

        Object.assign(this, props);

        this.#awake();
    }

    holder = new THREE.Object3D();

    async #awake() {
        const scope = this;

        this.add(this.holder);

        await this.load();
    }

    async load() {
        const AssetLoader = (await import('./AssetLoader')).default;

        const loader = new AssetLoader();

        const res = await loader.loadOnce('/assets/images/blur-x256.png');


        if (res.object) {
            for (let i = 0; i < 5; i++) {
                const material = new THREE.SpriteMaterial({
                    transparent: true,
                    map: res.object,
                });

                const sprite = new DotItem(material, {
                    immedially: true,
                });

                sprite.renderOrder = -1;
                this.holder.add(sprite);
            }
        }
    }
}

class DotItem extends THREE.Sprite {
    constructor(material, props) {
        super(material);

        this.props = props;

        this.material.opacity = 0;

        this.init();

        this.addEventListener(
            'dispose',
            function (e) {
                if (this.currentTween) gsap.killTweensOf(this.currentTween);
            }.bind(this)
        );
    }

    get DURATION() {
        return MathExtra.randFloat(2, 4);
    }
    get DELAY() {
        return this.props.immedially ? 0 : MathExtra.randFloat(0, 5);
    }
    get ALPHA() {
        return MathExtra.randFloat(0.1, 0.3);
    }

    init() {
        this.position.x = MathExtra.randInt(-window.innerWidth * 0.7, window.innerWidth * 0.7);
        this.position.y = MathExtra.randInt(-window.innerHeight * 0.7, window.innerHeight * 0.7);

        this.material.rotation = MathExtra.randFloat(0, Math.PI * 2);
        this.scale.setScalar(MathExtra.randInt(1000, 3000));
        this.tween();
    }

    tween() {
        const scope = this;
        this.currentTween = gsap.to(this.material, {
            duration: this.DURATION,
            delay: this.DELAY,
            opacity: this.ALPHA,

            yoyo: true,
            repeat: 1,
            ease: GsapCore.Sine.easeInOut,
            onComplete: () => {
                1;
                scope.init();
            },
        });
    }
}
