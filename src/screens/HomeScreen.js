import { Image, ScrollView, StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.headerContainer}>
          <Image source={require('../../assets/logo.png')} />
        </View>
        <View style={styles.getStartedContainer}>
          <Text style={styles.getStartedText}>
          RecognizeIT adalah aplikasi mobile yang menggunakan kamera untuk mendeteksi 
          dan mengklasifikasikan objek serta makanan secara instan. Arahkan kamera Anda 
          dan temukan informasi detail tentang dunia di sekitar Anda.
          </Text>

          <View style={styles.demoContainer}>
            <Text style={styles.demoText}>
              <Text style={{ fontWeight: "bold" }}>Made By:</Text> Agus Supriyatna (20210710150)
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 30,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
  },
  getStartedContainer: {
    marginTop: 30,
    alignItems: "center",
    marginHorizontal: 40,
  },
  codeHighlightContainer: {
    marginTop: 20,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    marginBottom: 20,
  },
  demoContainer: {
    alignItems: "flex-start",
  },
  demoText: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 100,
  },
});