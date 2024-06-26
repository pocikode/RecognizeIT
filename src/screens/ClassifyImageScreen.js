import { useEffect, useRef, useState } from "react";
import { Text, View } from "../components/Themed";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import * as jpeg from "jpeg-js";
import * as ImageManipulator from "expo-image-manipulator";
import { fetch } from "@tensorflow/tfjs-react-native";
import * as FileSystem from 'expo-file-system';

export default function ClassifyImageScreen() {
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
      model.current = await mobilenet.load();
      setIsModelReady(true);
    };

    const getPermissionAsync = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('ERROR', 'Sorry, we need camera roll permissions to make this work!')
      }
    }

    initializeTfAsync();
    initializeModelAsync();
    getPermissionAsync();
  }, [])

  const imageToTensor = (rawImageData) => {
    const { width, height, data } = jpeg.decode(rawImageData, {
      useTArray: true,
    });

    const buffer = new Uint8Array(width * height * 3);
    let offset = 0;
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset];
      buffer[i + 1] = data[offset + 1];
      buffer[i + 2] = data[offset + 2];

      offset += 4;
    }

    return tf.tensor3d(buffer, [height, width, 3]);
  };

  const classifyImageAsync = async ({ uri }) => {
    console.log("SOURCEE:", uri);
    try {
      const imageAssetPath = Image.resolveAssetSource({uri});
      console.log("IMGG:", imageAssetPath);
      const imgb64 = await FileSystem.readAsStringAsync(uri, {encoding: FileSystem.EncodingType.Base64})
      console.log('IMGB64:', imgb64);
      // const response = await fetch(imageAssetPath.uri, {}, { isBinary: true });
      // console.log('masuk1');
      // const rawImageData = await response.arrayBuffer();
      const rawImageData = tf.util.encodeString(imgb64, 'base64').buffer;
      const imageTensor = imageToTensor(rawImageData);
      const newPredictions = await model.current.classify(imageTensor);
      setPredictions(newPredictions);
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
        console.log("MANIP_RESPONSE:", manipResponse);

        const source = { uri: manipResponse.uri };
        setImageToAnalyze(source);
        setPredictions(null);
        await classifyImageAsync(source);
      }
    } catch (error) {
      console.log('ERROR SELECT:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.headerText}>MobileNet Image Classification</Text>
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
              <Text style={styles.text}>MobileNet model ready? </Text>
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
              <Image source={imageToAnalyze} style={styles.imageContainer} />
            )}

            {isModelReady && !imageToAnalyze && (
              <Text style={styles.transparentText}>Tap to choose image</Text>
            )}
          </TouchableOpacity>

          <View style={styles.predictionWrapper}>
            {isModelReady && imageToAnalyze && (
              <Text style={styles.text}>
                <Text style={{ fontWeight: 'bold'}}>Predictions</Text>: {predictions ? "" : "Predicting..."}
              </Text>
            )}
            {isModelReady &&
              predictions &&
              predictions.length &&
              console.log("=== Classify image predictions: ===")}
            {isModelReady &&
              predictions &&
              predictions.map((p, index) => {
                console.log(`${index} ${p.className}: ${p.probability}`);

                return (
                  <Text key={index} style={styles.text}>
                    {/* {p.className}: {p.probability} */}
                    {p.className}: {Math.ceil(p.probability*1000) / 1000}%
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
    height: 100,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
  transparentText: {
    opacity: 0.8,
  },
});