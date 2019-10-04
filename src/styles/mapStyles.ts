const mapStyles = [
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#e6e6e6"
      }
    ]
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [
      {
        visibility: "on"
      },
      {
        color: "#193341"
      },
      {
        weight: 0.2
      },
      {
        gamma: 0.84
      }
    ]
  },
  {
    featureType: "all",
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "all",
    stylers: [
      {
        saturation: 0
      },
      {
        hue: "#003569"
      }
    ]
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      {
        color: "#1a3541"
      }
    ]
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [
      {
        color: "#212121"
      }
    ]
  },

  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#193341"
      }
    ]
  },
  {
    featureType: "road",
    stylers: [
      {
        saturation: -70
      },
      { lightness: -70 }
    ]
  },
  {
    featureType: "road",
    elementType: "labels.text",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "transit",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "poi",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#193341"
      }
    ]
  }
];

export default mapStyles;
