import React from "react";
import {
  ClearButton,
  SearchContainer,
  SearchIcon,
  SearchInput,
} from "./search-bar-styles";

type SearchBarProps = {
  searchTerm: string;
  placeholder: string;
  bgcolor?: string;
  setSearchTerm: Function;
};

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  placeholder,
  bgcolor,
  setSearchTerm,
}) => {
  return (
    <SearchContainer>
      <SearchIcon />
      <SearchInput
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        $bgcolor={bgcolor}
        onChange={(e) => setSearchTerm(e.target.value)}
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

export default SearchBar;
