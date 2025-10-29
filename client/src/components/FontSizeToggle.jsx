import React from 'react';
import styled from 'styled-components';
import { useState, useEffect } from "react";

// Simple top-right controls with +/- buttons
const ToggleContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
`;

const ToggleButton = styled.button`
    border: none;
    border-radius: 30px;
    background-color: #cececeff;
    color: white;
    cursor: pointer;
    font-size: 16px;
    padding: 6px 12px;

    &:hover {
        background-color: #0056b3;
    }
`;

export default function FontSizeToggle({}) {
    const [fontSize, setFontSize] = useState(16);
    
    useEffect(() => {
        document.body.style.fontSize = `${fontSize}px`;
    }, [fontSize]);

    const increaseFontSize = () => {
        setFontSize(prevSize => prevSize + 2);
    };

    const decreaseFrontSize = () => {
        setFontSize(prevSize => prevSize -2);
    };

    return (

        <ToggleContainer>
            <ToggleButton onClick={decreaseFrontSize}>-</ToggleButton>
            <p>{fontSize}</p>
            <ToggleButton onClick={increaseFontSize}>+</ToggleButton>
        </ToggleContainer>
    );
    
}
