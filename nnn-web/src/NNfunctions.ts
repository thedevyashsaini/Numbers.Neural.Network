export type ModelParams = {
  W1: number[][];
  W2: number[][];
  W3: number[][];
  W4: number[][];
  b1: number[][];
  b2: number[][];
  b3: number[][];
  b4: number[][];
};

export const relu = (Z: number[]): number[] =>
  // Old Model: Relu
  // Z.map((value) => Math.max(0, value));

  // New Model: Leaky Relu
  Z.map((value) => Math.max(0.01 * value, value));

export const contractToUnitRange = (Z: number[]): number[] =>
  Z.map((value) => value / (1 + value));

const softmax = (Z: number[]): number[] => {
  const expZ = Z.map((value) => Math.exp(value - Math.max(...Z)));
  const sumExpZ = expZ.reduce((sum, value) => sum + value, 0);
  return expZ.map((value) => value / sumExpZ);
};

export const matMul = (A: number[][], B: number[]): number[] => {
  const result = A.map((row) => {
    const rowResult = row.reduce((sum, val, idx) => sum + val * B[idx], 0);
    return rowResult;
  });
  return result;
};

export const addBias = (Z: number[], b: number[][]): number[] => {
  const result = Z.map((value, idx) => value + b[idx][0]);
  return result;
};

export const loadModelParams = async (): Promise<ModelParams> => {
  const response = await fetch("/model_params.json");
  if (!response.ok) {
    throw new Error(`Failed to load model parameters: ${response.statusText}`);
  }
  return response.json() as Promise<ModelParams>;
};

export const feedForward = (
  modelParams: ModelParams,
  input: number[]
): {
  A1: number[];
  A2: number[];
  A3: number[];
  yHat: number[];
} => {
  const Z1 = addBias(matMul(modelParams.W1, input), modelParams.b1);
  const A1 = relu(Z1);

  const Z2 = addBias(matMul(modelParams.W2, A1), modelParams.b2);
  const A2 = relu(Z2);

  const Z3 = addBias(matMul(modelParams.W3, A2), modelParams.b3);
  const A3 = relu(Z3);

  const Z4 = addBias(matMul(modelParams.W4, A3), modelParams.b4);
  const yHat = softmax(Z4);

  return { A1: contractToUnitRange(A1), A2: contractToUnitRange(A2), A3: contractToUnitRange(A3), yHat };
};
