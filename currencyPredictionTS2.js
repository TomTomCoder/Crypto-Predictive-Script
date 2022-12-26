// Script 3
const tf = require('@tensorflow/tfjs');

// Load the data. This should be an array of objects, with each object representing a data point
// and having properties for the various features you want to use for prediction (e.g. 'open', 'close', etc.)
const data = require('./data.json');

// Split the data into training and test sets
const trainTestSplit = tf.util.createTrainTestSplit(data, 0.8);
const trainData = trainTestSplit.train;
const testData = trainTestSplit.test;

// Convert the data to tensors
const inputs = trainData.map((datum) => [
  datum.open,
  datum.close,
  datum.high,
  datum.low,
  datum.volume,
  datum.marketCap,
]);
const labels = trainData.map((datum) => datum.close);
const inputTensor = tf.tensor2d(inputs);
const labelTensor = tf.tensor1d(labels);

// Create the model
const model = tf.sequential();
model.add(tf.layers.dense({units: 32, inputShape: [6], activation: 'relu'}));
model.add(tf.layers.dense({units: 16, activation: 'relu'}));
model.add(tf.layers.dense({units: 1, activation: 'linear'}));

// Compile the model
model.compile({optimizer: 'adam', loss: 'meanSquaredError'});

// Train the model
await model.fit(inputTensor, labelTensor, {epochs: 100});

// Test the model
const testInputs = testData.map((datum) => [
  datum.open,
  datum.close,
  datum.high,
  datum.low,
  datum.volume,
  datum.marketCap,
]);
const testLabels = testData.map((datum) => datum.close);
const testInputTensor = tf.tensor2d(testInputs);
const testLabelTensor = tf.tensor1d(testLabels);

const testResults = model.evaluate(testInputTensor, testLabelTensor);
console.log(testResults);
