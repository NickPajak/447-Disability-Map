import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RouteSearchBar from "../components/RouteSearchBar";
import { useBuildingGeoJSONData, useBusStopGeoJSONData } from "../utils/loadGeoJSONData";
import { useBuildingMetadata } from "../utils/loadMetadata";

// Mock util functions
jest.mock("../utils/loadGeoJSONData", () => ({
    useBuildingGeoJSONData: jest.fn(),
    useBusStopGeoJSONData: jest.fn(),
}));

jest.mock("../utils/loadMetadata", () => ({
    useBuildingMetadata: jest.fn(),
}));

beforeEach(() => {
  useBuildingGeoJSONData.mockReturnValue({
    buildings: [
      { properties: { name: "Admin Building", building_id: "A01" }},
      { properties: { name: "Art Center", building_id: "A02" }},
    ],
    loading: false,
  });

  useBusStopGeoJSONData.mockReturnValue({
    busstops: [
      { properties: { name: "Central Bus Stop", building_id: "B01" }},
    ],
    loading: false,
  });

  useBuildingMetadata.mockReturnValue({
    A01: { acronym: "ADM" },
    A02: { acronym: "ART" },
    B01: { acronym: "CBS" },
  });
});

// Test loading state
test("Shows loading message when data is loading", () => {
    useBuildingGeoJSONData.mockReturnValueOnce({ buildings: [], loading: true});
    useBusStopGeoJSONData.mockReturnValueOnce({ buildings: [], loading: true});
    useBuildingMetadata.mockReturnValueOnce({});

    render(<RouteSearchBar />);

    expect(screen.getByText("Loading building data...")).toBeInTheDocument();
});

// Test typing and suggestion filtering
test("Shows suggestions as the user types", async () => {
    render(<RouteSearchBar />);

    const input = screen.getByPlaceholderText("Search on campus...");
    await userEvent.type(input, "A");

    expect(screen.getByText("Admin Building")).toBeInTheDocument();
    expect(screen.getByText("Art Center")).toBeInTheDocument();
});

// Test selecting a suggestion triggers callback
test("Selecting a suggestion calls onSelectBuilding", async()=> {
    const mockSelect = jest.fn();
    render(<RouteSearchBar onSelectBuilding={mockSelect}/>);

    const input = screen.getByPlaceholderText("Search on campus...");
    await userEvent.type(input, "Adm");

    await userEvent.click(screen.getByText("Admin Building"));

    expect(mockSelect).toHaveBeenCalledTimes(1);
    expect(mockSelect).toHaveBeenCalledWith(
        expect.objectContaining({
            properties: expect.objectContaining({
                name: "Admin Building",
                building_id: "A01",
            }),
        })
    );
});

// Test that suggestions disappear after click
test("Suggestions clear after selecting", async ()=> {
    render(<RouteSearchBar />);

    const input = screen.getByPlaceholderText("Search on campus...");
    await userEvent.type(input, "Art");

    await userEvent.click(screen.getByText("Art Center"));

    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
})