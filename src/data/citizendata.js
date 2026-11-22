
export const cityOverview = {
  aqi: 184,
  aqiCategory: "Poor",
  temperature: 24,
  feelsLike: 26,
  rainfall: 2.4,
  rainfallUnit: "mm",
  activeWarnings: 4,
  humidity: 68,
  windSpeed: 12,
  lastUpdated: "21 Nov 2026, 08:30 PM"
};

// CITY ALERTS

export const alerts = [
  {
    id: "ALT-001",
    category: "Weather",
    title: "Moderate rainfall expected in parts of Delhi",
    description:
      "Light to moderate rainfall may occur in isolated areas. Residents are advised to exercise caution while travelling and follow the latest weather updates.",
    source: "India Meteorological Department",
    area: "South and Central Delhi",
    time: "08:10 PM",
    date: "21 Nov 2026",
    level: "Advisory",
    official: true,
    url: "https://mausam.imd.gov.in/Delhi/"
  },
  {
    id: "ALT-002",
    category: "Traffic",
    title: "Traffic movement affected near ITO junction",
    description:
      "Slow-moving traffic reported around the ITO crossing due to road congestion. Commuters should consider alternate routes and check the latest traffic advisories before travelling.",
    source: "Delhi Traffic Police",
    area: "ITO, Central Delhi",
    time: "07:45 PM",
    date: "21 Nov 2026",
    level: "High",
    official: true,
    url: "https://traffic.delhipolice.gov.in/en"
  },
  {
    id: "ALT-003",
    category: "Environment",
    title: "Poor air quality recorded across several monitoring zones",
    description:
      "Sensitive individuals are advised to reduce prolonged outdoor exertion and follow relevant health precautions. Residents can check monitoring station readings for their area.",
    source: "CPCB / DPCC",
    area: "Multiple areas",
    time: "06:30 PM",
    date: "21 Nov 2026",
    level: "High",
    official: true,
    url: "https://aqi.delhi.gov.in/live"
  },
  {
    id: "ALT-004",
    category: "Public Safety",
    title: "Public movement advisory near a major event area",
    description:
      "Temporary traffic restrictions may affect nearby roads. Follow local instructions, use designated routes and check official police notifications for further information.",
    source: "Delhi Police",
    area: "Central Delhi",
    time: "05:50 PM",
    date: "21 Nov 2026",
    level: "Advisory",
    official: true,
    url: "https://delhipolice.gov.in/"
  }
];

// LOCALITY INFORMATION

export const localityData = [
  {
    name: "Anand Vihar",
    district: "East Delhi",
    aqi: 286,
    category: "Poor",
    temperature: 25,
    rainfall: "0.0 mm",
    road: "Heavy traffic",
    condition: "High pollution",
    updated: "08:20 PM"
  },
  {
    name: "Dwarka",
    district: "South West Delhi",
    aqi: 172,
    category: "Poor",
    temperature: 24,
    rainfall: "1.2 mm",
    road: "Normal movement",
    condition: "Moderate pollution",
    updated: "08:15 PM"
  },
  {
    name: "Rohini",
    district: "North West Delhi",
    aqi: 198,
    category: "Poor",
    temperature: 23,
    rainfall: "0.4 mm",
    road: "Slow movement",
    condition: "Elevated pollution",
    updated: "08:10 PM"
  },
  {
    name: "ITO",
    district: "Central Delhi",
    aqi: 221,
    category: "Poor",
    temperature: 25,
    rainfall: "2.4 mm",
    road: "Heavy traffic",
    condition: "Traffic disruption",
    updated: "08:25 PM"
  },
  {
    name: "Saket",
    district: "South Delhi",
    aqi: 156,
    category: "Moderate",
    temperature: 24,
    rainfall: "1.8 mm",
    road: "Normal movement",
    condition: "Moderate pollution",
    updated: "08:00 PM"
  },
  {
    name: "Connaught Place",
    district: "New Delhi",
    aqi: 179,
    category: "Poor",
    temperature: 25,
    rainfall: "1.0 mm",
    road: "Slow movement",
    condition: "Busy public area",
    updated: "08:18 PM"
  },
  {
    name: "Punjabi Bagh",
    district: "West Delhi",
    aqi: 205,
    category: "Poor",
    temperature: 23,
    rainfall: "0.0 mm",
    road: "Moderate traffic",
    condition: "Elevated pollution",
    updated: "07:55 PM"
  },
  {
    name: "Lodhi Road",
    district: "New Delhi",
    aqi: 142,
    category: "Moderate",
    temperature: 24,
    rainfall: "2.0 mm",
    road: "Normal movement",
    condition: "Relatively better air",
    updated: "08:05 PM"
  }
];

// CITY NEWS

export const newsData = [
  {
    id: 1,
    category: "Environment",
    title: "Delhi's air quality remains a key public health concern",
    summary:
      "Air quality monitoring stations across Delhi record changing pollution levels. Residents can check station-wise AQI readings and stay informed about environmental conditions.",
    source: "Delhi AQI",
    date: "21 Nov 2026",
    area: "Delhi",
    tag: "Air Quality",
    url: "https://aqi.delhi.gov.in/live"
  },
  {
    id: 2,
    category: "Weather",
    title: "Weather monitoring and rainfall updates across Delhi NCR",
    summary:
      "The India Meteorological Department provides local weather observations, forecasts and weather warnings for different parts of Delhi NCR.",
    source: "India Meteorological Department",
    date: "21 Nov 2026",
    area: "Delhi NCR",
    tag: "Weather",
    url: "https://mausam.imd.gov.in/Delhi/"
  },
  {
    id: 3,
    category: "Traffic",
    title: "Commuters advised to monitor traffic diversions and road advisories",
    summary:
      "Delhi Traffic Police publishes traffic alerts, road restrictions and diversion information to help commuters plan their journeys.",
    source: "Delhi Traffic Police",
    date: "20 Nov 2026",
    area: "Delhi",
    tag: "Road Safety",
    url: "https://traffic.delhipolice.gov.in/en"
  },
  {
    id: 4,
    category: "Public Safety",
    title: "Delhi Police publishes public notifications and safety updates",
    summary:
      "Official police notifications provide information about public orders, restrictions and other important safety-related developments across Delhi.",
    source: "Delhi Police",
    date: "20 Nov 2026",
    area: "Delhi",
    tag: "Public Safety",
    url: "https://delhipolice.gov.in/"
  },
  {
    id: 5,
    category: "Environment",
    title: "Local pollution monitoring highlights differences between areas",
    summary:
      "Station-wise air quality readings help residents understand how pollution levels vary across localities and monitor changes over time.",
    source: "Central Pollution Control Board",
    date: "19 Nov 2026",
    area: "Multiple localities",
    tag: "Environment",
    url: "https://app.cpcbccr.com/ccr"
  }
];

// EMERGENCY HELPLINES

export const helplines = [
  {
    service: "National Emergency Number",
    number: "112",
    description: "Police, fire and medical emergency assistance"
  },
  {
    service: "Police",
    number: "100",
    description: "Police assistance"
  },
  {
    service: "Fire Services",
    number: "101",
    description: "Fire and rescue services"
  },
  {
    service: "Ambulance",
    number: "108",
    description: "Emergency medical assistance"
  },
  {
    service: "Women Helpline",
    number: "181",
    description: "Women in distress"
  },
  {
    service: "Child Helpline",
    number: "1098",
    description: "Children in need of care and protection"
  }
];

// INITIAL EMERGENCY REPORTS

export const initialReports = [
  {
    id: "RSN-1001",
    type: "Road Accident",
    priority: "High",
    location: "Ring Road, Rajouri Garden",
    description: "A road accident involving two vehicles has been reported.",
    reporter: "Aarav Sharma",
    phone: "9876543210",
    status: "Under Review",
    date: "21 Nov 2026",
    time: "07:45 PM"
  },
  {
    id: "RSN-1002",
    type: "Fire",
    priority: "Critical",
    location: "Sector 12, Dwarka",
    description: "Smoke reported from a commercial building.",
    reporter: "Simran Kaur",
    phone: "9876543211",
    status: "Dispatched",
    date: "21 Nov 2026",
    time: "06:30 PM"
  },
  {
    id: "RSN-1003",
    type: "Waterlogging",
    priority: "Medium",
    location: "ITO Crossing, Central Delhi",
    description: "Water accumulation is affecting road movement.",
    reporter: "Rahul Verma",
    phone: "9876543212",
    status: "Resolved",
    date: "20 Nov 2026",
    time: "05:15 PM"
  }
];

// REPORT STORAGE FUNCTIONS

const REPORTS_STORAGE_KEY = "rescuenet_citizen_reports";

export const getReports = () => {
  const savedReports = localStorage.getItem(REPORTS_STORAGE_KEY);

  if (savedReports) {
    try {
      return JSON.parse(savedReports);
    } catch {
      return initialReports;
    }
  }

  return initialReports;
};

export const addReport = (newReport) => {
  const currentReports = getReports();

  const updatedReports = [newReport, ...currentReports];

  localStorage.setItem(
    REPORTS_STORAGE_KEY,
    JSON.stringify(updatedReports)
  );

  return updatedReports;
};

export const updateReportStatus = (id, status) => {
  const currentReports = getReports();

  const updatedReports = currentReports.map((report) =>
    report.id === id ? { ...report, status } : report
  );

  localStorage.setItem(
    REPORTS_STORAGE_KEY,
    JSON.stringify(updatedReports)
  );

  return updatedReports;
};
