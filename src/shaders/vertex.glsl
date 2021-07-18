uniform float uTime;
uniform float uProgress;

varying vec2 vUv;

void main(){
  vUv = uv;

  vec3 newPosition = position;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition,1.0);
}
