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

// Set up the grid search parameters
const learningRates = [0.01, 0.001, 0.0001];
const hiddenUnits = [8, 16, 32, 64];
const optimizers = ['adam', 'sgd'];

let bestModel;
let bestAccuracy = 0;

// Perform the grid search
for (const learningRate of learningRates) {
  for (const units of hiddenUnits) {
    for (const optimizer of optimizers) {
      // Create the model
      const model = tf.sequential();
      model.add(tf.layers.dense({units: units, inputShape: [6], activation: 'relu'}));
      model.add(tf.layers.dense({units: units, activation: 'relu'}));
      model.add(tf.layers.dense({units: 1, activation: 'linear'}));

      // Compile the model
      model.compile({optimizer: optimizer, loss: 'meanSquaredError', learningRate: learningRate});

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
      const accuracy = testResults[1].dataSync()[0];

      // Save the best model based on test accuracy
      if (accuracy > bestAccuracy) {
        bestAccuracy = accuracy;
        bestModel = model;
      }
    }
  }
}  
 
 
