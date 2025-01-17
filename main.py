# -*- coding: utf-8 -*-
"""NNN | Number's Neural Network

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1Otldxlc0L_YVQT6LP-J-X96cFnAnZc4W
"""

# @title Mount Drive Folder and Set Dataset Path
import os
dataset_path = "./dataset"

# @title Define NN Architecture
layer_1 = 20 # @param {"type":"number","placeholder":"20"}
layer_2 = 20 # @param {"type":"number","placeholder":"20"}
layer_3 = 10 # @param {"type":"number","placeholder":"20"}
output_layer = 10 # @param {"type":"number","placeholder":"20"}
n = [100, layer_1, layer_2, layer_3, output_layer]
print("layer 0 / input layer size      :", n[0])
print("layer 1 size                    :", n[1])
print("layer 2 size                    :", n[2])
print("layer 3 size                    :", n[3])
print("layer 4 / output layer size     :", n[4])

# @title Function to Load Pre-trained Model
def load_model(file_name):
    global W1, W2, W3, W4, b1, b2, b3, b4
    try:
        with open(file_name, 'rb') as file:
            model_params = pickle.load(file)

        W1 = model_params['W1']
        W2 = model_params['W2']
        W3 = model_params['W3']
        W4 = model_params['W4']
        b1 = model_params['b1']
        b2 = model_params['b2']
        b3 = model_params['b3']
        b4 = model_params['b4']

        print("Model parameters loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")

# @title Initialise Random Weights
import numpy as np

def init_weights(n_inputs, n_outputs):
    return np.random.randn(n_outputs, n_inputs) * np.sqrt(2.0 / n_inputs)

W1 = init_weights(n[0], n[1])
W2 = init_weights(n[1], n[2])
W3 = init_weights(n[2], n[3])
W4 = init_weights(n[3], n[4])

b1 = np.zeros((n[1], 1))
b2 = np.zeros((n[2], 1))
b3 = np.zeros((n[3], 1))
b4 = np.zeros((n[4], 1))

print("Layer 1 weights' shape          :", W1.shape)
print("Layer 2 weights' shape          :", W2.shape)
print("Layer 3 weights' shape          :", W3.shape)
print("Layer 4 weights' shape          :", W4.shape)
print("Layer 1 bias' shape             :", b1.shape)
print("Layer 2 bias' shape             :", b2.shape)
print("Layer 3 bias' shape             :", b3.shape)
print("Layer 4 bias' shape             :", b4.shape)

# @title Function to Load and Prepare Data
test_size = 0.1 # @param {"type":"number","placeholder":"Test Size"}
import json
from sklearn.model_selection import train_test_split

def prepare_data(split=False, test_size=test_size, random_state=42):
    data_samples = []
    labels = []

    for file_name in os.listdir(dataset_path):
        if file_name.endswith('.json'):
            file_path = os.path.join(dataset_path, file_name)
            with open(file_path, 'r') as f:
                data = json.load(f)
                for entry in data:
                    data_samples.append(entry['data'])
                    labels.append(entry['label'])

    data_samples = np.array(data_samples)
    labels = np.array(labels)

    if split:
        data_train, data_test, labels_train, labels_test = train_test_split(
            data_samples, labels, test_size=test_size, random_state=random_state
        )

        m_train = len(data_train)
        A0 = data_train.T
        Y = np.zeros((n[4], m_train))
        Y[labels_train, np.arange(m_train)] = 1

        m_test = len(data_test)
        A0_test = data_test.T
        Y_test = np.zeros((n[4], m_test))
        Y_test[labels_test, np.arange(m_test)] = 1

        return A0, Y, m_train, A0_test, Y_test, m_test
    else:
        m = len(data_samples)
        A0 = data_samples.T
        Y = np.zeros((n[4], m))
        Y[labels, np.arange(m)] = 1

        return A0, Y, m

# @title Helper Formulae
# def sigmoid(Z):
#     return 1.0 / (1.0 + np.exp(-np.clip(Z, -500, 500)))

# def sigmoid_derivative(Z):
#     s = sigmoid(Z)
#     return s * (1 - s)

def relu(Z):
    return np.maximum(0, Z)

def relu_derivative(Z):
    return (Z > 0).astype(Z.dtype)


def softmax(Z):
    Z = np.clip(Z, -500, 500)  # Prevent overflow
    exp_Z = np.exp(Z - np.max(Z, axis=0, keepdims=True))
    return exp_Z / np.sum(exp_Z, axis=0, keepdims=True)

def cross_entropy_loss(Y, Y_hat):
    epsilon = 1e-15
    Y_hat = np.clip(Y_hat, epsilon, 1 - epsilon)
    return -np.sum(Y * np.log(Y_hat)) / Y.shape[1]

def accuracy(Y, Y_hat):
    Y_pred = np.argmax(Y_hat, axis=0)
    Y_true = np.argmax(Y, axis=0)

    correct_predictions = np.sum(Y_pred == Y_true)
    total_predictions = Y.shape[1]

    return correct_predictions / total_predictions

# @title Prediction Function
def feed_forward(A0):
    Z1 = W1 @ A0 + b1
    A1 = relu(Z1)

    Z2 = W2 @ A1 + b2
    A2 = relu(Z2)

    Z3 = W3 @ A2 + b3
    A3 = relu(Z3)

    Z4 = W4 @ A3 + b4
    A4 = softmax(Z4)

    cache = {
        "Z1": Z1, "A1": A1,
        "Z2": Z2, "A2": A2,
        "Z3": Z3, "A3": A3,
        "Z4": Z4
    }
    return A4, cache

# @title Back-Propagation Functions
def backprop_layer_4(Y_hat, Y, m, A3, W4):
    dZ4 = Y_hat - Y
    dW4 = (1/m) * (dZ4 @ A3.T)
    db4 = (1/m) * np.sum(dZ4, axis=1, keepdims=True)
    dA3 = W4.T @ dZ4
    return dW4, db4, dA3

def backprop_hidden_layer(dA, A_prev, Z, W, m):
    dZ = dA * relu_derivative(Z)
    dW = (1/m) * (dZ @ A_prev.T)
    db = (1/m) * np.sum(dZ, axis=1, keepdims=True)
    dA_prev = W.T @ dZ
    return dW, db, dA_prev

# @title Training Function
def train(X, Y, A0_test, Y_test, learning_rate=0.001, epochs=1000):
    global W1, W2, W3, W4, b1, b2, b3, b4
    m = X.shape[1]
    costs = []

    for epoch in range(epochs):
        Y_hat, cache = feed_forward(X)

        cost = cross_entropy_loss(Y, Y_hat)
        acc = accuracy(Y, Y_hat)

        dW4, db4, dA3 = backprop_layer_4(Y_hat, Y, m, cache['A3'], W4)
        dW3, db3, dA2 = backprop_hidden_layer(dA3, cache['A2'], cache['Z3'], W3, m)
        dW2, db2, dA1 = backprop_hidden_layer(dA2, cache['A1'], cache['Z2'], W2, m)
        dW1, db1, dA0 = backprop_hidden_layer(dA1, X, cache['Z1'], W1, m)

        W4 -= learning_rate * dW4
        W3 -= learning_rate * dW3
        W2 -= learning_rate * dW2
        W1 -= learning_rate * dW1

        b4 -= learning_rate * db4
        b3 -= learning_rate * db3
        b2 -= learning_rate * db2
        b1 -= learning_rate * db1

        if epoch % 20 == 0:
            costs.append(cost)
            print(f"Epoch {epoch}: cost = {cost:.6f} | accuracy = {acc:.6f}")

        if epoch in [10, 25, 50, 100, 200, 999]:
            Y_hat_test, _ = feed_forward(A0_test)
            cost_test = cross_entropy_loss(Y_test, Y_hat_test)
            accuracy_test = accuracy(Y_test, Y_hat_test)
            print(f"Test at {epoch}: cost = {cost_test:.6f} | accuracy = {accuracy_test:.6f}")

    return costs

# @title Load Dataset and Train NN
alpha = 0.1 # @param {"type":"number","placeholder":"Learning Rate"}
epochs = 1000 # @param {"type":"number","placeholder":"Epochs"}
A0, Y, m, A0_test, Y_test, m_test = prepare_data(split=True)
costs = train(A0, Y, A0_test, Y_test, learning_rate=alpha, epochs=epochs)

# @title Save the Trained Model
import pickle

model_params = {
    'W1': W1,
    'W2': W2,
    'W3': W3,
    'W4': W4,
    'b1': b1,
    'b2': b2,
    'b3': b3,
    'b4': b4
}

with open('model_params.pkl', 'wb') as file:
    pickle.dump(model_params, file)

print("Model parameters saved to 'model_params.pkl'")

# @title Make Predictions
input = "[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,1,1,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]" # @param {"type":"string","placeholder":"1*100 array of Booleans Representing 10*10 Grid"}
def predict(input_array):
    x = np.array(input_array)

    x = x.reshape(100, 1)

    y_hat, _ = feed_forward(x)

    predicted_digit = np.argmax(y_hat)
    confidence = float(y_hat[predicted_digit])

    return predicted_digit, confidence

test_array = json.loads(input)

digit, conf = predict(test_array)
print(f"Predicted digit: {digit}")
print(f"Confidence: {conf:.2%}")

# To get full probability distribution:
def get_all_probabilities(input_array):
    x = np.array(input_array).reshape(100, 1)
    y_hat, _ = feed_forward(x)
    return [(digit, float(prob)) for digit, prob in enumerate(y_hat)]

probs = get_all_probabilities(test_array)
print("\nProbabilities for all digits:")
for digit, prob in probs:
    print(f"Digit {digit}: {prob:.2%}")