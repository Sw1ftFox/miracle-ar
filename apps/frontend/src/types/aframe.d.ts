// src/types/aframe.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    'a-scene': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      embedded?: boolean;
      arjs?: string;
      'vr-mode-ui'?: string;
      'loading-screen'?: string;
      'device-orientation-permission-ui'?: string;
      renderer?: string;
      sound?: boolean;
      cursor?: string;
      raycaster?: string;
    };
    'a-marker': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      preset?: string;
      type?: string;
      url?: string;
      emitevents?: boolean;
      cursor?: string;
      raycaster?: string;
      smooth?: boolean;
      smoothCount?: string;
      smoothTolerance?: string;
      smoothThreshold?: string;
    };
    'a-entity': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      position?: string;
      scale?: string;
      rotation?: string;
      'gltf-model'?: string;
      animation?: string;
      cursor?: string;
      raycaster?: string;
      geometry?: string;
      material?: string;
      camera?: boolean | string;
      events?: string;
      sound?: string;
    };
    'a-camera': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      position?: string;
      'look-controls'?: boolean | string;
      'wasd-controls'?: boolean | string;
      fov?: string;
    };
    'a-box': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      position?: string;
      rotation?: string;
      scale?: string;
      color?: string;
      width?: number;
      height?: number;
      depth?: number;
    };
    'a-sphere': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      position?: string;
      radius?: number;
      color?: string;
    };
    'a-cylinder': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      position?: string;
      radius?: number;
      height?: number;
      color?: string;
    };
    'a-plane': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      position?: string;
      rotation?: string;
      width?: number;
      height?: number;
      color?: string;
    };
    'a-sky': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      color?: string;
      src?: string;
      radius?: number;
    };
    'a-light': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      type?: string;
      position?: string;
      intensity?: number;
      color?: string;
    };
    'a-assets': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'a-asset-item': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      id?: string;
      src?: string;
    };
    'a-animation': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      attribute?: string;
      dur?: number;
      fill?: string;
      to?: string;
      repeat?: string | number;
    };
  }
}

