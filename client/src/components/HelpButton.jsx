/**
 *  React component for Route Planner Help Menu
 *  Utilizing: styled-components for CSS, heroicons for icon svgs
 */

import React from 'react';
import styled from 'styled-components';
import { useState, useEffect } from "react";
import { QuestionMarkCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";

// Styled components
const HelpButtonStyled = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 1000;
  &:hover {
    background-color: #0056b3;
  }
`;  
const HelpMenu = styled.div`
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 300px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 16px;
  z-index: 1000;
`;  
const MenuItem = styled.a`
  display: block;
  padding: 8px 0;
  color: #007bff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
const CloseButton = styled.button`
  position: absolute; 
  top: 14px;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
`;



export default function HelpButton() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const toggleHelpMenu = () => {
    setIsHelpOpen(!isHelpOpen);
  };  


  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const toggleLargeFont = () => {
    document.body.classList.toggle('large-font');
  }

  const toggleHighContrast = () => {
    document.body.classList.toggle('high-contrast');
  }

  return (
    <>
      <HelpButtonStyled onClick={toggleHelpMenu} aria-label="Help"> 
        <QuestionMarkCircleIcon style={{ width: "30px", height: "30px", color: "white" }} />
      </HelpButtonStyled>


      {isHelpOpen && (
        <HelpMenu>
          <CloseButton onClick={toggleHelpMenu} aria-label="Close Help Menu">
            <XMarkIcon style={{ width: "20px", height: "20px", color: "black" }} />
          </CloseButton>
            <h3>Help Menu</h3>
          <p>Welcome to the Accessibility Navigation App! Here are some tips to get you started:</p>
          <ul>
            <li>Use the search bar to find buildings on campus. </li>
            <li>Click on map markers to get more information about the building or accessibility features.</li>
            <li>Add your start point and end point.</li>
          </ul>
          
          <MenuItem href="https://docs.google.com/forms/d/e/1FAIpQLSca2b-Pyax_RaqCjMdrx3-Bn3i9LNMI-b5K9eQke1OA5D9lSg/viewform?usp=header" target="_blank" rel="noopener noreferrer">
            Submit Feedback
          </MenuItem>

          <MenuItem  onClick={() => {document.body.classList.toggle('dark-mode');}}>
            Light/Dark Mode
          </MenuItem>

            <MenuItem  onClick={() => {document.body.classList.toggle('large-font');}}> 
            Toggle Large Font
            </MenuItem>
            <MenuItem  onClick={() => {document.body.classList.toggle('high-contrast');}}>
            Toggle High Contrast
            </MenuItem>
            
         
        </HelpMenu>
      )}
    </>
  );
}