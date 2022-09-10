import { Injectable } from '@angular/core';
import { Workbook, Style, Borders, Cell } from 'exceljs';
import * as fs from 'file-saver';
import { FantaroiDAOService } from './fantaroi-dao.service';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  private titleStyle: Partial<Style> = {
    font: {
      name: "Arial",
      size: 14,
      bold: true,
      color: {argb: "000000"},
    },
    alignment: {
      horizontal: 'center',
      vertical: 'middle',
    },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: "D9D9D9"}
    }
  }

  private dateStyle: Partial<Style> = {
    font: {
      name: "Arial",
      size: 11,
      bold: true,
      color: {argb: "000000"},
    },
    alignment: {
      horizontal: 'center',
      vertical: 'middle',
    },
    fill: {
      type: 'pattern',
      pattern: 'none',
    }
  }

  private defaultStyle: Partial<Style> = {
    font: {
      name: "Arial",
      size: 14,
      color: {argb: "000000"},
    },
    alignment: {
      horizontal: 'center',
      vertical: 'top',
      wrapText: true,
    },
    fill: {
      type: 'pattern',
      pattern: 'none',
    }
  }

  private socDefaultStyle: Partial<Style> = {
    font: {
      name: "Arial",
      size: 14,
      color: {argb: "000000"},
    },
    alignment: {
      horizontal: 'center',
      vertical: 'top',
      wrapText: true,
    },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'b7e1cd'}
    }
  }

  private socStyle: Partial<Style> = {
    font: {
      name: "Arial",
      size: 14,
      color: {argb: "000000"},
    },
    alignment: {
      horizontal: 'center',
      vertical: 'top',
      wrapText: true,
    },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ff9900'}
    }
  }

  private dishStyle: Partial<Style> = {
    font: {
      name: "Arial",
      size: 14,
      color: {argb: "000000"},
    },
    alignment: {
      horizontal: 'center',
      vertical: 'top',
      wrapText: true,
    },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: '6fa8dc'}
    }
  }

  private offStyle: Partial<Style> = {
    font: {
      name: "Arial",
      size: 14,
      color: {argb: "000000"},
    },
    alignment: {
      horizontal: 'center',
      vertical: 'top',
      wrapText: true,
    },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'b7b7b7'}
    }
  }

  private titleValue = [
    "ΗΜΕΡΟΜΗΝΙΑ",
    "ΠΡΩΙ",
    "ΑΠΟΓΕΥΜΑ",
    "ΥΠΗΡΕΣΙΑ",
    "ΑΔΕΙΑ",
    "ΛΑΤΖΑ",
  ]

  constructor() { }

  public exportExcel(d: Date) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Month", {views: [{
      state: 'frozen', ySplit: 1
    }]});

    let titleRow = worksheet.getRow(1);
    titleRow.height = 48;

    for (let date = new Date(d); date.getMonth() === d.getMonth(); date.setDate(date.getDate() +1)) {
      const x = date.getDate();
      const s = (x-1)*6+x+1;
      const e = x*6+x+1;
      worksheet.mergeCells(`A${s}:A${e}`)
      
      const dateCell = worksheet.getCell(`A${s}`);
      dateCell.value = date.toLocaleDateString("el-GR", {weekday: 'long', day: 'numeric', month: 'long'});
      dateCell.style = this.dateStyle;

      for (let f of FantaroiDAOService.fantaroi) {
        const dayEvent = f.events.getEvent(date);
        let cell;
        if (dayEvent === null) {
          switch (f.seat) {
            case "ΣΚΑΚ":
              cell = worksheet.getCell(`B${s}`);
              cell.style = this.socDefaultStyle;
              break;
            case "Πάνω":
              cell = worksheet.getCell(`B${s+2}`);
              cell.style = this.defaultStyle;
              break;
            default:
              cell = worksheet.getCell(`B${s+4}`);
              cell.style = this.defaultStyle;
              break;
          }
        }
        else {
          switch (dayEvent.type) {
            case 'A':
              cell = worksheet.getCell(`D${s}`);
              cell.style = this.socStyle;
              break;
            case 'B':
              cell = worksheet.getCell(`F${s}`);
              cell.style = this.dishStyle;
              break;
            case 'D':
              switch (f.seat) {
                case "ΣΚΑΚ":
                  cell = worksheet.getCell(`C${s}`);
                  cell.style = this.socDefaultStyle;
                  break;
                case "Πάνω":
                  cell = worksheet.getCell(`C${s+2}`);
                  cell.style = this.defaultStyle;
                  break;
                default:
                  cell = worksheet.getCell(`C${s+4}`);
                  cell.style = this.defaultStyle;
                  break;
              }
              break;
            case 'E':
              cell = worksheet.getCell(`E${s}`);
              cell.style = this.offStyle;
              break;
            default:
              cell = worksheet.getCell(`E${s+4}`);
              cell.style = this.socDefaultStyle;
              break;
          }
        }
        cell.value = (cell.value === null ? "" : cell.value) + f.name + '\n';
      }

      for(let i = 0; i < this.titleValue.length; i++) {
        const cell = titleRow.getCell(i+1);
        cell.value = this.titleValue[i];
        cell.style = this.titleStyle;
        const col = worksheet.getColumn(i+1);
        col.width = 60;
        col.border = {
          left: {
            style: 'thick',
            color: {argb: "000000"}
          }
        }
      }
      for (let col of ['A', 'B', 'C', 'D', 'E', 'F']) {
        worksheet.getCell(`${col}${e}`).border = {
          bottom: {
            style: 'thick',
            color: {argb: "000000"}
          }
        }
      }
    }

    workbook.xlsx.writeBuffer().then((data: any) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, "cal.xlsx");
    })
  }
}
