/**
 *  React component for Route Planner Search bar
 *  Utilizing: styled-components for CSS, heroicons for icon svgs
 */


import React from 'react';
import styled from 'styled-components';
import {MagnifyingGlassIcon} from '@heroicons/react/24/solid';

// Styled components
const Form = styled.form`
  display: flex;
  align-items: center;
  background-color: #3b3b3bff;
  border: 1px solid #3a3a3aff;
  border-radius: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 0.5rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: none;
  outline: none;
  background-color: #3b3b3bff;
  color: white;
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
    background-color: #ecf01cff; 
  }
`;

export default function RouteSearchBar() {
  return (
    <Form>
      <Input type="text" placeholder="Search on campus..." />
      <Button type="submit">
        <MagnifyingGlassIcon style={{width: '20px', height: '20px'}} />
      </Button>
    </Form>
  );
}