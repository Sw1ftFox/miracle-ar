import { WebIO } from '@gltf-transform/core';
import { reorder, quantize, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';

export type CompressionLevel = 'medium' | 'high';

let encoderReady = false;

async function ensureMeshoptReady() {
  if (!encoderReady) {
    await MeshoptEncoder.ready;
    encoderReady = true;
  }
  await MeshoptDecoder.ready; 
}

export async function compressGLB(
  file: File,
  level: CompressionLevel
): Promise<Blob> {
  await ensureMeshoptReady();

  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  const io = new WebIO().registerDependencies({
    'meshopt.encoder': MeshoptEncoder,
    'meshopt.decoder': MeshoptDecoder,
  });

  const document = await io.readBinary(uint8Array);

  await document.transform(
    reorder({ encoder: MeshoptEncoder }),
    quantize(),
    meshopt({ encoder: MeshoptEncoder, level })
  );

  const compressedBuffer = await io.writeBinary(document);
  return new Blob([new Uint8Array(compressedBuffer)], { type: 'model/gltf-binary' });
}