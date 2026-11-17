export interface AfricaCountryPath {
  code: string;
  name: string;
  flag: string;
  region: 'West' | 'East' | 'Central' | 'North' | 'South' | 'Global';
  center: [number, number]; // [x, y] coordinates for label/pin in 800x800 viewBox
  path: string;
}

// 800x800 SVG Paths for African Nations
export const AFRICA_MAP_PATHS: AfricaCountryPath[] = [
  // WEST AFRICA
  {
    code: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    region: 'West',
    center: [330, 420],
    path: 'M 290 380 L 330 380 L 360 390 L 380 410 L 370 440 L 350 460 L 330 470 L 300 460 L 280 430 L 290 380 Z'
  },
  {
    code: 'GH',
    name: 'Ghana',
    flag: '🇬🇭',
    region: 'West',
    center: [230, 440],
    path: 'M 220 410 L 245 410 L 245 460 L 220 460 L 210 435 Z'
  },
  {
    code: 'SN',
    name: 'Senegal',
    flag: '🇸🇳',
    region: 'West',
    center: [120, 360],
    path: 'M 90 340 L 140 340 L 150 370 L 130 390 L 95 380 L 90 340 Z'
  },
  {
    code: 'CI',
    name: 'Côte d’Ivoire',
    flag: '🇨🇮',
    region: 'West',
    center: [180, 440],
    path: 'M 160 410 L 210 410 L 210 470 L 165 470 L 155 435 Z'
  },
  {
    code: 'NE',
    name: 'Niger',
    flag: '🇳🇪',
    region: 'West',
    center: [320, 320],
    path: 'M 260 290 L 390 290 L 400 350 L 360 380 L 290 380 L 260 340 Z'
  },
  {
    code: 'ML',
    name: 'Mali',
    flag: '🇲🇱',
    region: 'West',
    center: [200, 320],
    path: 'M 140 280 L 250 280 L 260 340 L 230 400 L 170 400 L 140 350 Z'
  },
  {
    code: 'BF',
    name: 'Burkina Faso',
    flag: '🇧🇫',
    region: 'West',
    center: [220, 385],
    path: 'M 190 370 L 250 370 L 250 410 L 190 410 Z'
  },
  {
    code: 'GN',
    name: 'Guinea',
    flag: '🇬🇳',
    region: 'West',
    center: [140, 410],
    path: 'M 110 390 L 170 390 L 165 430 L 120 430 Z'
  },
  {
    code: 'SL',
    name: 'Sierra Leone',
    flag: '🇸🇱',
    region: 'West',
    center: [120, 445],
    path: 'M 110 430 L 135 430 L 135 460 L 110 455 Z'
  },
  {
    code: 'LR',
    name: 'Liberia',
    flag: '🇱🇷',
    region: 'West',
    center: [145, 460],
    path: 'M 135 440 L 165 440 L 160 480 L 135 470 Z'
  },
  {
    code: 'TG',
    name: 'Togo',
    flag: '🇹🇬',
    region: 'West',
    center: [255, 435],
    path: 'M 245 410 L 265 410 L 265 465 L 245 465 Z'
  },
  {
    code: 'BJ',
    name: 'Benin',
    flag: '🇧🇯',
    region: 'West',
    center: [275, 435],
    path: 'M 265 400 L 290 400 L 290 465 L 265 465 Z'
  },
  {
    code: 'MR',
    name: 'Mauritania',
    flag: '🇲🇷',
    region: 'West',
    center: [160, 240],
    path: 'M 120 180 L 220 180 L 220 280 L 140 280 L 110 230 Z'
  },

  // EAST AFRICA
  {
    code: 'KE',
    name: 'Kenya',
    flag: '🇰🇪',
    region: 'East',
    center: [550, 450],
    path: 'M 520 400 L 580 400 L 600 450 L 570 500 L 520 480 L 515 430 Z'
  },
  {
    code: 'RW',
    name: 'Rwanda',
    flag: '🇷🇼',
    region: 'East',
    center: [485, 480],
    path: 'M 475 465 L 495 465 L 495 490 L 475 490 Z'
  },
  {
    code: 'UG',
    name: 'Uganda',
    flag: '🇺🇬',
    region: 'East',
    center: [500, 440],
    path: 'M 480 410 L 520 410 L 520 465 L 480 465 Z'
  },
  {
    code: 'TZ',
    name: 'Tanzania',
    flag: '🇹🇿',
    region: 'East',
    center: [530, 520],
    path: 'M 495 470 L 570 480 L 590 550 L 530 580 L 480 540 Z'
  },
  {
    code: 'ET',
    name: 'Ethiopia',
    flag: '🇪🇹',
    region: 'East',
    center: [550, 340],
    path: 'M 500 290 L 600 290 L 630 350 L 580 400 L 500 380 Z'
  },
  {
    code: 'SO',
    name: 'Somalia',
    flag: '🇸🇴',
    region: 'East',
    center: [640, 360],
    path: 'M 600 280 L 680 300 L 670 380 L 590 430 L 610 350 Z'
  },
  {
    code: 'SS',
    name: 'South Sudan',
    flag: '🇸🇸',
    region: 'East',
    center: [470, 370],
    path: 'M 430 330 L 510 330 L 510 410 L 440 410 Z'
  },
  {
    code: 'DJ',
    name: 'Djibouti',
    flag: '🇩🇯',
    region: 'East',
    center: [610, 305],
    path: 'M 595 295 L 620 295 L 615 315 L 595 310 Z'
  },
  {
    code: 'ER',
    name: 'Eritrea',
    flag: '🇪🇷',
    region: 'East',
    center: [540, 260],
    path: 'M 515 230 L 570 280 L 555 295 L 515 250 Z'
  },

  // SOUTHERN AFRICA
  {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    region: 'South',
    center: [430, 710],
    path: 'M 350 650 L 500 650 L 520 730 L 440 770 L 350 740 L 330 680 Z'
  },
  {
    code: 'BW',
    name: 'Botswana',
    flag: '🇧🇼',
    region: 'South',
    center: [430, 630],
    path: 'M 390 600 L 470 600 L 470 655 L 390 655 Z'
  },
  {
    code: 'NA',
    name: 'Namibia',
    flag: '🇳🇦',
    region: 'South',
    center: [350, 630],
    path: 'M 320 570 L 390 570 L 390 680 L 330 680 Z'
  },
  {
    code: 'ZM',
    name: 'Zambia',
    flag: '🇿🇲',
    region: 'South',
    center: [460, 560],
    path: 'M 410 520 L 500 520 L 500 590 L 410 580 Z'
  },
  {
    code: 'ZW',
    name: 'Zimbabwe',
    flag: '🇿🇼',
    region: 'South',
    center: [490, 620],
    path: 'M 465 595 L 520 595 L 520 645 L 465 645 Z'
  },
  {
    code: 'MZ',
    name: 'Mozambique',
    flag: '🇲🇿',
    region: 'South',
    center: [540, 620],
    path: 'M 510 550 L 570 560 L 560 670 L 515 650 L 525 590 Z'
  },
  {
    code: 'MG',
    name: 'Madagascar',
    flag: '🇲🇬',
    region: 'South',
    center: [650, 600],
    path: 'M 630 520 L 670 550 L 660 680 L 620 640 Z'
  },
  {
    code: 'MW',
    name: 'Malawi',
    flag: '🇲🇼',
    region: 'South',
    center: [520, 560],
    path: 'M 510 535 L 535 540 L 525 590 L 510 580 Z'
  },
  {
    code: 'AO',
    name: 'Angola',
    flag: '🇦🇴',
    region: 'South',
    center: [370, 530],
    path: 'M 320 480 L 410 480 L 410 570 L 330 570 Z'
  },

  // CENTRAL AFRICA
  {
    code: 'CM',
    name: 'Cameroon',
    flag: '🇨🇲',
    region: 'Central',
    center: [360, 440],
    path: 'M 335 410 L 385 410 L 385 480 L 340 480 Z'
  },
  {
    code: 'CD',
    name: 'DR Congo',
    flag: '🇨🇩',
    region: 'Central',
    center: [430, 480],
    path: 'M 380 430 L 490 430 L 490 540 L 400 540 L 375 480 Z'
  },
  {
    code: 'GA',
    name: 'Gabon',
    flag: '🇬🇦',
    region: 'Central',
    center: [320, 470],
    path: 'M 305 450 L 345 450 L 345 490 L 305 490 Z'
  },
  {
    code: 'CG',
    name: 'Congo',
    flag: '🇨🇬',
    region: 'Central',
    center: [350, 480],
    path: 'M 335 450 L 375 450 L 365 520 L 335 500 Z'
  },
  {
    code: 'CF',
    name: 'Central African Republic',
    flag: '🇨🇫',
    region: 'Central',
    center: [400, 395],
    path: 'M 365 375 L 450 375 L 440 425 L 365 425 Z'
  },
  {
    code: 'TD',
    name: 'Chad',
    flag: '🇹🇩',
    region: 'Central',
    center: [390, 310],
    path: 'M 360 250 L 450 250 L 440 370 L 360 370 Z'
  },

  // NORTH AFRICA
  {
    code: 'EG',
    name: 'Egypt',
    flag: '🇪🇬',
    region: 'North',
    center: [520, 180],
    path: 'M 470 130 L 580 130 L 570 230 L 470 230 Z'
  },
  {
    code: 'MA',
    name: 'Morocco',
    flag: '🇲🇦',
    region: 'North',
    center: [170, 120],
    path: 'M 130 80 L 220 80 L 210 160 L 140 160 Z'
  },
  {
    code: 'DZ',
    name: 'Algeria',
    flag: '🇩🇿',
    region: 'North',
    center: [260, 170],
    path: 'M 200 90 L 340 90 L 340 250 L 220 250 Z'
  },
  {
    code: 'TN',
    name: 'Tunisia',
    flag: '🇹🇳',
    region: 'North',
    center: [320, 90],
    path: 'M 305 60 L 340 60 L 335 125 L 305 110 Z'
  },
  {
    code: 'LY',
    name: 'Libya',
    flag: '🇱🇾',
    region: 'North',
    center: [410, 180],
    path: 'M 340 110 L 470 110 L 470 250 L 340 250 Z'
  },
  {
    code: 'SD',
    name: 'Sudan',
    flag: '🇸🇩',
    region: 'North',
    center: [480, 270],
    path: 'M 440 220 L 540 220 L 530 330 L 430 330 Z'
  },

  // GLOBAL PARTNER HUBS
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    region: 'Global',
    center: [680, 50],
    path: 'M 655 30 L 705 30 L 705 70 L 655 70 Z'
  },
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    region: 'Global',
    center: [80, 150],
    path: 'M 50 120 L 110 120 L 110 180 L 50 180 Z'
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    region: 'Global',
    center: [80, 70],
    path: 'M 50 40 L 110 40 L 110 100 L 50 100 Z'
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    region: 'Global',
    center: [650, 200],
    path: 'M 630 180 L 670 180 L 670 220 L 630 220 Z'
  },
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    region: 'Global',
    center: [730, 240],
    path: 'M 700 210 L 760 210 L 750 270 L 710 270 Z'
  },
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    region: 'Global',
    center: [740, 550],
    path: 'M 700 520 L 770 520 L 770 580 L 700 580 Z'
  }
];
