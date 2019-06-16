import React from "react";
import { PermissionsAndroid, Alert } from "react-native";

export async function request_location_runtime_permission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "ReactNativeCode Location Permission 위치권한",
        message:
          "ReactNativeCode App needs access to your location 이 기기의 위치치정보에대한 엑세스가 필요합니다"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //Alert.alert("Location Permission Granted.");
      return true;
    } else {
      Alert.alert("Location Permission Not Granted");
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}
