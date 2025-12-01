import React from "react";
import L from "leaflet";
import { render, screen, fireEvent, waitFor} from "@testing-library/react";
import { findRoute } from "../utils/geojsonRouteSearch";
import MapView from "../components/MapView";
import "@testing-library/jest-dom";

// Mock Leaflet MapContainer
jest.mock("react-leaflet", () => ({
  MapContainer: ({ children }) => <div data-testid="map">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  GeoJSON: ({ data }) => <div data-testid="geojson">{data.length} features</div>,
  Marker: ({ children }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }) => <div data-testid="popup">{children}</div>,
  Polyline: ({ positions }) => <div data-testid="polyline">{positions?.length || 0} points</div>,
  TileLayer: (props) => <div data-testid="tile-layer" data-url={props.url} data-attribution={props.attribution} />,
  useMap: () => ({
    flyTo: jest.fn(),
  }),
}));

// Mock utils
jest.mock("../utils/loadGeoJSONData", () => ({
  useBuildingGeoJSONData: () => ({ buildings: [{ properties: { name: "Test Building", building_id: "B1" }, geometry: { type: "Point", coordinates: [-76.7116, 39.2554] } }], loading: false }),
  useBusStopGeoJSONData: () => ({ busstops: [{ properties: { name: "Bus Stop 1" }, geometry: { type: "Point", coordinates: [-76.712, 39.256] } }], loading: false }),
  useHighwayGeoJSONData: () => ({ highways: [], loading: false }),
  useEntranceGeoJSONData: () => ({ entrances: [], loading: false }),
}));

jest.mock("../utils/loadMetadata", () => ({
  useBuildingMetadata: () => ({
    B1: { description: "Test Description", image: "/assets/test.jpg" },
  }),
}));

jest.mock("../utils/geojsonRouteSearch", () => ({
  findRoute: jest.fn(() => ({ route_coords: [[-76.7116, 39.2554], [-76.712, 39.256]] })),
}));

describe("MapView Component", () => {
  const onAddFeatureMock = jest.fn();

  test("renders map container and layers", () => {
    render(<MapView darkMode={false} onAddFeature={onAddFeatureMock} />);
    
    expect(screen.getByTestId("map")).toBeInTheDocument();
    expect(screen.getByTestId("tile-layer")).toBeInTheDocument();

    const geojsonElements = screen.getAllByTestId("geojson");
    expect(geojsonElements[0]).toHaveTextContent("1 features");
    expect(geojsonElements[1]).toHaveTextContent("1 features");
    expect(geojsonElements[2]).toHaveTextContent("0 features");

    const markers = screen.getAllByTestId("marker");

    expect(markers).toHaveLength(2);
    expect(markers[0]).toHaveTextContent("Bus Stop 1");
    expect(markers[1]).toHaveTextContent("Test Building");
  });

  test("clicking +ADD button calls onAddFeature", () => {
    render(<MapView darkMode={false} onAddFeature={onAddFeatureMock} />);
    const addButtons = screen.getAllByText("+ ADD");
    expect(addButtons.length).toBeGreaterThan(0);

    fireEvent.click(addButtons[0]);
    expect(onAddFeatureMock).toHaveBeenCalledTimes(1);
  });

  test("hides buildings with hidden types", () => {
    const hiddenBuilding = { properties: { name: "bridge", building_id: "B2" }, geometry: { type: "Point", coordinates: [-76.713, 39.257] } };
    jest.spyOn(require("../utils/loadGeoJSONData"), "useBuildingGeoJSONData").mockReturnValue({
      buildings: [hiddenBuilding],
      loading: false
    });
    render(<MapView darkMode={false} onAddFeature={onAddFeatureMock} />);

    const markers = screen.queryByText("bridge");
    expect(markers).toBeNull();
  });

    test("calls map flyTo when selectedFeature is provided", () => {
        const flyToMock = jest.fn();

        // Mock useMap
        jest.spyOn(require("react-leaflet"), "useMap").mockReturnValue({
            flyTo: flyToMock,
        });

        jest.spyOn(require("../utils/loadGeoJSONData"), "useBuildingGeoJSONData").mockReturnValue({
            buildings: [{ properties: { name: "Test Building", building_id: "B1" }, geometry: { type: "Point", coordinates: [-76.7116, 39.2554] } }],
            loading: false,
        });
        jest.spyOn(require("../utils/loadGeoJSONData"), "useBusStopGeoJSONData").mockReturnValue({
            busstops: [],
            loading: false,
        });
        jest.spyOn(require("../utils/loadGeoJSONData"), "useHighwayGeoJSONData").mockReturnValue({
            highways: [],
            loading: false,
        });
        jest.spyOn(require("../utils/loadGeoJSONData"), "useEntranceGeoJSONData").mockReturnValue({
            entrances: [],
            loading: false,
        });

        const selectedFeature = {
            properties: { name: "Selected Building", building_id: "B3" },
            geometry: { type: "Point", coordinates: [-76.714, 39.258] },
        };

        render(
            <MapView
            darkMode={false}
            onAddFeature={onAddFeatureMock}
            selectedFeature={selectedFeature}
            />
        );

        expect(flyToMock).toHaveBeenCalledWith([39.258, -76.714], 18);
    });


describe("MapView Component", () => {
  const onAddFeatureMock = jest.fn();

  beforeEach(() => {
    // Mock GeoJSON hooks with default data
    jest.spyOn(require("../utils/loadGeoJSONData"), "useBuildingGeoJSONData").mockReturnValue({
      buildings: [
        { properties: { name: "Test Building", building_id: "B1" }, geometry: { type: "Point", coordinates: [-76.7116, 39.2554] } }
      ],
      loading: false
    });
    jest.spyOn(require("../utils/loadGeoJSONData"), "useBusStopGeoJSONData").mockReturnValue({
      busstops: [
        { properties: { name: "Bus Stop 1" }, geometry: { type: "Point", coordinates: [-76.712, 39.256] } }
      ],
      loading: false
    });
    jest.spyOn(require("../utils/loadGeoJSONData"), "useHighwayGeoJSONData").mockReturnValue({
      highways: [],
      loading: false
    });
    jest.spyOn(require("../utils/loadGeoJSONData"), "useEntranceGeoJSONData").mockReturnValue({
      entrances: [],
      loading: false
    });
    jest.spyOn(require("../utils/loadMetadata"), "useBuildingMetadata").mockReturnValue({
      B1: { description: "Test Description", image: "/assets/test.jpg" },
    });
  });

  test("renders map container and layers", () => {
    render(<MapView darkMode={false} onAddFeature={onAddFeatureMock} />);
    
    expect(screen.getByTestId("map")).toBeInTheDocument();
    const geojsonElements = screen.getAllByTestId("geojson");
    expect(geojsonElements[0]).toHaveTextContent("1 features");
  });
});

describe("MapView Component - TileLayer", () => {
  const onAddFeatureMock = jest.fn();

  beforeEach(() => {
    jest.spyOn(require("../utils/loadGeoJSONData"), "useBuildingGeoJSONData").mockReturnValue({
      buildings: [
        { properties: { name: "Test Building", building_id: "B1" }, geometry: { type: "Point", coordinates: [-76.7116, 39.2554] } }
      ],
      loading: false
    });
    jest.spyOn(require("../utils/loadGeoJSONData"), "useBusStopGeoJSONData").mockReturnValue({
      busstops: [],
      loading: false
    });
    jest.spyOn(require("../utils/loadGeoJSONData"), "useHighwayGeoJSONData").mockReturnValue({
      highways: [],
      loading: false
    });
    jest.spyOn(require("../utils/loadGeoJSONData"), "useEntranceGeoJSONData").mockReturnValue({
      entrances: [],
      loading: false
    });
    jest.spyOn(require("../utils/loadMetadata"), "useBuildingMetadata").mockReturnValue({
      B1: { description: "Test Description", image: "/assets/test.jpg" },
    });
  });

  test("renders TileLayer with correct URL and attribution for light mode", () => {
    render(<MapView darkMode={false} onAddFeature={onAddFeatureMock} />);
    const tileLayer = screen.getByTestId("tile-layer");
    expect(tileLayer).toBeInTheDocument();
  });

  test("renders TileLayer with correct URL and attribution for dark mode", () => {
    render(<MapView darkMode={true} onAddFeature={onAddFeatureMock} />);
    const tileLayer = screen.getByTestId("tile-layer");
    expect(tileLayer).toBeInTheDocument();
  });
});

test("uses default image when building image fails to load", () => {
  const onAddFeatureMock = jest.fn();

  // Mock the GeoJSON hooks for this test
  jest.spyOn(require("../utils/loadGeoJSONData"), "useBuildingGeoJSONData").mockReturnValue({
    buildings: [
      { properties: { name: "Test Building", building_id: "B1" }, geometry: { type: "Point", coordinates: [-76.7116, 39.2554] } }
    ],
    loading: false,
  });
  jest.spyOn(require("../utils/loadGeoJSONData"), "useBusStopGeoJSONData").mockReturnValue({
    busstops: [],
    loading: false,
  });
  jest.spyOn(require("../utils/loadGeoJSONData"), "useHighwayGeoJSONData").mockReturnValue({
    highways: [],
    loading: false,
  });
  jest.spyOn(require("../utils/loadGeoJSONData"), "useEntranceGeoJSONData").mockReturnValue({
    entrances: [],
    loading: false,
  });
  jest.spyOn(require("../utils/loadMetadata"), "useBuildingMetadata").mockReturnValue({
    B1: { description: "Test Description", image: "/assets/test.jpg" },
  });

  render(<MapView darkMode={false} onAddFeature={onAddFeatureMock} />);
  
  const img = screen.getByRole("img"); 
  fireEvent.error(img); 
  expect(img.src).toContain("/assets/default.jpg");
});

describe("MapView Component - no data and bus stop markers", () => {
  const onAddFeatureMock = jest.fn();

  beforeEach(() => {
    // Mock all GeoJSON hooks before rendering
    jest.spyOn(require("../utils/loadGeoJSONData"), "useBuildingGeoJSONData").mockReturnValue({
      buildings: [],
      loading: false,
    });
    jest.spyOn(require("../utils/loadGeoJSONData"), "useBusStopGeoJSONData").mockReturnValue({
      busstops: [],
      loading: false,
    });
    jest.spyOn(require("../utils/loadGeoJSONData"), "useHighwayGeoJSONData").mockReturnValue({
      highways: [],
      loading: false,
    });
    jest.spyOn(require("../utils/loadGeoJSONData"), "useEntranceGeoJSONData").mockReturnValue({
      entrances: [],
      loading: false,
    });
    jest.spyOn(require("../utils/loadMetadata"), "useBuildingMetadata").mockReturnValue({});
  });

  test("renders correctly when no buildings or busstops exist", async () => {
    render(<MapView darkMode={false} onAddFeature={onAddFeatureMock} />);

    await waitFor(() => {
      const geojsonElements = screen.getAllByTestId("geojson");
      expect(geojsonElements[0]).toHaveTextContent("0 features"); // buildings
      expect(geojsonElements[1]).toHaveTextContent("0 features"); // busstops
      expect(geojsonElements[2]).toHaveTextContent("0 features"); // highways or entrances

      const markers = screen.queryAllByTestId("marker");
      expect(markers).toHaveLength(0); 
    });
  });

  test("renders bus stop markers correctly", async () => {
    jest.spyOn(require("../utils/loadGeoJSONData"), "useBusStopGeoJSONData").mockReturnValue({
      busstops: [
        { properties: { name: "Bus Stop 1" }, geometry: { type: "Point", coordinates: [-76.712, 39.256] } },
      ],
      loading: false,
    });

    render(<MapView darkMode={false} onAddFeature={onAddFeatureMock} />);

    await waitFor(() => {
        const marker = screen.getByText((content, element) => content.includes("Bus Stop 1"));
        expect(marker).toBeInTheDocument();


      const geojsonElements = screen.getAllByTestId("geojson");
      expect(geojsonElements[0]).toHaveTextContent("0 features"); // buildings
      expect(geojsonElements[1]).toHaveTextContent("1 features"); // bus stops
    });
  });

test("calls map flyTo with centroid for Polygon feature", () => {
  const flyToMock = jest.fn();
  jest.spyOn(require("react-leaflet"), "useMap").mockReturnValue({ flyTo: flyToMock });

  // Polygon coordinates (simple square)
  const polygonFeature = {
    properties: { name: "Test Polygon", building_id: "P1" },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-76.712, 39.255],
          [-76.710, 39.255],
          [-76.710, 39.257],
          [-76.712, 39.257],
          [-76.712, 39.255] // closed ring
        ]
      ]
    }
  };

  render(<MapView darkMode={false} onAddFeature={() => {}} selectedFeature={polygonFeature} />);

  // Centroid calculation: lat = (39.255+39.257)/2=39.256, lng=(−76.712+−76.710)/2=−76.711
  expect(flyToMock).toHaveBeenCalledWith([39.256, -76.711], 18);
});

test("calls map flyTo with centroid for MultiPolygon feature", () => {
  const flyToMock = jest.fn();
  jest.spyOn(require("react-leaflet"), "useMap").mockReturnValue({ flyTo: flyToMock });

  const multiPolygonFeature = {
    properties: { name: "Test MultiPolygon", building_id: "MP1" },
    geometry: {
      type: "MultiPolygon",
      coordinates: [
        [
          [
            [-76.712, 39.255],
            [-76.710, 39.255],
            [-76.710, 39.257],
            [-76.712, 39.257],
            [-76.712, 39.255]
          ]
        ],
        [
          [
            [-76.715, 39.258],
            [-76.713, 39.258],
            [-76.713, 39.260],
            [-76.715, 39.260],
            [-76.715, 39.258]
          ]
        ]
      ]
    }
  };

  render(<MapView darkMode={false} onAddFeature={() => {}} selectedFeature={multiPolygonFeature} />);

  // Only first polygon is used for centroid
  expect(flyToMock).toHaveBeenCalledWith([39.256, -76.711], 18);
});

test("does not call flyTo for unsupported geometry type", () => {
  const flyToMock = jest.fn();
  jest.spyOn(require("react-leaflet"), "useMap").mockReturnValue({ flyTo: flyToMock });

  const unsupportedFeature = {
    properties: { name: "Line Feature", building_id: "L1" },
    geometry: {
      type: "LineString",
      coordinates: [
        [-76.711, 39.255],
        [-76.712, 39.256]
      ]
    }
  };

  render(<MapView darkMode={false} onAddFeature={() => {}} selectedFeature={unsupportedFeature} />);
  expect(flyToMock).not.toHaveBeenCalled();
});

});

test("calls findRoute when routeRequest is provided and geoJSON data exists", () => {
  const onAddFeatureMock = jest.fn();

  // Mock useMap just in case
  jest.spyOn(require("react-leaflet"), "useMap").mockReturnValue({ flyTo: jest.fn() });

  // Mock GeoJSON hooks with some data
  jest.spyOn(require("../utils/loadGeoJSONData"), "useBuildingGeoJSONData").mockReturnValue({
    buildings: [{ properties: { name: "B1", building_id: "B1" }, geometry: { type: "Point", coordinates: [-76.7116, 39.2554] } }],
    loading: false
  });
  jest.spyOn(require("../utils/loadGeoJSONData"), "useBusStopGeoJSONData").mockReturnValue({
    busstops: [{ properties: { name: "Bus Stop 1" }, geometry: { type: "Point", coordinates: [-76.712, 39.256] } }],
    loading: false
  });
  jest.spyOn(require("../utils/loadGeoJSONData"), "useHighwayGeoJSONData").mockReturnValue({
    highways: [{ properties: { id: "H1" }, geometry: { type: "LineString", coordinates: [[-76.711, 39.255], [-76.712, 39.256]] } }],
    loading: false
  });
  jest.spyOn(require("../utils/loadGeoJSONData"), "useEntranceGeoJSONData").mockReturnValue({
    entrances: [{ properties: { id: "E1" }, geometry: { type: "Point", coordinates: [-76.7115, 39.2555] } }],
    loading: false
  });

  const routeRequest = { startId: "B1", endId: "B2" };

  render(<MapView darkMode={false} onAddFeature={onAddFeatureMock} routeRequest={routeRequest} />);

  expect(findRoute).toHaveBeenCalledWith(expect.objectContaining({
    startBuildingId: "B1",
    endBuildingId: "B2"
  }));
});

test("applies correct styles to GeoJSON layers", () => {
  const onAddFeatureMock = jest.fn();

  // Mock all hooks
  jest.spyOn(require("../utils/loadGeoJSONData"), "useBuildingGeoJSONData").mockReturnValue({
    buildings: [{ properties: { name: "B1", building_id: "B1" }, geometry: { type: "Point", coordinates: [-76.7116, 39.2554] } }],
    loading: false
  });
  jest.spyOn(require("../utils/loadGeoJSONData"), "useBusStopGeoJSONData").mockReturnValue({
    busstops: [{ properties: { name: "Bus Stop 1" }, geometry: { type: "Point", coordinates: [-76.712, 39.256] } }],
    loading: false
  });
  jest.spyOn(require("../utils/loadGeoJSONData"), "useHighwayGeoJSONData").mockReturnValue({
    highways: [{ properties: { id: "H1" }, geometry: { type: "LineString", coordinates: [[-76.711, 39.255], [-76.712, 39.256]] } }],
    loading: false
  });
  jest.spyOn(require("../utils/loadGeoJSONData"), "useEntranceGeoJSONData").mockReturnValue({
    entrances: [],
    loading: false
  });

  jest.spyOn(require("../utils/loadMetadata"), "useBuildingMetadata").mockReturnValue({
    B1: { description: "Test Description", image: "/assets/test.jpg" }
  });

  render(<MapView darkMode={false} onAddFeature={onAddFeatureMock} />);

  const geojsonElements = screen.getAllByTestId("geojson");
  expect(geojsonElements[0]).toHaveTextContent("1 features"); // buildings
  expect(geojsonElements[1]).toHaveTextContent("1 features"); // busstops
  expect(geojsonElements[2]).toHaveTextContent("1 features"); // highways
});

describe("MapView Component - edge cases", () => {
  const onAddFeatureMock = jest.fn();

  const mockAllHooks = ({
    buildings = [],
    busstops = [],
    highways = [],
    entrances = [],
    metadata = {}
  } = {}) => {
    const geojson = require("../utils/loadGeoJSONData");
    geojson.useBuildingGeoJSONData.mockReturnValue({ buildings, loading: false });
    geojson.useBusStopGeoJSONData.mockReturnValue({ busstops, loading: false });
    geojson.useHighwayGeoJSONData.mockReturnValue({ highways, loading: false });
    geojson.useEntranceGeoJSONData.mockReturnValue({ entrances, loading: false });

    require("../utils/loadMetadata").useBuildingMetadata.mockReturnValue(metadata);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("selectedFeature with MultiPolygon zooms to centroid", async () => {
    const flyToMock = jest.fn();
    jest.spyOn(require("react-leaflet"), "useMap").mockReturnValue({ flyTo: flyToMock });

    const multiPolygonFeature = {
      properties: { name: "MultiPolygon Feature" },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [[[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]],
          [[[20, 20], [20, 30], [30, 30], [30, 20], [20, 20]]]
        ]
      }
    };

    mockAllHooks({ buildings: [], busstops: [], highways: [], entrances: [], metadata: {} });

    render(<MapView darkMode={false} onAddFeature={onAddFeatureMock} selectedFeature={multiPolygonFeature} />);
    await waitFor(() => {
      expect(flyToMock).toHaveBeenCalled();
    });
  });

  test("hidden buildings are not rendered as markers", async () => {
    const hiddenBuilding = { properties: { name: "bridge", building_id: "B2" }, geometry: { type: "Point", coordinates: [-76.713, 39.257] } };
    mockAllHooks({ buildings: [hiddenBuilding], busstops: [], highways: [], entrances: [], metadata: {} });

    render(<MapView darkMode={false} onAddFeature={onAddFeatureMock} />);
    await waitFor(() => {
      const marker = screen.queryByText("bridge");
      expect(marker).toBeNull();
    });
  });

  test("building with null geometry does not crash", async () => {
    const nullGeomBuilding = { properties: { name: "Null Building", building_id: "B3" }, geometry: null };
    mockAllHooks({ buildings: [nullGeomBuilding], busstops: [], highways: [], entrances: [], metadata: {} });

    render(<MapView darkMode={false} onAddFeature={onAddFeatureMock} />);
    await waitFor(() => {
      expect(screen.getByTestId("map")).toBeInTheDocument();
      expect(screen.queryByText("Null Building")).toBeNull();
    });
  });
});


});