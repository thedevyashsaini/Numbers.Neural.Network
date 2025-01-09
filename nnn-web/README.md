# NNN Web

NNN Web is a TypeScript NextJS port for visualizing the Number's Neural Network (NNN) project. This project includes a neural network built from scratch to recognize hand-drawn digits (0-9) using a custom dataset. 
Check out the [Hosted Page](https://tds-nnn.vercel.app/)

P.S.: This is not compatible with portrait widths.

## Project Structure

- `NNfunctions.ts`: Contains the neural network functions and model parameters.
- `src/components/render-layer.tsx`: Component to render each layer of the neural network.
- `src/components/render-input-grid.tsx`: Component to render the input grid.
- `public/model_params.json`: Contains the pre-trained model parameters.
- `pages/index.tsx`: Main page component that visualizes the neural network.

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. **Get inside the directory**:
   ```sh
   cd nnn-web
   ```

2. **Install Dependencies**:
   ```sh
   npm install
   ```

### Running the Development Server

1. **Start the development server**:
   ```sh
   npm run dev
   ```

2. **Open the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the visualization.

### Neural Network Functions

The neural network functions are defined in the `NNfunctions.ts` file. This file includes functions for matrix multiplication, adding biases, activation functions (ReLU and softmax), and the feedforward process.

### Model Parameters

The pre-trained model parameters are stored in the `public/model_params.json` file. These parameters are loaded asynchronously when the application starts.

### Visualization Components

- **RenderLayer**: This component renders each layer of the neural network. It is defined in the `src/components/render-layer.tsx` file.
- **RenderInputGrid**: This component renders the input grid where users can draw digits. It is defined in the `src/components/render-input-grid.tsx` file.

### Usage

1. **Draw on the Input Grid**:
   Use your mouse draw on the input grid. The neural network will process the input and display the activations for each layer.

2. **Clear the Grid**:
   Click the "Clear" button to reset the input grid and activations.

3. **Copy Layer Parameters**:
   Click the copy icon next to each layer to copy the layer parameters to the clipboard.
