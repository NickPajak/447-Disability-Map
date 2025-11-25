import React from "react";
import {render, screen, fireEvent} from "@testing-library/react";
import DestinationCard from "../components/DestinationCard";
import * as loadMetadata from "../utils/loadMetadata";
import { useBuildingMetadata } from "../utils/loadMetadata";

import "@testing-library/jest-dom";

// Correctly mock the hook
jest.mock("../utils/loadMetadata", () => ({
  useBuildingMetadata: jest.fn(),
}));

describe("DestinationCard", () => {
  const buildingAdmin = {
    properties: {
      name: "Admin Building",
      building_id: "A01",
    },
  };

  const buildingArt = {
    properties: {
      name: "Art Building",
      building_id: "B02",
    },
  };

  beforeEach(() => {
    // Provide mock metadata before each test
    loadMetadata.useBuildingMetadata.mockReturnValue({
      A01: { acronym: "ADM" },
      B02: { acronym: "ART" },
    });
  });

  test("renders correctly with building info", () => {
    render(<DestinationCard label="Start" building={buildingAdmin} />);

    expect(screen.getByText("Admin Building")).toBeInTheDocument();
    expect(screen.getByText("ADM")).toBeInTheDocument();
    expect(screen.getByAltText("Admin Building")).toHaveAttribute("src", "/assets/A01.jpg");
    expect(screen.getByRole("button", { name: "View Floorplan" })).toBeInTheDocument();
  });

  test("renders default image if building image fails", () => {
    render(<DestinationCard label="Start" building={buildingAdmin} />);
    const img = screen.getByAltText("Admin Building");

    fireEvent.error(img);
    expect(img).toHaveAttribute("src", "/assets/default.jpg");
  });

  test("Renders correct acronym for a different building", () => {
    render(<DestinationCard label="End" building={buildingArt} />);

    expect(screen.getByText("Art Building")).toBeInTheDocument();
    expect(screen.getByText("ART")).toBeInTheDocument();
    expect(screen.getByAltText("Art Building")).toHaveAttribute("src", "/assets/B02.jpg");
  });

  test("Renders default image if building image fails", () => {
    render(<DestinationCard label="Start" building={buildingAdmin} />);
    const img = screen.getByAltText("Admin Building");

    fireEvent.error(img);
    expect(img).toHaveAttribute("src", "/assets/default.jpg");
  });

  test("Floorplan button is clickable", () => {
    render(<DestinationCard label="Start" building={buildingAdmin} />);
    const button = screen.getByRole("button", {name: "View Floorplan" });
    fireEvent.click(button);
    expect(button).toBeEnabled();
  });

  test("Renders nothing if no building is provided", () => {
    const { container } = render(<DestinationCard label="Start"/>);
    expect(container.firstChild).toBeNull();
  });

    test("renders default info if metadata[id] is undefined", () => {
        const building = { properties: { building_id: "X99", name: "Unknown Building" } };
        useBuildingMetadata.mockReturnValue({}); 

        render(<DestinationCard building={building} label="Start" />);

        expect(screen.getByText("Unknown Building")).toBeInTheDocument();

        const img = screen.getByAltText("Unknown Building");
        expect(img).toHaveAttribute("src", "/assets/X99.jpg");
    });

})