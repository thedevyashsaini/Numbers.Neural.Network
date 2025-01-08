# NNN | Number's Neural Network

Welcome to the Number's Neural Network (NNN) project! This is a basic neural network **built from scratch** to recognize hand-drawn digits (0-9) using a custom dataset. The project includes a Python implementation for training and a TypeScript port for visualization. Let's dive into the world of digits and neural networks!

Check out the [Hosted Demo](https://tds-nnn.vercel.app/) (99% Train Accuracy, 55% Test Accuracy - Overfitted 🫠)

![Screenshot 2025-01-09 022552](https://github.com/user-attachments/assets/dd8deee7-4e84-4840-8b35-b5b5ca01437f)

## Project Structure

- [`main.py`](main.py): Contains the neural network architecture and functions to load the pre-trained model.
- [`dataset`](dataset): Directory containing the custom dataset of hand-drawn digits.
- [`nnn-web`](nnn-web): Directory containing the TypeScript port for visualizing the neural network.

## Getting Started

### Neural Network Architecture Overview

Our neural network is a **multi-class classification** model with **one-hot encoding**. Here's a quick rundown of the architecture:

- **Input Layer**: **100 neurons** (because the grid I'm using is 10*10 | make sure ur dataset is compatible with this)
- **Hidden Layers**: Three hidden layers with **20, 20, and 10 neurons** respectively. We like to keep things interesting.
- **Output Layer**: **10 neurons**, one for each digit (0-9). We use the **softmax activation** function here to ensure our outputs sum up to 1 (because math is fun).
- **Cost Function**: Categorical Cross-Entropy **(CCE).** It's like a harsh teacher that penalizes wrong answers more severely.

### Python Implementation

1. **Setup the Dataset Path**:
   Ensure the dataset is placed in the [`dataset`](dataset) directory (mine is already there).

2. **Define Neural Network Architecture**:
   The architecture is defined in [`main.py`](main.py):
   ```python
   layer_1 = 20
   layer_2 = 20
   layer_3 = 10
   output_layer = 10
   n = [100, layer_1, layer_2, layer_3, output_layer]
   ```

3. **Load Pre-trained Model**:
   Use the load_model function to load some pre-trained model parameters (if u save one):
   ```python
   def load_model(file_name):
       global W1, W2, W3, W4, b1, b2, b3, b4
       try:
           with open(file_name, 'rb') as file:
               model_params = pickle.load(file)
   ```
5. **Train and make predictions**: Use the _train_ and _predict_ functions in [`main.py`](main.py) to use the use the NN.

4. **Have fun with the NN**:
    Use the [NNN Colab Notebook](https://colab.research.google.com/drive/1Otldxlc0L_YVQT6LP-J-X96cFnAnZc4W) to easily play around and explore the implementation.

### TypeScript Visualization

The TypeScript port available in the nnn-web directory provides a visualization of the neural network. Because who doesn't love a good visual?

1. **Navigate to the nnn-web directory**:
   ```sh
   cd nnn-web
   ```

2. **Install Dependencies**:
   ```sh
   npm install
   ```

3. **Run the Development Server**:
   ```sh
   npm run dev
   ```

4. **Open the Application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the visualization.

For more details on the TypeScript visualization, refer to the [NNN_WEB README](nnn-web/README.md).

## Conclusion

That's it! You've got a neural network that can recognize hand-drawn digits and a cool visualization to show off to your friends. Happy coding!

P.S. If your neural network starts talking to you, it might be time to take a break. Just saying.
