import React from "react";
import {
  ClearButton,
  SearchContainer,
  SearchIcon,
  SearchInput,
} from "./search-item-styles";

type SearchItemProps = {
  searchTerm: string;
  setSearchTerm: Function;
};

const SearchItem: React.FC<SearchItemProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <SearchContainer
      width={"100%"}
      height={"49px"}
      py={"12px"}
      px={"8px"}
      justify={"between"}
      align={"center"}
    >
      <SearchIcon />
      <SearchInput
        type="text"
        placeholder="Search market..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      {searchTerm && (
        <ClearButton
          onMouseDown={(e) => {
            e.preventDefault();
            setSearchTerm("");
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            setSearchTerm("");
          }}
        >
          ×
        </ClearButton>
      )}
    </SearchContainer>
  );
};

export default SearchItem;
