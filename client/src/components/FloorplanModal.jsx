import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const Marker = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: red;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  position: relative;
  background-color: ${props => props.theme.cardBg};
  padding: 20px;
  border-radius: 0.75rem;
  max-width: 800px;
  width: 90%;
  max-height: 90%;
`;

const FloorplanImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: #eee;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
`;

export default function FloorplanModal({ building, userLocation, onClose }) {
  const [currentFloor, setCurrentFloor] = React.useState(0);
  const transformRef = useRef(null);

  const numLevels = parseInt(building.properties["building:levels"], 10) || 1;
  const floors = Array.from({ length: numLevels }, (_, i) => i);

    useEffect(() => {
  const wrapper = transformRef.current;
  if (!wrapper) return;

  const container = wrapper.wrapperComponent; // this one exists
  const containerWidth = container?.clientWidth || 800;
  const containerHeight = container?.clientHeight || 600;

  wrapper.setTransform(0, 0, 1);
}, [currentFloor]);




  if (!building) return null;
  const id = building.properties.building_id;
  const numericId = id.replace("bldg_", "");
  const floorplanSrc = `/assets/floorplans/${numericId}_F${currentFloor}.png`;

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>Close</CloseButton>

        {/* Floor buttons */}
        <div style={{ marginBottom: "10px" }}>
          {floors.map(f => (
            <button
              key={f}
              onClick={() => setCurrentFloor(f)}
              style={{
                marginRight: "5px",
                padding: "5px 10px",
                fontWeight: f === currentFloor ? "bold" : "normal",
                backgroundColor: f === currentFloor ? "#ddd" : "#fff"
              }}
            >
              Floor {f}
            </button>
          ))}
        </div>

        {/* Zoomable floorplan */}
        <div style={{ position: "relative", width: "100%", height: "600px" }}>
          <TransformWrapper
            defaultScale={1}
            wheel={{ step: 0.1 }}
            doubleClick={{ disabled: true }}
            ref={transformRef}
          >
            <TransformComponent>
              <FloorplanImage
                key={currentFloor}
                src={floorplanSrc}
                alt={`${building.properties.name} Floorplan`}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `/assets/floorplans/default.png`;
                }}
              />

              {/* User marker */}
              {userLocation && (
                <Marker
                  style={{
                    left: `${userLocation.x * 100}%`,
                    top: `${userLocation.y * 100}%`
                  }}
                />
              )}
            </TransformComponent>
          </TransformWrapper>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
}
