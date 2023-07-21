import * as THREE from 'three';
import ThreeUtils from './ThreeUtils';

export default class Object3DExtend extends THREE.Object3D {
    constructor(props) {
        super(props);

        this.props = props || {};

        this.debug = this.props.hasOwnProperty('debug') ? this.props['debug'] : this.debug;

        this.name = 'Object3DExtend';
        this.customType = 'Object3DExtend';
    }

    canInteract = false;

    get globalPosition() {
        return ThreeUtils.globalPosition(this);
    }

    #debug = false;
    get debug() {
        return false;
    }
    set debug(value) {
        this.#debug = value;
    }

    dispatchLoaded() {
        this.dispatchEvent({ type: 'loaded' });
    }

    async scaleIn(options) {
        options = {
            duration: 0.7,
            ease: 'sine.inout',
            ...options,
        };

        this.visible = true;

        const gsap = (await import('gsap')).default;
        await gsap.to(this.scale, { x: 1, y: 1, z: 1, ...options });
    }

    async scaleOut(options) {
        options = {
            duration: 0.7,
            ease: 'sine.inout',
            ...options,
        };

        const gsap = (await import('gsap')).default;
        await gsap.to(this.scale, { x: 0, y: 0, z: 0, ...options });
    }

    /**
     * Khi load 3D model từ file FBX/GLTF, các materials của children đôi khi không tương thích
     * Dùng method này để fix tạm bằng cách chuyển materials sang định dạng của THREE.js
     */
    fullyConvertMaterialsToThreeJS() {
        this.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                // trick to convert FBX materials to THREE materials
                // (child.material)
                var threeJsMaterials = child.material.clone();
                // dispose materials from FBX file
                child.material.dispose();
                // assign THREE materials to child objects
                child.material = threeJsMaterials;
            }
        });
    }

    removeAllEventListener() {
        if (this._listeners === undefined) return false;
        const listeners = this._listeners;

        for (const type in listeners) {
            this.removeAllEventListenerByType(type);
        }
    }

    removeAllEventListenerByType(type) {
        if (this._listeners === undefined) return false;
        const listeners = this._listeners;

        const listenerArray = listeners[type];
        if (listenerArray)
            while (listenerArray.length > 0) {
                listenerArray.splice(0, 1);
            }
    }

    removeObjectByProperty(nameProperty, value, isRemoveCurrentObject) {
        var _this = this;

        isRemoveCurrentObject = typeof isRemoveCurrentObject == 'undefined' ? false : isRemoveCurrentObject;

        if (isRemoveCurrentObject)
            if (_this[nameProperty] == value) {
                _this.parent.remove(_this);
                ThreeUtils.clearThree(_this);
                return;
            }

        for (var i = _this.children.length - 1; i >= 0; i--) {
            _this.children[i].removeObjectByProperty(nameProperty, value, true);
        }
    }

    removeObjectByName(name, isRemoveCurrentObject) {
        isRemoveCurrentObject = typeof isRemoveCurrentObject == 'undefined' ? false : isRemoveCurrentObject;

        this.removeObjectByProperty('name', name, isRemoveCurrentObject);
    }

    removeObjectById(name, isRemoveCurrentObject) {
        isRemoveCurrentObject = typeof isRemoveCurrentObject == 'undefined' ? false : isRemoveCurrentObject;

        this.removeObjectByProperty('id', name, isRemoveCurrentObject);
    }
}
