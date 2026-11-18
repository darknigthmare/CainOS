/** Extend the source table without replacing the legend or user cells below it. */
export function appendWorkbookReferences(sheet, table, rows) {
  if (!rows.length) return;
  const first = table.getDataRows().length + 6;
  const last = sheet.getUsedRange().values.length;
  const shift = rows.length;
  if (last >= first) {
    for (let row=last;row>=first;row--) {
      const source=sheet.getRange(`A${row}:E${row}`);
      const destination=sheet.getRange(`A${row+shift}:E${row+shift}`);
      const height=source.format.rowHeight;
      destination.copyFrom(source,'all');
      if (height != null) destination.format.rowHeight=height;
    }
    sheet.getRange(`A${first}:E${first+shift-1}`).clear();
  }
  table.rows.add(null,rows);
}
