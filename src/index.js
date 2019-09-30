import React from "react";
import ReactDOM from "react-dom";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Polyline
} from "react-google-maps";
import axios from "axios";

const MyMapComponent = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap defaultZoom={8} defaultCenter={props.pathCoordinates[0]}>
    {props.isMarkerShown && (
      <>
        <Marker position={props.pathCoordinates[0]} />
        <Polyline
          path={props.pathCoordinates}
          geodesic={true}
          options={{
            strokeColor: "#ff2527",
            strokeOpacity: 0.75,
            strokeWeight: 2,
            icons: [
              {
                offset: "0",
                repeat: "20px"
              }
            ]
          }}
        />
        <Marker position={props.pathCoordinates[1]} />
      </>
    )}
  </GoogleMap>
));

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: "New York City, New York",
      stop: "Los Angeles, California",
      pathCoordinates: [
        { lat: 40.7127753, lng: -74.0059728 },
        { lat: 34.0522342, lng: -118.2436849 }
      ]
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    var start;
    var destination;
    var coordinates = [];
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${this.state.start}&key=${process.env.GOOGLE_MAPS}`
      )
      .then(function(response) {
        // handle success
        start = response.data["results"][0].geometry.location;
        coordinates.push(start);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${this.state.stop}&key=${process.env.GOOGLE_MAPS}`
      )
      .then(function(response) {
        // handle success
        destination = response.data["results"][0].geometry.location;
        coordinates.push(destination);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
    console.log("coordinates", coordinates);
    this.setState({
      pathCoordinates: coordinates
    });
    console.log("state", this.state.pathCoordinates);
  }

  render() {
    return (
      <div>
        <h1>Maps</h1>
        <MyMapComponent
          isMarkerShown
          pathCoordinates={this.state.pathCoordinates}
        />
        <form onSubmit={this.handleSubmit}>
          <label>
            Start:
            <input
              name="start"
              type="text"
              value={this.state.start}
              onChange={this.handleInputChange}
            />
          </label>
          <label>
            Stop:
            <input
              name="stop"
              type="text"
              value={this.state.stop}
              onChange={this.handleInputChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <h4>{this.state.start}</h4>
        <h4>{this.state.stop}</h4>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
