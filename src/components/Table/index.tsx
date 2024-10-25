import { Flex, Text } from "@radix-ui/themes";
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

const ROWS_PER_PAGE = [10, 20, 50];

type TableProps = {
  headerColumns: string[];
  width: string;
  currentPage: number;
  positionsTotalNumber: number;
  itemsPerPage: number;
  setCurrentPage: Function;
  setItemsPerPage: Function;
  body?: React.ReactNode;
};

const StyledTable: React.FC<TableProps> = ({
  headerColumns,
  width,
  currentPage,
  positionsTotalNumber,
  itemsPerPage,
  setCurrentPage,
  setItemsPerPage,
  body,
}) => {
  const totalPages = Math.ceil(positionsTotalNumber / itemsPerPage);

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

  return (
    <>
      <Table width={width}>
        <thead>
          <tr>
            {headerColumns.map((column: string) => (
              <StyledHeader>{column}</StyledHeader>
            ))}
          </tr>
        </thead>
        <tbody>{body}</tbody>
      </Table>

      {/* Pagination */}
      {positionsTotalNumber > 10 && (
        <Flex align="center" mt="4" gap="2">
          {/* Previous Button */}
          <PaginationButton
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            navBtn={true}
          >
            <Flex>
              <ChevronLeft />
            </Flex>
          </PaginationButton>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, pageIndex) => {
            const page = pageIndex + 1;
            return (
              <PaginationButton
                key={pageIndex}
                onClick={() => handlePageClick(page)}
                active={page === currentPage}
                navBtn={false}
              >
                {page}
              </PaginationButton>
            );
          })}

          {/* Next Button */}
          <PaginationButton
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            navBtn={true}
          >
            <Flex>
              <ChevronRight />
            </Flex>
          </PaginationButton>

          {/* Items per page selector */}
          <Flex align="center" gap="2">
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
