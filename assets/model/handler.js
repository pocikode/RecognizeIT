import { bundleResourceIO } from "@tensorflow/tfjs-react-native";

const modelJson = require('../model/yolov5n-320/model.json')
const modelWeights = [
  require("../model/yolov5n-320/group1-shard1of2.bin"),
  require("../model/yolov5n-320/group1-shard2of2.bin"),
];

export default bundleResourceIO(modelJson, modelWeights)