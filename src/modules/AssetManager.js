import ThreeUtils from './ThreeUtils';

export default class AssetManager {
    static map = new Map();
    static __list = [];

    constructor() {}

    // static functions
    /**
     * @returns {AssetManager}
     */

    /**
     * @returns {Map}
     */
    static all() {
        return this.map;
    }

    /**
     * @param  {string} key
     * @returns {THREE.Object3D}
     */
    static find(key) {
        return this.map.get(key);
    }

    /**
     * @param  {string} key
     * @returns {THREE.Object3D}
     */
    static get(key) {
        return this.find(key);
    }

    static set(key, object) {
        return this.map.set(key, object);
    }

    static delete(key) {
        const object = this.get(key);
        if (object) {
            ThreeUtils.clearThree(object);
            this.map.delete(key);
        }
    }

    static dispose() {
        this.map.forEach((item, key) => {
            this.delete(key);
        });
        AssetManager.__list.forEach((item) => {
            ThreeUtils.clearThree(item);
        });
    }

    /**
     * @param  {string} key
     * @param  {THREE.Object3D} object
     * @param  {string} url
     */
    static addObject(key, object, url) {
        if (object.traverse)
            object.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = false;
                    child.receiveShadow = false;
                }
            });

        object.name = url;
        this.map.set(key, object);

        this.__list.push(object);
    }
}
