import * as cocossd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { fetch } from "@tensorflow/tfjs-react-native";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import * as jpeg from "jpeg-js";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Platform, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../components/Themed";
import * as FileSystem from 'expo-file-system';
import * as mobilenet from "@tensorflow-models/mobilenet";

export default function DetectObjectScreen() {
  const [isTfReady, setIsTfReady] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [imageToAnalyze, setImageToAnalyze] = useState(null);
  const model = useRef(null);

  useEffect(() => {
    const initializeTfAsync = async () => {
      await tf.ready();
      setIsTfReady(true);
    };

    const initializeModelAsync = async () => {
      model.current = await cocossd.load();
      setIsModelReady(true);
    };

    const getPermissionAsync = async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    };

    initializeTfAsync();
    initializeModelAsync();
    getPermissionAsync();
  }, []);

  const imageToTensor = (rawImageData) => {
    const { width, height, data } = jpeg.decode(rawImageData, {
      useTArray: true,
    });

    const buffer = new Uint8Array(width * height * 3);
    let offset = 0; // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset];
      buffer[i + 1] = data[offset + 1];
      buffer[i + 2] = data[offset + 2];

      offset += 4;
    }

    return tf.tensor3d(buffer, [height, width, 3]);
  };

  const detectObjectsAsync = async (source) => {
    try {
      const imgb64 = await FileSystem.readAsStringAsync(source.uri, {encoding: FileSystem.EncodingType.Base64})
      // const response = await fetch(imageAssetPath.uri, {}, { isBinary: true });
      console.log('IMGb64:', imgb64);
      const rawImageData = tf.util.encodeString(imgb64, 'base64').buffer;
      const imageTensor = imageToTensor(rawImageData);
      const newPredictions = await model.detect(imageTensor)
        .then(res => console.log(res))
        .catch(res => console.log(res));
      setPredictions(newPredictions);
      console.log("=== Detect objects predictions: ===");
      console.log(newPredictions);
    } catch (error) {
      console.log("Exception Error: ", error);
    }
  };

  const selectImageAsync = async () => {
    try {
      let response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!response.cancelled) {
        const manipResponse = await ImageManipulator.manipulateAsync(
          response?.assets?.[0]?.uri,
          [{ resize: { width: 900 } }],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );

        const source = { uri: manipResponse.uri };
        setImageToAnalyze(source);
        // console.log(manipResponse);
        setPredictions(null);
        await detectObjectsAsync(source);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const borderColors = ["blue", "green", "orange", "pink", "purple"];
  const scalingFactor = 280 / 900;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.welcomeContainer}>
          <Text style={styles.headerText}>COCO-SSD Object Detection</Text>

          <View style={styles.loadingContainer}>
            <View style={styles.loadingTfContainer}>
              <Text style={styles.text}>TensorFlow.js ready?</Text>
              {isTfReady ? (
                <Text style={styles.text}>✅</Text>
              ) : (
                <ActivityIndicator size="small" />
              )}
            </View>

            <View style={styles.loadingModelContainer}>
              <Text style={styles.text}>COCO-SSD model ready? </Text>
              {isModelReady ? (
                <Text style={styles.text}>✅</Text>
              ) : (
                <ActivityIndicator size="small" />
              )}
            </View>
          </View>
          <TouchableOpacity
            style={styles.imageWrapper}
            onPress={isModelReady ? selectImageAsync : undefined}
          >
            {imageToAnalyze && (
              <View style={{ position: "relative" }}>
                {isModelReady &&
                  predictions &&
                  predictions.map((p, index) => {
                    return (
                      <View
                        key={index}
                        style={{
                          zIndex: 1,
                          elevation: 1,
                          left: p.bbox[0] * scalingFactor,
                          top: p.bbox[1] * scalingFactor,
                          width: p.bbox[2] * scalingFactor,
                          height: p.bbox[3] * scalingFactor,
                          borderWidth: 2,
                          borderColor: borderColors[index % 5],
                          backgroundColor: "transparent",
                          position: "absolute",
                        }}
                      />
                    );
                  })}

                <View
                  style={{
                    zIndex: 0,
                    elevation: 0,
                  }}
                >
                  <Image
                    source={imageToAnalyze}
                    style={styles.imageContainer}
                  />
                </View>
              </View>
            )}

            {isModelReady && !imageToAnalyze && (
              <Text style={styles.transparentText}>Tap to choose image</Text>
            )}
          </TouchableOpacity>
          <View style={styles.predictionWrapper}>
            {isModelReady && imageToAnalyze && (
              <Text style={styles.text}>
                Predictions: {predictions ? "" : "Predicting..."}
              </Text>
            )}
            {isModelReady &&
              predictions &&
              predictions.map((p, index) => {
                return (
                  <Text
                    key={index}
                    style={{ ...styles.text, color: borderColors[index % 5] }}
                  >
                    {p.class}: {p.score} {/* p.bbox */}
                  </Text>
                );
              })}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  contentContainer: {
    paddingTop: 30,
  },
  headerText: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: "bold",
  },
  loadingContainer: {
    marginTop: 5,
  },
  text: {
    fontSize: 16,
  },
  loadingTfContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  loadingModelContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  imageWrapper: {
    width: 300,
    height: 300,
    borderColor: "#66c8cf",
    borderWidth: 3,
    borderStyle: "dashed",
    marginTop: 40,
    marginBottom: 10,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: 280,
    height: 280,
  },
  predictionWrapper: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
  transparentText: {
    opacity: 0.8,
  },
});
