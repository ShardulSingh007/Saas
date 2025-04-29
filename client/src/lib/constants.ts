// Tax brackets for different countries, years, and filing statuses
export const taxBrackets = {
  us: {
    2023: {
      single: [
        { min: 0, max: 11000, rate: 0.10 },
        { min: 11000, max: 44725, rate: 0.12 },
        { min: 44725, max: 95375, rate: 0.22 },
        { min: 95375, max: 182100, rate: 0.24 },
        { min: 182100, max: 231250, rate: 0.32 },
        { min: 231250, max: 578125, rate: 0.35 },
        { min: 578125, max: null, rate: 0.37 }
      ],
      mfj: [
        { min: 0, max: 22000, rate: 0.10 },
        { min: 22000, max: 89450, rate: 0.12 },
        { min: 89450, max: 190750, rate: 0.22 },
        { min: 190750, max: 364200, rate: 0.24 },
        { min: 364200, max: 462500, rate: 0.32 },
        { min: 462500, max: 693750, rate: 0.35 },
        { min: 693750, max: null, rate: 0.37 }
      ],
      mfs: [
        { min: 0, max: 11000, rate: 0.10 },
        { min: 11000, max: 44725, rate: 0.12 },
        { min: 44725, max: 95375, rate: 0.22 },
        { min: 95375, max: 182100, rate: 0.24 },
        { min: 182100, max: 231250, rate: 0.32 },
        { min: 231250, max: 346875, rate: 0.35 },
        { min: 346875, max: null, rate: 0.37 }
      ],
      hoh: [
        { min: 0, max: 15700, rate: 0.10 },
        { min: 15700, max: 59850, rate: 0.12 },
        { min: 59850, max: 95350, rate: 0.22 },
        { min: 95350, max: 182100, rate: 0.24 },
        { min: 182100, max: 231250, rate: 0.32 },
        { min: 231250, max: 578100, rate: 0.35 },
        { min: 578100, max: null, rate: 0.37 }
      ]
    },
    2022: {
      single: [
        { min: 0, max: 10275, rate: 0.10 },
        { min: 10275, max: 41775, rate: 0.12 },
        { min: 41775, max: 89075, rate: 0.22 },
        { min: 89075, max: 170050, rate: 0.24 },
        { min: 170050, max: 215950, rate: 0.32 },
        { min: 215950, max: 539900, rate: 0.35 },
        { min: 539900, max: null, rate: 0.37 }
      ],
      mfj: [
        { min: 0, max: 20550, rate: 0.10 },
        { min: 20550, max: 83550, rate: 0.12 },
        { min: 83550, max: 178150, rate: 0.22 },
        { min: 178150, max: 340100, rate: 0.24 },
        { min: 340100, max: 431900, rate: 0.32 },
        { min: 431900, max: 647850, rate: 0.35 },
        { min: 647850, max: null, rate: 0.37 }
      ],
      mfs: [
        { min: 0, max: 10275, rate: 0.10 },
        { min: 10275, max: 41775, rate: 0.12 },
        { min: 41775, max: 89075, rate: 0.22 },
        { min: 89075, max: 170050, rate: 0.24 },
        { min: 170050, max: 215950, rate: 0.32 },
        { min: 215950, max: 323925, rate: 0.35 },
        { min: 323925, max: null, rate: 0.37 }
      ],
      hoh: [
        { min: 0, max: 14650, rate: 0.10 },
        { min: 14650, max: 55900, rate: 0.12 },
        { min: 55900, max: 89050, rate: 0.22 },
        { min: 89050, max: 170050, rate: 0.24 },
        { min: 170050, max: 215950, rate: 0.32 },
        { min: 215950, max: 539900, rate: 0.35 },
        { min: 539900, max: null, rate: 0.37 }
      ]
    },
    2021: {
      single: [
        { min: 0, max: 9950, rate: 0.10 },
        { min: 9950, max: 40525, rate: 0.12 },
        { min: 40525, max: 86375, rate: 0.22 },
        { min: 86375, max: 164925, rate: 0.24 },
        { min: 164925, max: 209425, rate: 0.32 },
        { min: 209425, max: 523600, rate: 0.35 },
        { min: 523600, max: null, rate: 0.37 }
      ],
      mfj: [
        { min: 0, max: 19900, rate: 0.10 },
        { min: 19900, max: 81050, rate: 0.12 },
        { min: 81050, max: 172750, rate: 0.22 },
        { min: 172750, max: 329850, rate: 0.24 },
        { min: 329850, max: 418850, rate: 0.32 },
        { min: 418850, max: 628300, rate: 0.35 },
        { min: 628300, max: null, rate: 0.37 }
      ],
      mfs: [
        { min: 0, max: 9950, rate: 0.10 },
        { min: 9950, max: 40525, rate: 0.12 },
        { min: 40525, max: 86375, rate: 0.22 },
        { min: 86375, max: 164925, rate: 0.24 },
        { min: 164925, max: 209425, rate: 0.32 },
        { min: 209425, max: 314150, rate: 0.35 },
        { min: 314150, max: null, rate: 0.37 }
      ],
      hoh: [
        { min: 0, max: 14200, rate: 0.10 },
        { min: 14200, max: 54200, rate: 0.12 },
        { min: 54200, max: 86350, rate: 0.22 },
        { min: 86350, max: 164900, rate: 0.24 },
        { min: 164900, max: 209400, rate: 0.32 },
        { min: 209400, max: 523600, rate: 0.35 },
        { min: 523600, max: null, rate: 0.37 }
      ]
    }
  },
  // Simplified tax brackets for other countries
  ca: {
    2023: {
      single: [
        { min: 0, max: 53359, rate: 0.15 },
        { min: 53359, max: 106717, rate: 0.205 },
        { min: 106717, max: 165430, rate: 0.26 },
        { min: 165430, max: 235675, rate: 0.29 },
        { min: 235675, max: null, rate: 0.33 }
      ],
      married: [
        { min: 0, max: 53359, rate: 0.15 },
        { min: 53359, max: 106717, rate: 0.205 },
        { min: 106717, max: 165430, rate: 0.26 },
        { min: 165430, max: 235675, rate: 0.29 },
        { min: 235675, max: null, rate: 0.33 }
      ]
    },
    2022: {
      single: [
        { min: 0, max: 50197, rate: 0.15 },
        { min: 50197, max: 100392, rate: 0.205 },
        { min: 100392, max: 155625, rate: 0.26 },
        { min: 155625, max: 221708, rate: 0.29 },
        { min: 221708, max: null, rate: 0.33 }
      ],
      married: [
        { min: 0, max: 50197, rate: 0.15 },
        { min: 50197, max: 100392, rate: 0.205 },
        { min: 100392, max: 155625, rate: 0.26 },
        { min: 155625, max: 221708, rate: 0.29 },
        { min: 221708, max: null, rate: 0.33 }
      ]
    },
    2021: {
      single: [
        { min: 0, max: 49020, rate: 0.15 },
        { min: 49020, max: 98040, rate: 0.205 },
        { min: 98040, max: 151978, rate: 0.26 },
        { min: 151978, max: 216511, rate: 0.29 },
        { min: 216511, max: null, rate: 0.33 }
      ],
      married: [
        { min: 0, max: 49020, rate: 0.15 },
        { min: 49020, max: 98040, rate: 0.205 },
        { min: 98040, max: 151978, rate: 0.26 },
        { min: 151978, max: 216511, rate: 0.29 },
        { min: 216511, max: null, rate: 0.33 }
      ]
    }
  },
  uk: {
    2023: {
      single: [
        { min: 0, max: 12570, rate: 0 },
        { min: 12570, max: 50270, rate: 0.20 },
        { min: 50270, max: 125140, rate: 0.40 },
        { min: 125140, max: null, rate: 0.45 }
      ]
    },
    2022: {
      single: [
        { min: 0, max: 12570, rate: 0 },
        { min: 12570, max: 50270, rate: 0.20 },
        { min: 50270, max: 150000, rate: 0.40 },
        { min: 150000, max: null, rate: 0.45 }
      ]
    },
    2021: {
      single: [
        { min: 0, max: 12570, rate: 0 },
        { min: 12570, max: 50270, rate: 0.20 },
        { min: 50270, max: 150000, rate: 0.40 },
        { min: 150000, max: null, rate: 0.45 }
      ]
    }
  },
  au: {
    2023: {
      single: [
        { min: 0, max: 18200, rate: 0 },
        { min: 18200, max: 45000, rate: 0.19 },
        { min: 45000, max: 120000, rate: 0.325 },
        { min: 120000, max: 180000, rate: 0.37 },
        { min: 180000, max: null, rate: 0.45 }
      ]
    },
    2022: {
      single: [
        { min: 0, max: 18200, rate: 0 },
        { min: 18200, max: 45000, rate: 0.19 },
        { min: 45000, max: 120000, rate: 0.325 },
        { min: 120000, max: 180000, rate: 0.37 },
        { min: 180000, max: null, rate: 0.45 }
      ]
    },
    2021: {
      single: [
        { min: 0, max: 18200, rate: 0 },
        { min: 18200, max: 45000, rate: 0.19 },
        { min: 45000, max: 120000, rate: 0.325 },
        { min: 120000, max: 180000, rate: 0.37 },
        { min: 180000, max: null, rate: 0.45 }
      ]
    }
  },
  in: {
    2025: {
      single: [
        { min: 0, max: 300000, rate: 0 },
        { min: 300000, max: 600000, rate: 0.05 },
        { min: 600000, max: 900000, rate: 0.10 },
        { min: 900000, max: 1200000, rate: 0.15 },
        { min: 1200000, max: 1500000, rate: 0.20 },
        { min: 1500000, max: null, rate: 0.30 }
      ],
      newRegime: [
        { min: 0, max: 300000, rate: 0 },
        { min: 300000, max: 600000, rate: 0.05 },
        { min: 600000, max: 900000, rate: 0.10 },
        { min: 900000, max: 1200000, rate: 0.15 },
        { min: 1200000, max: 1500000, rate: 0.20 },
        { min: 1500000, max: null, rate: 0.30 }
      ],
      oldRegime: [
        { min: 0, max: 250000, rate: 0 },
        { min: 250000, max: 500000, rate: 0.05 },
        { min: 500000, max: 1000000, rate: 0.20 },
        { min: 1000000, max: null, rate: 0.30 }
      ]
    },
    2024: {
      single: [
        { min: 0, max: 300000, rate: 0 },
        { min: 300000, max: 600000, rate: 0.05 },
        { min: 600000, max: 900000, rate: 0.10 },
        { min: 900000, max: 1200000, rate: 0.15 },
        { min: 1200000, max: 1500000, rate: 0.20 },
        { min: 1500000, max: null, rate: 0.30 }
      ],
      newRegime: [
        { min: 0, max: 300000, rate: 0 },
        { min: 300000, max: 600000, rate: 0.05 },
        { min: 600000, max: 900000, rate: 0.10 },
        { min: 900000, max: 1200000, rate: 0.15 },
        { min: 1200000, max: 1500000, rate: 0.20 },
        { min: 1500000, max: null, rate: 0.30 }
      ],
      oldRegime: [
        { min: 0, max: 250000, rate: 0 },
        { min: 250000, max: 500000, rate: 0.05 },
        { min: 500000, max: 1000000, rate: 0.20 },
        { min: 1000000, max: null, rate: 0.30 }
      ]
    },
    2023: {
      single: [
        { min: 0, max: 300000, rate: 0 },
        { min: 300000, max: 600000, rate: 0.05 },
        { min: 600000, max: 900000, rate: 0.10 },
        { min: 900000, max: 1200000, rate: 0.15 },
        { min: 1200000, max: 1500000, rate: 0.20 },
        { min: 1500000, max: null, rate: 0.30 }
      ],
      newRegime: [
        { min: 0, max: 300000, rate: 0 },
        { min: 300000, max: 600000, rate: 0.05 },
        { min: 600000, max: 900000, rate: 0.10 },
        { min: 900000, max: 1200000, rate: 0.15 },
        { min: 1200000, max: 1500000, rate: 0.20 },
        { min: 1500000, max: null, rate: 0.30 }
      ],
      oldRegime: [
        { min: 0, max: 250000, rate: 0 },
        { min: 250000, max: 500000, rate: 0.05 },
        { min: 500000, max: 1000000, rate: 0.20 },
        { min: 1000000, max: null, rate: 0.30 }
      ]
    }
  }
};

// List of supported countries
export const countries = [
  { id: 'af', name: 'Afghanistan' },
  { id: 'al', name: 'Albania' },
  { id: 'dz', name: 'Algeria' },
  { id: 'ad', name: 'Andorra' },
  { id: 'ao', name: 'Angola' },
  { id: 'ag', name: 'Antigua and Barbuda' },
  { id: 'ar', name: 'Argentina' },
  { id: 'am', name: 'Armenia' },
  { id: 'au', name: 'Australia' },
  { id: 'at', name: 'Austria' },
  { id: 'az', name: 'Azerbaijan' },
  { id: 'bs', name: 'Bahamas' },
  { id: 'bh', name: 'Bahrain' },
  { id: 'bd', name: 'Bangladesh' },
  { id: 'bb', name: 'Barbados' },
  { id: 'by', name: 'Belarus' },
  { id: 'be', name: 'Belgium' },
  { id: 'bz', name: 'Belize' },
  { id: 'bj', name: 'Benin' },
  { id: 'bt', name: 'Bhutan' },
  { id: 'bo', name: 'Bolivia' },
  { id: 'ba', name: 'Bosnia and Herzegovina' },
  { id: 'bw', name: 'Botswana' },
  { id: 'br', name: 'Brazil' },
  { id: 'bn', name: 'Brunei' },
  { id: 'bg', name: 'Bulgaria' },
  { id: 'bf', name: 'Burkina Faso' },
  { id: 'bi', name: 'Burundi' },
  { id: 'cv', name: 'Cabo Verde' },
  { id: 'kh', name: 'Cambodia' },
  { id: 'cm', name: 'Cameroon' },
  { id: 'ca', name: 'Canada' },
  { id: 'cf', name: 'Central African Republic' },
  { id: 'td', name: 'Chad' },
  { id: 'cl', name: 'Chile' },
  { id: 'cn', name: 'China' },
  { id: 'co', name: 'Colombia' },
  { id: 'km', name: 'Comoros' },
  { id: 'cg', name: 'Congo' },
  { id: 'cr', name: 'Costa Rica' },
  { id: 'ci', name: 'Côte d\'Ivoire' },
  { id: 'hr', name: 'Croatia' },
  { id: 'cu', name: 'Cuba' },
  { id: 'cy', name: 'Cyprus' },
  { id: 'cz', name: 'Czech Republic' },
  { id: 'dk', name: 'Denmark' },
  { id: 'dj', name: 'Djibouti' },
  { id: 'dm', name: 'Dominica' },
  { id: 'do', name: 'Dominican Republic' },
  { id: 'ec', name: 'Ecuador' },
  { id: 'eg', name: 'Egypt' },
  { id: 'sv', name: 'El Salvador' },
  { id: 'gq', name: 'Equatorial Guinea' },
  { id: 'er', name: 'Eritrea' },
  { id: 'ee', name: 'Estonia' },
  { id: 'sz', name: 'Eswatini' },
  { id: 'et', name: 'Ethiopia' },
  { id: 'fj', name: 'Fiji' },
  { id: 'fi', name: 'Finland' },
  { id: 'fr', name: 'France' },
  { id: 'ga', name: 'Gabon' },
  { id: 'gm', name: 'Gambia' },
  { id: 'ge', name: 'Georgia' },
  { id: 'de', name: 'Germany' },
  { id: 'gh', name: 'Ghana' },
  { id: 'gr', name: 'Greece' },
  { id: 'gd', name: 'Grenada' },
  { id: 'gt', name: 'Guatemala' },
  { id: 'gn', name: 'Guinea' },
  { id: 'gw', name: 'Guinea-Bissau' },
  { id: 'gy', name: 'Guyana' },
  { id: 'ht', name: 'Haiti' },
  { id: 'hn', name: 'Honduras' },
  { id: 'hu', name: 'Hungary' },
  { id: 'is', name: 'Iceland' },
  { id: 'in', name: 'India' },
  { id: 'id', name: 'Indonesia' },
  { id: 'ir', name: 'Iran' },
  { id: 'iq', name: 'Iraq' },
  { id: 'ie', name: 'Ireland' },
  { id: 'il', name: 'Israel' },
  { id: 'it', name: 'Italy' },
  { id: 'jm', name: 'Jamaica' },
  { id: 'jp', name: 'Japan' },
  { id: 'jo', name: 'Jordan' },
  { id: 'kz', name: 'Kazakhstan' },
  { id: 'ke', name: 'Kenya' },
  { id: 'ki', name: 'Kiribati' },
  { id: 'kp', name: 'North Korea' },
  { id: 'kr', name: 'South Korea' },
  { id: 'kw', name: 'Kuwait' },
  { id: 'kg', name: 'Kyrgyzstan' },
  { id: 'la', name: 'Laos' },
  { id: 'lv', name: 'Latvia' },
  { id: 'lb', name: 'Lebanon' },
  { id: 'ls', name: 'Lesotho' },
  { id: 'lr', name: 'Liberia' },
  { id: 'ly', name: 'Libya' },
  { id: 'li', name: 'Liechtenstein' },
  { id: 'lt', name: 'Lithuania' },
  { id: 'lu', name: 'Luxembourg' },
  { id: 'mg', name: 'Madagascar' },
  { id: 'mw', name: 'Malawi' },
  { id: 'my', name: 'Malaysia' },
  { id: 'mv', name: 'Maldives' },
  { id: 'ml', name: 'Mali' },
  { id: 'mt', name: 'Malta' },
  { id: 'mh', name: 'Marshall Islands' },
  { id: 'mr', name: 'Mauritania' },
  { id: 'mu', name: 'Mauritius' },
  { id: 'mx', name: 'Mexico' },
  { id: 'fm', name: 'Micronesia' },
  { id: 'md', name: 'Moldova' },
  { id: 'mc', name: 'Monaco' },
  { id: 'mn', name: 'Mongolia' },
  { id: 'me', name: 'Montenegro' },
  { id: 'ma', name: 'Morocco' },
  { id: 'mz', name: 'Mozambique' },
  { id: 'mm', name: 'Myanmar' },
  { id: 'na', name: 'Namibia' },
  { id: 'nr', name: 'Nauru' },
  { id: 'np', name: 'Nepal' },
  { id: 'nl', name: 'Netherlands' },
  { id: 'nz', name: 'New Zealand' },
  { id: 'ni', name: 'Nicaragua' },
  { id: 'ne', name: 'Niger' },
  { id: 'ng', name: 'Nigeria' },
  { id: 'mk', name: 'North Macedonia' },
  { id: 'no', name: 'Norway' },
  { id: 'om', name: 'Oman' },
  { id: 'pk', name: 'Pakistan' },
  { id: 'pw', name: 'Palau' },
  { id: 'pa', name: 'Panama' },
  { id: 'pg', name: 'Papua New Guinea' },
  { id: 'py', name: 'Paraguay' },
  { id: 'pe', name: 'Peru' },
  { id: 'ph', name: 'Philippines' },
  { id: 'pl', name: 'Poland' },
  { id: 'pt', name: 'Portugal' },
  { id: 'qa', name: 'Qatar' },
  { id: 'ro', name: 'Romania' },
  { id: 'ru', name: 'Russia' },
  { id: 'rw', name: 'Rwanda' },
  { id: 'kn', name: 'Saint Kitts and Nevis' },
  { id: 'lc', name: 'Saint Lucia' },
  { id: 'vc', name: 'Saint Vincent and the Grenadines' },
  { id: 'ws', name: 'Samoa' },
  { id: 'sm', name: 'San Marino' },
  { id: 'st', name: 'Sao Tome and Principe' },
  { id: 'sa', name: 'Saudi Arabia' },
  { id: 'sn', name: 'Senegal' },
  { id: 'rs', name: 'Serbia' },
  { id: 'sc', name: 'Seychelles' },
  { id: 'sl', name: 'Sierra Leone' },
  { id: 'sg', name: 'Singapore' },
  { id: 'sk', name: 'Slovakia' },
  { id: 'si', name: 'Slovenia' },
  { id: 'sb', name: 'Solomon Islands' },
  { id: 'so', name: 'Somalia' },
  { id: 'za', name: 'South Africa' },
  { id: 'ss', name: 'South Sudan' },
  { id: 'es', name: 'Spain' },
  { id: 'lk', name: 'Sri Lanka' },
  { id: 'sd', name: 'Sudan' },
  { id: 'sr', name: 'Suriname' },
  { id: 'se', name: 'Sweden' },
  { id: 'ch', name: 'Switzerland' },
  { id: 'sy', name: 'Syria' },
  { id: 'tw', name: 'Taiwan' },
  { id: 'tj', name: 'Tajikistan' },
  { id: 'tz', name: 'Tanzania' },
  { id: 'th', name: 'Thailand' },
  { id: 'tl', name: 'Timor-Leste' },
  { id: 'tg', name: 'Togo' },
  { id: 'to', name: 'Tonga' },
  { id: 'tt', name: 'Trinidad and Tobago' },
  { id: 'tn', name: 'Tunisia' },
  { id: 'tr', name: 'Turkey' },
  { id: 'tm', name: 'Turkmenistan' },
  { id: 'tv', name: 'Tuvalu' },
  { id: 'ug', name: 'Uganda' },
  { id: 'ua', name: 'Ukraine' },
  { id: 'ae', name: 'United Arab Emirates' },
  { id: 'gb', name: 'United Kingdom' },
  { id: 'us', name: 'United States' },
  { id: 'uy', name: 'Uruguay' },
  { id: 'uz', name: 'Uzbekistan' },
  { id: 'vu', name: 'Vanuatu' },
  { id: 've', name: 'Venezuela' },
  { id: 'vn', name: 'Vietnam' },
  { id: 'ye', name: 'Yemen' },
  { id: 'zm', name: 'Zambia' },
  { id: 'zw', name: 'Zimbabwe' },
];

// List of supported tax years
export const taxYears = [
  { id: 2025, name: '2025' },
  { id: 2024, name: '2024' },
  { id: 2023, name: '2023' },
  { id: 2022, name: '2022' },
  { id: 2021, name: '2021' },
  { id: 2020, name: '2020' },
  { id: 2019, name: '2019' },
];

// Filing statuses by country
export interface FilingStatus {
  id: string;
  name: string;
}

export interface FilingStatusesByCountry {
  [key: string]: FilingStatus[];
}

export const filingStatuses: FilingStatusesByCountry = {
  us: [
    { id: 'single', name: 'Single' },
    { id: 'mfj', name: 'Married Filing Jointly' },
    { id: 'mfs', name: 'Married Filing Separately' },
    { id: 'hoh', name: 'Head of Household' },
  ],
  ca: [
    { id: 'single', name: 'Single' },
    { id: 'married', name: 'Married or Common-Law' },
  ],
  uk: [
    { id: 'single', name: 'Individual' },
  ],
  au: [
    { id: 'single', name: 'Individual' },
  ],
  in: [
    { id: 'single', name: 'Individual' },
    { id: 'newRegime', name: 'New Tax Regime' },
    { id: 'oldRegime', name: 'Old Tax Regime' },
  ],
  // Default filing status for countries without specific statuses
  default: [
    { id: 'single', name: 'Individual' },
  ]
};

// Tax saving tips
export const taxSavingTips = [
  "Maximize retirement contributions to reduce taxable income.",
  "Consider Health Savings Account (HSA) contributions for tax-advantaged savings.",
  "Take advantage of education tax credits for qualifying expenses.",
  "Track charitable donations for potential itemized deduction.",
  "Review possible business expense deductions if self-employed.",
  "Explore child and dependent care credits if applicable.",
  "Consider tax-loss harvesting for investment accounts.",
  "Review eligibility for Earned Income Tax Credit (EITC).",
  "Time major medical expenses in a single tax year to maximize deductions.",
  "Investigate green energy tax credits for home improvements."
];
