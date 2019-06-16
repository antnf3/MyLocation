import React, { Component } from "react";
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  Text,
  Alert,
  StatusBar
} from "react-native";
import styled from "styled-components";

import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps"; // remove PROVIDER_GOOGLE import if not using Google Maps
import Geocoder from "react-native-geocoder";
import { googleApiKey } from "./apiKey";

Geocoder.fallbackToGoogle(googleApiKey);

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
      //Alert.alert("Location Permission Not Granted");
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Title = styled.View`
  position: absolute;
  height: 50px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: gray;
  opacity: 0.8;
  align-items: center;
  justify-content: center;
`;

const Ctext = styled.Text`
  font-size: 16px;
  color: #000;
`;
export default class App extends Component {
  state = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    addr: ""
  };
  async componentDidMount() {
    const locationGranted = await request_location_runtime_permission();
    if (locationGranted) {
      this._getGeolocation();
    }
  }
  // 위치정보
  _getGeolocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log(position.coords.latitude, position.coords.longitude);
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });

        // Position Geocoding
        var NY = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        //language=ko
        Geocoder.geocodePosition(NY)
          .then(res => {
            // res is an Array of geocoding object (see below)
            console.log(res);
            this.setState({ addr: res[0].formattedAddress });
          })
          .catch(err => console.log(err));

        // let ret = await Geocoder.geocodePosition(NY)
        // console.log(ret);
      },
      error => {
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  render() {
    const { latitude, longitude, addr } = this.state;
    if (latitude && longitude) {
      return (
        <Container>
          <StatusBar barStyle={"light-content"} />
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={{ ...StyleSheet.absoluteFillObject }}
            region={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121
            }}
            onRegionChange={this.onRegionChange}
          >
            <Marker
              coordinate={{ latitude: latitude, longitude: longitude }}
              title={addr}
              description="비고"
            />
          </MapView>
          <Title>
            <Ctext>{addr}</Ctext>
          </Title>
        </Container>
      );
    } else {
      return <View />;
    }
  }
}
