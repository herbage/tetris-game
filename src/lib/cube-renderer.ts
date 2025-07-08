import { createShader, createProgram, createBuffer, createIndexBuffer, createMatrix4, perspective, translate, scale, multiply } from './webgl-utils';

const vertexShaderSource = `
  attribute vec3 a_position;
  attribute vec3 a_normal;
  
  uniform mat4 u_modelMatrix;
  uniform mat4 u_viewMatrix;
  uniform mat4 u_projectionMatrix;
  uniform mat4 u_normalMatrix;
  
  varying vec3 v_normal;
  varying vec3 v_position;
  
  void main() {
    vec4 worldPosition = u_modelMatrix * vec4(a_position, 1.0);
    v_position = worldPosition.xyz;
    v_normal = (u_normalMatrix * vec4(a_normal, 0.0)).xyz;
    
    gl_Position = u_projectionMatrix * u_viewMatrix * worldPosition;
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  
  uniform vec3 u_color;
  uniform vec3 u_lightDirection;
  uniform vec3 u_ambientLight;
  uniform vec3 u_lightColor;
  uniform bool u_isGlowing;
  
  varying vec3 v_normal;
  varying vec3 v_position;
  
  void main() {
    vec3 normal = normalize(v_normal);
    vec3 lightDir = normalize(-u_lightDirection);
    
    float light = max(dot(normal, lightDir), 0.0);
    
    // Add simple edge highlighting for better 3D effect
    float edgeLight = 1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0)));
    
    vec3 lighting = u_ambientLight + (u_lightColor * light) + (vec3(0.1, 0.1, 0.2) * edgeLight);
    
    vec3 color = u_color * lighting;
    
    if (u_isGlowing) {
      color += u_color * 0.4; // Add glow effect
      color += vec3(0.2, 0.2, 0.2); // Add brightness
    }
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export interface CubeRenderer {
  render(x: number, y: number, z: number, color: [number, number, number], isGlowing?: boolean): void;
  setViewMatrix(viewMatrix: Float32Array): void;
  setProjectionMatrix(projectionMatrix: Float32Array): void;
  clear(): void;
}

export function createCubeRenderer(gl: WebGLRenderingContext): CubeRenderer | null {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  
  if (!vertexShader || !fragmentShader) return null;
  
  const program = createProgram(gl, vertexShader, fragmentShader);
  if (!program) return null;
  
  // Cube vertices (positions and normals)
  const vertices = new Float32Array([
    // Front face
    -0.5, -0.5,  0.5,  0,  0,  1,
     0.5, -0.5,  0.5,  0,  0,  1,
     0.5,  0.5,  0.5,  0,  0,  1,
    -0.5,  0.5,  0.5,  0,  0,  1,
    
    // Back face
    -0.5, -0.5, -0.5,  0,  0, -1,
    -0.5,  0.5, -0.5,  0,  0, -1,
     0.5,  0.5, -0.5,  0,  0, -1,
     0.5, -0.5, -0.5,  0,  0, -1,
    
    // Top face
    -0.5,  0.5, -0.5,  0,  1,  0,
    -0.5,  0.5,  0.5,  0,  1,  0,
     0.5,  0.5,  0.5,  0,  1,  0,
     0.5,  0.5, -0.5,  0,  1,  0,
    
    // Bottom face
    -0.5, -0.5, -0.5,  0, -1,  0,
     0.5, -0.5, -0.5,  0, -1,  0,
     0.5, -0.5,  0.5,  0, -1,  0,
    -0.5, -0.5,  0.5,  0, -1,  0,
    
    // Right face
     0.5, -0.5, -0.5,  1,  0,  0,
     0.5,  0.5, -0.5,  1,  0,  0,
     0.5,  0.5,  0.5,  1,  0,  0,
     0.5, -0.5,  0.5,  1,  0,  0,
    
    // Left face
    -0.5, -0.5, -0.5, -1,  0,  0,
    -0.5, -0.5,  0.5, -1,  0,  0,
    -0.5,  0.5,  0.5, -1,  0,  0,
    -0.5,  0.5, -0.5, -1,  0,  0,
  ]);
  
  const indices = new Uint16Array([
    0,  1,  2,    0,  2,  3,    // front
    4,  5,  6,    4,  6,  7,    // back
    8,  9,  10,   8,  10, 11,   // top
    12, 13, 14,   12, 14, 15,   // bottom
    16, 17, 18,   16, 18, 19,   // right
    20, 21, 22,   20, 22, 23,   // left
  ]);
  
  const vertexBuffer = createBuffer(gl, vertices);
  const indexBuffer = createIndexBuffer(gl, indices);
  
  if (!vertexBuffer || !indexBuffer) return null;
  
  // Get uniform and attribute locations
  const locations = {
    attributes: {
      position: gl.getAttribLocation(program, 'a_position'),
      normal: gl.getAttribLocation(program, 'a_normal'),
    },
    uniforms: {
      modelMatrix: gl.getUniformLocation(program, 'u_modelMatrix'),
      viewMatrix: gl.getUniformLocation(program, 'u_viewMatrix'),
      projectionMatrix: gl.getUniformLocation(program, 'u_projectionMatrix'),
      normalMatrix: gl.getUniformLocation(program, 'u_normalMatrix'),
      color: gl.getUniformLocation(program, 'u_color'),
      lightDirection: gl.getUniformLocation(program, 'u_lightDirection'),
      ambientLight: gl.getUniformLocation(program, 'u_ambientLight'),
      lightColor: gl.getUniformLocation(program, 'u_lightColor'),
      isGlowing: gl.getUniformLocation(program, 'u_isGlowing'),
    }
  };
  
  let viewMatrix = createMatrix4();
  let projectionMatrix = createMatrix4();
  
  return {
    render(x: number, y: number, z: number, color: [number, number, number], isGlowing = false) {
      gl.useProgram(program);
      
      // Bind buffers
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      
      // Set up attributes
      gl.enableVertexAttribArray(locations.attributes.position);
      gl.enableVertexAttribArray(locations.attributes.normal);
      
      const stride = 6 * 4; // 6 floats per vertex, 4 bytes per float
      gl.vertexAttribPointer(locations.attributes.position, 3, gl.FLOAT, false, stride, 0);
      gl.vertexAttribPointer(locations.attributes.normal, 3, gl.FLOAT, false, stride, 3 * 4);
      
      // Create model matrix
      let modelMatrix = createMatrix4();
      modelMatrix = translate(modelMatrix, x, y, z);
      modelMatrix = scale(modelMatrix, 0.9, 0.9, 0.9); // Slightly smaller for gaps
      
      // Create normal matrix (for lighting)
      const normalMatrix = createMatrix4();
      
      // Set uniforms
      gl.uniformMatrix4fv(locations.uniforms.modelMatrix, false, modelMatrix);
      gl.uniformMatrix4fv(locations.uniforms.viewMatrix, false, viewMatrix);
      gl.uniformMatrix4fv(locations.uniforms.projectionMatrix, false, projectionMatrix);
      gl.uniformMatrix4fv(locations.uniforms.normalMatrix, false, normalMatrix);
      
      gl.uniform3f(locations.uniforms.color, color[0], color[1], color[2]);
      gl.uniform3f(locations.uniforms.lightDirection, 0.3, 0.8, 0.7);
      gl.uniform3f(locations.uniforms.ambientLight, 0.4, 0.4, 0.5);
      gl.uniform3f(locations.uniforms.lightColor, 1.2, 1.2, 1.0);
      gl.uniform1i(locations.uniforms.isGlowing, isGlowing ? 1 : 0);
      
      // Draw the cube
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    },
    
    setViewMatrix(matrix: Float32Array) {
      viewMatrix = matrix;
    },
    
    setProjectionMatrix(matrix: Float32Array) {
      projectionMatrix = matrix;
    },
    
    clear() {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
  };
}