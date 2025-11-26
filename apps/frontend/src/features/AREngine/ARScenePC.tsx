import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface ARSceneProps {
  modelUrl: string;
  markerPatternUrl?: string;
  modelScale?: number;
}

const ARScene = ({ 
  modelUrl,
  markerPatternUrl,
  modelScale = 0.5
}: ARSceneProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); 
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    initARJS(scene, camera, renderer);

    loadModel(scene);

    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        (cameraRef.current as THREE.PerspectiveCamera).aspect = window.innerWidth / window.innerHeight;
        (cameraRef.current as THREE.PerspectiveCamera).updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      requestAnimationFrame(animate);
      
      if (modelRef.current) {
        modelRef.current.rotation.y += 0.01;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [modelUrl, modelScale]);

  const initARJS = (scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer) => {
    if (!(window as any).AR) {
      console.error('AR.js не загружен');
      return;
    }

    try {
      const arSource = new (window as any).ARjs.Source({
        sourceType: 'webcam',
      });

      const arContext = new (window as any).ARjs.Context({
        cameraParametersUrl: 'https://arjs-cors-proxy.herokuapp.com/https://raw.githubusercontent.com/AR-js-org/AR.js/master/three.js/data/data/camera_para.dat',
        detectionMode: 'mono',
        maxDetectionRate: 60,
        canvasWidth: 640,
        canvasHeight: 480,
      });

      arSource.init(() => {
        arContext.init(() => {
          camera.projectionMatrix.copy(arContext.getProjectionMatrix());
        });
      });

      const updateAR = () => {
        if (arSource.ready) {
          arContext.update(arSource.domElement);
        }
        requestAnimationFrame(updateAR);
      };
      
      updateAR();

    } catch (error) {
      console.error('Ошибка инициализации AR.js:', error);
    }
  };

  const loadModel = (scene: THREE.Scene) => {
    const loader = new GLTFLoader();
    
    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(modelScale, modelScale, modelScale);
        model.position.set(0, 0, 0);
        modelRef.current = model;
        scene.add(model);
        
        console.log('3D модель успешно загружена');
      },
      (progress) => {
        const percent = (progress.loaded / progress.total) * 100;
        console.log(`Загрузка модели: ${percent.toFixed(2)}%`);
      },
      (error) => {
        console.error('Ошибка загрузки модели:', error);
      }
    );
  };

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100%', 
        height: '100vh',
        position: 'relative'
      }} 
    />
  );
};

export default ARScene;