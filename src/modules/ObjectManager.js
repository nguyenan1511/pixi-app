import * as THREE from 'three';

/**
 * @type {ObjectManager}
 */

export default class ObjectManager {
    // static functions
    /**
     * @returns {ObjectManager}
     */
    static list = new Map();

    // functions
    /**
     * @returns {Map}
     */
    static all() {
        return this.list;
    }

    /**
     * @param  {THREE.Object3D} key
     */
    static find(key) {
        return this.list.get(key);
    }

    /**
     * @param  {THREE.Object3D} key
     */
    static get(key) {
        return this.find(key);
    }

    /**
     * @param  {string} key
     */
    static add(key, object, isPublic = false) {
        if (this.list.has(key)) {
            if (this.get('key') != object) {
                // console.warn(`The key "${key}" was existed, this object will be overwritten:`, this.get(key))
            }
        }
        this.list.set(key, object);
        if (isPublic && typeof window != 'undefined') window[key] = object;
    }

    static dispose() {
        // dispose all objects in the manager?

        this.list.forEach((item) => {
            item = null;
        });
        this.list.clear();
    }
}
