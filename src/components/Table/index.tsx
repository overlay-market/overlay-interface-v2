import { Flex, ScrollArea, Text, Checkbox } from "@radix-ui/themes";
import { ChevronLeft, ChevronRight } from "react-feather";
import {
  Dropdown,
  DropdownMenu,
  PaginationButton,
  RotatingChevron,
  StyledHeader,
  Table,
} from "./table-styles";
import theme from "../../theme";
import { useState, useEffect } from "react";

const ROWS_PER_PAGE = [10, 20, 50];

type TableProps = {
  headerColumns: string[];
  width?: string;
  minWidth?: string;
  currentPage: number;
  positionsTotalNumber: number;
  itemsPerPage: number;
  setCurrentPage: Function;
  setItemsPerPage: Function;
  body?: React.ReactNode;
  showCheckbox?: boolean;
  onSelectAll?: (selectAll: boolean) => void;
};

const StyledTable: React.FC<TableProps> = ({
  headerColumns,
  width,
  minWidth,
  currentPage,
  positionsTotalNumber,
  itemsPerPage,
  setCurrentPage,
  setItemsPerPage,
  body,
  showCheckbox,
  onSelectAll,
}) => {
  const totalPages = Math.ceil(positionsTotalNumber / itemsPerPage);
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    if (!showCheckbox) {
      setAllSelected(false);
    }
  }, [showCheckbox]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleSelectAll = () => {
    const newAllSelected = !allSelected;
    setAllSelected(newAllSelected);
    onSelectAll && onSelectAll(newAllSelected);
  };

  return (
    <>
      <ScrollArea type="auto" scrollbars="horizontal" size="2">
        <Table width={width} minwidth={minWidth}>
          <thead>
            <tr>
              {showCheckbox && (
                <StyledHeader
                  style={{
                    width: "40px",
                    paddingLeft: "10px",
                  }}
                >
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    size="3"
                  />
                </StyledHeader>
              )}
              {headerColumns.map((column: string, index) => (
                <StyledHeader key={index}>{column}</StyledHeader>
              ))}
            </tr>
          </thead>
          <tbody>{body}</tbody>
        </Table>
      </ScrollArea>

      {/* Pagination */}
      {positionsTotalNumber > 10 && (
        <Flex align="center" wrap={"wrap"}>
          <Flex pt="4">
            {/* Previous Button */}
            <PaginationButton
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              $navbutton={"true"}
            >
              <Flex>
                <ChevronLeft />
              </Flex>
            </PaginationButton>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, pageIndex) => {
              const page = pageIndex + 1;

              if (currentPage <= 4) {
                if (page <= 5 || page === totalPages) {
                  return (
                    <PaginationButton
                      key={pageIndex}
                      onClick={() => handlePageClick(page)}
                      $active={(page === currentPage).toString()}
                      $navbutton={"false"}
                    >
                      {page}
                    </PaginationButton>
                  );
                }
                if (page === 6) {
                  return (
                    <Text
                      key={`ellipsis-${page}`}
                      style={{ padding: "6px 5px 0" }}
                    >
                      ...
                    </Text>
                  );
                }
              } else if (currentPage > totalPages - 4) {
                if (page === 1 || page > totalPages - 5) {
                  return (
                    <PaginationButton
                      key={pageIndex}
                      onClick={() => handlePageClick(page)}
                      $active={(page === currentPage).toString()}
                      $navbutton={"false"}
                    >
                      {page}
                    </PaginationButton>
                  );
                }
                if (page === totalPages - 5) {
                  return (
                    <Text
                      key={`ellipsis-${page}`}
                      style={{ padding: "6px 5px 0" }}
                    >
                      ...
                    </Text>
                  );
                }
              } else {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationButton
                      key={pageIndex}
                      onClick={() => handlePageClick(page)}
                      $active={(page === currentPage).toString()}
                      $navbutton={"false"}
                    >
                      {page}
                    </PaginationButton>
                  );
                }
                if (
                  (page === 2 && currentPage > 4) ||
                  (page === totalPages - 1 && currentPage < totalPages - 3)
                ) {
                  return (
                    <Text
                      key={`ellipsis-${page}`}
                      style={{ padding: "6px 5px 0" }}
                    >
                      ...
                    </Text>
                  );
                }
              }

              return null;
            })}

            {/* Next Button */}
            <PaginationButton
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              $navbutton={"true"}
            >
              <Flex>
                <ChevronRight />
              </Flex>
            </PaginationButton>
          </Flex>

          {/* Items per page selector */}
          <Flex align="center" pl={"14px"} pt="4">
            <Text style={{ color: theme.color.grey3 }}>Show:</Text>

            <Dropdown>
              <Flex>
                <Text>{itemsPerPage} / page</Text>
                <RotatingChevron
                  className="chevron"
                  strokeWidth={1}
                  height={18}
                  width={18}
                />
              </Flex>

              <DropdownMenu className="dropdown-menu">
                {ROWS_PER_PAGE.map(
                  (value) =>
                    value !== itemsPerPage && (
                      <div
                        key={value}
                        onClick={() => handleItemsPerPageChange(value)}
                      >
                        <Text>{value} / page</Text>
                      </div>
                    )
                )}
              </DropdownMenu>
            </Dropdown>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default StyledTable;

export { StyledCell, StyledRow } from "./table-styles";
