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
        "costVAT": 52288250,
        "revenue": 493077000,
        "cpDichVu": 52288250,
        "cpTong": 46421982,
        "totalData": 81,
        "dataChatLuong": 71,
        "services": [
          {
            "name": "Implant",
            "cp": 23820300,
            "dataCount": 19,
            "dataChatLuong": 71
          },
          {
            "name": "Niềng",
            "cp": 8560265,
            "dataCount": 12,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 12618257,
            "dataCount": 10,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 7289428,
            "dataCount": 40,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Bình Phước",
        "costVAT": 20375737,
        "revenue": 9800000,
        "cpDichVu": 20375737,
        "cpTong": 18089764,
        "totalData": 20,
        "dataChatLuong": 17,
        "services": [
          {
            "name": "Implant",
            "cp": 6805347,
            "dataCount": 1,
            "dataChatLuong": 17
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 4,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 8578146,
            "dataCount": 11,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 4992244,
            "dataCount": 4,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Biên Hòa",
        "costVAT": 39698817,
        "revenue": 437765000,
        "cpDichVu": 39698817,
        "cpTong": 35244969,
        "totalData": 70,
        "dataChatLuong": 55,
        "services": [
          {
            "name": "Implant",
            "cp": 12622173,
            "dataCount": 10,
            "dataChatLuong": 55
          },
          {
            "name": "Niềng",
            "cp": 9575350,
            "dataCount": 16,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 10496572,
            "dataCount": 4,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 7004722,
            "dataCount": 40,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cần Thơ",
        "costVAT": 37356522,
        "revenue": 177129000,
        "cpDichVu": 37356522,
        "cpTong": 33165458,
        "totalData": 108,
        "dataChatLuong": 77,
        "services": [
          {
            "name": "TH",
            "cp": 7836847,
            "dataCount": 83,
            "dataChatLuong": 77
          },
          {
            "name": "Implant",
            "cp": 10851853,
            "dataCount": 7,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 9118186,
            "dataCount": 9,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 9549636,
            "dataCount": 9,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Nẵng",
        "costVAT": 54962580,
        "revenue": 171150000,
        "cpDichVu": 54962580,
        "cpTong": 48796276,
        "totalData": 55,
        "dataChatLuong": 46,
        "services": [
          {
            "name": "Implant",
            "cp": 19689656,
            "dataCount": 10,
            "dataChatLuong": 46
          },
          {
            "name": "Niềng",
            "cp": 10515471,
            "dataCount": 2,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 16134125,
            "dataCount": 4,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 8623328,
            "dataCount": 39,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Quy Nhơn",
        "costVAT": 27795381,
        "revenue": 170200000,
        "cpDichVu": 27795381,
        "cpTong": 24676991,
        "totalData": 32,
        "dataChatLuong": 20,
        "services": [
          {
            "name": "Implant",
            "cp": 9973944,
            "dataCount": 6,
            "dataChatLuong": 20
          },
          {
            "name": "Niềng",
            "cp": 7009953,
            "dataCount": 3,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 3882120,
            "dataCount": 3,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 6929364,
            "dataCount": 20,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Tây Ninh",
        "costVAT": 31151138,
        "revenue": 316400000,
        "cpDichVu": 31151138,
        "cpTong": 27656262,
        "totalData": 44,
        "dataChatLuong": 39,
        "services": [
          {
            "name": "Implant",
            "cp": 9036481,
            "dataCount": 4,
            "dataChatLuong": 39
          },
          {
            "name": "Niềng",
            "cp": 7118451,
            "dataCount": 6,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 7295230,
            "dataCount": 3,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 7700976,
            "dataCount": 31,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Vũng Tàu",
        "costVAT": 35662116,
        "revenue": 195550000,
        "cpDichVu": 35662116,
        "cpTong": 31661149,
        "totalData": 90,
        "dataChatLuong": 71,
        "services": [
          {
            "name": "Implant",
            "cp": 11404477,
            "dataCount": 10,
            "dataChatLuong": 71
          },
          {
            "name": "Niềng",
            "cp": 7328192,
            "dataCount": 5,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 6654084,
            "dataCount": 14,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 10275363,
            "dataCount": 61,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Dĩ An",
        "costVAT": 26376870,
        "revenue": 53995000,
        "cpDichVu": 26376871,
        "cpTong": 23417624,
        "totalData": 49,
        "dataChatLuong": 37,
        "services": [
          {
            "name": "Implant",
            "cp": 9413483,
            "dataCount": 3,
            "dataChatLuong": 37
          },
          {
            "name": "Niềng",
            "cp": 6041560,
            "dataCount": 8,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 5832847,
            "dataCount": 7,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 5088981,
            "dataCount": 31,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "HCM",
        "costVAT": 628379896,
        "revenue": 5099272350,
        "cpDichVu": 628379895,
        "cpTong": 557881359,
        "totalData": 1187,
        "dataChatLuong": 948,
        "services": [
          {
            "name": "Implant",
            "cp": 238823892,
            "dataCount": 101,
            "dataChatLuong": 948
          },
          {
            "name": "Niềng",
            "cp": 112760587,
            "dataCount": 110,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 122330761,
            "dataCount": 125,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 154464655,
            "dataCount": 851,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Việt Kiều",
        "costVAT": 174779777,
        "revenue": 895655000,
        "cpDichVu": 174779777,
        "cpTong": 155171068,
        "totalData": 24,
        "dataChatLuong": 24,
        "services": [
          {
            "name": "Việt Kiều",
            "cp": 174779777,
            "dataCount": 24,
            "dataChatLuong": 24
          }
        ]
      },
      {
        "name": "Bạc Liêu",
        "costVAT": 12369172,
        "revenue": 127849000,
        "cpDichVu": 12369173,
        "cpTong": 10981463,
        "totalData": 22,
        "dataChatLuong": 17,
        "services": [
          {
            "name": "Implant",
            "cp": 3015651,
            "dataCount": 4,
            "dataChatLuong": 17
          },
          {
            "name": "Niềng",
            "cp": 4595617,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 2696454,
            "dataCount": 5,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 2061451,
            "dataCount": 13,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cà Mau",
        "costVAT": 15848719,
        "revenue": 205450000,
        "cpDichVu": 15848719,
        "cpTong": 14070636,
        "totalData": 40,
        "dataChatLuong": 24,
        "services": [
          {
            "name": "Implant",
            "cp": 4161456,
            "dataCount": 3,
            "dataChatLuong": 24
          },
          {
            "name": "Niềng",
            "cp": 5665208,
            "dataCount": 5,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 3102210,
            "dataCount": 7,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 2919845,
            "dataCount": 25,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đồng Tháp",
        "costVAT": 18319653,
        "revenue": 51600000,
        "cpDichVu": 18319653,
        "cpTong": 16264354,
        "totalData": 39,
        "dataChatLuong": 30,
        "services": [
          {
            "name": "Implant",
            "cp": 7780841,
            "dataCount": 5,
            "dataChatLuong": 30
          },
          {
            "name": "Niềng",
            "cp": 3973042,
            "dataCount": 5,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 3575125,
            "dataCount": 4,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 2990645,
            "dataCount": 25,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Sóc Trăng",
        "costVAT": 11876628,
        "revenue": 16200000,
        "cpDichVu": 11876629,
        "cpTong": 10544178,
        "totalData": 7,
        "dataChatLuong": 8,
        "services": [
          {
            "name": "Implant",
            "cp": 2664847,
            "dataCount": 0,
            "dataChatLuong": 8
          },
          {
            "name": "Niềng",
            "cp": 3387660,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 2126675,
            "dataCount": 3,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 3697447,
            "dataCount": 4,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Lạt",
        "costVAT": 20164978,
        "revenue": 32800000,
        "cpDichVu": 20164978,
        "cpTong": 17902650,
        "totalData": 32,
        "dataChatLuong": 30,
        "services": [
          {
            "name": "Implant",
            "cp": 7440562,
            "dataCount": 4,
            "dataChatLuong": 30
          },
          {
            "name": "Niềng",
            "cp": 5739679,
            "dataCount": 4,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 3305793,
            "dataCount": 2,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 3678944,
            "dataCount": 22,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Gia Kiệm",
        "costVAT": 16178667,
        "revenue": 0,
        "cpDichVu": 16178668,
        "cpTong": 14363567,
        "totalData": 8,
        "dataChatLuong": 6,
        "services": [
          {
            "name": "Implant",
            "cp": 5348583,
            "dataCount": 1,
            "dataChatLuong": 6
          },
          {
            "name": "Niềng",
            "cp": 4223022,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 3781291,
            "dataCount": 2,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 2825772,
            "dataCount": 5,
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
        "totalData": 233,
        "dataChatLuong": 117,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 22,
            "dataChatLuong": 117
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 12,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 15,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 184,
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
        "costVAT": 29452790,
        "revenue": 269198000,
        "cpDichVu": 29452792,
        "cpTong": 25748741,
        "totalData": 77,
        "dataChatLuong": 71,
        "services": [
          {
            "name": "Implant",
            "cp": 11507853,
            "dataCount": 11,
            "dataChatLuong": 71
          },
          {
            "name": "Niềng",
            "cp": 6691087,
            "dataCount": 13,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 7198328,
            "dataCount": 9,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 4055524,
            "dataCount": 44,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Bình Phước",
        "costVAT": 12220990,
        "revenue": 13300000,
        "cpDichVu": 12220992,
        "cpTong": 10684052,
        "totalData": 14,
        "dataChatLuong": 14,
        "services": [
          {
            "name": "Implant",
            "cp": 4902798,
            "dataCount": 1,
            "dataChatLuong": 14
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 7,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 4283342,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 3034852,
            "dataCount": 6,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Biên Hòa",
        "costVAT": 28857830,
        "revenue": 241885000,
        "cpDichVu": 28857830,
        "cpTong": 25228603,
        "totalData": 72,
        "dataChatLuong": 72,
        "services": [
          {
            "name": "Implant",
            "cp": 8883680,
            "dataCount": 12,
            "dataChatLuong": 72
          },
          {
            "name": "Niềng",
            "cp": 8024918,
            "dataCount": 5,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 7875224,
            "dataCount": 23,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 4074008,
            "dataCount": 32,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cần Thơ",
        "costVAT": 24002120,
        "revenue": 76250000,
        "cpDichVu": 24002119,
        "cpTong": 20983557,
        "totalData": 61,
        "dataChatLuong": 29,
        "services": [
          {
            "name": "TH",
            "cp": 5224091,
            "dataCount": 32,
            "dataChatLuong": 29
          },
          {
            "name": "Implant",
            "cp": 7621411,
            "dataCount": 4,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 5975170,
            "dataCount": 10,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 5181447,
            "dataCount": 15,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Nẵng",
        "costVAT": 32711790,
        "revenue": 20300000,
        "cpDichVu": 32711789,
        "cpTong": 28597880,
        "totalData": 22,
        "dataChatLuong": 22,
        "services": [
          {
            "name": "Implant",
            "cp": 12946204,
            "dataCount": 2,
            "dataChatLuong": 22
          },
          {
            "name": "Niềng",
            "cp": 6306684,
            "dataCount": 7,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 7267084,
            "dataCount": 2,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 6191817,
            "dataCount": 11,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Quy Nhơn",
        "costVAT": 19491020,
        "revenue": 102548000,
        "cpDichVu": 19491018,
        "cpTong": 17039783,
        "totalData": 27,
        "dataChatLuong": 27,
        "services": [
          {
            "name": "Implant",
            "cp": 7065673,
            "dataCount": 2,
            "dataChatLuong": 27
          },
          {
            "name": "Niềng",
            "cp": 4577669,
            "dataCount": 6,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 2963056,
            "dataCount": 13,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 4884620,
            "dataCount": 6,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Tây Ninh",
        "costVAT": 17296210,
        "revenue": 38300000,
        "cpDichVu": 17296210,
        "cpTong": 15120998,
        "totalData": 34,
        "dataChatLuong": 32,
        "services": [
          {
            "name": "Implant",
            "cp": 4398532,
            "dataCount": 6,
            "dataChatLuong": 32
          },
          {
            "name": "Niềng",
            "cp": 3866148,
            "dataCount": 5,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 4406788,
            "dataCount": 3,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 4624742,
            "dataCount": 20,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Vũng Tàu",
        "costVAT": 23240310,
        "revenue": 95070000,
        "cpDichVu": 23240311,
        "cpTong": 20317555,
        "totalData": 48,
        "dataChatLuong": 46,
        "services": [
          {
            "name": "Implant",
            "cp": 8051264,
            "dataCount": 5,
            "dataChatLuong": 46
          },
          {
            "name": "Niềng",
            "cp": 4352845,
            "dataCount": 8,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 4461027,
            "dataCount": 6,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 6375175,
            "dataCount": 29,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Dĩ An",
        "costVAT": 12433760,
        "revenue": 4440000,
        "cpDichVu": 12433760,
        "cpTong": 10870061,
        "totalData": 87,
        "dataChatLuong": 87,
        "services": [
          {
            "name": "Implant",
            "cp": 2986092,
            "dataCount": 7,
            "dataChatLuong": 87
          },
          {
            "name": "Niềng",
            "cp": 3803842,
            "dataCount": 5,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 2805101,
            "dataCount": 11,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 2838725,
            "dataCount": 64,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "HCM",
        "costVAT": 445757320,
        "revenue": 2375006240,
        "cpDichVu": 445757319,
        "cpTong": 389697847,
        "totalData": 659,
        "dataChatLuong": 625,
        "services": [
          {
            "name": "Implant",
            "cp": 167803633,
            "dataCount": 64,
            "dataChatLuong": 625
          },
          {
            "name": "Niềng",
            "cp": 78270483,
            "dataCount": 115,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 80448405,
            "dataCount": 56,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 119234798,
            "dataCount": 424,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Việt Kiều",
        "costVAT": 84393970,
        "revenue": 143000000,
        "cpDichVu": 84393967,
        "cpTong": 73780386,
        "totalData": 53,
        "dataChatLuong": 53,
        "services": [
          {
            "name": "Việt Kiều",
            "cp": 84393967,
            "dataCount": 53,
            "dataChatLuong": 53
          }
        ]
      },
      {
        "name": "Bạc Liêu",
        "costVAT": 7434340,
        "revenue": 51750000,
        "cpDichVu": 7434340,
        "cpTong": 6499380,
        "totalData": 17,
        "dataChatLuong": 17,
        "services": [
          {
            "name": "Implant",
            "cp": 3056052,
            "dataCount": 3,
            "dataChatLuong": 17
          },
          {
            "name": "Niềng",
            "cp": 1498928,
            "dataCount": 1,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 1225910,
            "dataCount": 4,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 1653450,
            "dataCount": 9,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cà Mau",
        "costVAT": 11891350,
        "revenue": 103550000,
        "cpDichVu": 11891350,
        "cpTong": 10395866,
        "totalData": 32,
        "dataChatLuong": 28,
        "services": [
          {
            "name": "Implant",
            "cp": 3640282,
            "dataCount": 4,
            "dataChatLuong": 28
          },
          {
            "name": "Niềng",
            "cp": 1888461,
            "dataCount": 7,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 1574258,
            "dataCount": 5,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 4788349,
            "dataCount": 16,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đồng Tháp",
        "costVAT": 13317810,
        "revenue": 41500000,
        "cpDichVu": 13317809,
        "cpTong": 11642931,
        "totalData": 22,
        "dataChatLuong": 22,
        "services": [
          {
            "name": "Implant",
            "cp": 4858576,
            "dataCount": 3,
            "dataChatLuong": 22
          },
          {
            "name": "Niềng",
            "cp": 2655417,
            "dataCount": 4,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 2513093,
            "dataCount": 14,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 3290723,
            "dataCount": 1,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Sóc Trăng",
        "costVAT": 8267580,
        "revenue": 12300000,
        "cpDichVu": 8267580,
        "cpTong": 7227830,
        "totalData": 15,
        "dataChatLuong": 15,
        "services": [
          {
            "name": "Implant",
            "cp": 3239069,
            "dataCount": 3,
            "dataChatLuong": 15
          },
          {
            "name": "Niềng",
            "cp": 1194501,
            "dataCount": 1,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 1304506,
            "dataCount": 7,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 2529504,
            "dataCount": 4,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Lạt",
        "costVAT": 14423770,
        "revenue": 3000000,
        "cpDichVu": 14423770,
        "cpTong": 12609803,
        "totalData": 28,
        "dataChatLuong": 23,
        "services": [
          {
            "name": "Implant",
            "cp": 5361614,
            "dataCount": 4,
            "dataChatLuong": 23
          },
          {
            "name": "Niềng",
            "cp": 3483974,
            "dataCount": 2,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 2890137,
            "dataCount": 4,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 2688045,
            "dataCount": 18,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Gia Kiệm",
        "costVAT": 10969970,
        "revenue": 1500000,
        "cpDichVu": 10969971,
        "cpTong": 9590361,
        "totalData": 15,
        "dataChatLuong": 15,
        "services": [
          {
            "name": "Implant",
            "cp": 3733912,
            "dataCount": 2,
            "dataChatLuong": 15
          },
          {
            "name": "Niềng",
            "cp": 2595186,
            "dataCount": 5,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 1715640,
            "dataCount": 6,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 2925233,
            "dataCount": 2,
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
        "totalData": 17,
        "dataChatLuong": 8,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 2,
            "dataChatLuong": 8
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 1,
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
            "dataCount": 14,
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
        "costVAT": 47270060,
        "revenue": 424580000,
        "cpDichVu": 47270060,
        "cpTong": 47270060,
        "totalData": 99,
        "dataChatLuong": 96,
        "services": [
          {
            "name": "Implant",
            "cp": 17008130,
            "dataCount": 17,
            "dataChatLuong": 96
          },
          {
            "name": "Niềng",
            "cp": 10599409,
            "dataCount": 21,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 13690325,
            "dataCount": 15,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 5972196,
            "dataCount": 46,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Bình Phước",
        "costVAT": 20802670,
        "revenue": 2300000,
        "cpDichVu": 20802673,
        "cpTong": 20802670,
        "totalData": 18,
        "dataChatLuong": 18,
        "services": [
          {
            "name": "Implant",
            "cp": 6255220,
            "dataCount": 2,
            "dataChatLuong": 18
          },
          {
            "name": "Niềng",
            "cp": 2719415,
            "dataCount": 4,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 7001438,
            "dataCount": 12,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 4826600,
            "dataCount": 0,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Biên Hòa",
        "costVAT": 42663960,
        "revenue": 632800000,
        "cpDichVu": 42663960,
        "cpTong": 42663960,
        "totalData": 72,
        "dataChatLuong": 65,
        "services": [
          {
            "name": "Implant",
            "cp": 15890493,
            "dataCount": 18,
            "dataChatLuong": 65
          },
          {
            "name": "Niềng",
            "cp": 7896546,
            "dataCount": 14,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 12358233,
            "dataCount": 12,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 6518688,
            "dataCount": 28,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cần Thơ",
        "costVAT": 37071500,
        "revenue": 193717000,
        "cpDichVu": 37071501,
        "cpTong": 37071500,
        "totalData": 62,
        "dataChatLuong": 59,
        "services": [
          {
            "name": "TH",
            "cp": 7719398,
            "dataCount": 27,
            "dataChatLuong": 59
          },
          {
            "name": "Implant",
            "cp": 11799780,
            "dataCount": 10,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 7676294,
            "dataCount": 8,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 9876029,
            "dataCount": 17,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Nẵng",
        "costVAT": 50629360,
        "revenue": 283480000,
        "cpDichVu": 50629361,
        "cpTong": 50629360,
        "totalData": 62,
        "dataChatLuong": 60,
        "services": [
          {
            "name": "Implant",
            "cp": 19342901,
            "dataCount": 4,
            "dataChatLuong": 60
          },
          {
            "name": "Niềng",
            "cp": 10743691,
            "dataCount": 19,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 12111123,
            "dataCount": 8,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 8431646,
            "dataCount": 31,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Quy Nhơn",
        "costVAT": 21782310,
        "revenue": 263500000,
        "cpDichVu": 21782312,
        "cpTong": 21782310,
        "totalData": 38,
        "dataChatLuong": 38,
        "services": [
          {
            "name": "Implant",
            "cp": 6972792,
            "dataCount": 3,
            "dataChatLuong": 38
          },
          {
            "name": "Niềng",
            "cp": 5784695,
            "dataCount": 13,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 4184422,
            "dataCount": 4,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 4840403,
            "dataCount": 18,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Tây Ninh",
        "costVAT": 28087710,
        "revenue": 298060000,
        "cpDichVu": 28087708,
        "cpTong": 28087710,
        "totalData": 34,
        "dataChatLuong": 33,
        "services": [
          {
            "name": "Implant",
            "cp": 8262105,
            "dataCount": 4,
            "dataChatLuong": 33
          },
          {
            "name": "Niềng",
            "cp": 6424941,
            "dataCount": 7,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 7039009,
            "dataCount": 2,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 6361653,
            "dataCount": 21,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Vũng Tàu",
        "costVAT": 35292430,
        "revenue": 607600000,
        "cpDichVu": 35292430,
        "cpTong": 35292430,
        "totalData": 77,
        "dataChatLuong": 69,
        "services": [
          {
            "name": "Implant",
            "cp": 13392306,
            "dataCount": 13,
            "dataChatLuong": 69
          },
          {
            "name": "Niềng",
            "cp": 6867334,
            "dataCount": 12,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 6790312,
            "dataCount": 13,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 8242478,
            "dataCount": 39,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Dĩ An",
        "costVAT": 26168590,
        "revenue": 0,
        "cpDichVu": 26168591,
        "cpTong": 26168590,
        "totalData": 42,
        "dataChatLuong": 40,
        "services": [
          {
            "name": "Implant",
            "cp": 10089118,
            "dataCount": 7,
            "dataChatLuong": 40
          },
          {
            "name": "Niềng",
            "cp": 7460100,
            "dataCount": 2,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 4328858,
            "dataCount": 5,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 4290515,
            "dataCount": 28,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "HCM",
        "costVAT": 713789450,
        "revenue": 5759372000,
        "cpDichVu": 713789450,
        "cpTong": 713789450,
        "totalData": 1213,
        "dataChatLuong": 1133,
        "services": [
          {
            "name": "Implant",
            "cp": 271531470,
            "dataCount": 162,
            "dataChatLuong": 1133
          },
          {
            "name": "Niềng",
            "cp": 123814117,
            "dataCount": 263,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 154412551,
            "dataCount": 119,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 164031312,
            "dataCount": 669,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Việt Kiều",
        "costVAT": 111420920,
        "revenue": 938910000,
        "cpDichVu": 111420967,
        "cpTong": 111420920,
        "totalData": 85,
        "dataChatLuong": 81,
        "services": [
          {
            "name": "Việt Kiều",
            "cp": 111420967,
            "dataCount": 85,
            "dataChatLuong": 81
          }
        ]
      },
      {
        "name": "Bạc Liêu",
        "costVAT": 13775100,
        "revenue": 20240000,
        "cpDichVu": 13775096,
        "cpTong": 13775100,
        "totalData": 20,
        "dataChatLuong": 20,
        "services": [
          {
            "name": "Implant",
            "cp": 4040002,
            "dataCount": 2,
            "dataChatLuong": 20
          },
          {
            "name": "Niềng",
            "cp": 4146717,
            "dataCount": 1,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 1956984,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 3631393,
            "dataCount": 17,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cà Mau",
        "costVAT": 21474250,
        "revenue": 18398000,
        "cpDichVu": 21474246,
        "cpTong": 21474250,
        "totalData": 32,
        "dataChatLuong": 32,
        "services": [
          {
            "name": "Implant",
            "cp": 7056411,
            "dataCount": 4,
            "dataChatLuong": 32
          },
          {
            "name": "Niềng",
            "cp": 3832328,
            "dataCount": 6,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 4001569,
            "dataCount": 6,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 6583938,
            "dataCount": 16,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đồng Tháp",
        "costVAT": 22627600,
        "revenue": 41839000,
        "cpDichVu": 22627594,
        "cpTong": 22627600,
        "totalData": 29,
        "dataChatLuong": 28,
        "services": [
          {
            "name": "Implant",
            "cp": 7832737,
            "dataCount": 4,
            "dataChatLuong": 28
          },
          {
            "name": "Niềng",
            "cp": 5303858,
            "dataCount": 2,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 4679182,
            "dataCount": 2,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 4811817,
            "dataCount": 21,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Sóc Trăng",
        "costVAT": 16113690,
        "revenue": 153900000,
        "cpDichVu": 16113689,
        "cpTong": 16113690,
        "totalData": 19,
        "dataChatLuong": 19,
        "services": [
          {
            "name": "Implant",
            "cp": 3690705,
            "dataCount": 0,
            "dataChatLuong": 19
          },
          {
            "name": "Niềng",
            "cp": 3823706,
            "dataCount": 1,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 3871807,
            "dataCount": 1,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 4727471,
            "dataCount": 17,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Lạt",
        "costVAT": 23106850,
        "revenue": 57870000,
        "cpDichVu": 23106854,
        "cpTong": 23106850,
        "totalData": 31,
        "dataChatLuong": 31,
        "services": [
          {
            "name": "Implant",
            "cp": 8032111,
            "dataCount": 6,
            "dataChatLuong": 31
          },
          {
            "name": "Niềng",
            "cp": 6771077,
            "dataCount": 3,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 3497014,
            "dataCount": 3,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 4806652,
            "dataCount": 19,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Gia Kiệm",
        "costVAT": 13537990,
        "revenue": 0,
        "cpDichVu": 13537993,
        "cpTong": 13537990,
        "totalData": 15,
        "dataChatLuong": 15,
        "services": [
          {
            "name": "Implant",
            "cp": 4651870,
            "dataCount": 0,
            "dataChatLuong": 15
          },
          {
            "name": "Niềng",
            "cp": 4000782,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 1496418,
            "dataCount": 2,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 3388923,
            "dataCount": 13,
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
        "totalData": 406,
        "dataChatLuong": 203,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 34,
            "dataChatLuong": 203
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 44,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 23,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 305,
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
        "costVAT": 44548620,
        "revenue": 362420000,
        "cpDichVu": 44548620,
        "cpTong": 44548620,
        "totalData": 72,
        "dataChatLuong": 67,
        "services": [
          {
            "name": "Implant",
            "cp": 17964720,
            "dataCount": 10,
            "dataChatLuong": 67
          },
          {
            "name": "Niềng",
            "cp": 5025967,
            "dataCount": 7,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 14770411,
            "dataCount": 10,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 6787522,
            "dataCount": 45,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Bình Phước",
        "costVAT": 16250100,
        "revenue": 2700000,
        "cpDichVu": 16250101,
        "cpTong": 16250100,
        "totalData": 14,
        "dataChatLuong": 13,
        "services": [
          {
            "name": "Implant",
            "cp": 5092138,
            "dataCount": 1,
            "dataChatLuong": 13
          },
          {
            "name": "Niềng",
            "cp": 2086491,
            "dataCount": 3,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 5042502,
            "dataCount": 7,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 4028970,
            "dataCount": 3,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Biên Hòa",
        "costVAT": 38539540,
        "revenue": 205300000,
        "cpDichVu": 38539540,
        "cpTong": 38539540,
        "totalData": 58,
        "dataChatLuong": 51,
        "services": [
          {
            "name": "Implant",
            "cp": 14680423,
            "dataCount": 9,
            "dataChatLuong": 51
          },
          {
            "name": "Niềng",
            "cp": 5332596,
            "dataCount": 9,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 14298050,
            "dataCount": 12,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 4228471,
            "dataCount": 28,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cần Thơ",
        "costVAT": 29735990,
        "revenue": 364877000,
        "cpDichVu": 29735990,
        "cpTong": 29735990,
        "totalData": 78,
        "dataChatLuong": 66,
        "services": [
          {
            "name": "TH",
            "cp": 6092086,
            "dataCount": 42,
            "dataChatLuong": 66
          },
          {
            "name": "Implant",
            "cp": 9926303,
            "dataCount": 6,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 5580743,
            "dataCount": 20,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 8136858,
            "dataCount": 10,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Nẵng",
        "costVAT": 36444360,
        "revenue": 109610000,
        "cpDichVu": 36444360,
        "cpTong": 36444360,
        "totalData": 57,
        "dataChatLuong": 55,
        "services": [
          {
            "name": "Implant",
            "cp": 15079228,
            "dataCount": 14,
            "dataChatLuong": 55
          },
          {
            "name": "Niềng",
            "cp": 5052741,
            "dataCount": 8,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 10694293,
            "dataCount": 3,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 5618098,
            "dataCount": 32,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Quy Nhơn",
        "costVAT": 20876050,
        "revenue": 38100000,
        "cpDichVu": 20876050,
        "cpTong": 20876050,
        "totalData": 36,
        "dataChatLuong": 32,
        "services": [
          {
            "name": "Implant",
            "cp": 7472193,
            "dataCount": 6,
            "dataChatLuong": 32
          },
          {
            "name": "Niềng",
            "cp": 2763250,
            "dataCount": 4,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 5144042,
            "dataCount": 2,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 5496565,
            "dataCount": 24,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Tây Ninh",
        "costVAT": 27536270,
        "revenue": 72194000,
        "cpDichVu": 27536270,
        "cpTong": 27536270,
        "totalData": 44,
        "dataChatLuong": 38,
        "services": [
          {
            "name": "Implant",
            "cp": 9229717,
            "dataCount": 9,
            "dataChatLuong": 38
          },
          {
            "name": "Niềng",
            "cp": 3148156,
            "dataCount": 3,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 8057210,
            "dataCount": 6,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 7101187,
            "dataCount": 26,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Vũng Tàu",
        "costVAT": 31562230,
        "revenue": 404100000,
        "cpDichVu": 31562230,
        "cpTong": 31562230,
        "totalData": 75,
        "dataChatLuong": 63,
        "services": [
          {
            "name": "Implant",
            "cp": 10764112,
            "dataCount": 7,
            "dataChatLuong": 63
          },
          {
            "name": "Niềng",
            "cp": 4687680,
            "dataCount": 15,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 9110794,
            "dataCount": 8,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 6999644,
            "dataCount": 45,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Dĩ An",
        "costVAT": 21356590,
        "revenue": 9640000,
        "cpDichVu": 21356590,
        "cpTong": 21356590,
        "totalData": 50,
        "dataChatLuong": 44,
        "services": [
          {
            "name": "Implant",
            "cp": 8050184,
            "dataCount": 8,
            "dataChatLuong": 44
          },
          {
            "name": "Niềng",
            "cp": 3360771,
            "dataCount": 8,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 7775501,
            "dataCount": 7,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 2170134,
            "dataCount": 27,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "HCM",
        "costVAT": 677612530,
        "revenue": 5609179000,
        "cpDichVu": 677612530,
        "cpTong": 677612530,
        "totalData": 1117,
        "dataChatLuong": 984,
        "services": [
          {
            "name": "Implant",
            "cp": 259435492,
            "dataCount": 138,
            "dataChatLuong": 984
          },
          {
            "name": "Niềng",
            "cp": 52556949,
            "dataCount": 181,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 173540199,
            "dataCount": 138,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 192079890,
            "dataCount": 660,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Việt Kiều",
        "costVAT": 109518450,
        "revenue": 482600000,
        "cpDichVu": 109518450,
        "cpTong": 109518450,
        "totalData": 67,
        "dataChatLuong": 67,
        "services": [
          {
            "name": "Việt Kiều",
            "cp": 109518450,
            "dataCount": 67,
            "dataChatLuong": 67
          }
        ]
      },
      {
        "name": "Bạc Liêu",
        "costVAT": 14406480,
        "revenue": 9400000,
        "cpDichVu": 14406480,
        "cpTong": 14406480,
        "totalData": 17,
        "dataChatLuong": 16,
        "services": [
          {
            "name": "Implant",
            "cp": 3961275,
            "dataCount": 0,
            "dataChatLuong": 16
          },
          {
            "name": "Niềng",
            "cp": 2785992,
            "dataCount": 3,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 2765621,
            "dataCount": 4,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 4893592,
            "dataCount": 10,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cà Mau",
        "costVAT": 18157020,
        "revenue": 36500000,
        "cpDichVu": 18157020,
        "cpTong": 18157020,
        "totalData": 32,
        "dataChatLuong": 31,
        "services": [
          {
            "name": "Implant",
            "cp": 5191448,
            "dataCount": 4,
            "dataChatLuong": 31
          },
          {
            "name": "Niềng",
            "cp": 3263853,
            "dataCount": 3,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 3508334,
            "dataCount": 2,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 6193385,
            "dataCount": 23,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đồng Tháp",
        "costVAT": 22761920,
        "revenue": 6100000,
        "cpDichVu": 22761920,
        "cpTong": 22761920,
        "totalData": 39,
        "dataChatLuong": 33,
        "services": [
          {
            "name": "Implant",
            "cp": 8047851,
            "dataCount": 7,
            "dataChatLuong": 33
          },
          {
            "name": "Niềng",
            "cp": 4635157,
            "dataCount": 5,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 5033369,
            "dataCount": 5,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 5045543,
            "dataCount": 22,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Sóc Trăng",
        "costVAT": 17006120,
        "revenue": 2200000,
        "cpDichVu": 17006119,
        "cpTong": 17006120,
        "totalData": 11,
        "dataChatLuong": 11,
        "services": [
          {
            "name": "Implant",
            "cp": 4397571,
            "dataCount": 1,
            "dataChatLuong": 11
          },
          {
            "name": "Niềng",
            "cp": 3291967,
            "dataCount": 3,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 3153494,
            "dataCount": 2,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 6163087,
            "dataCount": 5,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Lạt",
        "costVAT": 18831160,
        "revenue": 160950000,
        "cpDichVu": 18831160,
        "cpTong": 18831160,
        "totalData": 33,
        "dataChatLuong": 32,
        "services": [
          {
            "name": "Implant",
            "cp": 5639541,
            "dataCount": 4,
            "dataChatLuong": 32
          },
          {
            "name": "Niềng",
            "cp": 3649922,
            "dataCount": 6,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 4581300,
            "dataCount": 1,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 4960397,
            "dataCount": 22,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Gia Kiệm",
        "costVAT": 11208960,
        "revenue": 56000000,
        "cpDichVu": 11208970,
        "cpTong": 11208960,
        "totalData": 12,
        "dataChatLuong": 10,
        "services": [
          {
            "name": "Implant",
            "cp": 3823279,
            "dataCount": 4,
            "dataChatLuong": 10
          },
          {
            "name": "Niềng",
            "cp": 2425432,
            "dataCount": 1,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 1494262,
            "dataCount": 1,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 3465997,
            "dataCount": 6,
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
        "totalData": 433,
        "dataChatLuong": 217,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 20,
            "dataChatLuong": 217
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 37,
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
            "dataCount": 357,
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
        "costVAT": 35817340,
        "revenue": 262760000,
        "cpDichVu": 35817341,
        "cpTong": 35817340,
        "totalData": 78,
        "dataChatLuong": 68,
        "services": [
          {
            "name": "Implant",
            "cp": 13201803,
            "dataCount": 6,
            "dataChatLuong": 68
          },
          {
            "name": "Niềng",
            "cp": 2975537,
            "dataCount": 22,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 14245323,
            "dataCount": 12,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 5394678,
            "dataCount": 38,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Bình Phước",
        "costVAT": 8771030,
        "revenue": 3300000,
        "cpDichVu": 8771030,
        "cpTong": 8771030,
        "totalData": 16,
        "dataChatLuong": 16,
        "services": [
          {
            "name": "Implant",
            "cp": 2732970,
            "dataCount": 3,
            "dataChatLuong": 16
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 2,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 4351984,
            "dataCount": 8,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 1686076,
            "dataCount": 3,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Biên Hòa",
        "costVAT": 39968140,
        "revenue": 413549000,
        "cpDichVu": 39968140,
        "cpTong": 39968140,
        "totalData": 79,
        "dataChatLuong": 76,
        "services": [
          {
            "name": "Implant",
            "cp": 13383728,
            "dataCount": 10,
            "dataChatLuong": 76
          },
          {
            "name": "Niềng",
            "cp": 6492146,
            "dataCount": 19,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 12961681,
            "dataCount": 11,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 7130585,
            "dataCount": 39,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cần Thơ",
        "costVAT": 59223450,
        "revenue": 268819000,
        "cpDichVu": 59223449,
        "cpTong": 59223450,
        "totalData": 73,
        "dataChatLuong": 66,
        "services": [
          {
            "name": "TH",
            "cp": 17944032,
            "dataCount": 42,
            "dataChatLuong": 66
          },
          {
            "name": "Implant",
            "cp": 19273059,
            "dataCount": 12,
            "dataChatLuong": 0
          },
          {
            "name": "Niềng",
            "cp": 6635641,
            "dataCount": 10,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 15370717,
            "dataCount": 9,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Nẵng",
        "costVAT": 32931900,
        "revenue": 457650000,
        "cpDichVu": 32931900,
        "cpTong": 32931900,
        "totalData": 51,
        "dataChatLuong": 46,
        "services": [
          {
            "name": "Implant",
            "cp": 14616754,
            "dataCount": 13,
            "dataChatLuong": 46
          },
          {
            "name": "Niềng",
            "cp": 1101855,
            "dataCount": 11,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 10173952,
            "dataCount": 5,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 7039339,
            "dataCount": 22,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Quy Nhơn",
        "costVAT": 22298790,
        "revenue": 249220000,
        "cpDichVu": 22298790,
        "cpTong": 22298790,
        "totalData": 47,
        "dataChatLuong": 42,
        "services": [
          {
            "name": "Implant",
            "cp": 7372725,
            "dataCount": 11,
            "dataChatLuong": 42
          },
          {
            "name": "Niềng",
            "cp": 5014060,
            "dataCount": 3,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 6163760,
            "dataCount": 2,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 3748245,
            "dataCount": 31,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Tây Ninh",
        "costVAT": 30591190,
        "revenue": 44500000,
        "cpDichVu": 30591190,
        "cpTong": 30591190,
        "totalData": 36,
        "dataChatLuong": 33,
        "services": [
          {
            "name": "Implant",
            "cp": 10616745,
            "dataCount": 6,
            "dataChatLuong": 33
          },
          {
            "name": "Niềng",
            "cp": 2447741,
            "dataCount": 5,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 12204672,
            "dataCount": 8,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 5322032,
            "dataCount": 17,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Vũng Tàu",
        "costVAT": 22635440,
        "revenue": 467800000,
        "cpDichVu": 22635441,
        "cpTong": 22635440,
        "totalData": 107,
        "dataChatLuong": 93,
        "services": [
          {
            "name": "Implant",
            "cp": 9715282,
            "dataCount": 12,
            "dataChatLuong": 93
          },
          {
            "name": "Niềng",
            "cp": 2172417,
            "dataCount": 16,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 6397980,
            "dataCount": 14,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 4349762,
            "dataCount": 65,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Dĩ An",
        "costVAT": 15480400,
        "revenue": 59500000,
        "cpDichVu": 15480400,
        "cpTong": 15480400,
        "totalData": 50,
        "dataChatLuong": 47,
        "services": [
          {
            "name": "Implant",
            "cp": 6536360,
            "dataCount": 3,
            "dataChatLuong": 47
          },
          {
            "name": "Niềng",
            "cp": 1942688,
            "dataCount": 9,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 4495877,
            "dataCount": 9,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 2505475,
            "dataCount": 29,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "HCM",
        "costVAT": 732957350,
        "revenue": 3754820000,
        "cpDichVu": 732957350,
        "cpTong": 732957350,
        "totalData": 1166,
        "dataChatLuong": 1043,
        "services": [
          {
            "name": "Implant",
            "cp": 282000390,
            "dataCount": 142,
            "dataChatLuong": 1043
          },
          {
            "name": "Niềng",
            "cp": 42397721,
            "dataCount": 144,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 189543254,
            "dataCount": 114,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 219015985,
            "dataCount": 766,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Việt Kiều",
        "costVAT": 153827090,
        "revenue": 566800000,
        "cpDichVu": 153827090,
        "cpTong": 153827090,
        "totalData": 68,
        "dataChatLuong": 61,
        "services": [
          {
            "name": "Việt Kiều",
            "cp": 153827090,
            "dataCount": 68,
            "dataChatLuong": 61
          }
        ]
      },
      {
        "name": "Bạc Liêu",
        "costVAT": 8890170,
        "revenue": 228350000,
        "cpDichVu": 8890170,
        "cpTong": 8890170,
        "totalData": 23,
        "dataChatLuong": 22,
        "services": [
          {
            "name": "Implant",
            "cp": 1665167,
            "dataCount": 2,
            "dataChatLuong": 22
          },
          {
            "name": "Niềng",
            "cp": 2532786,
            "dataCount": 3,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 1598008,
            "dataCount": 5,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 3094209,
            "dataCount": 13,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Cà Mau",
        "costVAT": 20656970,
        "revenue": 96070000,
        "cpDichVu": 20656971,
        "cpTong": 20656970,
        "totalData": 27,
        "dataChatLuong": 24,
        "services": [
          {
            "name": "Implant",
            "cp": 3596850,
            "dataCount": 4,
            "dataChatLuong": 24
          },
          {
            "name": "Niềng",
            "cp": 7191864,
            "dataCount": 4,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 6340314,
            "dataCount": 4,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 3527943,
            "dataCount": 15,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đồng Tháp",
        "costVAT": 14762510,
        "revenue": 142200000,
        "cpDichVu": 14762509,
        "cpTong": 14762510,
        "totalData": 20,
        "dataChatLuong": 17,
        "services": [
          {
            "name": "Implant",
            "cp": 6563133,
            "dataCount": 3,
            "dataChatLuong": 17
          },
          {
            "name": "Niềng",
            "cp": 2879558,
            "dataCount": 6,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 3712167,
            "dataCount": 3,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 1607651,
            "dataCount": 8,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Sóc Trăng",
        "costVAT": 12119190,
        "revenue": 88429000,
        "cpDichVu": 12119190,
        "cpTong": 12119190,
        "totalData": 14,
        "dataChatLuong": 14,
        "services": [
          {
            "name": "Implant",
            "cp": 2741487,
            "dataCount": 2,
            "dataChatLuong": 14
          },
          {
            "name": "Niềng",
            "cp": 3876906,
            "dataCount": 2,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 2566093,
            "dataCount": 3,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 2934704,
            "dataCount": 7,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Đà Lạt",
        "costVAT": 21047820,
        "revenue": 10150000,
        "cpDichVu": 21047820,
        "cpTong": 21047820,
        "totalData": 37,
        "dataChatLuong": 36,
        "services": [
          {
            "name": "Implant",
            "cp": 4949087,
            "dataCount": 6,
            "dataChatLuong": 36
          },
          {
            "name": "Niềng",
            "cp": 9278138,
            "dataCount": 7,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 2545355,
            "dataCount": 2,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 4275240,
            "dataCount": 22,
            "dataChatLuong": 0
          }
        ]
      },
      {
        "name": "Gia Kiệm",
        "costVAT": 8846440,
        "revenue": 7100000,
        "cpDichVu": 8846440,
        "cpTong": 8846440,
        "totalData": 4,
        "dataChatLuong": 4,
        "services": [
          {
            "name": "Implant",
            "cp": 1383300,
            "dataCount": 0,
            "dataChatLuong": 4
          },
          {
            "name": "Niềng",
            "cp": 1823222,
            "dataCount": 0,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 2109340,
            "dataCount": 2,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 3530578,
            "dataCount": 2,
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
        "totalData": 506,
        "dataChatLuong": 260,
        "services": [
          {
            "name": "Implant",
            "cp": 0,
            "dataCount": 20,
            "dataChatLuong": 260
          },
          {
            "name": "Niềng",
            "cp": 0,
            "dataCount": 34,
            "dataChatLuong": 0
          },
          {
            "name": "Sứ",
            "cp": 0,
            "dataCount": 18,
            "dataChatLuong": 0
          },
          {
            "name": "TH",
            "cp": 0,
            "dataCount": 434,
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "HCM-Imp", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "HCM-Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "HCM-Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "HCM-TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Việt Kiều", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "HCM-Imp", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "HCM-Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "HCM-Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "HCM-TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Việt Kiều", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
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
          { "name": "Implant", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Niềng", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "Sứ", "cp": 0, "dataCount": 0, "dataChatLuong": 0 },
          { "name": "TH", "cp": 0, "dataCount": 0, "dataChatLuong": 0 }
        ]
      }
    ]
  }
];
