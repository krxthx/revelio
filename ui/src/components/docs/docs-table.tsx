interface DocsTableProps {
  headers: string[];
  rows: readonly (readonly string[])[];
  monospaceColumns?: number[];
  nowrapColumns?: number[];
}

export default function DocsTable({
  headers,
  rows,
  monospaceColumns = [],
  nowrapColumns = [],
}: DocsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            {headers.map((header) => (
              <th key={header} className="px-4 py-2.5">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-foreground/80">
          {rows.map((row) => (
            <tr key={row.join("|")}>
              {row.map((cell, index) => (
                <td
                  key={`${row[0]}-${headers[index]}`}
                  className={[
                    "px-4 py-2.5",
                    monospaceColumns.includes(index) ? "font-mono text-foreground" : "",
                    nowrapColumns.includes(index) ? "whitespace-nowrap" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
