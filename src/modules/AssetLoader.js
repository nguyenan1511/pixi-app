import { EventDispatcher } from 'three';
import { Object3D, LoadingManager, TextureLoader, AudioLoader, CubeTextureLoader, FileLoader } from 'three';
import UrlUtils from './UrlUtils';
import AssetManager from './AssetManager';

export const AssetLoaderEvent = {
    START: 'start',
    COMPLETED: 'completed',
    PROGRESS: 'progress',
    ERROR: 'error',
};

export default class AssetLoader extends EventDispatcher {
    // #privateField = 'test';

    #cubeImagesRLTBFB = [
        'left.jpg', // px
        'right.jpg', // nx
        'top.jpg', // py
        'bottom.jpg', // ny
        'front.jpg', // pz
        'back.jpg', // nz
    ];

    #cubeImagesXYZ = ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'];

    constructor() {
        super();

        const scope = this;

        const manager = (this.manager = new LoadingManager());

        this.allowCallback = true;

        manager.onStart = function (url, itemsLoaded, itemsTotal) {
            scope.dispatchEvent({ type: AssetLoaderEvent.START });
        };

        manager.onLoad = function () {
            if (!scope.allowCallback) return;

            scope.dispatchEvent({ type: AssetLoaderEvent.COMPLETED });
            // ('Loading complete!');
        };

        manager.onProgress = function (url, itemsLoaded, itemsTotal) {
            const percent = parseFloat(itemsLoaded) / parseFloat(itemsTotal);

            scope.dispatchEvent({ type: AssetLoaderEvent.PROGRESS, percent: percent });
        };

        manager.onError = function (url) {
            scope.dispatchEvent({ type: AssetLoaderEvent.ERROR, url });
            console.log('There was an error loading ' + url);
        };
        // (this.#privateField);
    }

    /**
     *
     * @param {Object[]} list - The employees who are responsible for the project.
     * @param {string} list[].url - The name of an employee.
     * @param {string} list[].key - The employee's department.
     * @param {string} list[].type - The employee's department.
     */
    loadList(list) {
        const scope = this;
        let count = 0;
        let array = [];
        this.allowCallback = false;
        return new Promise(async (resolve, reject) => {
            list.map(async (item, index) => {
                const url = item.url || '';
                const key = item.key || null;
                const type = item.type || null;
                const res = await this.load(url, key, type);
                array.push(res);
                count++;
                if (count == list.length) {
                    scope.dispatchEvent({ type: AssetLoaderEvent.COMPLETED });
                    resolve(array);
                }
            });
        });
    }

    /**
     *
     * @param {string} url
     * @param {string} key
     * @param {string} type
     */
    load(url, key, type) {
        key = key || url;

        return new Promise(async (resolve, reject) => {
            let loader;
            if (key.indexOf('cube_map') != -1) {
                loader = new CubeTextureLoader(this.manager);
                loader.setPath(url);
                if (key.indexOf('_xyz') != -1) {
                    loader.load(this.#cubeImagesXYZ, onItemLoaded);
                } else {
                    loader.load(this.#cubeImagesRLTBFB, onItemLoaded);
                }
            } else {
                var fileExt = type || UrlUtils.getFileExtension(url);
                fileExt = fileExt.toLowerCase();
                switch (fileExt) {
                    case 'fbx':
                        const FBXLoader = (await import('three/examples/jsm/loaders/FBXLoader')).FBXLoader;
                        loader = new FBXLoader(this.manager);
                        break;

                    case 'svg':
                        const SVGLoader = (await import('three/examples/jsm/loaders/SVGLoader')).SVGLoader;
                        loader = new SVGLoader(this.manager);
                        break;

                    case 'glb':
                        var GLTFLoader = (await import('three/examples/jsm/loaders/GLTFLoader')).GLTFLoader;
                        loader = new GLTFLoader(this.manager);
                        break;

                    case 'gltf':
                        var GLTFLoader = (await import('three/examples/jsm/loaders/GLTFLoader')).GLTFLoader;
                        var DRACOLoader = (await import('three/examples/jsm/loaders/DRACOLoader')).DRACOLoader;

                        loader = new GLTFLoader(this.manager);
                        this.dracoLoader = new DRACOLoader();
                        loader.setDRACOLoader(this.dracoLoader);
                        loader.dracoLoader.setDecoderPath('/draco/gltf/');
                        break;

                    case 'obj':
                        var OBJLoader = (await import('three/examples/jsm/loaders/OBJLoader')).OBJLoader;

                        loader = new OBJLoader(this.manager);
                        break;

                    case 'mp3':
                        loader = new AudioLoader(this.manager);
                        break;

                    case 'jpg':
                        loader = new TextureLoader(this.manager);
                        break;

                    case 'png':
                        loader = new TextureLoader(this.manager);
                        break;

                    default:
                        loader = new FileLoader(this.manager);
                        break;
                }
                loader.load(url, onItemLoaded, undefined, onItemError);
            }

            function onItemError(e) {
                console.error('LOADING ERROR !');
                console.log(e);

                resolve({ error: e });
                // ("[Assets] Error " + e.target.status + ": " + e.target.statusText);
            }

            function onItemLoaded(object) {
                var obj3d;
                if (typeof object.scene != 'undefined') {
                    //  (object);
                    var holder = new Object3D();
                    holder.add(object.scene);
                    object.scene.scale.setScalar(100);
                    obj3d = holder;
                    if (typeof object.animations != 'undefined') {
                        obj3d.animations = object.animations;
                    }
                    if (typeof object.assets != 'undefined') {
                        obj3d.assets = object.assets;
                    }
                    if (typeof object.parser != 'undefined') {
                        obj3d.parser = object.parser;
                    }
                } else {
                    obj3d = object;
                }

                AssetManager.addObject(key, obj3d, url);

                resolve({ key, object: obj3d });
            }
        });
    }

    /**
     *
     * @param {Object[]} list - The employees who are responsible for the project.
     * @param {string} list[].url - The name of an employee.
     * @param {string} list[].key - The employee's department.
     * @param {string} list[].type - The employee's department.
     */
    async loadListOnce(list) {
        const scope = this;

        scope.allowCallback = false;
        let count = 0;
        const array = [];

        await Promise.all(
            list.map(async (item, index) => {
                const url = item.url || '';
                const key = item.key || null;
                const type = item.type || null;
                const res = await scope.loadOnce(url, key, type, false);
                count++;
                array.push(res);
                // if (count == list.length) {
                //     scope.dispatchEvent({ type: AssetLoaderEvent.COMPLETED });
                //     resolve(array);
                // }
            })
        );

        scope.dispatchEvent({ type: AssetLoaderEvent.COMPLETED });
        return array;

        // return new Promise(async (resolve, reject) => {

        // })
    }

    /**
     * Use same texture with same key
     * @param {string} url
     * @param {string} key
     * @param {string} type
     * @param {Boolean} canDispactch
     * @returns {{key, object : THREE.Object3D}}
     *
     */
    loadOnce(url, key, type, canDispactch = true) {
        const scope = this;
        return new Promise(async (resolve, reject) => {
            key = key || url;

            if (scope.checkExited(key)) {
                if (canDispactch) scope.dispatchEvent({ type: AssetLoaderEvent.COMPLETED });
                resolve({ key, object: AssetManager.get(key) });
                return;
            }

            const res = await scope.load(url, key, type);
            resolve(res);
            return;
        });
    }

    /**
     *
     * @param {string} key
     */
    checkExited(key) {
        return AssetManager.get(key);
    }
}
