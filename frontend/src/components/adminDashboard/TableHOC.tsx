import React from 'react';
import { AiOutlineSortAscending, AiOutlineSortDescending } from 'react-icons/ai';
import { BiSolidLeftArrow, BiSolidRightArrow } from 'react-icons/bi';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { TbPlayerTrackNextFilled, TbPlayerTrackPrevFilled } from 'react-icons/tb';
import { useTable, useSortBy, usePagination, Column, TableOptions } from 'react-table';

function TableHOC<T extends object>(columns: Column<T>[], data: T[], containerClassName: string, heading: string, showPagination: boolean = false) {
  return function HOC() {
    const options: TableOptions<T> = {
      columns,
      data,
      initialState: {
        pageSize: 6,
      }
    };

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      page,
      prepareRow,
      nextPage,
      previousPage,
      canNextPage,
      canPreviousPage,
      gotoPage,
      pageCount,
      state: { pageIndex }
    } = useTable(options, useSortBy, usePagination);

    return (
      <div className={containerClassName}>
        <h2 className="heading">{heading}</h2>

        <table className='table' {...getTableProps()}>
          <thead>
            {
              headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {
                    headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                        {column.render("Header")}
                        {" "}
                        {
                          column.isSorted && <span>{column.isSortedDesc ? <AiOutlineSortDescending /> : <AiOutlineSortAscending />}</span>
                        }
                        {column.isSorted ? <span>{column.isSortedDesc ? <FaSortDown /> : <FaSortUp />}</span> : <FaSort />}
                      </th>
                    ))
                  }
                </tr>
              ))
            }
          </thead>
          <tbody {...getTableBodyProps()}>
            {
              page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {
                      row.cells.map((cell) => (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      ))
                    }
                  </tr>
                );
              })
            }
          </tbody>
        </table>
        {
          showPagination && (
            <div className='tablePagination'>
              <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}><TbPlayerTrackPrevFilled /></button>
              <button onClick={previousPage} disabled={!canPreviousPage}><BiSolidLeftArrow /></button>
              <span>{`Page ${pageIndex + 1} of ${pageCount}`}</span>
              <button onClick={nextPage} disabled={!canNextPage}><BiSolidRightArrow /></button>
              <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}><TbPlayerTrackNextFilled /></button>
            </div>
          )
        }
      </div>
    );
  }()
}

export default TableHOC;
