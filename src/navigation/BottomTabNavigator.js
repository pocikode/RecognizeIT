import { Entypo, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import {View, TextField, Text, Button, Colors} from 'react-native-ui-lib';

import Colors from "../constants/colors";
// import { Colors } from "react-native-ui-lib";
// import View from 'react-native-ui-lib/view';
// import Text from 'react-native-ui-lib/text';
// import {KeyboardTrackingView, KeyboardAwareInsetsView, KeyboardRegistry, KeyboardAccessoryView, KeyboardUtils} from 'react-native-ui-lib/keyboard';

import useColorScheme from "../hooks/useColorScheme";
import HomeScreen from "../screens/HomeScreen";
import ClassifyImageScreen from "../screens/ClassifyImageScreen";
import DetectObjectScreen from "../screens/DetectObjectScreen";
import DetectFoodScreen from "../screens/DetectFoodScreen";

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        // headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarStyle: [
          {
            display: "flex",
          },
          null,
        ],
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        screenOptions={{ headerShown: false }}
        options={{
          tabBarIcon: ({ color }) => (
            <Entypo name="home" size={25} color={color} style={{ marginBottom: -3 }} />
          ),
          tabBarLabel: "Home",
        }}
      />
      <BottomTab.Screen
        name="ClassifyImage"
        component={ClassifyImageScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Entypo name="flow-branch" size={25} color={color} style={{ marginBottom: -3 }} />
          ),
          tabBarLabel: "Classify Image",
        }}
      />
      <BottomTab.Screen
        name="DetectObjects"
        component={DetectObjectScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Entypo name="crop" size={25} color={color} style={{ marginBottom: -3 }} />
          ),
          tabBarLabel: "Detect Objects",
        }}
      />
      <BottomTab.Screen
        name="DetectFoods"
        component={DetectFoodScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="fast-food" size={25} color={color} style={{ marginBottom: -3 }} />
          ),
          tabBarLabel: "Detect Foods",
        }}
      />
    </BottomTab.Navigator>
  );
}
