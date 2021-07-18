#define PI 3.1415926535897932384626433832795

uniform float uTime;
uniform float uProgress;
uniform vec2 uResolution;
uniform vec2 uQuadSize;
uniform vec4 uCorners;

varying vec2 vUv;
varying vec2 vSize;

void main(){
  vUv = uv;

  vec3 newPosition = position;

  vec4 defaultState = modelMatrix * vec4(newPosition,1.0);
  vec4 fullScreenState = vec4(newPosition,1.0);
  fullScreenState.x *= uResolution.x /uQuadSize.x;
  fullScreenState.y *= uResolution.y / uQuadSize.y;

  float uCornerProgress = mix(
  mix(uCorners.z,uCorners.w,uv.x),
  mix(uCorners.x,uCorners.y,uv.x),
  uv.y
  );

  float sine = sin(PI * uCornerProgress);
  float waves = sine * 0.1 * sin(length(uv)*5. + 5. * uCornerProgress);

  vec4 finalState = mix(defaultState,fullScreenState,uCornerProgress + waves);

  vSize = mix(uQuadSize,uResolution,uProgress);

  gl_Position = projectionMatrix  * viewMatrix * finalState;
}
