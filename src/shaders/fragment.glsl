uniform sampler2D uTexture;

varying vec2 vUv;

void main(){
  vec4 myImage = texture(
    uTexture,
    vUv
    );

  gl_FragColor = myImage;
}
