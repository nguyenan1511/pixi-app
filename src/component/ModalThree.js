import { Inter } from "next/font/google";
import Head from "next/head";
import { useEffect } from "react";
import * as THREE from "three";
const inter = Inter({ subsets: ["latin"] });

import DotAnimate from "../modules/DotAnimate"

export default function ModalThree() {
  useEffect(() => {
    const clock = new THREE.Clock();

    const windowHalfX = window.innerWidth;
    const windowHalfY = window.innerHeight;

    let mouseX = 0;
    let mouseY = 0;

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 48;

    // NOTE: Specify a canvas which is already created in the HTML.
    const canvas = document.getElementById("myThreeJsCanvas");
    const renderer = new THREE.WebGLRenderer({
      canvas,
      // NOTE: Anti-aliasing smooths out the edges.
      antialias: true,
      alpha: true,
    });

    const scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshStandardMaterial({ color: 0x05e8e4 });
    const cube = new THREE.Mesh(geometry, material);

    // ambient light which is for the whole scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    ambientLight.castShadow = true;
    scene.add(ambientLight);

    // directional light - parallel sun rays
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.castShadow = true;
    directionalLight.position.set(4, 32, 64);
    scene.add(directionalLight);

    const dotAnimate = new DotAnimate();

    scene.add(cube);
    scene.add(dotAnimate);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.render(scene, camera);

    function moveMouse(e) {
      const elapsedTime = clock.getElapsedTime();

      mouseX = e.clientX - windowHalfX;
      mouseY = e.clientY - windowHalfY;

      camera.rotation.x = -mouseX * (elapsedTime * 0.000001);
      camera.rotation.y = mouseY * (elapsedTime * 0.000001);
      // cube.rotation.x = mouseX * (elapsedTime * 0.00008);
    }
    const updateSphere = (e) => {
      cube.rotation.z = scrollY * 0.003;
      cube.rotation.x = scrollY * 0.003;
      renderer.render(scene, camera);
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      window.requestAnimationFrame(animate.bind(renderer));
      renderer.render();
      renderer.stats.update();
      renderer.controls.update();
    };

    const autoRotate = () => {
      const elapsedTime = clock.getElapsedTime();
      cube.rotation.y = 0.2 * elapsedTime;

      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(autoRotate);
    };

    // document.addEventListener("mousemove", moveMouse);
    window.addEventListener("scroll", updateSphere);
    // window.addEventListener("resize", () => onWindowResize(), false);
    autoRotate();
  }, []);

  return (
    <>
      <Head>
        <title>An Nguyen</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="myThreeJsCanvas w-screen h-screen">
        <canvas
          id="myThreeJsCanvas"
          className="fixed top-0 left-0 z-[9] w-screen h-screen bg-transparent"
        />
      </div>
      <style jsx global>{`
        .dg.ac {
          z-index: 999 !important;
        }
        .myThreeJsCanvas {
          background-image: url("/assets/images/bg.jpg");
          background-repeat: no-repeat;
          background-size: cover;
          overflow: hidden;
          z-index: -1;
        }
      `}</style>
    </>
  );
}
