import React, { Component } from "react";
import { StyleSheet, Dimensions, StatusBar, Text } from "react-native";
import styled from "styled-components";

import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps"; // remove PROVIDER_GOOGLE import if not using Google Maps
import Geocoder from "react-native-geocoder";
import { googleApiKey } from "./apiKey";
import PriceMarker from "./components/PriceMarker";

import { request_location_runtime_permission } from "./components/PermissionCheck";

Geocoder.fallbackToGoogle(googleApiKey);

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

function log(eventName, e) {
  //console.log(eventName, e.nativeEvent);
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

    this.state = {
      region: {
        latitude: LATITUDE - SPACE,
        longitude: LONGITUDE - SPACE
      },
      addr: ""
    };
  }

  async componentDidMount() {
    const locationGranted = await request_location_runtime_permission();
    if (locationGranted) {
      this._getGeolocation();
    }
  }

  // 위치정보
  _getGeolocation = e => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          addr: ""
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
        //console.log(res);
        this.setState({ addr: res[0].formattedAddress });
      })
      .catch(err => console.log(err));

    // let ret = await Geocoder.geocodePosition(NY)
    // console.log(ret);
  };

  _dragEnd = e => {
    this.setState({
      region: {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude
      },
      addr: ""
    });
    this._getAddr();
  };

  render() {
    return (
      <Container>
        <StatusBar barStyle={"light-content"} />
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ ...StyleSheet.absoluteFillObject }}
          initialRegion={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }}
          region={{
            latitude: this.state.region.latitude,
            longitude: this.state.region.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }}
        >
          <Marker
            coordinate={this.state.region}
            onSelect={e => log("onSelect", e)}
            onDrag={e => log("onDrag", e)}
            onDragStart={e => log("onDragStart", e)}
            onDragEnd={e => this._dragEnd(e)}
            onPress={e => log("onPress", e)}
            draggable
            title={this.state.addr}
            description={this.state.addr}
          >
            {/* <PriceMarker amount={this.state.addr} /> */}
          </Marker>
        </MapView>
        <Title>
          <Ctext>{this.state.addr}</Ctext>
        </Title>
      </Container>
    );
  }
}
