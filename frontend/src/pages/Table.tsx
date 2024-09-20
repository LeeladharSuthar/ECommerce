type TablePropd = {
    columns: { heading: string, sort: boolean, sortOrder?: "none" | "asc" | "dsc" }[],
    perPage?: number,
    pagination?: boolean,
    data: Record<string, any>[],
}

const Table = () => {
    return (
        <div>Table</div>
    )
}

export default Table