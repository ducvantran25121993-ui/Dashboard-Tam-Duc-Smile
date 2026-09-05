export interface ServiceData {
  name: string;
  cp: number;
  dataCount: number;
  dataChatLuong: number;
}

export interface RegionData {
  name: string;
  costVAT: number;
  revenue: number;
  cpDichVu: number;
  cpTong: number;
  totalData: number;
  dataChatLuong: number;
  services: ServiceData[];
}

export interface MonthDataset {
  month: number;
  label: string;
  regions: RegionData[];
}

export const MONTHLY_DATA: MonthDataset[] = [
  {
    "month": 1,
    "label": "Tháng 1",
    "regions": [
      {
        "name": "Bình Dương",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Bình Phước",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Biên Hòa",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cần Thơ",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Nẵng",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Quy Nhơn",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Tây Ninh",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Vũng Tàu",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Dĩ An",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "HCM",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "HCM-Imp",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "HCM-Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "HCM-Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "HCM-TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Việt Kiều",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Việt Kiều",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Bạc Liêu",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cà Mau",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đồng Tháp",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Sóc Trăng",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Lạt",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Gia Kiệm",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Không Địa Chỉ",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      }
    ]
  },
  {
    "month": 2,
    "label": "Tháng 2",
    "regions": [
      {
        "name": "Bình Dương",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Bình Phước",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Biên Hòa",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cần Thơ",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Nẵng",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Quy Nhơn",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Tây Ninh",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Vũng Tàu",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Dĩ An",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "HCM",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "HCM-Imp",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "HCM-Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "HCM-Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "HCM-TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Việt Kiều",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Việt Kiều",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Bạc Liêu",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cà Mau",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đồng Tháp",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Sóc Trăng",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Lạt",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Gia Kiệm",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Không Địa Chỉ",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      }
    ]
  },
  {
    "month": 3,
    "label": "Tháng 3",
    "regions": [
      {
        "name": "Bình Dương",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Bình Phước",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Biên Hòa",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cần Thơ",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Nẵng",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Quy Nhơn",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Tây Ninh",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Vũng Tàu",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Dĩ An",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "HCM",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "HCM-Imp",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "HCM-Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "HCM-Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "HCM-TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Việt Kiều",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Việt Kiều",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Bạc Liêu",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cà Mau",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đồng Tháp",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Sóc Trăng",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Lạt",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Gia Kiệm",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Không Địa Chỉ",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      }
    ]
  },
  {
    "month": 4,
    "label": "Tháng 4",
    "regions": [
      {
        "name": "Bình Dương",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Bình Phước",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Biên Hòa",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cần Thơ",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Nẵng",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Quy Nhơn",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Tây Ninh",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Vũng Tàu",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Dĩ An",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "HCM",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "HCM-Imp",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "HCM-Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "HCM-Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "HCM-TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Việt Kiều",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Việt Kiều",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Bạc Liêu",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cà Mau",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đồng Tháp",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Sóc Trăng",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Lạt",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Gia Kiệm",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Không Địa Chỉ",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      }
    ]
  },
  {
    "month": 5,
    "label": "Tháng 5",
    "regions": [
      {
        "name": "Bình Dương",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Bình Phước",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Biên Hòa",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cần Thơ",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Nẵng",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Quy Nhơn",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Tây Ninh",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Vũng Tàu",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Dĩ An",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "HCM",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "HCM-Imp",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "HCM-Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "HCM-Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "HCM-TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Việt Kiều",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Việt Kiều",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Bạc Liêu",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cà Mau",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đồng Tháp",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Sóc Trăng",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Lạt",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Gia Kiệm",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Không Địa Chỉ",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      }
    ]
  },
  {
    "month": 6,
    "label": "Tháng 6",
    "regions": [
      {
        "name": "Bình Dương",
        "costVAT": 30103289,
        "revenue": 521012000,
        "cpDichVu": 30103288,
        "cpTong": 30103289,
        "totalData": 98,
        "dataChatLuong": 84,
        "services": [
          {
            "name": "Implant",
            "cp": 13402365,
            "dataCount": 11,
            "dataChatLuong": 84
          },
          {
            "name": "Niềng",
            "cp": 145704,
            "dataCount": 18,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 11236402,
            "dataCount": 13,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 5318817,
            "dataCount": 56,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Bình Phước",
        "costVAT": 8441639,
        "revenue": 5500000,
        "cpDichVu": 8441639,
        "cpTong": 8441639,
        "totalData": 23,
        "dataChatLuong": 22,
        "services": [
          {
            "name": "Implant",
            "cp": 1877689,
            "dataCount": 2,
            "dataChatLuong": 22
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 3,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 5687180,
            "dataCount": 12,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 876770,
            "dataCount": 6,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Biên Hòa",
        "costVAT": 37553754,
        "revenue": 494100000,
        "cpDichVu": 37553755,
        "cpTong": 37553754,
        "totalData": 69,
        "dataChatLuong": 65,
        "services": [
          {
            "name": "Implant",
            "cp": 14632103,
            "dataCount": 11,
            "dataChatLuong": 65
          },
          {
            "name": "Niềng",
            "cp": 1429384,
            "dataCount": 14,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 14398028,
            "dataCount": 13,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 7094240,
            "dataCount": 31,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cần Thơ",
        "costVAT": 58914171,
        "revenue": 351009000,
        "cpDichVu": 58914172,
        "cpTong": 58914171,
        "totalData": 87,
        "dataChatLuong": 66,
        "services": [
          {
            "name": "TH",
            "cp": 23767963,
            "dataCount": 57,
            "dataChatLuong": 66
          },
          {
            "name": "Implant",
            "cp": 18455812,
            "dataCount": 9,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 861333,
            "dataCount": 9,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 15829064,
            "dataCount": 12,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Nẵng",
        "costVAT": 28887373,
        "revenue": 260120000,
        "cpDichVu": 28887372,
        "cpTong": 28887373,
        "totalData": 64,
        "dataChatLuong": 55,
        "services": [
          {
            "name": "Implant",
            "cp": 14947597,
            "dataCount": 13,
            "dataChatLuong": 55
          },
          {
            "name": "Niềng",
            "cp": 33537,
            "dataCount": 7,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 9473446,
            "dataCount": 8,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 4432792,
            "dataCount": 36,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Quy Nhơn",
        "costVAT": 18974996,
        "revenue": 207300000,
        "cpDichVu": 18974997,
        "cpTong": 18974996,
        "totalData": 44,
        "dataChatLuong": 38,
        "services": [
          {
            "name": "Implant",
            "cp": 6962398,
            "dataCount": 4,
            "dataChatLuong": 38
          },
          {
            "name": "Niềng",
            "cp": 933910,
            "dataCount": 1,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 6568332,
            "dataCount": 3,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 4510357,
            "dataCount": 36,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Tây Ninh",
        "costVAT": 35340653,
        "revenue": 384720000,
        "cpDichVu": 35340653,
        "cpTong": 35340653,
        "totalData": 53,
        "dataChatLuong": 46,
        "services": [
          {
            "name": "Implant",
            "cp": 13572102,
            "dataCount": 3,
            "dataChatLuong": 46
          },
          {
            "name": "Niềng",
            "cp": 209706,
            "dataCount": 6,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 14520517,
            "dataCount": 4,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 7038328,
            "dataCount": 40,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Vũng Tàu",
        "costVAT": 24161758,
        "revenue": 495120000,
        "cpDichVu": 24161758,
        "cpTong": 24161758,
        "totalData": 118,
        "dataChatLuong": 104,
        "services": [
          {
            "name": "Implant",
            "cp": 7495783,
            "dataCount": 15,
            "dataChatLuong": 104
          },
          {
            "name": "Niềng",
            "cp": 181385,
            "dataCount": 23,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 11655342,
            "dataCount": 14,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 4829248,
            "dataCount": 66,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Dĩ An",
        "costVAT": 12375436,
        "revenue": 318110000,
        "cpDichVu": 12375436,
        "cpTong": 12375436,
        "totalData": 51,
        "dataChatLuong": 44,
        "services": [
          {
            "name": "Implant",
            "cp": 4750151,
            "dataCount": 5,
            "dataChatLuong": 44
          },
          {
            "name": "Niềng",
            "cp": 177934,
            "dataCount": 6,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 4311789,
            "dataCount": 2,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 3135562,
            "dataCount": 38,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "HCM",
        "costVAT": 673841377,
        "revenue": 3794528000,
        "cpDichVu": 673841377,
        "cpTong": 673841377,
        "totalData": 1256,
        "dataChatLuong": 1069,
        "services": [
          {
            "name": "Implant",
            "cp": 262557514,
            "dataCount": 141,
            "dataChatLuong": 1069
          },
          {
            "name": "Niềng",
            "cp": 16166565,
            "dataCount": 168,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 207296104,
            "dataCount": 156,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 187821194,
            "dataCount": 791,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Việt Kiều",
        "costVAT": 139846215,
        "revenue": 579500000,
        "cpDichVu": 139846215,
        "cpTong": 139846215,
        "totalData": 55,
        "dataChatLuong": 43,
        "services": [
          {
            "name": "Việt Kiều",
            "cp": 139846215,
            "dataCount": 55,
            "dataChatLuong": 43
          }
        ]
      },
      {
        "name": "Bạc Liêu",
        "costVAT": 3371608,
        "revenue": 53200000,
        "cpDichVu": 3371608,
        "cpTong": 3371608,
        "totalData": 20,
        "dataChatLuong": 15,
        "services": [
          {
            "name": "Implant",
            "cp": 691061,
            "dataCount": 3,
            "dataChatLuong": 15
          },
          {
            "name": "Niềng",
            "cp": 53975,
            "dataCount": 1,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 438702,
            "dataCount": 6,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 2187870,
            "dataCount": 10,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cà Mau",
        "costVAT": 18990079,
        "revenue": 126018000,
        "cpDichVu": 18990079,
        "cpTong": 18990079,
        "totalData": 56,
        "dataChatLuong": 47,
        "services": [
          {
            "name": "Implant",
            "cp": 6524249,
            "dataCount": 11,
            "dataChatLuong": 47
          },
          {
            "name": "Niềng",
            "cp": 1033820,
            "dataCount": 7,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 3716928,
            "dataCount": 7,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 7715082,
            "dataCount": 31,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đồng Tháp",
        "costVAT": 9040295,
        "revenue": 48200000,
        "cpDichVu": 9040294,
        "cpTong": 9040295,
        "totalData": 32,
        "dataChatLuong": 26,
        "services": [
          {
            "name": "Implant",
            "cp": 3816808,
            "dataCount": 2,
            "dataChatLuong": 26
          },
          {
            "name": "Niềng",
            "cp": 1530228,
            "dataCount": 7,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 1877513,
            "dataCount": 3,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 1815745,
            "dataCount": 20,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Sóc Trăng",
        "costVAT": 5833997,
        "revenue": 53380000,
        "cpDichVu": 5833997,
        "cpTong": 5833997,
        "totalData": 13,
        "dataChatLuong": 13,
        "services": [
          {
            "name": "Implant",
            "cp": 448915,
            "dataCount": 3,
            "dataChatLuong": 13
          },
          {
            "name": "Niềng",
            "cp": 735828,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 231908,
            "dataCount": 3,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 4417346,
            "dataCount": 7,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Lạt",
        "costVAT": 21275290,
        "revenue": 359370000,
        "cpDichVu": 21275290,
        "cpTong": 21275290,
        "totalData": 50,
        "dataChatLuong": 44,
        "services": [
          {
            "name": "Implant",
            "cp": 10752226,
            "dataCount": 4,
            "dataChatLuong": 44
          },
          {
            "name": "Niềng",
            "cp": 140078,
            "dataCount": 10,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 4516186,
            "dataCount": 7,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 5866800,
            "dataCount": 29,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Gia Kiệm",
        "costVAT": 7109540,
        "revenue": 91640000,
        "cpDichVu": 7109541,
        "cpTong": 7109540,
        "totalData": 13,
        "dataChatLuong": 13,
        "services": [
          {
            "name": "Implant",
            "cp": 2781455,
            "dataCount": 2,
            "dataChatLuong": 13
          },
          {
            "name": "Niềng",
            "cp": 56909,
            "dataCount": 1,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 2255357,
            "dataCount": 2,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 2015820,
            "dataCount": 8,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Không Địa Chỉ",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 562,
        "dataChatLuong": 281,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 18,
            "dataChatLuong": 281
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 33,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 19,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 492,
            "dataChatLuong": 0
          }
        ]
      }
    ]
  },
  {
    "month": 7,
    "label": "Tháng 7",
    "regions": [
      {
        "name": "Bình Dương",
        "costVAT": 11231960,
        "revenue": 212750000,
        "cpDichVu": 11231960,
        "cpTong": 11231960,
        "totalData": 69,
        "dataChatLuong": 59,
        "services": [
          {
            "name": "Implant",
            "cp": 5605033,
            "dataCount": 11,
            "dataChatLuong": 59
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 8,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 4392216,
            "dataCount": 7,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 1234711,
            "dataCount": 43,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Bình Phước",
        "costVAT": 6915668,
        "revenue": 3700000,
        "cpDichVu": 6915668,
        "cpTong": 6915668,
        "totalData": 20,
        "dataChatLuong": 17,
        "services": [
          {
            "name": "Implant",
            "cp": 1530486,
            "dataCount": 4,
            "dataChatLuong": 17
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 2,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 4111813,
            "dataCount": 12,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 1273369,
            "dataCount": 2,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Biên Hòa",
        "costVAT": 30491750,
        "revenue": 384805000,
        "cpDichVu": 30491751,
        "cpTong": 30491750,
        "totalData": 65,
        "dataChatLuong": 58,
        "services": [
          {
            "name": "Implant",
            "cp": 12714811,
            "dataCount": 12,
            "dataChatLuong": 58
          },
          {
            "name": "Niềng",
            "cp": 1188934,
            "dataCount": 13,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 10767665,
            "dataCount": 11,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 5820341,
            "dataCount": 29,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cần Thơ",
        "costVAT": 33964921,
        "revenue": 209887000,
        "cpDichVu": 33964920,
        "cpTong": 33964921,
        "totalData": 84,
        "dataChatLuong": 71,
        "services": [
          {
            "name": "TH",
            "cp": 14920831,
            "dataCount": 50,
            "dataChatLuong": 71
          },
          {
            "name": "Implant",
            "cp": 9862345,
            "dataCount": 10,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 240438,
            "dataCount": 10,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 8941306,
            "dataCount": 14,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Nẵng",
        "costVAT": 23173089,
        "revenue": 286878000,
        "cpDichVu": 23173090,
        "cpTong": 23173089,
        "totalData": 48,
        "dataChatLuong": 48,
        "services": [
          {
            "name": "Implant",
            "cp": 11045141,
            "dataCount": 7,
            "dataChatLuong": 48
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 6,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 8237040,
            "dataCount": 6,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 3890909,
            "dataCount": 29,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Quy Nhơn",
        "costVAT": 14359947,
        "revenue": 109050000,
        "cpDichVu": 14359947,
        "cpTong": 14359947,
        "totalData": 36,
        "dataChatLuong": 24,
        "services": [
          {
            "name": "Implant",
            "cp": 6089955,
            "dataCount": 4,
            "dataChatLuong": 24
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 5,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 4858938,
            "dataCount": 3,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 3411054,
            "dataCount": 24,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Tây Ninh",
        "costVAT": 26945214,
        "revenue": 38800000,
        "cpDichVu": 26945215,
        "cpTong": 26945214,
        "totalData": 43,
        "dataChatLuong": 40,
        "services": [
          {
            "name": "Implant",
            "cp": 10347211,
            "dataCount": 0,
            "dataChatLuong": 40
          },
          {
            "name": "Niềng",
            "cp": 806671,
            "dataCount": 7,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 10331203,
            "dataCount": 9,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 5460130,
            "dataCount": 27,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Vũng Tàu",
        "costVAT": 20379237,
        "revenue": 395639000,
        "cpDichVu": 20379238,
        "cpTong": 20379237,
        "totalData": 92,
        "dataChatLuong": 81,
        "services": [
          {
            "name": "Implant",
            "cp": 7345031,
            "dataCount": 6,
            "dataChatLuong": 81
          },
          {
            "name": "Niềng",
            "cp": 946225,
            "dataCount": 8,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 7830288,
            "dataCount": 14,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 4257694,
            "dataCount": 64,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Dĩ An",
        "costVAT": 7520616,
        "revenue": 0,
        "cpDichVu": 7520615,
        "cpTong": 7520616,
        "totalData": 72,
        "dataChatLuong": 63,
        "services": [
          {
            "name": "Implant",
            "cp": 2002768,
            "dataCount": 9,
            "dataChatLuong": 63
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 2,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 3217381,
            "dataCount": 9,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 2300466,
            "dataCount": 52,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "HCM",
        "costVAT": 446076797,
        "revenue": 3273102450,
        "cpDichVu": 446076798,
        "cpTong": 446076797,
        "totalData": 1049,
        "dataChatLuong": 904,
        "services": [
          {
            "name": "Implant",
            "cp": 166201260,
            "dataCount": 108,
            "dataChatLuong": 904
          },
          {
            "name": "Niềng",
            "cp": 12231818,
            "dataCount": 132,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 124455141,
            "dataCount": 106,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 143188579,
            "dataCount": 703,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Việt Kiều",
        "costVAT": 100439628,
        "revenue": 115900000,
        "cpDichVu": 100439628,
        "cpTong": 100439628,
        "totalData": 56,
        "dataChatLuong": 47,
        "services": [
          {
            "name": "Việt Kiều",
            "cp": 100439628,
            "dataCount": 56,
            "dataChatLuong": 47
          }
        ]
      },
      {
        "name": "Bạc Liêu",
        "costVAT": 1188556,
        "revenue": 24000000,
        "cpDichVu": 1188556,
        "cpTong": 1188556,
        "totalData": 12,
        "dataChatLuong": 10,
        "services": [
          {
            "name": "Implant",
            "cp": 337290,
            "dataCount": 0,
            "dataChatLuong": 10
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 2,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 222791,
            "dataCount": 3,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 628475,
            "dataCount": 7,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cà Mau",
        "costVAT": 11620610,
        "revenue": 150800000,
        "cpDichVu": 11620610,
        "cpTong": 11620610,
        "totalData": 39,
        "dataChatLuong": 37,
        "services": [
          {
            "name": "Implant",
            "cp": 3673851,
            "dataCount": 4,
            "dataChatLuong": 37
          },
          {
            "name": "Niềng",
            "cp": 274172,
            "dataCount": 4,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 2579387,
            "dataCount": 9,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 5093200,
            "dataCount": 22,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đồng Tháp",
        "costVAT": 7474192,
        "revenue": 44650000,
        "cpDichVu": 7474193,
        "cpTong": 7474192,
        "totalData": 33,
        "dataChatLuong": 30,
        "services": [
          {
            "name": "Implant",
            "cp": 2808621,
            "dataCount": 6,
            "dataChatLuong": 30
          },
          {
            "name": "Niềng",
            "cp": 311119,
            "dataCount": 3,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 2071620,
            "dataCount": 7,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 2282833,
            "dataCount": 17,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Sóc Trăng",
        "costVAT": 5831508,
        "revenue": 20299000,
        "cpDichVu": 5831507,
        "cpTong": 5831508,
        "totalData": 13,
        "dataChatLuong": 13,
        "services": [
          {
            "name": "Implant",
            "cp": 1098565,
            "dataCount": 0,
            "dataChatLuong": 13
          },
          {
            "name": "Niềng",
            "cp": 292184,
            "dataCount": 1,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 1434843,
            "dataCount": 4,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 3005915,
            "dataCount": 8,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Lạt",
        "costVAT": 14662883,
        "revenue": 12900000,
        "cpDichVu": 14662883,
        "cpTong": 14662883,
        "totalData": 30,
        "dataChatLuong": 27,
        "services": [
          {
            "name": "Implant",
            "cp": 5346387,
            "dataCount": 4,
            "dataChatLuong": 27
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 4,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 5369983,
            "dataCount": 4,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 3946513,
            "dataCount": 18,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Gia Kiệm",
        "costVAT": 1272569,
        "revenue": 0,
        "cpDichVu": 1272570,
        "cpTong": 1272569,
        "totalData": 11,
        "dataChatLuong": 11,
        "services": [
          {
            "name": "Implant",
            "cp": 544904,
            "dataCount": 5,
            "dataChatLuong": 11
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 516532,
            "dataCount": 2,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 211134,
            "dataCount": 4,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Không Địa Chỉ",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 352,
        "dataChatLuong": 176,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 23,
            "dataChatLuong": 176
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 21,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 19,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 289,
            "dataChatLuong": 0
          }
        ]
      }
    ]
  },
  {
    "month": 8,
    "label": "Tháng 8",
    "regions": [
      {
        "name": "Bình Dương",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Bình Phước",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Biên Hòa",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cần Thơ",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Nẵng",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Quy Nhơn",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Tây Ninh",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Vũng Tàu",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Dĩ An",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "HCM",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "HCM-Imp",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "HCM-Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "HCM-Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "HCM-TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Việt Kiều",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Việt Kiều",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Bạc Liêu",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cà Mau",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đồng Tháp",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Sóc Trăng",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Lạt",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Gia Kiệm",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Không Địa Chỉ",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      }
    ]
  },
  {
    "month": 9,
    "label": "Tháng 9",
    "regions": [
      {
        "name": "Bình Dương",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Bình Phước",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Biên Hòa",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cần Thơ",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Nẵng",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Quy Nhơn",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Tây Ninh",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Vũng Tàu",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Dĩ An",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "HCM",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "HCM-Imp",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "HCM-Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "HCM-Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "HCM-TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Việt Kiều",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Việt Kiều",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Bạc Liêu",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cà Mau",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đồng Tháp",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Sóc Trăng",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Lạt",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Gia Kiệm",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Không Địa Chỉ",
        "costVAT": 0,
        "revenue": 0,
        "cpDichVu": 0,
        "cpTong": 0,
        "totalData": 0,
        "dataChatLuong": 0,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      }
    ]
  },
  {
    month: 10,
    label: 'Tháng 10',
    regions: [
      'Bình Dương',
      'Bình Phước',
      'Biên Hòa',
      'Cần Thơ',
      'Đà Nẵng',
      'Quy Nhơn',
      'Tây Ninh',
      'Vũng Tàu',
      'Dĩ An',
      'HCM',
      'Việt Kiều',
      'Bạc Liêu',
      'Cà Mau',
      'Đồng Tháp',
      'Sóc Trăng',
      'Đà Lạt',
      'Gia Kiệm',
      'Không Địa Chỉ',
    ].map((name) => ({
      name,
      costVAT: 0,
      revenue: 0,
      cpDichVu: 0,
      cpTong: 0,
      totalData: 0,
      dataChatLuong: 0,
      services: [
        { name: 'Implant', cp: 0, dataCount: 0, dataChatLuong: 0 },
        { name: 'Niềng', cp: 0, dataCount: 0, dataChatLuong: 0 },
        { name: 'Sứ', cp: 0, dataCount: 0, dataChatLuong: 0 },
        { name: 'TH', cp: 0, dataCount: 0, dataChatLuong: 0 },
      ],
    })),
  }
];
