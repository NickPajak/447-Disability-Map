

import React from "react";
import styled from "styled-components";

const FontSizeToggleStyled = styled.button`
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    color: white;
    padding: 10px 15px;
    cursor: pointer;
    z-index: 1000;

    &:hover {
        background-color: #0056b3;
    }
`;

export default function FontSizeToggle({ toggleFontSize }) {
    const [fontSize, setFontSize] = React.useState("medium");

    const sizeMap = {
        small: "12px",
        medium: "16px",
        large: "20px",
    };

    const applySize = (size) => {
        document.body.style.fontSize = sizeMap[size] || sizeMap.medium;
    };

    const increaseFontSize = () => {
        setFontSize((prev) => {
            const order = ["small", "medium", "large"];
            const idx = Math.min(order.indexOf(prev) + 1, order.length - 1);
            const newSize = order[idx];
            applySize(newSize);
            return newSize;
        });
    };

    const decreaseFontSize = () => {
        setFontSize((prev) => {
            const order = ["small", "medium", "large"];
            const idx = Math.max(order.indexOf(prev) - 1, 0);
            const newSize = order[idx];
            applySize(newSize);
            return newSize;
        });
    };

    return (
        <>
            <FontSizeToggleStyled onClick={decreaseFontSize} style={{ top: 20, right: 60 }}>
                -
            </FontSizeToggleStyled>
            <FontSizeToggleStyled onClick={increaseFontSize} style={{ top: 20, right: 20 }}>
                +
            </FontSizeToggleStyled>
        </>
    );
}