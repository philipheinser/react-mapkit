import React, { Component, Fragment } from 'react';

export const MapEvents = [
  // Map Display Events
  'region-change-start',
  'region-change-end',
  'scroll-start',
  'scroll-end',
  'zoom-start',
  'zoom-end',
  'map-type-change',
  // Annotation and Overlay Events
  'select',
  'deselect',
  'drag-start',
  'dragging',
  'drag-end',
  // User Location Events
  'user-location-change',
  'user-location-error',
];

export const MapEventProps = MapEvents.reduce((result, current) => {
  result[current] =
    'on' +
    current[0].toUpperCase() +
    current
      .replace(/-[a-z]/g, match => match.substring(1).toUpperCase())
      .substring(1);
  return result;
}, {});

class Map extends Component {
  static defaultProps = {
    mapType: 'standard',
    showsScale: 'adaptive',
    showsCompass: 'adaptive',
    center: {
      latitude: 37.33182,
      longitude: -122.03118,
    },
    span: {
      latitude: 0.016,
      longitude: 0.016,
    },
    isZoomEnabled: true,
    isScrollEnabled: true,
    isRotationEnabled: true,
    style: {
      width: '100%',
      height: '400px',
    },
  };

  componentDidMount() {
    this.map = new window.mapkit.Map(this.mapContainer, {
      region: new window.mapkit.CoordinateRegion(
        new window.mapkit.Coordinate(
          this.props.center.latitude,
          this.props.center.longitude
        ),
        new window.mapkit.CoordinateSpan(
          this.props.span.latitude,
          this.props.span.longitude
        )
      ),
      mapType: this.props.mapType,
      tintColor: this.props.tintColor,
      showsZoomControl: this.props.showsZoomControl,
      showsScale: this.props.showsScale,
      showsCompass: this.props.showsCompass,
      showsUserLocationControl: this.props.showsUserLocationControl,
      isZoomEnabled: this.props.isZoomEnabled,
      isRotationEnabled: this.props.isRotationEnabled,
      isScrollEnabled: this.props.isScrollEnabled,
    });
    MapEvents.forEach(event => {
      this.map.addEventListener(event, this.handleMapEvent);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    this.map.mapType = this.props.mapType;
    this.map.tintColor = this.props.tintColor;
    this.map.showsZoomControl = this.props.showsZoomControl;
    this.map.showsScale = this.props.showsScale;
    this.map.showsCompass = this.props.showsCompass;
    this.map.showsUserLocationControl = this.props.showsUserLocationControl;
    this.map.isZoomEnabled = this.props.isZoomEnabled;
    this.map.isRotationEnabled = this.props.isRotationEnabled;
    this.map.isScrollEnabled = this.props.isScrollEnabled;
  }

  componentWillUnmount() {
    MapEvents.forEach(event => {
      this.map.removeEventListener(event, this.handleMapEvent);
    });
    this.map.destroy();
  }

  handleMapEvent = event => {
    const eventPropName = MapEventProps[event.type];
    if (this.props[eventPropName]) this.props[eventPropName](event);
  };

  render() {
    return (
      <div ref={ref => (this.mapContainer = ref)} style={this.props.style} />
    );
  }
}

export class Wrapper extends Component {
  state = {
    loadet: false,
  };
  componentDidMount() {
    if (!window.mapkit) {
      let script = document.createElement('script');
      script.onload = this.initMap;
      script.async = true;
      script.src = 'https://cdn.apple-mapkit.com/mk/5.0.x/mapkit.js';
      document.body.appendChild(script);
    } else {
      this.initMap();
    }
  }

  initMap = () => {
    window.mapkit.init({
      authorizationCallback: this.props.authorizationCallback,
      language: this.props.language,
    });
    this.setState({ loadet: true });
  };

  render() {
    if (!this.state.loadet) return null;

    return <Fragment>{this.props.children}</Fragment>;
  }
}

export default Map;
