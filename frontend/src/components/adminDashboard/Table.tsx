import React, { useState } from 'react';
import { FaSortDown, FaSortUp } from 'react-icons/fa';

interface TableProps {
    page?: number;
    lastPage?: number;
    columns?: {
        heading: string;
        sorting: boolean;
        sortingOrder: string;
    }[];
    containerClassName?: string;
    heading?: string;
    rows: sampleDataProps[];
}

type sampleDataProps = {
    Name: string,
    Age: number,
    Contact: string,
    Email: string,
    Height: number,
    Weight: number
}

const cols = [
    {
        heading: "Name",
        sorting: false,
        sortingOrder: "none"
    },
    {
        heading: "Age",
        sorting: true,
        sortingOrder: "asc"
    },
    {
        heading: "Contact",
        sorting: false,
        sortingOrder: "none"
    },
    {
        heading: "Email",
        sorting: false,
        sortingOrder: "none"
    },
    {
        heading: "Height",
        sorting: true,
        sortingOrder: "desc"
    },
    {
        heading: "Weight",
        sorting: true,
        sortingOrder: "none"
    },
];

const sampleData: sampleDataProps[] = [
    {
        Name: "Alice Smith",
        Age: 30,
        Contact: "(555) 123-4567",
        Email: "alice.smith@example.com",
        Height: 65,
        Weight: 140
    },
    {
        Name: "Bob Johnson",
        Age: 25,
        Contact: "(555) 234-5678",
        Email: "bob.johnson@example.com",
        Height: 70,
        Weight: 180
    },
    {
        Name: "Carol Williams",
        Age: 28,
        Contact: "(555) 345-6789",
        Email: "carol.williams@example.com",
        Height: 62,
        Weight: 130
    },
    {
        Name: "David Brown",
        Age: 35,
        Contact: "(555) 456-7890",
        Email: "david.brown@example.com",
        Height: 72,
        Weight: 200
    },
    {
        Name: "Emily Davis",
        Age: 22,
        Contact: "(555) 567-8901",
        Email: "emily.davis@example.com",
        Height: 64,
        Weight: 120
    }
];

const Table = ({ columns = cols, lastPage = 1, page = 1, containerClassName = "classTable", heading = "contact", rows = sampleData }: TableProps) => {
    const [tableColumns, setTableColumns] = useState(columns);
    const [tableRows, setTableRows] = useState(rows);

    const sort = (column: string) => {
        const col = tableColumns.find(col => col.heading === column);

        if (!col) return;

        // Determine the next sorting order
        const newSortingOrder = col.sortingOrder === "asc" ? "desc" : "asc";

        // Determine if the column is numeric
        const isNumeric = tableRows.every(row => !isNaN(Number(row[column as keyof sampleDataProps])));

        // Create a new sorted array to avoid mutating the original
        const sortedRows = [...tableRows].sort((a, b) => {
            if (isNumeric) {
                return newSortingOrder === "asc"
                    ? Number(a[column as keyof sampleDataProps]) - Number(b[column as keyof sampleDataProps])
                    : Number(b[column as keyof sampleDataProps]) - Number(a[column as keyof sampleDataProps]);
            } else {
                return newSortingOrder === "asc"
                    ? (a[column as keyof sampleDataProps] as string).localeCompare(b[column as keyof sampleDataProps] as string)
                    : (b[column as keyof sampleDataProps] as string).localeCompare(a[column as keyof sampleDataProps] as string);
            }
        });

        // Update the state with sorted rows and new column sorting order
        setTableRows(sortedRows);
        setTableColumns(
            tableColumns.map(col =>
                col.heading === column
                    ? { ...col, sortingOrder: newSortingOrder }
                    : { ...col, sortingOrder: "none" }
            )
        );
    };


    return (
        <div className={containerClassName}>
            <h2 className="heading">{heading}</h2>
            <table className="table">
                <thead>
                    <tr>
                        {tableColumns.map((col) => (
                            <th key={col.heading} onClick={() => { if (col.sorting) sort(col.heading) }}>
                                {col.heading}
                                {col.sorting && (
                                    <span>
                                        {col.sortingOrder === "desc" ? <FaSortDown /> :
                                            col.sortingOrder === "asc" ? <FaSortUp /> : null}
                                    </span>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableRows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {tableColumns.map((col) => (
                                <td key={col.heading}>
                                    {row[col.heading as keyof typeof row]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* <div className='tablePagination'>
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}><TbPlayerTrackPrevFilled /></button>
                <button onClick={previousPage} disabled={!canPreviousPage}><BiSolidLeftArrow /></button>
                <span>{`Page ${pageIndex + 1} of ${pageCount}`}</span>
                <button onClick={nextPage} disabled={!canNextPage}><BiSolidRightArrow /></button>
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}><TbPlayerTrackNextFilled /></button>
            </div> */}
        </div>
    );
}

export default Table;
