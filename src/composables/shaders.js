// Ashima 3D simplex noise
const noise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p){float f=0.,a=.5;for(int i=0;i<5;i++){f+=a*snoise(p);p*=2.02;a*=.5;}return f;}
`

export const blobVertex = /* glsl */ `
uniform float uTime;
uniform float uIntensity;
uniform vec2 uMouse;
varying vec3 vNormal;
varying vec3 vView;
varying float vDisp;
${noise}
float disp(vec3 p){
  float t=uTime*.25;
  float n=fbm(p*1.2+vec3(t,t*.7,-t));
  float spikes=pow(max(snoise(p*3.+t*2.),0.),3.)*uIntensity;
  return n*.45+spikes*.6+dot(normalize(p).xy,uMouse)*.25;
}
void main(){
  vec3 p=position;
  float d=disp(p);
  vec3 displaced=p+normal*d;
  // finite-difference normal so lighting follows the noise
  float e=.01;
  vec3 tA=normalize(cross(normal,vec3(0.,1.,0.)+1e-4));
  vec3 tB=normalize(cross(normal,tA));
  vec3 pA=p+tA*e;vec3 pB=p+tB*e;
  vec3 dA=pA+normal*disp(pA);vec3 dB=pB+normal*disp(pB);
  vec3 n=normalize(cross(dA-displaced,dB-displaced));
  vNormal=normalize(normalMatrix*n);
  vec4 mv=modelViewMatrix*vec4(displaced,1.);
  vView=normalize(-mv.xyz);
  vDisp=d;
  gl_Position=projectionMatrix*mv;
}
`

export const blobFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
varying vec3 vNormal;
varying vec3 vView;
varying float vDisp;
void main(){
  float fres=pow(1.-max(dot(vNormal,vView),0.),2.5);
  // thin-film-ish iridescence
  vec3 irid=.5+.5*cos(6.2831*(fres*1.4+vDisp*1.6+uTime*.08+vec3(0.,.33,.67)));
  vec3 base=mix(uColorA,uColorB,smoothstep(-.4,.6,vDisp));
  vec3 col=mix(base*.25,irid,fres);
  col+=uColorC*pow(fres,4.)*2.2;
  float spec=pow(max(dot(reflect(-vView,vNormal),normalize(vec3(.4,.8,.6))),0.),40.);
  col+=spec*.9;
  gl_FragColor=vec4(col,1.);
}
`

export const particlesVertex = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform float uScroll;
uniform vec2 uMouse;
attribute float aSeed;
varying float vAlpha;
varying float vSeed;
${noise}
void main(){
  vec3 p=position;
  float t=uTime*.08;
  // swirl around the y axis with noise drift
  float ang=t*(.4+aSeed*.6)+uScroll*3.;
  float c=cos(ang),s=sin(ang);
  p.xz=mat2(c,-s,s,c)*p.xz;
  p+=vec3(snoise(p*.3+t),snoise(p*.3+t+11.),snoise(p*.3+t+23.))*.6;
  p.xy+=uMouse*.6*(1.-aSeed);
  vec4 mv=modelViewMatrix*vec4(p,1.);
  gl_Position=projectionMatrix*mv;
  float size=(.6+aSeed*aSeed*3.)*uPixelRatio;
  gl_PointSize=size*(12./-mv.z);
  vAlpha=smoothstep(28.,6.,-mv.z)*(.25+.2*sin(uTime*2.+aSeed*50.))*.6;
  vSeed=aSeed;
}
`

export const particlesFragment = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
varying float vAlpha;
varying float vSeed;
void main(){
  float d=length(gl_PointCoord-.5);
  float a=smoothstep(.5,0.,d);
  vec3 col=mix(uColorA,uColorB,step(.85,vSeed));
  gl_FragColor=vec4(col,a*vAlpha);
}
`
