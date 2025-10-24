import RouteSearchBar from "../components/RouteSearchBar";
import MapView from "../components/MapView";
import styled from "styled-components";

const PageContainer = styled.div`
    display: flex;
    justify-content: flex-start;  /* Align left */
    align-items: flex-start;      /* Align top */
    height: 100vh;
`;

// Wrapper for the search bar area
const SearchWrapper = styled.div`
    width: 400px;
    margin-left: 0;
`;

export default function MainPage() {
    return (
        <PageContainer>
            <SearchWrapper>
                <RouteSearchBar />
            </SearchWrapper>

            {/* Add map component here later */}
            <MapView />

        </PageContainer>

    );
}