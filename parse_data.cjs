const fs = require('fs');

// Helpers and data generator
const monthData = [
  {
    month: 1,
    label: "Tháng 1",
    regions: [
      {
        name: "Bình Dương",
        costVAT: 54146600,
        revenue: 493077000,
        cpDichVu: 46421982,
        cpTong: 21147878,
        services: [
          { name: "Implant", cp: 21147878, dataCount: 19 },
          { name: "Niềng", cp: 7599881, dataCount: 12 },
          { name: "Sứ", cp: 11202603, dataCount: 10 },
          { name: "TH", cp: 6471620, dataCount: 40 }
        ]
      },
      {
        name: "Bình Phước",
        costVAT: 21099901,
        revenue: 9800000,
        cpDichVu: 18089764,
        cpTong: 6041849,
        services: [
          { name: "Implant", cp: 6041849, dataCount: 1 },
          { name: "Niềng", cp: 0, dataCount: 4 },
          { name: "TH", cp: 7615756, dataCount: 11 },
          { name: "Sứ", cp: 4432159, dataCount: 4 }
        ]
      },
      {
        name: "Biên Hòa",
        costVAT: 41109732,
        revenue: 437765000,
        cpDichVu: 35244969,
        cpTong: 11206079,
        services: [
          { name: "Implant", cp: 11206079, dataCount: 10 },
          { name: "Niềng", cp: 8501082, dataCount: 16 },
          { name: "Sứ", cp: 9318952, dataCount: 4 },
          { name: "TH", cp: 6218856, dataCount: 40 }
        ]
      },
      {
        name: "Cần Thơ",
        costVAT: 38684190,
        revenue: 177129000,
        cpDichVu: 33165458,
        cpTong: 6957624,
        services: [
          { name: "TH", cp: 6957624, dataCount: 83 },
          { name: "Implant", cp: 9634373, dataCount: 7 },
          { name: "Niềng", cp: 8095208, dataCount: 9 },
          { name: "Sứ", cp: 8478253, dataCount: 9 }
        ]
      },
      {
        name: "Đà Nẵng",
        costVAT: 56915976,
        revenue: 171150000,
        cpDichVu: 48796276,
        cpTong: 17480655,
        services: [
          { name: "Implant", cp: 17480655, dataCount: 10 },
          { name: "Niềng", cp: 9335730, dataCount: 2 },
          { name: "Sứ", cp: 14324022, dataCount: 4 },
          { name: "TH", cp: 7655869, dataCount: 39 }
        ]
      },
      {
        name: "Quy Nhơn",
        costVAT: 28783242,
        revenue: 170200000,
        cpDichVu: 24676991,
        cpTong: 8854958,
        services: [
          { name: "Implant", cp: 8854958, dataCount: 6 },
          { name: "Niềng", cp: 6223500, dataCount: 3 },
          { name: "Sứ", cp: 3446581, dataCount: 3 },
          { name: "TH", cp: 6151952, dataCount: 20 }
        ]
      },
      {
        name: "Tây Ninh",
        costVAT: 32258264,
        revenue: 316400000,
        cpDichVu: 27656262,
        cpTong: 8022670,
        services: [
          { name: "Implant", cp: 8022670, dataCount: 4 },
          { name: "Niềng", cp: 6319825, dataCount: 6 },
          { name: "Sứ", cp: 6476771, dataCount: 3 },
          { name: "TH", cp: 6836996, dataCount: 31 }
        ]
      },
      {
        name: "Vũng Tàu",
        costVAT: 36929564,
        revenue: 195550000,
        cpDichVu: 31661149,
        cpTong: 10124998,
        services: [
          { name: "Implant", cp: 10124998, dataCount: 10 },
          { name: "Niềng", cp: 6506035, dataCount: 5 },
          { name: "Sứ", cp: 5907556, dataCount: 14 },
          { name: "TH", cp: 9122560, dataCount: 61 }
        ]
      },
      {
        name: "Dĩ An",
        costVAT: 27314317,
        revenue: 53995000,
        cpDichVu: 23417624,
        cpTong: 8357375,
        services: [
          { name: "Implant", cp: 8357375, dataCount: 3 },
          { name: "Niềng", cp: 5363752, dataCount: 8 },
          { name: "Sứ", cp: 5178454, dataCount: 7 },
          { name: "TH", cp: 4518043, dataCount: 31 }
        ]
      },
      {
        name: "HCM",
        costVAT: 607226015,
        revenue: 5099272350,
        cpDichVu: 557881359,
        cpTong: 212030013,
        services: [
          { name: "HCM-Imp", cp: 212030013, dataCount: 101 },
          { name: "HCM-Niềng", cp: 100109870, dataCount: 110 },
          { name: "HCM-Sứ", cp: 108606357, dataCount: 125 },
          { name: "HCM-TH", cp: 137135119, dataCount: 851 }
        ]
      },
      {
        name: "Việt Kiều",
        costVAT: 180991534,
        revenue: 895655000,
        cpDichVu: 155171068,
        cpTong: 155171068,
        services: [
          { name: "Việt Kiều", cp: 155171068, dataCount: 24 }
        ]
      },
      {
        name: "Bạc Liêu",
        costVAT: 12808778,
        revenue: 127849000,
        cpDichVu: 10981463,
        cpTong: 2677322,
        services: [
          { name: "Implant", cp: 2677322, dataCount: 4 },
          { name: "Niềng", cp: 4080030, dataCount: 0 },
          { name: "Sứ", cp: 2393936, dataCount: 5 },
          { name: "TH", cp: 1830175, dataCount: 13 }
        ]
      },
      {
        name: "Cà Mau",
        costVAT: 16411990,
        revenue: 205450000,
        cpDichVu: 14070636,
        cpTong: 3694578,
        services: [
          { name: "Implant", cp: 3694578, dataCount: 3 },
          { name: "Niềng", cp: 5029623, dataCount: 5 },
          { name: "Sứ", cp: 2754170, dataCount: 7 },
          { name: "TH", cp: 2592265, dataCount: 25 }
        ]
      },
      {
        name: "Đồng Tháp",
        costVAT: 18970743,
        revenue: 51600000,
        cpDichVu: 16264354,
        cpTong: 6907901,
        services: [
          { name: "Implant", cp: 6907901, dataCount: 5 },
          { name: "Niềng", cp: 3527303, dataCount: 5 },
          { name: "Sứ", cp: 3174028, dataCount: 4 },
          { name: "TH", cp: 2655122, dataCount: 25 }
        ]
      },
      {
        name: "Sóc Trăng",
        costVAT: 12298729,
        revenue: 16200000,
        cpDichVu: 10544178,
        cpTong: 2365875,
        services: [
          { name: "Implant", cp: 2365875, dataCount: 0 },
          { name: "Niềng", cp: 3007595, dataCount: 0 },
          { name: "Sứ", cp: 1888081, dataCount: 3 },
          { name: "TH", cp: 3282627, dataCount: 4 }
        ]
      },
      {
        name: "Đà Lạt",
        costVAT: 20881651,
        revenue: 32800000,
        cpDichVu: 17902650,
        cpTong: 6605798,
        services: [
          { name: "Implant", cp: 6605798, dataCount: 4 },
          { name: "Niềng", cp: 5095739, dataCount: 4 },
          { name: "Sứ", cp: 2934913, dataCount: 2 },
          { name: "TH", cp: 3266200, dataCount: 22 }
        ]
      },
      {
        name: "Gia Kiệm",
        costVAT: 16753665,
        revenue: 0,
        cpDichVu: 14363567,
        cpTong: 4748520,
        services: [
          { name: "Implant", cp: 4748520, dataCount: 1 },
          { name: "Niềng", cp: 3749237, dataCount: 0 },
          { name: "Sứ", cp: 3357064, dataCount: 2 },
          { name: "TH", cp: 2508746, dataCount: 5 }
        ]
      }
    ]
  },
  {
    month: 2,
    label: "Tháng 2",
    regions: [
      {
        name: "Bình Dương",
        costVAT: 29452790,
        revenue: 269198000,
        cpDichVu: 25611009,
        cpTong: 8521057,
        services: [
          { name: "Implant", cp: 8521057, dataCount: 11 },
          { name: "Niềng", cp: 5087241, dataCount: 13 },
          { name: "Sứ", cp: 6000823, dataCount: 9 },
          { name: "TH", cp: 3099888, dataCount: 44 }
        ]
      },
      {
        name: "Bình Phước",
        costVAT: 12220990,
        revenue: 13300000,
        cpDichVu: 10626888,
        cpTong: 3973755,
        services: [
          { name: "Implant", cp: 3973755, dataCount: 1 },
          { name: "Niềng", cp: 2968861, dataCount: 0 },
          { name: "TH", cp: 2163128, dataCount: 7 },
          { name: "Sứ", cp: 6987326, dataCount: 0 }
        ]
      },
      {
        name: "Biên Hòa",
        costVAT: 28857830,
        revenue: 241885000,
        cpDichVu: 25095368,
        cpTong: 5552733,
        services: [
          { name: "Implant", cp: 5552733, dataCount: 6 },
          { name: "Niềng", cp: 5456356, dataCount: 12 },
          { name: "Sứ", cp: 2870290, dataCount: 5 },
          { name: "TH", cp: 3758353, dataCount: 23 }
        ]
      },
      {
        name: "Cần Thơ",
        costVAT: 24002120,
        revenue: 76250000,
        cpDichVu: 20871131,
        cpTong: 5325209,
        services: [
          { name: "TH", cp: 5325209, dataCount: 32 },
          { name: "Implant", cp: 4654045, dataCount: 4 },
          { name: "Niềng", cp: 3747195, dataCount: 10 },
          { name: "Sứ", cp: 6812438, dataCount: 15 }
        ]
      },
      {
        name: "Đà Nẵng",
        costVAT: 32711790,
        revenue: 20300000,
        cpDichVu: 28445173,
        cpTong: 4515991,
        services: [
          { name: "Implant", cp: 4515991, dataCount: 2 },
          { name: "Niềng", cp: 6274490, dataCount: 7 },
          { name: "Sứ", cp: 4500329, dataCount: 2 },
          { name: "TH", cp: 5237597, dataCount: 11 }
        ]
      },
      {
        name: "Quy Nhơn",
        costVAT: 19491020,
        revenue: 102548000,
        cpDichVu: 16948796,
        cpTong: 3380750,
        services: [
          { name: "Implant", cp: 3380750, dataCount: 2 },
          { name: "Niềng", cp: 3030282, dataCount: 2 },
          { name: "Sứ", cp: 3435746, dataCount: 7 },
          { name: "TH", cp: 2757968, dataCount: 13 }
        ]
      },
      {
        name: "Tây Ninh",
        costVAT: 17296210,
        revenue: 38300000,
        cpDichVu: 15040212,
        cpTong: 2837871,
        services: [
          { name: "Implant", cp: 2837871, dataCount: 6 },
          { name: "Niềng", cp: 3712350, dataCount: 5 },
          { name: "Sứ", cp: 3381858, dataCount: 3 },
          { name: "TH", cp: 5441984, dataCount: 20 }
        ]
      },
      {
        name: "Vũng Tàu",
        costVAT: 23240310,
        revenue: 95070000,
        cpDichVu: 20209149,
        cpTong: 3183181,
        services: [
          { name: "Implant", cp: 3183181, dataCount: 5 },
          { name: "Niềng", cp: 2895318, dataCount: 8 },
          { name: "Sứ", cp: 4626132, dataCount: 6 },
          { name: "TH", cp: 1831830, dataCount: 29 }
        ]
      },
      {
        name: "Dĩ An",
        costVAT: 12433760,
        revenue: 4440000,
        cpDichVu: 10811964,
        cpTong: 2639146,
        services: [
          { name: "Implant", cp: 2639146, dataCount: 4 },
          { name: "Niềng", cp: 2062758, dataCount: 7 },
          { name: "Sứ", cp: 2121018, dataCount: 5 },
          { name: "TH", cp: 114042490, dataCount: 11 }
        ]
      },
      {
        name: "HCM",
        costVAT: 445757320,
        revenue: 2375006240,
        cpDichVu: 387612185,
        cpTong: 54719740,
        services: [
          { name: "HCM-Imp", cp: 54719740, dataCount: 64 },
          { name: "HCM-Niềng", cp: 57151819, dataCount: 115 },
          { name: "HCM-Sứ", cp: 86428755, dataCount: 56 },
          { name: "HCM-TH", cp: 63286861, dataCount: 424 }
        ]
      },
      {
        name: "Việt Kiều",
        costVAT: 84393970,
        revenue: 143000000,
        cpDichVu: 73386060,
        cpTong: 2113394,
        services: [
          { name: "Việt Kiều", cp: 2113394, dataCount: 53 }
        ]
      },
      {
        name: "Bạc Liêu",
        costVAT: 7434340,
        revenue: 51750000,
        cpDichVu: 6464643,
        cpTong: 1109536,
        services: [
          { name: "Implant", cp: 1109536, dataCount: 3 },
          { name: "Niềng", cp: 754065, dataCount: 1 },
          { name: "Sứ", cp: 1148060, dataCount: 4 },
          { name: "TH", cp: 2422822, dataCount: 9 }
        ]
      },
      {
        name: "Cà Mau",
        costVAT: 11891350,
        revenue: 103550000,
        cpDichVu: 10340304,
        cpTong: 1307566,
        services: [
          { name: "Implant", cp: 1307566, dataCount: 4 },
          { name: "Niềng", cp: 1083989, dataCount: 7 },
          { name: "Sứ", cp: 3097922, dataCount: 5 },
          { name: "TH", cp: 3191470, dataCount: 16 }
        ]
      },
      {
        name: "Đồng Tháp",
        costVAT: 13317810,
        revenue: 41500000,
        cpDichVu: 11580704,
        cpTong: 2059875,
        services: [
          { name: "Implant", cp: 2059875, dataCount: 0 },
          { name: "Niềng", cp: 1384618, dataCount: 3 },
          { name: "Sứ", cp: 2325538, dataCount: 4 },
          { name: "TH", cp: 1821245, dataCount: 14 }
        ]
      },
      {
        name: "Sóc Trăng",
        costVAT: 8267580,
        revenue: 12300000,
        cpDichVu: 7189200,
        cpTong: 944047,
        services: [
          { name: "Implant", cp: 944047, dataCount: 1 },
          { name: "Niềng", cp: 746289, dataCount: 3 },
          { name: "Sứ", cp: 1780472, dataCount: 1 },
          { name: "TH", cp: 3712779, dataCount: 7 }
        ]
      },
      {
        name: "Đà Lạt",
        costVAT: 14423770,
        revenue: 3000000,
        cpDichVu: 12542408,
        cpTong: 2265736,
        services: [
          { name: "Implant", cp: 2265736, dataCount: 4 },
          { name: "Niềng", cp: 2145715, dataCount: 2 },
          { name: "Sứ", cp: 1892222, dataCount: 4 },
          { name: "TH", cp: 2381701, dataCount: 18 }
        ]
      },
      {
        name: "Gia Kiệm",
        costVAT: 10969970,
        revenue: 1500000,
        cpDichVu: 9539104,
        cpTong: 2006840,
        services: [
          { name: "Implant", cp: 2006840, dataCount: 0 },
          { name: "Niềng", cp: 1277996, dataCount: 2 },
          { name: "Sứ", cp: 2458156, dataCount: 5 },
          { name: "TH", cp: 0, dataCount: 6 }
        ]
      }
    ]
  },
  {
    month: 3,
    label: "Tháng 3",
    regions: [
      {
        name: "Bình Dương",
        costVAT: 48606823,
        revenue: 424580000,
        cpDichVu: 41672604,
        cpTong: 15513806,
        services: [
          { name: "Implant", cp: 15513806, dataCount: 16 },
          { name: "Niềng", cp: 9353195, dataCount: 21 },
          { name: "Sứ", cp: 11535491, dataCount: 15 },
          { name: "TH", cp: 5270024, dataCount: 44 }
        ]
      },
      {
        name: "Bình Phước",
        costVAT: 21386555,
        revenue: 2300000,
        cpDichVu: 18335355,
        cpTong: 5518974,
        services: [
          { name: "Implant", cp: 5518974, dataCount: 2 },
          { name: "Niềng", cp: 2399683, dataCount: 4 },
          { name: "TH", cp: 6201785, dataCount: 12 },
          { name: "Sứ", cp: 4215082, dataCount: 0 }
        ]
      },
      {
        name: "Biên Hòa",
        costVAT: 44257816,
        revenue: 632800000,
        cpDichVu: 37943809,
        cpTong: 13677209,
        services: [
          { name: "Implant", cp: 13677209, dataCount: 16 },
          { name: "Niềng", cp: 6968120, dataCount: 13 },
          { name: "Sứ", cp: 11546354, dataCount: 11 },
          { name: "TH", cp: 5752261, dataCount: 25 }
        ]
      },
      {
        name: "Cần Thơ",
        costVAT: 38146405,
        revenue: 193717000,
        cpDichVu: 32703800,
        cpTong: 6811800,
        services: [
          { name: "TH", cp: 6811800, dataCount: 27 },
          { name: "Implant", cp: 10251696, dataCount: 10 },
          { name: "Niềng", cp: 6816204, dataCount: 8 },
          { name: "Sứ", cp: 8824694, dataCount: 14 }
        ]
      },
      {
        name: "Đà Nẵng",
        costVAT: 52251295,
        revenue: 283480000,
        cpDichVu: 44792567,
        cpTong: 15886807,
        services: [
          { name: "Implant", cp: 15886807, dataCount: 3 },
          { name: "Niềng", cp: 9525856, dataCount: 19 },
          { name: "Sứ", cp: 11944094, dataCount: 8 },
          { name: "TH", cp: 7440307, dataCount: 30 }
        ]
      },
      {
        name: "Quy Nhơn",
        costVAT: 22419707,
        revenue: 263500000,
        cpDichVu: 19221200,
        cpTong: 6152974,
        services: [
          { name: "Implant", cp: 6152974, dataCount: 3 },
          { name: "Niềng", cp: 5104566, dataCount: 13 },
          { name: "Sứ", cp: 3692444, dataCount: 4 },
          { name: "TH", cp: 4271301, dataCount: 18 }
        ]
      },
      {
        name: "Tây Ninh",
        costVAT: 29181091,
        revenue: 298060000,
        cpDichVu: 25017983,
        cpTong: 7776089,
        services: [
          { name: "Implant", cp: 7776089, dataCount: 4 },
          { name: "Niềng", cp: 5669537, dataCount: 7 },
          { name: "Sứ", cp: 5958767, dataCount: 2 },
          { name: "TH", cp: 5613690, dataCount: 20 }
        ]
      },
      {
        name: "Vũng Tàu",
        costVAT: 36013892,
        revenue: 607600000,
        cpDichVu: 30876010,
        cpTong: 11919297,
        services: [
          { name: "Implant", cp: 11919297, dataCount: 10 },
          { name: "Niềng", cp: 6059915, dataCount: 11 },
          { name: "Sứ", cp: 5640013, dataCount: 13 },
          { name: "TH", cp: 7256883, dataCount: 35 }
        ]
      },
      {
        name: "Dĩ An",
        costVAT: 26571783,
        revenue: 0,
        cpDichVu: 22780921,
        cpTong: 8155085,
        services: [
          { name: "Implant", cp: 8155085, dataCount: 6 },
          { name: "Niềng", cp: 6582987, dataCount: 2 },
          { name: "Sứ", cp: 4256887, dataCount: 5 },
          { name: "TH", cp: 3786062, dataCount: 27 }
        ]
      },
      {
        name: "HCM",
        costVAT: 698132560,
        revenue: 4619606000,
        cpDichVu: 598558730,
        cpTong: 234701227,
        services: [
          { name: "HCM-Imp", cp: 234701227, dataCount: 141 },
          { name: "HCM-Niềng", cp: 110223913, dataCount: 251 },
          { name: "HCM-Sứ", cp: 136242777, dataCount: 116 },
          { name: "HCM-TH", cp: 148991813, dataCount: 624 }
        ]
      },
      {
        name: "Việt Kiều",
        costVAT: 114700525,
        revenue: 938910000,
        cpDichVu: 98337213,
        cpTong: 98337213,
        services: [
          { name: "Việt Kiều", cp: 98337213, dataCount: 81 }
        ]
      },
      {
        name: "Bạc Liêu",
        costVAT: 13871008,
        revenue: 20240000,
        cpDichVu: 11892154,
        cpTong: 3381198,
        services: [
          { name: "Implant", cp: 3381198, dataCount: 2 },
          { name: "Niềng", cp: 3659172, dataCount: 1 },
          { name: "Sứ", cp: 1647347, dataCount: 0 },
          { name: "TH", cp: 3204437, dataCount: 17 }
        ]
      },
      {
        name: "Cà Mau",
        costVAT: 22551036,
        revenue: 18398000,
        cpDichVu: 19333879,
        cpTong: 6608605,
        services: [
          { name: "Implant", cp: 6608605, dataCount: 4 },
          { name: "Niềng", cp: 3381748, dataCount: 6 },
          { name: "Sứ", cp: 3259058, dataCount: 6 },
          { name: "TH", cp: 6084468, dataCount: 16 }
        ]
      },
      {
        name: "Đồng Tháp",
        costVAT: 23338416,
        revenue: 41839000,
        cpDichVu: 20008907,
        cpTong: 7175295,
        services: [
          { name: "Implant", cp: 7175295, dataCount: 4 },
          { name: "Niềng", cp: 4680265, dataCount: 2 },
          { name: "Sứ", cp: 3907298, dataCount: 2 },
          { name: "TH", cp: 4246072, dataCount: 20 }
        ]
      },
      {
        name: "Sóc Trăng",
        costVAT: 16481555,
        revenue: 153900000,
        cpDichVu: 14130277,
        cpTong: 2876402,
        services: [
          { name: "Implant", cp: 2876402, dataCount: 0 },
          { name: "Niềng", cp: 3374138, dataCount: 1 },
          { name: "Sứ", cp: 3708091, dataCount: 1 },
          { name: "TH", cp: 4171646, dataCount: 17 }
        ]
      },
      {
        name: "Đà Lạt",
        costVAT: 23799584,
        revenue: 57870000,
        cpDichVu: 20404307,
        cpTong: 7101265,
        services: [
          { name: "Implant", cp: 7101265, dataCount: 6 },
          { name: "Niềng", cp: 6354502, dataCount: 3 },
          { name: "Sứ", cp: 2940889, dataCount: 3 },
          { name: "TH", cp: 4007651, dataCount: 19 }
        ]
      },
      {
        name: "Gia Kiệm",
        costVAT: 13904387,
        revenue: 0,
        cpDichVu: 11920771,
        cpTong: 4097051,
        services: [
          { name: "Implant", cp: 4097051, dataCount: 0 },
          { name: "Niềng", cp: 3643804, dataCount: 0 },
          { name: "Sứ", cp: 1270883, dataCount: 2 },
          { name: "TH", cp: 2909033, dataCount: 13 }
        ]
      }
    ]
  },
  {
    month: 4,
    label: "Tháng 4",
    regions: [
      {
        name: "Bình Dương",
        costVAT: 44548620,
        revenue: 362420000,
        cpDichVu: 38289886,
        cpTong: 17964720,
        services: [
          { name: "Implant", cp: 17964720, dataCount: 10 },
          { name: "Niềng", cp: 5025967, dataCount: 7 },
          { name: "Sứ", cp: 14770411, dataCount: 10 },
          { name: "TH", cp: 6787522, dataCount: 45 }
        ]
      },
      {
        name: "Bình Phước",
        costVAT: 16250100,
        revenue: 2700000,
        cpDichVu: 13928100,
        cpTong: 5092138,
        services: [
          { name: "Implant", cp: 5092138, dataCount: 1 },
          { name: "Niềng", cp: 2086491, dataCount: 3 },
          { name: "TH", cp: 5042502, dataCount: 7 },
          { name: "Sứ", cp: 4028970, dataCount: 3 }
        ]
      },
      {
        name: "Biên Hòa",
        costVAT: 38539540,
        revenue: 205300000,
        cpDichVu: 33039540,
        cpTong: 14680423,
        services: [
          { name: "Implant", cp: 14680423, dataCount: 9 },
          { name: "Niềng", cp: 5332596, dataCount: 9 },
          { name: "Sứ", cp: 14298050, dataCount: 12 },
          { name: "TH", cp: 4228471, dataCount: 28 }
        ]
      },
      {
        name: "Cần Thơ",
        costVAT: 29735990,
        revenue: 364877000,
        cpDichVu: 25487990,
        cpTong: 6092086,
        services: [
          { name: "TH", cp: 6092086, dataCount: 42 },
          { name: "Implant", cp: 9926303, dataCount: 6 },
          { name: "Niềng", cp: 5580743, dataCount: 20 },
          { name: "Sứ", cp: 8136858, dataCount: 10 }
        ]
      },
      {
        name: "Đà Nẵng",
        costVAT: 36444360,
        revenue: 109610000,
        cpDichVu: 31238030,
        cpTong: 15079228,
        services: [
          { name: "Implant", cp: 15079228, dataCount: 14 },
          { name: "Niềng", cp: 5052741, dataCount: 8 },
          { name: "Sứ", cp: 10694293, dataCount: 3 },
          { name: "TH", cp: 5618098, dataCount: 32 }
        ]
      },
      {
        name: "Quy Nhơn",
        costVAT: 20876050,
        revenue: 38100000,
        cpDichVu: 17893750,
        cpTong: 7472193,
        services: [
          { name: "Implant", cp: 7472193, dataCount: 6 },
          { name: "Niềng", cp: 2763250, dataCount: 4 },
          { name: "Sứ", cp: 5144042, dataCount: 2 },
          { name: "TH", cp: 5496565, dataCount: 24 }
        ]
      },
      {
        name: "Tây Ninh",
        costVAT: 27536270,
        revenue: 72194000,
        cpDichVu: 23602810,
        cpTong: 9229717,
        services: [
          { name: "Implant", cp: 9229717, dataCount: 9 },
          { name: "Niềng", cp: 3148156, dataCount: 3 },
          { name: "Sứ", cp: 8057210, dataCount: 6 },
          { name: "TH", cp: 7101187, dataCount: 26 }
        ]
      },
      {
        name: "Vũng Tàu",
        costVAT: 31562230,
        revenue: 404100000,
        cpDichVu: 27053030,
        cpTong: 10764112,
        services: [
          { name: "Implant", cp: 10764112, dataCount: 7 },
          { name: "Niềng", cp: 4687680, dataCount: 15 },
          { name: "Sứ", cp: 9110794, dataCount: 8 },
          { name: "TH", cp: 6999644, dataCount: 45 }
        ]
      },
      {
        name: "Dĩ An",
        costVAT: 21356590,
        revenue: 9640000,
        cpDichVu: 18305650,
        cpTong: 8050184,
        services: [
          { name: "Implant", cp: 8050184, dataCount: 8 },
          { name: "Niềng", cp: 3360771, dataCount: 8 },
          { name: "Sứ", cp: 7775501, dataCount: 7 },
          { name: "TH", cp: 2170134, dataCount: 27 }
        ]
      },
      {
        name: "HCM",
        costVAT: 677612530,
        revenue: 5609179000,
        cpDichVu: 580807530,
        cpTong: 259435492,
        services: [
          { name: "HCM-Imp", cp: 259435492, dataCount: 138 },
          { name: "HCM-Niềng", cp: 52556949, dataCount: 181 },
          { name: "HCM-Sứ", cp: 173540199, dataCount: 138 },
          { name: "HCM-TH", cp: 192079890, dataCount: 660 }
        ]
      },
      {
        name: "Việt Kiều",
        costVAT: 109518450,
        revenue: 482600000,
        cpDichVu: 93872950,
        cpTong: 109518450,
        services: [
          { name: "Việt Kiều", cp: 109518450, dataCount: 67 }
        ]
      },
      {
        name: "Bạc Liêu",
        costVAT: 14406480,
        revenue: 9400000,
        cpDichVu: 12348480,
        cpTong: 3961275,
        services: [
          { name: "Implant", cp: 3961275, dataCount: 0 },
          { name: "Niềng", cp: 2785992, dataCount: 3 },
          { name: "Sứ", cp: 2765621, dataCount: 4 },
          { name: "TH", cp: 4893592, dataCount: 10 }
        ]
      },
      {
        name: "Cà Mau",
        costVAT: 18157020,
        revenue: 36500000,
        cpDichVu: 15563160,
        cpTong: 5191448,
        services: [
          { name: "Implant", cp: 5191448, dataCount: 4 },
          { name: "Niềng", cp: 3263853, dataCount: 3 },
          { name: "Sứ", cp: 3508334, dataCount: 2 },
          { name: "TH", cp: 6193385, dataCount: 23 }
        ]
      },
      {
        name: "Đồng Tháp",
        costVAT: 22761920,
        revenue: 6100000,
        cpDichVu: 19510220,
        cpTong: 8047851,
        services: [
          { name: "Implant", cp: 8047851, dataCount: 7 },
          { name: "Niềng", cp: 4635157, dataCount: 5 },
          { name: "Sứ", cp: 5033369, dataCount: 5 },
          { name: "TH", cp: 5045543, dataCount: 22 }
        ]
      },
      {
        name: "Sóc Trăng",
        costVAT: 17006120,
        revenue: 2200000,
        cpDichVu: 14576680,
        cpTong: 4397571,
        services: [
          { name: "Implant", cp: 4397571, dataCount: 1 },
          { name: "Niềng", cp: 3291967, dataCount: 3 },
          { name: "Sứ", cp: 3153494, dataCount: 2 },
          { name: "TH", cp: 6163087, dataCount: 5 }
        ]
      },
      {
        name: "Đà Lạt",
        costVAT: 18831160,
        revenue: 160950000,
        cpDichVu: 16141000,
        cpTong: 5639541,
        services: [
          { name: "Implant", cp: 5639541, dataCount: 4 },
          { name: "Niềng", cp: 3649922, dataCount: 6 },
          { name: "Sứ", cp: 4581300, dataCount: 1 },
          { name: "TH", cp: 4960397, dataCount: 22 }
        ]
      },
      {
        name: "Gia Kiệm",
        costVAT: 11208970,
        revenue: 56000000,
        cpDichVu: 9607690,
        cpTong: 3823279,
        services: [
          { name: "Implant", cp: 3823279, dataCount: 4 },
          { name: "Niềng", cp: 2425432, dataCount: 1 },
          { name: "Sứ", cp: 1494262, dataCount: 1 },
          { name: "TH", cp: 3465997, dataCount: 6 }
        ]
      }
    ]
  },
  {
    month: 5,
    label: "Tháng 5",
    regions: [
      {
        name: "Bình Dương",
        costVAT: 35839187,
        revenue: 262760000,
        cpDichVu: 30815462,
        cpTong: 13201803,
        services: [
          { name: "Implant", cp: 13201803, dataCount: 5 },
          { name: "Niềng", cp: 2975537, dataCount: 22 },
          { name: "Sứ", cp: 14245323, dataCount: 12 },
          { name: "TH", cp: 5394678, dataCount: 35 }
        ]
      },
      {
        name: "Bình Phước",
        costVAT: 8748188,
        revenue: 3300000,
        cpDichVu: 7521743,
        cpTong: 2732970,
        services: [
          { name: "Implant", cp: 2732970, dataCount: 2 },
          { name: "Niềng", cp: 0, dataCount: 2 },
          { name: "TH", cp: 4351984, dataCount: 8 },
          { name: "Sứ", cp: 1686076, dataCount: 2 }
        ]
      },
      {
        name: "Biên Hòa",
        costVAT: 39951401,
        revenue: 413549000,
        cpDichVu: 34351886,
        cpTong: 13383728,
        services: [
          { name: "Implant", cp: 13383728, dataCount: 10 },
          { name: "Niềng", cp: 6492146, dataCount: 19 },
          { name: "Sứ", cp: 12961681, dataCount: 11 },
          { name: "TH", cp: 7130585, dataCount: 39 }
        ]
      },
      {
        name: "Cần Thơ",
        costVAT: 58363444,
        revenue: 268819000,
        cpDichVu: 50183444,
        cpTong: 17944032,
        services: [
          { name: "TH", cp: 17944032, dataCount: 41 },
          { name: "Implant", cp: 19273059, dataCount: 12 },
          { name: "Niềng", cp: 6635641, dataCount: 10 },
          { name: "Sứ", cp: 15370717, dataCount: 8 }
        ]
      },
      {
        name: "Đà Nẵng",
        costVAT: 32786091,
        revenue: 457650000,
        cpDichVu: 28190928,
        cpTong: 14616754,
        services: [
          { name: "Implant", cp: 14616754, dataCount: 13 },
          { name: "Niềng", cp: 1101855, dataCount: 11 },
          { name: "Sứ", cp: 10173952, dataCount: 5 },
          { name: "TH", cp: 7039339, dataCount: 22 }
        ]
      },
      {
        name: "Quy Nhơn",
        costVAT: 22339621,
        revenue: 249220000,
        cpDichVu: 19192110,
        cpTong: 7372725,
        services: [
          { name: "Implant", cp: 7372725, dataCount: 11 },
          { name: "Niềng", cp: 5014060, dataCount: 3 },
          { name: "Sứ", cp: 6163760, dataCount: 2 },
          { name: "TH", cp: 3748245, dataCount: 29 }
        ]
      },
      {
        name: "Tây Ninh",
        costVAT: 30629595,
        revenue: 44500000,
        cpDichVu: 26290883,
        cpTong: 10616745,
        services: [
          { name: "Implant", cp: 10616745, dataCount: 6 },
          { name: "Niềng", cp: 2447741, dataCount: 5 },
          { name: "Sứ", cp: 12204672, dataCount: 8 },
          { name: "TH", cp: 5322032, dataCount: 15 }
        ]
      },
      {
        name: "Vũng Tàu",
        costVAT: 22672091,
        revenue: 467800000,
        cpDichVu: 19494830,
        cpTong: 9715282,
        services: [
          { name: "Implant", cp: 9715282, dataCount: 12 },
          { name: "Niềng", cp: 2172417, dataCount: 15 },
          { name: "Sứ", cp: 6397980, dataCount: 14 },
          { name: "TH", cp: 4349762, dataCount: 64 }
        ]
      },
      {
        name: "Dĩ An",
        costVAT: 15490678,
        revenue: 59500000,
        cpDichVu: 13306380,
        cpTong: 6536360,
        services: [
          { name: "Implant", cp: 6536360, dataCount: 3 },
          { name: "Niềng", cp: 1942688, dataCount: 8 },
          { name: "Sứ", cp: 4495877, dataCount: 9 },
          { name: "TH", cp: 2505475, dataCount: 28 }
        ]
      },
      {
        name: "HCM",
        costVAT: 734154173,
        revenue: 3754820000,
        cpDichVu: 630017173,
        cpTong: 282000390,
        services: [
          { name: "HCM-Imp", cp: 282000390, dataCount: 141 },
          { name: "HCM-Niềng", cp: 42397721, dataCount: 142 },
          { name: "HCM-Sứ", cp: 189543254, dataCount: 113 },
          { name: "HCM-TH", cp: 219015985, dataCount: 746 }
        ]
      },
      {
        name: "Việt Kiều",
        costVAT: 153909066,
        revenue: 566800000,
        cpDichVu: 131922090,
        cpTong: 153827090,
        services: [
          { name: "Việt Kiều", cp: 153827090, dataCount: 66 }
        ]
      },
      {
        name: "Bạc Liêu",
        costVAT: 8819903,
        revenue: 228350000,
        cpDichVu: 7567703,
        cpTong: 1665167,
        services: [
          { name: "Implant", cp: 1665167, dataCount: 2 },
          { name: "Niềng", cp: 2532786, dataCount: 3 },
          { name: "Sứ", cp: 1598008, dataCount: 5 },
          { name: "TH", cp: 3094209, dataCount: 12 }
        ]
      },
      {
        name: "Cà Mau",
        costVAT: 20643988,
        revenue: 96070000,
        cpDichVu: 17698971,
        cpTong: 3596850,
        services: [
          { name: "Implant", cp: 3596850, dataCount: 4 },
          { name: "Niềng", cp: 7191864, dataCount: 4 },
          { name: "Sứ", cp: 6340314, dataCount: 4 },
          { name: "TH", cp: 3527943, dataCount: 15 }
        ]
      },
      {
        name: "Đồng Tháp",
        costVAT: 14770423,
        revenue: 142200000,
        cpDichVu: 12662423,
        cpTong: 6563133,
        services: [
          { name: "Implant", cp: 6563133, dataCount: 3 },
          { name: "Niềng", cp: 2879558, dataCount: 6 },
          { name: "Sứ", cp: 3712167, dataCount: 3 },
          { name: "TH", cp: 1607651, dataCount: 8 }
        ]
      },
      {
        name: "Sóc Trăng",
        costVAT: 12268889,
        revenue: 88429000,
        cpDichVu: 10519103,
        cpTong: 2741487,
        services: [
          { name: "Implant", cp: 2741487, dataCount: 2 },
          { name: "Niềng", cp: 3876906, dataCount: 2 },
          { name: "Sứ", cp: 2566093, dataCount: 3 },
          { name: "TH", cp: 2934704, dataCount: 7 }
        ]
      },
      {
        name: "Đà Lạt",
        costVAT: 21111233,
        revenue: 10150000,
        cpDichVu: 18097820,
        cpTong: 4949087,
        services: [
          { name: "Implant", cp: 4949087, dataCount: 6 },
          { name: "Niềng", cp: 9278138, dataCount: 7 },
          { name: "Sứ", cp: 2545355, dataCount: 2 },
          { name: "TH", cp: 4275240, dataCount: 21 }
        ]
      },
      {
        name: "Gia Kiệm",
        costVAT: 8840522,
        revenue: 7100000,
        cpDichVu: 7576440,
        cpTong: 1383300,
        services: [
          { name: "Implant", cp: 1383300, dataCount: 0 },
          { name: "Niềng", cp: 1823222, dataCount: 0 },
          { name: "Sứ", cp: 2109340, dataCount: 2 },
          { name: "TH", cp: 3530578, dataCount: 2 }
        ]
      }
    ]
  },
  {
    month: 6,
    label: "Tháng 6",
    regions: [
      {
        name: "Bình Dương",
        costVAT: 30103289,
        revenue: 521012000,
        cpDichVu: 25802825,
        cpTong: 0,
        services: [
          { name: "Implant", cp: 0, dataCount: 11 },
          { name: "Niềng", cp: 0, dataCount: 18 },
          { name: "Sứ", cp: 0, dataCount: 13 },
          { name: "TH", cp: 0, dataCount: 56 }
        ]
      },
      {
        name: "Bình Phước",
        costVAT: 8441639,
        revenue: 5500000,
        cpDichVu: 7235691,
        cpTong: 0,
        services: [
          { name: "Implant", cp: 0, dataCount: 2 },
          { name: "Niềng", cp: 0, dataCount: 3 },
          { name: "TH", cp: 0, dataCount: 12 },
          { name: "Sứ", cp: 0, dataCount: 6 }
        ]
      },
      {
        name: "Biên Hòa",
        costVAT: 37553754,
        revenue: 494100000,
        cpDichVu: 32188932,
        cpTong: 0,
        services: [
          { name: "Implant", cp: 0, dataCount: 11 },
          { name: "Niềng", cp: 0, dataCount: 14 },
          { name: "Sứ", cp: 0, dataCount: 13 },
          { name: "TH", cp: 0, dataCount: 31 }
        ]
      },
      {
        name: "Cần Thơ",
        costVAT: 58914171,
        revenue: 351009000,
        cpDichVu: 50497861,
        cpTong: 0,
        services: [
          { name: "TH", cp: 0, dataCount: 57 },
          { name: "Implant", cp: 0, dataCount: 9 },
          { name: "Niềng", cp: 0, dataCount: 9 },
          { name: "Sứ", cp: 0, dataCount: 12 }
        ]
      },
      {
        name: "Đà Nẵng",
        costVAT: 28887373,
        revenue: 260120000,
        cpDichVu: 24760605,
        cpTong: 0,
        services: [
          { name: "Implant", cp: 0, dataCount: 13 },
          { name: "Niềng", cp: 0, dataCount: 7 },
          { name: "Sứ", cp: 0, dataCount: 8 },
          { name: "TH", cp: 0, dataCount: 36 }
        ]
      },
      {
        name: "Quy Nhơn",
        costVAT: 18974996,
        revenue: 207300000,
        cpDichVu: 16264282,
        cpTong: 0,
        services: [
          { name: "Implant", cp: 0, dataCount: 4 },
          { name: "Niềng", cp: 0, dataCount: 1 },
          { name: "Sứ", cp: 0, dataCount: 3 },
          { name: "TH", cp: 0, dataCount: 36 }
        ]
      },
      {
        name: "Tây Ninh",
        costVAT: 35340653,
        revenue: 384720000,
        cpDichVu: 30292100,
        cpTong: 0,
        services: [
          { name: "Implant", cp: 0, dataCount: 3 },
          { name: "Niềng", cp: 0, dataCount: 6 },
          { name: "Sứ", cp: 0, dataCount: 4 },
          { name: "TH", cp: 0, dataCount: 40 }
        ]
      },
      {
        name: "Vũng Tàu",
        costVAT: 24161758,
        revenue: 495120000,
        cpDichVu: 20709221,
        cpTong: 0,
        services: [
          { name: "Implant", cp: 0, dataCount: 15 },
          { name: "Niềng", cp: 0, dataCount: 23 },
          { name: "Sứ", cp: 0, dataCount: 14 },
          { name: "TH", cp: 0, dataCount: 66 }
        ]
      },
      {
        name: "Dĩ An",
        costVAT: 12375436,
        revenue: 318110000,
        cpDichVu: 10607517,
        cpTong: 0,
        services: [
          { name: "Implant", cp: 0, dataCount: 5 },
          { name: "Niềng", cp: 0, dataCount: 6 },
          { name: "Sứ", cp: 0, dataCount: 2 },
          { name: "TH", cp: 0, dataCount: 38 }
        ]
      },
      {
        name: "HCM",
        costVAT: 673841377,
        revenue: 3794528000,
        cpDichVu: 577578323,
        cpTong: 0,
        services: [
          { name: "HCM-Imp", cp: 0, dataCount: 141 },
          { name: "HCM-Niềng", cp: 0, dataCount: 168 },
          { name: "HCM-Sứ", cp: 0, dataCount: 156 },
          { name: "HCM-TH", cp: 0, dataCount: 791 }
        ]
      },
      {
        name: "Việt Kiều",
        costVAT: 139846215,
        revenue: 579500000,
        cpDichVu: 119868184,
        cpTong: 0,
        services: [
          { name: "Việt Kiều", cp: 0, dataCount: 55 }
        ]
      },
      {
        name: "Bạc Liêu",
        costVAT: 3371608,
        revenue: 53200000,
        cpDichVu: 2889893,
        cpTong: 0,
        services: [
          { name: "Implant", cp: 0, dataCount: 3 },
          { name: "Niềng", cp: 0, dataCount: 1 },
          { name: "Sứ", cp: 0, dataCount: 6 },
          { name: "TH", cp: 0, dataCount: 10 }
        ]
      },
      {
        name: "Cà Mau",
        costVAT: 18990079,
        revenue: 126018000,
        cpDichVu: 16277210,
        cpTong: 0,
        services: [
          { name: "Implant", cp: 0, dataCount: 11 },
          { name: "Niềng", cp: 0, dataCount: 7 },
          { name: "Sứ", cp: 0, dataCount: 7 },
          { name: "TH", cp: 0, dataCount: 31 }
        ]
      },
      {
        name: "Đồng Tháp",
        costVAT: 9040293,
        revenue: 48200000,
        cpDichVu: 7748823,
        cpTong: 0,
        services: [
          { name: "Implant", cp: 0, dataCount: 2 },
          { name: "Niềng", cp: 0, dataCount: 7 },
          { name: "Sứ", cp: 0, dataCount: 3 },
          { name: "TH", cp: 0, dataCount: 20 }
        ]
      },
      {
        name: "Sóc Trăng",
        costVAT: 5833995,
        revenue: 53380000,
        cpDichVu: 5000567,
        cpTong: 0,
        services: [
          { name: "Implant", cp: 0, dataCount: 3 },
          { name: "Niềng", cp: 0, dataCount: 0 },
          { name: "Sứ", cp: 0, dataCount: 3 },
          { name: "TH", cp: 0, dataCount: 7 }
        ]
      },
      {
        name: "Đà Lạt",
        costVAT: 21275290,
        revenue: 359370000,
        cpDichVu: 18235249,
        cpTong: 0,
        services: [
          { name: "Implant", cp: 0, dataCount: 4 },
          { name: "Niềng", cp: 0, dataCount: 10 },
          { name: "Sứ", cp: 0, dataCount: 7 },
          { name: "TH", cp: 0, dataCount: 29 }
        ]
      },
      {
        name: "Gia Kiệm",
        costVAT: 7109540,
        revenue: 91640000,
        cpDichVu: 6093890,
        cpTong: 0,
        services: [
          { name: "Implant", cp: 0, dataCount: 2 },
          { name: "Niềng", cp: 0, dataCount: 1 },
          { name: "Sứ", cp: 0, dataCount: 2 },
          { name: "TH", cp: 0, dataCount: 8 }
        ]
      }
    ]
  }
];

fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/revenueData.ts', `export interface ServiceData {
  name: string;
  cp: number;
  dataCount: number;
}

export interface RegionData {
  name: string;
  costVAT: number;      // Chi Phí (VAT)
  revenue: number;      // Doanh Thu
  cpDichVu: number;     // CP Dịch Vụ
  cpTong: number;       // CP Tổng
  services: ServiceData[];
}

export interface MonthDataset {
  month: number;
  label: string;
  regions: RegionData[];
}

export const MONTHLY_DATA: MonthDataset[] = ${JSON.stringify(monthData, null, 2)};
`);

console.log("Successfully generated src/data/revenueData.ts");
