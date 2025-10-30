/**
 *  React component for Route Planner Search bar
 *  Utilizing: styled-components for CSS, heroicons for icon svgs
 */

import React from 'react';
import styled from 'styled-components';
import {MagnifyingGlassIcon} from '@heroicons/react/24/solid';
import { useState } from "react";
import {useBuildingGeoJSONData, useBusStopGeoJSONData} from '../utils/loadGeoJSONData';
import { useBuildingMetadata } from '../utils/loadMetadata';

// Styled components
const Form = styled.form`
  display: flex;
  align-items: center;
  border-radius: 1.5rem;
  box-shadow: 0 2px 3px rgba(0,0,0,0.1);
  position: relative;
  width: 350px;
  box-shadow: 0 2px 3px rgba(0,0,0,0.1);
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: none;
  outline: none;
  background-color: #c7c8ca;
  color: black;
`;

const Button = styled.button`
  margin-left: 0.5rem;
  background-color: #e4e4e4ff; 
  color: black;
  padding: 0.5rem 1rem;
  border-radius: 1.375rem;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #fdb515; 
  }
`;
const SuggestionBox = styled.ul`
  position: absolute;
  top: 60%;
  left: 0;
  width: 99.5%;
  background: #c7c8ca;
  border-radius: 0 0 1rem 1rem;
  border: 1px solid #c7c8ca;
  margin-top: 0.3 rem;
  list-style: none;
  padding: 0;
  z-index: 10;
`;

const SuggestionItem = styled.li`
  // TODO: Add more accessibility information to each item
  padding: 0.5rem 1rem;
  color: #000000ff;
  cursor: pointer;

  &:hover {
    background-color: #e4e3e3b0;
    border-radius: 1rem 1rem 1rem 1rem;
  }
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  background-color: #c7c8ca;
  border: 1px solid #bebdbdff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  width: 100%;
  border-radius: ${(props) => (props.hasSuggestions ? '1.5rem 1.5rem 0 0': '1.5rem')};
  transition: border-radius 0.15s ease;
`;

export default function RouteSearchBar({ onSelectBuilding, placeholder}) {
  const metadata = useBuildingMetadata();

  const {buildings, loading: building_loading} = useBuildingGeoJSONData();
  const {busstops, loading: bus_loading} = useBusStopGeoJSONData();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  if (building_loading || bus_loading || Object.keys(metadata).length === 0) {
  return <p>Loading building data...</p>;
  }

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if(!value) {
      setSuggestions([]);
      return;
    }

    const allFeatures = [
      ...buildings.map((b) => ({ ...b, source: "building"})),
      ...busstops.map((b) => ({ ...b, source: "busstop"})),
    ];

    const filtered = allFeatures.filter((f) => {
      const name = f.properties.name?.trim().toLowerCase() || "";
      const building_id = f.properties.building_id;
      const acronym = metadata[building_id]?.acronym?.toLowerCase() || "";
      if(!name) return false;
      return name.startsWith(value.toLowerCase()) || acronym.startsWith(value);
    }).sort((a, b) => a.properties.name.localeCompare(b.properties.name)); // TODO: Fuzzy match 
    setSuggestions(filtered.slice(0,5));
  };

  const handleSelect = (feature) => {
    setQuery(feature.properties.name);
    setSuggestions([]);
    if (onSelectBuilding) onSelectBuilding(feature);
    // TODO: handle map zoom 
  };

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <InputRow hasSuggestions={suggestions.length > 0}>
        <Input type="text" placeholder={placeholder || "Search on campus..."} value={query} onChange={handleChange}/>
        <Button type="submit">
          <MagnifyingGlassIcon style={{width: '20px', height: '20px'}} />
        </Button>
      </InputRow>

      {suggestions.length > 0 && (
        <SuggestionBox>
          {suggestions.map((s, i) => {
            const acronym = metadata[s.properties.building_id]?.acronym;
            return(
            <SuggestionItem key={i} onClick={() => handleSelect(s)}>
              {s.properties.name}
              {acronym && (
                <span style={{ color: "black", marginLeft: "8px"}}>
                  ({acronym})
                </span>
              )}
            </SuggestionItem>
            );
          })}
        </SuggestionBox>
      )}
    </Form>
  );
}