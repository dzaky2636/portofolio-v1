/**
 * The single lazy entry for everything 3D. Importing these separately makes the bundler
 * emit Three.js into one chunk per import, and the browser then downloads it twice.
 */
export { default as ProfileVoxelView } from '@/components/webgl/ProfileVoxelView';
export { default as RetroCanvas } from '@/components/RetroCanvas';
export { default as WebGLRoot } from '@/components/webgl/WebGLRoot';
