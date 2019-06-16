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
  constructor(props) {
    super(props);
  }

  state = {
    region: {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    },
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
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }
        });

        this._getAddr();
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

  _getAddr = () => {
    var NY = {
      lat: this.state.region.latitude,
      lng: this.state.region.longitude
    };

    Geocoder.geocodePosition(NY)
      .then(res => {
        // res is an Array of geocoding object (see below)
        console.log(res);
        this.setState({ addr: res[0].formattedAddress });
      })
      .catch(err => console.log(err));

    // let ret = await Geocoder.geocodePosition(NY)
    // console.log(ret);
  };

  onRegionChangeComplete(region) {
    console.log(region);
    this.setState({ region });
    //console.log(this.state);
    this._getAddr();
  }

  render() {
    const { addr } = this.state;

    if (!this.state.region) {
      return <View />;
    } else {
      return (
        <Container>
          <StatusBar barStyle={"light-content"} />
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={{ ...StyleSheet.absoluteFillObject }}
            region={this.state.region}
            onRegionChangeComplete={this.onRegionChangeComplete.bind(this)}
          >
            <Marker
              coordinate={{
                latitude: this.state.region.latitude,
                longitude: this.state.region.longitude
              }}
              title={this.state.addr}
              description={this.state.addr}
            />
          </MapView>
          <Title>
            <Ctext>{addr}</Ctext>
          </Title>
        </Container>
      );
    }
  }
}
