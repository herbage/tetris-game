export function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  
  return shader;
}

export function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;
  
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  
  return program;
}

export function createBuffer(gl: WebGLRenderingContext, data: Float32Array): WebGLBuffer | null {
  const buffer = gl.createBuffer();
  if (!buffer) return null;
  
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  
  return buffer;
}

export function createIndexBuffer(gl: WebGLRenderingContext, data: Uint16Array): WebGLBuffer | null {
  const buffer = gl.createBuffer();
  if (!buffer) return null;
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
  
  return buffer;
}

export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): boolean {
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
  
  const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;
  
  if (needResize) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
  
  return needResize;
}

export function createMatrix4(): Float32Array {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);
}

export function perspective(fieldOfView: number, aspect: number, near: number, far: number): Float32Array {
  const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfView);
  const rangeInv = 1.0 / (near - far);
  
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0
  ]);
}

export function translate(matrix: Float32Array, x: number, y: number, z: number): Float32Array {
  const result = new Float32Array(matrix);
  result[12] = matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12];
  result[13] = matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13];
  result[14] = matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14];
  result[15] = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15];
  return result;
}

export function scale(matrix: Float32Array, x: number, y: number, z: number): Float32Array {
  const result = new Float32Array(matrix);
  result[0] *= x;
  result[1] *= x;
  result[2] *= x;
  result[3] *= x;
  result[4] *= y;
  result[5] *= y;
  result[6] *= y;
  result[7] *= y;
  result[8] *= z;
  result[9] *= z;
  result[10] *= z;
  result[11] *= z;
  return result;
}

export function multiply(a: Float32Array, b: Float32Array): Float32Array {
  const result = new Float32Array(16);
  
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      result[i * 4 + j] = 
        a[i * 4 + 0] * b[0 * 4 + j] +
        a[i * 4 + 1] * b[1 * 4 + j] +
        a[i * 4 + 2] * b[2 * 4 + j] +
        a[i * 4 + 3] * b[3 * 4 + j];
    }
  }
  
  return result;
}