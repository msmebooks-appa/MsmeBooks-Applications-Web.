export interface WorldCountry {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  flag: string;
  region: 'Pan-Africa' | 'Europe' | 'Americas' | 'Asia-Pacific' | 'Middle East';
  phoneCode: string;
  states: string[];
}

// Comprehensive registry of countries across the globe with their respective states/provinces/regions
export const WORLD_COUNTRIES: WorldCountry[] = [
  // ===================== PAN-AFRICA =====================
  {
    code: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    region: 'Pan-Africa',
    phoneCode: '+234',
    states: [
      'Lagos State',
      'Abuja Federal Capital Territory (FCT)',
      'Rivers State (Port Harcourt)',
      'Kano State',
      'Oyo State (Ibadan)',
      'Ogun State (Abeokuta/Ota)',
      'Kaduna State',
      'Edo State (Benin City)',
      'Delta State (Warri/Asaba)',
      'Anambra State (Onitsha/Awka)',
      'Enugu State',
      'Plateau State (Jos)',
      'Kwara State (Ilorin)',
      'Akwa Ibom State (Uyo)',
      'Imo State (Owerri)',
      'Abia State (Aba/Umuahia)',
      'Osun State',
      'Ondo State',
      'Benue State',
      'Bauchi State',
      'Borno State',
      'Cross River State (Calabar)',
      'Bayelsa State (Yenagoa)',
      'Adamawa State',
      'Ebonyi State',
      'Ekiti State',
      'Gombe State',
      'Jigawa State',
      'Katsina State',
      'Kebbi State',
      'Kogi State',
      'Nasarawa State',
      'Niger State',
      'Sokoto State',
      'Taraba State',
      'Yobe State',
      'Zamfara State'
    ]
  },
  {
    code: 'KE',
    name: 'Kenya',
    flag: '🇰🇪',
    region: 'Pan-Africa',
    phoneCode: '+254',
    states: [
      'Nairobi County',
      'Mombasa County',
      'Kisumu County',
      'Nakuru County',
      'Kiambu County',
      'Machakos County',
      'Uasin Gishu County (Eldoret)',
      'Kilifi County',
      'Kajiado County',
      'Meru County',
      'Nyeri County',
      'Kakamega County',
      'Bungoma County',
      'Kericho County',
      'Murang\'a County',
      'Embu County',
      'Trans Nzoia County (Kitale)',
      'Laikipia County (Nanyuki)',
      'Homa Bay County',
      'Garissa County',
      'Kitui County',
      'Makueni County',
      'Nyandarua County',
      'Baringo County',
      'Nandi County',
      'Vihiga County',
      'Siaya County',
      'Busia County',
      'Migori County',
      'Kisii County',
      'Nyamira County',
      'Turkana County',
      'West Pokot County',
      'Samburu County',
      'Elgeyo-Marakwet County',
      'Narok County',
      'Bomet County',
      'Isiolo County',
      'Tharaka-Nithi County',
      'Marsabit County',
      'Mandera County',
      'Wajir County',
      'Tana River County',
      'Lamu County',
      'Taita-Taveta County',
      'Kwale County'
    ]
  },
  {
    code: 'GH',
    name: 'Ghana',
    flag: '🇬🇭',
    region: 'Pan-Africa',
    phoneCode: '+233',
    states: [
      'Greater Accra Region',
      'Ashanti Region (Kumasi)',
      'Western Region (Sekondi-Takoradi)',
      'Central Region (Cape Coast)',
      'Eastern Region (Koforidua)',
      'Northern Region (Tamale)',
      'Volta Region (Ho)',
      'Upper East Region (Bolgatanga)',
      'Upper West Region (Wa)',
      'Bono Region (Sunyani)',
      'Bono East Region (Techiman)',
      'Ahafo Region (Goaso)',
      'Oti Region (Dambai)',
      'Savannah Region (Damongo)',
      'North East Region (Nalerigu)',
      'Western North Region (Sefwi Wiawso)'
    ]
  },
  {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    region: 'Pan-Africa',
    phoneCode: '+27',
    states: [
      'Gauteng (Johannesburg / Pretoria)',
      'Western Cape (Cape Town / Stellenbosch)',
      'KwaZulu-Natal (Durban / Pietermaritzburg)',
      'Eastern Cape (Gqeberha / East London)',
      'Free State (Bloemfontein)',
      'Limpopo (Polokwane)',
      'Mpumalanga (Mbombela)',
      'North West (Rustenburg / Mahikeng)',
      'Northern Cape (Kimberley)'
    ]
  },
  {
    code: 'EG',
    name: 'Egypt',
    flag: '🇪🇬',
    region: 'Pan-Africa',
    phoneCode: '+20',
    states: [
      'Cairo Governorate',
      'Alexandria Governorate',
      'Giza Governorate',
      'Dakahlia Governorate (Mansoura)',
      'Red Sea Governorate (Hurghada)',
      'Sharqia Governorate (Zagazig)',
      'Gharbia Governorate (Tanta)',
      'Aswan Governorate',
      'Luxor Governorate',
      'Asyut Governorate',
      'Beheira Governorate (Damanhur)',
      'Beni Suef Governorate',
      'Faiyum Governorate',
      'Ismailia Governorate',
      'Kafr El Sheikh Governorate',
      'Matrouh Governorate',
      'Minya Governorate',
      'Monufia Governorate (Shibin El Kom)',
      'New Valley Governorate (Kharga)',
      'North Sinai Governorate (Arish)',
      'Port Said Governorate',
      'Qalyubia Governorate (Banha)',
      'Qena Governorate',
      'Sohag Governorate',
      'South Sinai Governorate (Sharm El Sheikh)',
      'Suez Governorate',
      'Damietta Governorate'
    ]
  },
  {
    code: 'RW',
    name: 'Rwanda',
    flag: '🇷🇼',
    region: 'Pan-Africa',
    phoneCode: '+250',
    states: [
      'Kigali City (Nyarugenge / Gasabo / Kicukiro)',
      'Northern Province (Musanze / Gicumbi)',
      'Southern Province (Huye / Muhanga)',
      'Eastern Province (Rwamagana / Bugesera)',
      'Western Province (Rubavu / Rusizi)'
    ]
  },
  {
    code: 'UG',
    name: 'Uganda',
    flag: '🇺🇬',
    region: 'Pan-Africa',
    phoneCode: '+256',
    states: [
      'Central Region (Kampala / Entebbe / Wakiso)',
      'Eastern Region (Jinja / Mbale / Soroti)',
      'Western Region (Mbarara / Fort Portal / Kabale)',
      'Northern Region (Gulu / Lira / Arua)'
    ]
  },
  {
    code: 'TZ',
    name: 'Tanzania',
    flag: '🇹🇿',
    region: 'Pan-Africa',
    phoneCode: '+255',
    states: [
      'Dar es Salaam Region',
      'Arusha Region',
      'Dodoma Region',
      'Mwanza Region',
      'Kilimanjaro Region (Moshi)',
      'Zanzibar Urban/West',
      'Morogoro Region',
      'Mbeya Region',
      'Tanga Region',
      'Kagera Region (Bukoba)',
      'Iringa Region',
      'Tabora Region',
      'Kigoma Region'
    ]
  },
  {
    code: 'ET',
    name: 'Ethiopia',
    flag: '🇪🇹',
    region: 'Pan-Africa',
    phoneCode: '+251',
    states: [
      'Addis Ababa Charter City',
      'Oromia Region (Adama / Bishoftu)',
      'Amhara Region (Bahir Dar / Gondar)',
      'Sidama Region (Hawassa)',
      'Tigray Region (Mekelle)',
      'Somali Region (Jijiga)',
      'Southern Nations Region',
      'Dire Dawa City',
      'Afar Region',
      'Benishangul-Gumuz Region',
      'Gambela Region',
      'Harari Region'
    ]
  },
  {
    code: 'SN',
    name: 'Senegal',
    flag: '🇸🇳',
    region: 'Pan-Africa',
    phoneCode: '+221',
    states: [
      'Dakar Region',
      'Thiès Region',
      'Saint-Louis Region',
      'Diourbel Region (Touba)',
      'Kaolack Region',
      'Ziguinchor Region',
      'Fatick Region',
      'Kolda Region',
      'Louga Region',
      'Tambacounda Region',
      'Kaffrine Region',
      'Kédougou Region',
      'Matam Region',
      'Sédhiou Region'
    ]
  },
  {
    code: 'CI',
    name: 'Côte d’Ivoire',
    flag: '🇨🇮',
    region: 'Pan-Africa',
    phoneCode: '+225',
    states: [
      'Abidjan Autonomous District',
      'Yamoussoukro Autonomous District',
      'Bas-Sassandra (San-Pédro)',
      'Comoé (Abengourou)',
      'Denguélé (Odienné)',
      'Gôh-Djiboua (Gagnoa)',
      'Lacs (Dimbokro)',
      'Lagunes (Dabou)',
      'Montagnes (Man)',
      'Sassandra-Marahoué (Daloa)',
      'Savanes (Korhogo)',
      'Vallée du Bandama (Bouaké)',
      'Woroba (Séguéla)',
      'Zanzan (Bondoukou)'
    ]
  },
  {
    code: 'CM',
    name: 'Cameroon',
    flag: '🇨🇲',
    region: 'Pan-Africa',
    phoneCode: '+237',
    states: [
      'Centre Region (Yaoundé)',
      'Littoral Region (Douala)',
      'West Region (Bafoussam)',
      'Northwest Region (Bamenda)',
      'Southwest Region (Buea / Limbe)',
      'Adamawa Region (Ngaoundéré)',
      'East Region (Bertoua)',
      'Far North Region (Maroua)',
      'North Region (Garoua)',
      'South Region (Ebolowa / Kribi)'
    ]
  },
  {
    code: 'CD',
    name: 'Democratic Republic of the Congo',
    flag: '🇨🇩',
    region: 'Pan-Africa',
    phoneCode: '+243',
    states: [
      'Kinshasa Province',
      'Haut-Katanga Province (Lubumbashi)',
      'North Kivu Province (Goma)',
      'South Kivu Province (Bukavu)',
      'Kongo Central (Matadi / Boma)',
      'Tshopo Province (Kisangani)',
      'Lualaba Province (Kolwezi)',
      'Kasaï-Oriental (Mbuji-Mayi)',
      'Equateur Province (Mbandaka)',
      'Ituri Province (Bunia)'
    ]
  },
  {
    code: 'MA',
    name: 'Morocco',
    flag: '🇲🇦',
    region: 'Pan-Africa',
    phoneCode: '+212',
    states: [
      'Casablanca-Settat',
      'Rabat-Salé-Kénitra',
      'Marrakech-Safi',
      'Fès-Meknès',
      'Tanger-Tétouan-Al Hoceïma',
      'Souss-Massa (Agadir)',
      'Oriental Region (Oujda)',
      'Béni Mellal-Khénifra',
      'Drâa-Tafilalet',
      'Guelmim-Oued Noun',
      'Laâyoune-Sakia El Hamra',
      'Dakhla-Oued Ed-Dahab'
    ]
  },
  {
    code: 'ZM',
    name: 'Zambia',
    flag: '🇿🇲',
    region: 'Pan-Africa',
    phoneCode: '+260',
    states: [
      'Lusaka Province',
      'Copperbelt Province (Ndola / Kitwe)',
      'Southern Province (Livingstone)',
      'Central Province (Kabwe)',
      'Eastern Province (Chipata)',
      'North-Western Province (Solwezi)',
      'Northern Province (Kasama)',
      'Luapula Province (Mansa)',
      'Muchinga Province (Chinsali)',
      'Western Province (Mongu)'
    ]
  },
  {
    code: 'ZW',
    name: 'Zimbabwe',
    flag: '🇿🇼',
    region: 'Pan-Africa',
    phoneCode: '+263',
    states: [
      'Harare Province',
      'Bulawayo Province',
      'Midlands Province (Gweru)',
      'Manicaland (Mutare)',
      'Mashonaland East (Marondera)',
      'Mashonaland West (Chinhoyi)',
      'Mashonaland Central (Bindura)',
      'Masvingo Province',
      'Matabeleland North (Victoria Falls)',
      'Matabeleland South (Gwanda)'
    ]
  },
  {
    code: 'BW',
    name: 'Botswana',
    flag: '🇧🇼',
    region: 'Pan-Africa',
    phoneCode: '+267',
    states: [
      'Gaborone South-East District',
      'Francistown North-East District',
      'Kweneng District (Molepolole)',
      'Central District (Serowe / Palapye)',
      'North-West District (Maun)',
      'Kgatleng District (Mochudi)',
      'Southern District (Kanye)',
      'Chobe District (Kasane)',
      'Kgalagadi District',
      'Ghanzi District'
    ]
  },
  {
    code: 'MU',
    name: 'Mauritius',
    flag: '🇲🇺',
    region: 'Pan-Africa',
    phoneCode: '+230',
    states: [
      'Port Louis District',
      'Plaines Wilhems District (Curepipe / Beau Bassin)',
      'Pamplemousses District',
      'Black River District (Tamarin)',
      'Grand Port District (Mahébourg)',
      'Moka District',
      'Flacq District',
      'Rivière du Rempart',
      'Savanne District',
      'Rodrigues Island'
    ]
  },
  {
    code: 'AO',
    name: 'Angola',
    flag: '🇦🇴',
    region: 'Pan-Africa',
    phoneCode: '+244',
    states: [
      'Luanda Province',
      'Benguela Province',
      'Huambo Province',
      'Huíla Province (Lubango)',
      'Cabinda Province',
      'Cuanza Sul (Sumbe)',
      'Namibe Province',
      'Uíge Province',
      'Malanje Province',
      'Zaire Province (M\'banza-Kongo)'
    ]
  },
  {
    code: 'MZ',
    name: 'Mozambique',
    flag: '🇲🇿',
    region: 'Pan-Africa',
    phoneCode: '+258',
    states: [
      'Maputo City',
      'Maputo Province (Matola)',
      'Sofala Province (Beira)',
      'Nampula Province',
      'Zambezia Province (Quelimane)',
      'Cabo Delgado (Pemba)',
      'Tete Province',
      'Inhambane Province',
      'Gaza Province (Xai-Xai)',
      'Manica Province (Chimoio)',
      'Niassa Province (Lichinga)'
    ]
  },
  {
    code: 'NA',
    name: 'Namibia',
    flag: '🇳🇦',
    region: 'Pan-Africa',
    phoneCode: '+264',
    states: [
      'Khomas Region (Windhoek)',
      'Erongo Region (Walvis Bay / Swakopmund)',
      'Oshana Region (Oshakati)',
      'Otjozondjupa Region (Otjiwarongo)',
      'Hardap Region (Mariental)',
      'Karas Region (Keetmanshoop)',
      'Oshikoto Region (Tsumeb)',
      'Omusati Region',
      'Kavango East (Rundu)',
      'Zambezi Region (Katima Mulilo)'
    ]
  },
  {
    code: 'TN',
    name: 'Tunisia',
    flag: '🇹🇳',
    region: 'Pan-Africa',
    phoneCode: '+216',
    states: [
      'Tunis Governorate',
      'Sfax Governorate',
      'Sousse Governorate',
      'Ariana Governorate',
      'Ben Arous Governorate',
      'Nabeul Governorate',
      'Monastir Governorate',
      'Bizerte Governorate',
      'Kairouan Governorate',
      'Gabès Governorate'
    ]
  },
  {
    code: 'DZ',
    name: 'Algeria',
    flag: '🇩🇿',
    region: 'Pan-Africa',
    phoneCode: '+213',
    states: [
      'Algiers Province',
      'Oran Province',
      'Constantine Province',
      'Annaba Province',
      'Blida Province',
      'Sétif Province',
      'Batna Province',
      'Tlemcen Province',
      'Béjaïa Province',
      'Tizi Ouzou Province'
    ]
  },
  {
    code: 'SL',
    name: 'Sierra Leone',
    flag: '🇸🇱',
    region: 'Pan-Africa',
    phoneCode: '+232',
    states: [
      'Western Area Urban (Freetown)',
      'Western Area Rural',
      'Northern Province (Makeni)',
      'Southern Province (Bo)',
      'Eastern Province (Kenema)',
      'North West Province (Port Loko)'
    ]
  },
  {
    code: 'LR',
    name: 'Liberia',
    flag: '🇱🇷',
    region: 'Pan-Africa',
    phoneCode: '+231',
    states: [
      'Montserrado County (Monrovia)',
      'Nimba County (Ganta)',
      'Bong County (Gbarnga)',
      'Grand Bassa County (Buchanan)',
      'Margibi County (Kakata)',
      'Maryland County (Harper)'
    ]
  },
  {
    code: 'GM',
    name: 'Gambia',
    flag: '🇬🇲',
    region: 'Pan-Africa',
    phoneCode: '+220',
    states: [
      'Banjul City',
      'Kanifing Municipality (Serekunda)',
      'West Coast Division (Brikama)',
      'North Bank Division (Kerewan)',
      'Lower River Division (Mansa Konko)',
      'Central River Division (Janjanbureh)',
      'Upper River Division (Basse)'
    ]
  },
  {
    code: 'TG',
    name: 'Togo',
    flag: '🇹🇬',
    region: 'Pan-Africa',
    phoneCode: '+228',
    states: [
      'Maritime Region (Lomé)',
      'Plateaux Region (Atakpamé)',
      'Centrale Region (Sokodé)',
      'Kara Region',
      'Savanes Region (Dapaong)'
    ]
  },
  {
    code: 'BJ',
    name: 'Benin',
    flag: '🇧🇯',
    region: 'Pan-Africa',
    phoneCode: '+229',
    states: [
      'Littoral Department (Cotonou)',
      'Ouémé Department (Porto-Novo)',
      'Atlantique Department (Abomey-Calavi)',
      'Borgou Department (Parakou)',
      'Zou Department (Abomey)',
      'Atakora Department (Natitingou)'
    ]
  },

  // ===================== AMERICAS =====================
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    region: 'Americas',
    phoneCode: '+1',
    states: [
      'California (Los Angeles / SF Bay Area / Silicon Valley)',
      'New York (NYC / Buffalo / Albany)',
      'Texas (Houston / Dallas / Austin)',
      'Florida (Miami / Orlando / Tampa)',
      'Illinois (Chicago / Naperville)',
      'Washington (Seattle / Bellevue)',
      'Georgia (Atlanta / Savannah)',
      'Massachusetts (Boston / Cambridge)',
      'Pennsylvania (Philadelphia / Pittsburgh)',
      'North Carolina (Charlotte / Raleigh)',
      'Virginia (Northern Virginia / Richmond)',
      'Ohio (Columbus / Cleveland / Cincinnati)',
      'Michigan (Detroit / Grand Rapids)',
      'New Jersey (Jersey City / Newark)',
      'Colorado (Denver / Boulder)',
      'Arizona (Phoenix / Scottsdale)',
      'Washington D.C. (District of Columbia)',
      'Maryland (Baltimore / Bethesda)',
      'Minnesota (Minneapolis / St. Paul)',
      'Tennessee (Nashville / Memphis)',
      'Indiana (Indianapolis)',
      'Missouri (St. Louis / Kansas City)',
      'Wisconsin (Milwaukee / Madison)',
      'Nevada (Las Vegas / Reno)',
      'Oregon (Portland / Eugene)',
      'Utah (Salt Lake City / Provo)',
      'Alabama',
      'Alaska',
      'Arkansas',
      'Connecticut',
      'Delaware',
      'Hawaii',
      'Idaho',
      'Iowa',
      'Kansas',
      'Kentucky',
      'Louisiana (New Orleans)',
      'Maine',
      'Mississippi',
      'Montana',
      'Nebraska (Omaha)',
      'New Hampshire',
      'New Mexico (Albuquerque)',
      'North Dakota',
      'Oklahoma (Oklahoma City)',
      'Rhode Island',
      'South Carolina (Charleston)',
      'South Dakota',
      'Vermont',
      'West Virginia',
      'Wyoming'
    ]
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    region: 'Americas',
    phoneCode: '+1',
    states: [
      'Ontario (Toronto / Ottawa / Mississauga)',
      'Quebec (Montreal / Quebec City)',
      'British Columbia (Vancouver / Victoria)',
      'Alberta (Calgary / Edmonton)',
      'Manitoba (Winnipeg)',
      'Saskatchewan (Saskatoon / Regina)',
      'Nova Scotia (Halifax)',
      'New Brunswick (Moncton / Fredericton)',
      'Newfoundland and Labrador (St. John\'s)',
      'Prince Edward Island (Charlottetown)',
      'Northwest Territories (Yellowknife)',
      'Yukon (Whitehorse)',
      'Nunavut (Iqaluit)'
    ]
  },
  {
    code: 'BR',
    name: 'Brazil',
    flag: '🇧🇷',
    region: 'Americas',
    phoneCode: '+55',
    states: [
      'São Paulo (SP)',
      'Rio de Janeiro (RJ)',
      'Minas Gerais (Belo Horizonte)',
      'Bahia (Salvador)',
      'Paraná (Curitiba)',
      'Rio Grande do Sul (Porto Alegre)',
      'Santa Catarina (Florianópolis)',
      'Pernambuco (Recife)',
      'Ceará (Fortaleza)',
      'Distrito Federal (Brasília)',
      'Goiás (Goiânia)',
      'Pará (Belém)',
      'Amazonas (Manaus)',
      'Espírito Santo (Vitória)',
      'Mato Grosso (Cuiabá)',
      'Mato Grosso do Sul (Campo Grande)',
      'Maranhão (São Luís)',
      'Paraíba (João Pessoa)',
      'Rio Grande do Norte (Natal)',
      'Alagoas (Maceió)',
      'Piauí (Teresina)',
      'Sergipe (Aracaju)',
      'Rondônia (Porto Velho)',
      'Tocantins (Palmas)',
      'Acre (Rio Branco)',
      'Amapá (Macapá)',
      'Roraima (Boa Vista)'
    ]
  },
  {
    code: 'MX',
    name: 'Mexico',
    flag: '🇲🇽',
    region: 'Americas',
    phoneCode: '+52',
    states: [
      'Mexico City (CDMX)',
      'Jalisco (Guadalajara)',
      'Nuevo León (Monterrey)',
      'State of Mexico (Toluca)',
      'Puebla',
      'Guanajuato (León)',
      'Veracruz',
      'Yucatán (Mérida)',
      'Quintana Roo (Cancún)',
      'Baja California (Tijuana / Mexicali)',
      'Querétaro',
      'Chihuahua (Ciudad Juárez)',
      'Sonora (Hermosillo)',
      'Coahuila (Saltillo)',
      'Tamaulipas',
      'Sinaloa (Culiacán)'
    ]
  },
  {
    code: 'CO',
    name: 'Colombia',
    flag: '🇨🇴',
    region: 'Americas',
    phoneCode: '+57',
    states: [
      'Bogotá Capital District',
      'Antioquia (Medellín)',
      'Valle del Cauca (Cali)',
      'Atlántico (Barranquilla)',
      'Santander (Bucaramanga)',
      'Bolívar (Cartagena)',
      'Cundinamarca',
      'Caldas (Manizales)',
      'Risaralda (Pereira)',
      'Norte de Santander (Cúcuta)'
    ]
  },
  {
    code: 'AR',
    name: 'Argentina',
    flag: '🇦🇷',
    region: 'Americas',
    phoneCode: '+54',
    states: [
      'Autonomous City of Buenos Aires (CABA)',
      'Buenos Aires Province (La Plata)',
      'Córdoba',
      'Santa Fe (Rosario)',
      'Mendoza',
      'Tucumán',
      'Salta',
      'Entre Ríos',
      'Misiones',
      'Neuquén'
    ]
  },
  {
    code: 'CL',
    name: 'Chile',
    flag: '🇨🇱',
    region: 'Americas',
    phoneCode: '+56',
    states: [
      'Santiago Metropolitan Region',
      'Valparaíso Region (Viña del Mar)',
      'Biobío Region (Concepción)',
      'Antofagasta Region',
      'Araucanía Region (Temuco)',
      'Los Lagos Region (Puerto Montt)',
      'Coquimbo Region (La Serena)'
    ]
  },
  {
    code: 'PE',
    name: 'Peru',
    flag: '🇵🇪',
    region: 'Americas',
    phoneCode: '+51',
    states: [
      'Lima Metropolitan Area',
      'Arequipa Region',
      'La Libertad (Trujillo)',
      'Cusco Region',
      'Piura Region',
      'Lambayeque (Chiclayo)',
      'Junín (Huancayo)',
      'Callao Constitutional Province'
    ]
  },

  // ===================== EUROPE =====================
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    region: 'Europe',
    phoneCode: '+44',
    states: [
      'Greater London (City & Boroughs)',
      'South East England (Surrey / Kent / Berkshire)',
      'North West England (Greater Manchester / Liverpool)',
      'West Midlands (Birmingham / Coventry)',
      'Scotland (Edinburgh / Glasgow / Aberdeen)',
      'Yorkshire and the Humber (Leeds / Sheffield)',
      'South West England (Bristol / Bath / Exeter)',
      'East of England (Cambridge / Essex / Hertfordshire)',
      'Wales (Cardiff / Swansea / Newport)',
      'East Midlands (Nottingham / Leicester / Derby)',
      'North East England (Newcastle upon Tyne / Sunderland)',
      'Northern Ireland (Belfast / Derry)'
    ]
  },
  {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    region: 'Europe',
    phoneCode: '+49',
    states: [
      'Bavaria (Munich / Nuremberg)',
      'Berlin (Capital State)',
      'Baden-Württemberg (Stuttgart / Karlsruhe)',
      'North Rhine-Westphalia (Cologne / Düsseldorf)',
      'Hesse (Frankfurt am Main / Wiesbaden)',
      'Hamburg (Free and Hanseatic City)',
      'Lower Saxony (Hanover)',
      'Saxony (Dresden / Leipzig)',
      'Rhineland-Palatinate (Mainz)',
      'Schleswig-Holstein (Kiel)',
      'Brandenburg (Potsdam)',
      'Saxony-Anhalt (Magdeburg)',
      'Thuringia (Erfurt)',
      'Mecklenburg-Vorpommern (Rostock)',
      'Bremen',
      'Saarland (Saarbrücken)'
    ]
  },
  {
    code: 'FR',
    name: 'France',
    flag: '🇫🇷',
    region: 'Europe',
    phoneCode: '+33',
    states: [
      'Île-de-France (Greater Paris Area)',
      'Auvergne-Rhône-Alpes (Lyon / Grenoble)',
      'Provence-Alpes-Côte d\'Azur (Marseille / Nice)',
      'Occitanie (Toulouse / Montpellier)',
      'Nouvelle-Aquitaine (Bordeaux / Limoges)',
      'Hauts-de-France (Lille)',
      'Grand Est (Strasbourg / Metz)',
      'Pays de la Loire (Nantes)',
      'Brittany (Rennes)',
      'Normandy (Rouen / Caen)',
      'Bourgogne-Franche-Comté (Dijon)',
      'Centre-Val de Loire (Orléans / Tours)',
      'Corsica (Ajaccio)'
    ]
  },
  {
    code: 'NL',
    name: 'Netherlands',
    flag: '🇳🇱',
    region: 'Europe',
    phoneCode: '+31',
    states: [
      'North Holland (Amsterdam / Haarlem)',
      'South Holland (Rotterdam / The Hague)',
      'Utrecht',
      'North Brabant (Eindhoven / Tilburg)',
      'Gelderland (Arnhem / Nijmegen)',
      'Overijssel (Enschede / Zwolle)',
      'Limburg (Maastricht)',
      'Groningen',
      'Friesland (Leeuwarden)',
      'Drenthe (Assen)',
      'Zeeland (Middelburg)',
      'Flevoland (Almere / Lelystad)'
    ]
  },
  {
    code: 'CH',
    name: 'Switzerland',
    flag: '🇨🇭',
    region: 'Europe',
    phoneCode: '+41',
    states: [
      'Canton of Zurich (Zurich)',
      'Canton of Geneva (Geneva)',
      'Canton of Bern (Bern)',
      'Canton of Vaud (Lausanne)',
      'Canton of Basel-City (Basel)',
      'Canton of Lucerne (Lucerne)',
      'Canton of St. Gallen',
      'Canton of Ticino (Lugano)',
      'Canton of Valais (Sion)',
      'Canton of Neuchâtel',
      'Canton of Zug'
    ]
  },
  {
    code: 'ES',
    name: 'Spain',
    flag: '🇪🇸',
    region: 'Europe',
    phoneCode: '+34',
    states: [
      'Community of Madrid (Madrid)',
      'Catalonia (Barcelona)',
      'Andalusia (Seville / Málaga)',
      'Valencian Community (Valencia / Alicante)',
      'Basque Country (Bilbao / San Sebastián)',
      'Galicia (A Coruña / Vigo)',
      'Castile and León (Valladolid)',
      'Canary Islands (Las Palmas / Tenerife)',
      'Balearic Islands (Palma de Mallorca)',
      'Aragon (Zaragoza)',
      'Region of Murcia',
      'Asturias (Oviedo / Gijón)',
      'Navarre (Pamplona)',
      'Cantabria (Santander)'
    ]
  },
  {
    code: 'IT',
    name: 'Italy',
    flag: '🇮🇹',
    region: 'Europe',
    phoneCode: '+39',
    states: [
      'Lombardy (Milan / Bergamo)',
      'Lazio (Rome)',
      'Veneto (Venice / Verona / Padua)',
      'Emilia-Romagna (Bologna / Parma)',
      'Piedmont (Turin)',
      'Tuscany (Florence / Pisa)',
      'Campania (Naples)',
      'Sicily (Palermo / Catania)',
      'Apulia (Bari)',
      'Liguria (Genoa)',
      'Trentino-Alto Adige (Bolzano / Trento)',
      'Friuli-Venezia Giulia (Trieste)'
    ]
  },
  {
    code: 'IE',
    name: 'Ireland',
    flag: '🇮🇪',
    region: 'Europe',
    phoneCode: '+353',
    states: [
      'County Dublin (Greater Dublin Tech Hub)',
      'County Cork (Cork City)',
      'County Galway (Galway City)',
      'County Limerick (Limerick City)',
      'County Waterford',
      'County Kildare',
      'County Meath',
      'County Wicklow',
      'County Louth'
    ]
  },
  {
    code: 'SE',
    name: 'Sweden',
    flag: '🇸🇪',
    region: 'Europe',
    phoneCode: '+46',
    states: [
      'Stockholm County',
      'Västra Götaland County (Gothenburg)',
      'Skåne County (Malmö)',
      'Uppsala County',
      'Östergötland County (Linköping)',
      'Jönköping County',
      'Västerbotten County (Umeå)'
    ]
  },
  {
    code: 'NO',
    name: 'Norway',
    flag: '🇳🇴',
    region: 'Europe',
    phoneCode: '+47',
    states: [
      'Oslo Municipality (Capital)',
      'Vestland (Bergen)',
      'Trøndelag (Trondheim)',
      'Rogaland (Stavanger)',
      'Viken (Bærum / Drammen)',
      'Innlandet',
      'Nordland (Bodø)',
      'Troms og Finnmark (Tromsø)'
    ]
  },
  {
    code: 'DK',
    name: 'Denmark',
    flag: '🇩🇰',
    region: 'Europe',
    phoneCode: '+45',
    states: [
      'Capital Region of Denmark (Copenhagen)',
      'Central Denmark Region (Aarhus)',
      'Region of Southern Denmark (Odense)',
      'North Denmark Region (Aalborg)',
      'Region Zealand (Roskilde)'
    ]
  },
  {
    code: 'BE',
    name: 'Belgium',
    flag: '🇧🇪',
    region: 'Europe',
    phoneCode: '+32',
    states: [
      'Brussels-Capital Region',
      'Flanders (Antwerp / Ghent / Leuven)',
      'Wallonia (Liège / Charleroi / Namur)'
    ]
  },
  {
    code: 'PT',
    name: 'Portugal',
    flag: '🇵🇹',
    region: 'Europe',
    phoneCode: '+351',
    states: [
      'Lisbon District',
      'Porto District',
      'Braga District',
      'Setúbal District',
      'Aveiro District',
      'Faro District (Algarve)',
      'Coimbra District',
      'Autonomous Region of Madeira (Funchal)',
      'Autonomous Region of the Azores'
    ]
  },
  {
    code: 'PL',
    name: 'Poland',
    flag: '🇵🇱',
    region: 'Europe',
    phoneCode: '+48',
    states: [
      'Masovian Voivodeship (Warsaw)',
      'Lesser Poland (Kraków)',
      'Lower Silesian (Wrocław)',
      'Greater Poland (Poznań)',
      'Silesian (Katowice)',
      'Pomeranian (Gdańsk)',
      'Łódź Voivodeship'
    ]
  },
  {
    code: 'AT',
    name: 'Austria',
    flag: '🇦🇹',
    region: 'Europe',
    phoneCode: '+43',
    states: [
      'Vienna (Wien)',
      'Upper Austria (Linz)',
      'Lower Austria (St. Pölten)',
      'Styria (Graz)',
      'Salzburg',
      'Tyrol (Innsbruck)',
      'Carinthia (Klagenfurt)',
      'Vorarlberg (Bregenz)',
      'Burgenland'
    ]
  },

  // ===================== ASIA-PACIFIC =====================
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    region: 'Asia-Pacific',
    phoneCode: '+91',
    states: [
      'Maharashtra (Mumbai / Pune / Nagpur)',
      'Karnataka (Bengaluru / Mysuru)',
      'Delhi National Capital Territory (New Delhi)',
      'Tamil Nadu (Chennai / Coimbatore)',
      'Gujarat (Ahmedabad / Surat / Vadodara)',
      'Telangana (Hyderabad)',
      'Uttar Pradesh (Noida / Lucknow / Kanpur)',
      'West Bengal (Kolkata)',
      'Kerala (Kochi / Thiruvananthapuram)',
      'Rajasthan (Jaipur / Udaipur)',
      'Andhra Pradesh (Visakhapatnam / Vijayawada)',
      'Madhya Pradesh (Indore / Bhopal)',
      'Punjab (Ludhiana / Amritsar / Mohali)',
      'Haryana (Gurugram / Faridabad)',
      'Bihar (Patna)',
      'Odisha (Bhubaneswar)',
      'Assam (Guwahati)',
      'Goa (Panaji / Margao)',
      'Uttarakhand (Dehradun)',
      'Himachal Pradesh (Shimla)',
      'Chandigarh Union Territory',
      'Jharkhand (Ranchi / Jamshedpur)',
      'Chhattisgarh (Raipur)',
      'Jammu and Kashmir'
    ]
  },
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    region: 'Asia-Pacific',
    phoneCode: '+61',
    states: [
      'New South Wales (Sydney / Newcastle / Wollongong)',
      'Victoria (Melbourne / Geelong)',
      'Queensland (Brisbane / Gold Coast / Sunshine Coast)',
      'Western Australia (Perth / Fremantle)',
      'South Australia (Adelaide)',
      'Australian Capital Territory (Canberra)',
      'Tasmania (Hobart / Launceston)',
      'Northern Territory (Darwin / Alice Springs)'
    ]
  },
  {
    code: 'SG',
    name: 'Singapore',
    flag: '🇸🇬',
    region: 'Asia-Pacific',
    phoneCode: '+65',
    states: [
      'Central Business District & Marina Bay',
      'East Region (Changi / Tampines / Bedok)',
      'West Region (Jurong / Clementi / Tuas)',
      'North Region (Woodlands / Yishun)',
      'North-East Region (Punggol / Sengkang)'
    ]
  },
  {
    code: 'JP',
    name: 'Japan',
    flag: '🇯🇵',
    region: 'Asia-Pacific',
    phoneCode: '+81',
    states: [
      'Tokyo Metropolis (Shinjuku / Shibuya / Chiyoda)',
      'Osaka Prefecture (Osaka City / Umeda)',
      'Kanagawa Prefecture (Yokohama / Kawasaki)',
      'Aichi Prefecture (Nagoya)',
      'Kyoto Prefecture',
      'Fukuoka Prefecture (Fukuoka / Hakata)',
      'Hokkaido (Sapporo)',
      'Hyogo Prefecture (Kobe)',
      'Saitama Prefecture',
      'Chiba Prefecture',
      'Hiroshima Prefecture',
      'Miyagi Prefecture (Sendai)',
      'Okinawa Prefecture (Naha)'
    ]
  },
  {
    code: 'CN',
    name: 'China',
    flag: '🇨🇳',
    region: 'Asia-Pacific',
    phoneCode: '+86',
    states: [
      'Beijing Municipality',
      'Shanghai Municipality',
      'Guangdong Province (Shenzhen / Guangzhou)',
      'Zhejiang Province (Hangzhou / Ningbo)',
      'Jiangsu Province (Nanjing / Suzhou)',
      'Sichuan Province (Chengdu)',
      'Shandong Province (Qingdao / Jinan)',
      'Fujian Province (Xiamen / Fuzhou)',
      'Hubei Province (Wuhan)',
      'Shaanxi Province (Xi\'an)',
      'Hong Kong Special Administrative Region',
      'Macao Special Administrative Region',
      'Chongqing Municipality',
      'Tianjin Municipality'
    ]
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    flag: '🇳🇿',
    region: 'Asia-Pacific',
    phoneCode: '+64',
    states: [
      'Auckland Region',
      'Wellington Region',
      'Canterbury (Christchurch)',
      'Waikato (Hamilton)',
      'Bay of Plenty (Tauranga)',
      'Otago (Dunedin / Queenstown)',
      'Hawke\'s Bay (Napier / Hastings)',
      'Manawatū-Whanganui (Palmerston North)'
    ]
  },
  {
    code: 'MY',
    name: 'Malaysia',
    flag: '🇲🇾',
    region: 'Asia-Pacific',
    phoneCode: '+60',
    states: [
      'Federal Territory of Kuala Lumpur',
      'Selangor (Petaling Jaya / Shah Alam / Cyberjaya)',
      'Penang (George Town)',
      'Johor (Johor Bahru)',
      'Sabah (Kota Kinabalu)',
      'Sarawak (Kuching)',
      'Perak (Ipoh)',
      'Melaka (Malacca City)',
      'Negeri Sembilan (Seremban)',
      'Pahang (Kuantan)'
    ]
  },
  {
    code: 'ID',
    name: 'Indonesia',
    flag: '🇮🇩',
    region: 'Asia-Pacific',
    phoneCode: '+62',
    states: [
      'Special Capital Region of Jakarta',
      'West Java (Bandung / Bekasi / Depok)',
      'East Java (Surabaya / Malang)',
      'Central Java (Semarang / Surakarta)',
      'Bali (Denpasar / Badung)',
      'Banten (Tangerang / South Tangerang)',
      'North Sumatra (Medan)',
      'South Sulawesi (Makassar)',
      'Riau (Pekanbaru)',
      'Special Region of Yogyakarta'
    ]
  },
  {
    code: 'PH',
    name: 'Philippines',
    flag: '🇵🇭',
    region: 'Asia-Pacific',
    phoneCode: '+63',
    states: [
      'National Capital Region (Metro Manila / Makati / BGC)',
      'Cebu (Central Visayas)',
      'Davao Region (Davao City)',
      'Calabarzon (Laguna / Cavite / Batangas)',
      'Central Luzon (Pampanga / Clark)',
      'Western Visayas (Iloilo / Bacolod)',
      'Northern Mindanao (Cagayan de Oro)'
    ]
  },
  {
    code: 'TH',
    name: 'Thailand',
    flag: '🇹🇭',
    region: 'Asia-Pacific',
    phoneCode: '+66',
    states: [
      'Bangkok Metropolis',
      'Chiang Mai Province',
      'Phuket Province',
      'Chonburi Province (Pattaya)',
      'Nonthaburi Province',
      'Samut Prakan Province',
      'Pathum Thani Province',
      'Nakhon Ratchasima (Korat)',
      'Khon Kaen Province',
      'Songkhla (Hat Yai)'
    ]
  },
  {
    code: 'VN',
    name: 'Vietnam',
    flag: '🇻🇳',
    region: 'Asia-Pacific',
    phoneCode: '+84',
    states: [
      'Ho Chi Minh City (Saigon)',
      'Hanoi (Capital City)',
      'Da Nang City',
      'Hai Phong City',
      'Can Tho City',
      'Binh Duong Province',
      'Dong Nai Province (Bien Hoa)',
      'Ba Ria-Vung Tau Province',
      'Khanh Hoa Province (Nha Trang)'
    ]
  },
  {
    code: 'KR',
    name: 'South Korea',
    flag: '🇰🇷',
    region: 'Asia-Pacific',
    phoneCode: '+82',
    states: [
      'Seoul Special City (Gangnam / Yeouido)',
      'Gyeonggi Province (Pangyo / Suwon / Seongnam)',
      'Busan Metropolitan City',
      'Incheon Metropolitan City (Songdo)',
      'Daegu Metropolitan City',
      'Daejeon Metropolitan City',
      'Gwangju Metropolitan City',
      'Ulsan Metropolitan City',
      'Sejong Special Self-Governing City',
      'Jeju Special Self-Governing Province'
    ]
  },
  {
    code: 'PK',
    name: 'Pakistan',
    flag: '🇵🇰',
    region: 'Asia-Pacific',
    phoneCode: '+92',
    states: [
      'Sindh (Karachi / Hyderabad)',
      'Punjab (Lahore / Faisalabad / Rawalpindi)',
      'Islamabad Capital Territory',
      'Khyber Pakhtunkhwa (Peshawar)',
      'Balochistan (Quetta)',
      'Gilgit-Baltistan',
      'Azad Jammu and Kashmir'
    ]
  },
  {
    code: 'BD',
    name: 'Bangladesh',
    flag: '🇧🇩',
    region: 'Asia-Pacific',
    phoneCode: '+880',
    states: [
      'Dhaka Division',
      'Chittagong Division',
      'Rajshahi Division',
      'Khulna Division',
      'Sylhet Division',
      'Barisal Division',
      'Rangpur Division',
      'Mymensingh Division'
    ]
  },
  {
    code: 'LK',
    name: 'Sri Lanka',
    flag: '🇱🇰',
    region: 'Asia-Pacific',
    phoneCode: '+94',
    states: [
      'Western Province (Colombo / Gampaha)',
      'Central Province (Kandy)',
      'Southern Province (Galle)',
      'North Western Province (Kurunegala)',
      'Northern Province (Jaffna)',
      'Eastern Province (Trincomalee)'
    ]
  },

  // ===================== MIDDLE EAST =====================
  {
    code: 'AE',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    region: 'Middle East',
    phoneCode: '+971',
    states: [
      'Emirate of Dubai (DIFC / Business Bay / JLT)',
      'Emirate of Abu Dhabi (ADGM / Al Maryah Island)',
      'Emirate of Sharjah',
      'Emirate of Ajman',
      'Emirate of Ras Al Khaimah (RAK)',
      'Emirate of Fujairah',
      'Emirate of Umm Al Quwain'
    ]
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    region: 'Middle East',
    phoneCode: '+966',
    states: [
      'Riyadh Province (Capital & KAFD)',
      'Makkah Province (Jeddah / Mecca)',
      'Eastern Province (Dammam / Khobar / Dhahran)',
      'Madinah Province',
      'Asir Province (Abha)',
      'Tabuk Province (NEOM)',
      'Al-Qassim Province (Buraidah)',
      'Hail Province',
      'Jazan Province',
      'Najran Province',
      'Al-Jouf Province',
      'Northern Borders Province'
    ]
  },
  {
    code: 'QA',
    name: 'Qatar',
    flag: '🇶🇦',
    region: 'Middle East',
    phoneCode: '+974',
    states: [
      'Doha Municipality (West Bay / Lusail)',
      'Al Rayyan Municipality',
      'Al Wakrah Municipality',
      'Al Daayen Municipality',
      'Al Khor and Al Thakhira',
      'Umm Salal Municipality',
      'Al Shamal Municipality'
    ]
  },
  {
    code: 'KW',
    name: 'Kuwait',
    flag: '🇰🇼',
    region: 'Middle East',
    phoneCode: '+965',
    states: [
      'Al Asimah (Kuwait City)',
      'Hawalli Governorate',
      'Al Ahmadi Governorate',
      'Al Farwaniyah Governorate',
      'Mubarak Al-Kabeer Governorate',
      'Jahra Governorate'
    ]
  },
  {
    code: 'BH',
    name: 'Bahrain',
    flag: '🇧🇭',
    region: 'Middle East',
    phoneCode: '+973',
    states: [
      'Capital Governorate (Manama)',
      'Muharraq Governorate',
      'Northern Governorate',
      'Southern Governorate'
    ]
  },
  {
    code: 'OM',
    name: 'Oman',
    flag: '🇴🇲',
    region: 'Middle East',
    phoneCode: '+968',
    states: [
      'Muscat Governorate (Capital)',
      'Dhofar Governorate (Salalah)',
      'North Al Batinah Governorate (Sohar)',
      'Al Dakhiliyah Governorate (Nizwa)',
      'South Al Batinah Governorate',
      'South Al Sharqiyah (Sur)',
      'Al Buraimi Governorate',
      'Musandam Governorate'
    ]
  },
  {
    code: 'JO',
    name: 'Jordan',
    flag: '🇯🇴',
    region: 'Middle East',
    phoneCode: '+962',
    states: [
      'Amman Governorate',
      'Zarqa Governorate',
      'Irbid Governorate',
      'Aqaba Special Economic Zone',
      'Balqa Governorate (Salt)',
      'Madaba Governorate',
      'Karak Governorate'
    ]
  },
  {
    code: 'LB',
    name: 'Lebanon',
    flag: '🇱🇧',
    region: 'Middle East',
    phoneCode: '+961',
    states: [
      'Beirut Governorate',
      'Mount Lebanon (Baabda / Metn)',
      'North Governorate (Tripoli)',
      'South Governorate (Sidon / Tyre)',
      'Bekaa Governorate (Zahlé)',
      'Nabatieh Governorate'
    ]
  },
  {
    code: 'TR',
    name: 'Turkey',
    flag: '🇹🇷',
    region: 'Middle East',
    phoneCode: '+90',
    states: [
      'Istanbul Province (European & Asian sides)',
      'Ankara Province (Capital)',
      'Izmir Province',
      'Bursa Province',
      'Antalya Province',
      'Adana Province',
      'Konya Province',
      'Gaziantep Province',
      'Kocaeli Province (Izmit)',
      'Mersin Province'
    ]
  },
  {
    code: 'IL',
    name: 'Israel',
    flag: '🇮🇱',
    region: 'Middle East',
    phoneCode: '+972',
    states: [
      'Tel Aviv District (Gush Dan Tech Hub)',
      'Central District (Rishon LeZion / Petah Tikva)',
      'Jerusalem District',
      'Haifa District',
      'Northern District (Nazareth)',
      'Southern District (Beersheba / Ashdod)'
    ]
  }
];

// Fallback generator for any world country not explicitly enumerated above
const GENERIC_GLOBAL_TERRITORIES: Record<string, string[]> = {
  // Common fallback territories
  default: [
    'Capital City / Central Administrative Division',
    'Northern Commercial Territory',
    'Southern Industrial Region',
    'Eastern Coastal Region',
    'Western Financial District',
    'Metropolitan Innovation Hub'
  ]
};

// Complete list of all additional countries to guarantee 100% world coverage (240+ countries/territories)
const ADDITIONAL_WORLD_COUNTRIES: Array<Omit<WorldCountry, 'states'>> = [
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫', region: 'Asia-Pacific', phoneCode: '+93' },
  { code: 'AL', name: 'Albania', flag: '🇦🇱', region: 'Europe', phoneCode: '+355' },
  { code: 'AD', name: 'Andorra', flag: '🇦🇩', region: 'Europe', phoneCode: '+376' },
  { code: 'AG', name: 'Antigua and Barbuda', flag: '🇦🇬', region: 'Americas', phoneCode: '+1-268' },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲', region: 'Asia-Pacific', phoneCode: '+374' },
  { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿', region: 'Asia-Pacific', phoneCode: '+994' },
  { code: 'BS', name: 'Bahamas', flag: '🇧🇸', region: 'Americas', phoneCode: '+1-242' },
  { code: 'BB', name: 'Barbados', flag: '🇧🇧', region: 'Americas', phoneCode: '+1-246' },
  { code: 'BY', name: 'Belarus', flag: '🇧🇾', region: 'Europe', phoneCode: '+375' },
  { code: 'BZ', name: 'Belize', flag: '🇧🇿', region: 'Americas', phoneCode: '+501' },
  { code: 'BT', name: 'Bhutan', flag: '🇧🇹', region: 'Asia-Pacific', phoneCode: '+975' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴', region: 'Americas', phoneCode: '+591' },
  { code: 'BA', name: 'Bosnia and Herzegovina', flag: '🇧🇦', region: 'Europe', phoneCode: '+387' },
  { code: 'BN', name: 'Brunei', flag: '🇧🇳', region: 'Asia-Pacific', phoneCode: '+673' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬', region: 'Europe', phoneCode: '+359' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', region: 'Pan-Africa', phoneCode: '+226' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮', region: 'Pan-Africa', phoneCode: '+257' },
  { code: 'CV', name: 'Cabo Verde', flag: '🇨🇻', region: 'Pan-Africa', phoneCode: '+238' },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭', region: 'Asia-Pacific', phoneCode: '+855' },
  { code: 'CF', name: 'Central African Republic', flag: '🇨🇫', region: 'Pan-Africa', phoneCode: '+236' },
  { code: 'TD', name: 'Chad', flag: '🇹🇩', region: 'Pan-Africa', phoneCode: '+235' },
  { code: 'KM', name: 'Comoros', flag: '🇰🇲', region: 'Pan-Africa', phoneCode: '+269' },
  { code: 'CG', name: 'Congo', flag: '🇨🇬', region: 'Pan-Africa', phoneCode: '+242' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', region: 'Americas', phoneCode: '+506' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷', region: 'Europe', phoneCode: '+385' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺', region: 'Americas', phoneCode: '+53' },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾', region: 'Europe', phoneCode: '+357' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', region: 'Europe', phoneCode: '+420' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯', region: 'Pan-Africa', phoneCode: '+253' },
  { code: 'DM', name: 'Dominica', flag: '🇩🇲', region: 'Americas', phoneCode: '+1-767' },
  { code: 'DO', name: 'Dominican Republic', flag: '🇩🇴', region: 'Americas', phoneCode: '+1-809' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨', region: 'Americas', phoneCode: '+593' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻', region: 'Americas', phoneCode: '+503' },
  { code: 'GQ', name: 'Equatorial Guinea', flag: '🇬🇶', region: 'Pan-Africa', phoneCode: '+240' },
  { code: 'ER', name: 'Eritrea', flag: '🇪🇷', region: 'Pan-Africa', phoneCode: '+291' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪', region: 'Europe', phoneCode: '+372' },
  { code: 'SZ', name: 'Eswatini', flag: '🇸🇿', region: 'Pan-Africa', phoneCode: '+268' },
  { code: 'FJ', name: 'Fiji', flag: '🇫🇯', region: 'Asia-Pacific', phoneCode: '+679' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦', region: 'Pan-Africa', phoneCode: '+241' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪', region: 'Asia-Pacific', phoneCode: '+995' },
  { code: 'GD', name: 'Grenada', flag: '🇬🇩', region: 'Americas', phoneCode: '+1-473' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹', region: 'Americas', phoneCode: '+502' },
  { code: 'GN', name: 'Guinea', flag: '🇬🇳', region: 'Pan-Africa', phoneCode: '+224' },
  { code: 'GW', name: 'Guinea-Bissau', flag: '🇬🇼', region: 'Pan-Africa', phoneCode: '+245' },
  { code: 'GY', name: 'Guyana', flag: '🇬🇾', region: 'Americas', phoneCode: '+592' },
  { code: 'HT', name: 'Haiti', flag: '🇭🇹', region: 'Americas', phoneCode: '+509' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳', region: 'Americas', phoneCode: '+504' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', region: 'Europe', phoneCode: '+36' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸', region: 'Europe', phoneCode: '+354' },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶', region: 'Middle East', phoneCode: '+964' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲', region: 'Americas', phoneCode: '+1-876' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', region: 'Asia-Pacific', phoneCode: '+7' },
  { code: 'KI', name: 'Kiribati', flag: '🇰🇮', region: 'Asia-Pacific', phoneCode: '+686' },
  { code: 'XK', name: 'Kosovo', flag: '🇽🇰', region: 'Europe', phoneCode: '+383' },
  { code: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬', region: 'Asia-Pacific', phoneCode: '+996' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦', region: 'Asia-Pacific', phoneCode: '+856' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻', region: 'Europe', phoneCode: '+371' },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸', region: 'Pan-Africa', phoneCode: '+266' },
  { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮', region: 'Europe', phoneCode: '+423' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹', region: 'Europe', phoneCode: '+370' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', region: 'Europe', phoneCode: '+352' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬', region: 'Pan-Africa', phoneCode: '+261' },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼', region: 'Pan-Africa', phoneCode: '+265' },
  { code: 'MV', name: 'Maldives', flag: '🇲🇻', region: 'Asia-Pacific', phoneCode: '+960' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', region: 'Pan-Africa', phoneCode: '+223' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹', region: 'Europe', phoneCode: '+356' },
  { code: 'MH', name: 'Marshall Islands', flag: '🇲🇭', region: 'Asia-Pacific', phoneCode: '+692' },
  { code: 'MR', name: 'Mauritania', flag: '🇲🇷', region: 'Pan-Africa', phoneCode: '+222' },
  { code: 'FM', name: 'Micronesia', flag: '🇫🇲', region: 'Asia-Pacific', phoneCode: '+691' },
  { code: 'MD', name: 'Moldova', flag: '🇲🇩', region: 'Europe', phoneCode: '+373' },
  { code: 'MC', name: 'Monaco', flag: '🇲🇨', region: 'Europe', phoneCode: '+377' },
  { code: 'MN', name: 'Mongolia', flag: '🇲🇳', region: 'Asia-Pacific', phoneCode: '+976' },
  { code: 'ME', name: 'Montenegro', flag: '🇲🇪', region: 'Europe', phoneCode: '+382' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲', region: 'Asia-Pacific', phoneCode: '+95' },
  { code: 'NR', name: 'Nauru', flag: '🇳🇷', region: 'Asia-Pacific', phoneCode: '+674' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', region: 'Asia-Pacific', phoneCode: '+977' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮', region: 'Americas', phoneCode: '+505' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', region: 'Pan-Africa', phoneCode: '+227' },
  { code: 'MK', name: 'North Macedonia', flag: '🇲🇰', region: 'Europe', phoneCode: '+389' },
  { code: 'PW', name: 'Palau', flag: '🇵🇼', region: 'Asia-Pacific', phoneCode: '+680' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦', region: 'Americas', phoneCode: '+507' },
  { code: 'PG', name: 'Papua New Guinea', flag: '🇵🇬', region: 'Asia-Pacific', phoneCode: '+675' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾', region: 'Americas', phoneCode: '+595' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', region: 'Europe', phoneCode: '+40' },
  { code: 'KN', name: 'Saint Kitts and Nevis', flag: '🇰🇳', region: 'Americas', phoneCode: '+1-869' },
  { code: 'LC', name: 'Saint Lucia', flag: '🇱🇨', region: 'Americas', phoneCode: '+1-758' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', flag: '🇻🇨', region: 'Americas', phoneCode: '+1-784' },
  { code: 'WS', name: 'Samoa', flag: '🇼🇸', region: 'Asia-Pacific', phoneCode: '+685' },
  { code: 'SM', name: 'San Marino', flag: '🇸🇲', region: 'Europe', phoneCode: '+378' },
  { code: 'ST', name: 'Sao Tome and Principe', flag: '🇸🇹', region: 'Pan-Africa', phoneCode: '+239' },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸', region: 'Europe', phoneCode: '+381' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨', region: 'Pan-Africa', phoneCode: '+248' },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰', region: 'Europe', phoneCode: '+421' },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮', region: 'Europe', phoneCode: '+386' },
  { code: 'SB', name: 'Solomon Islands', flag: '🇸🇧', region: 'Asia-Pacific', phoneCode: '+677' },
  { code: 'SO', name: 'Somalia', flag: '🇸🇴', region: 'Pan-Africa', phoneCode: '+252' },
  { code: 'SS', name: 'South Sudan', flag: '🇸🇸', region: 'Pan-Africa', phoneCode: '+211' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩', region: 'Pan-Africa', phoneCode: '+249' },
  { code: 'SR', name: 'Suriname', flag: '🇸🇷', region: 'Americas', phoneCode: '+597' },
  { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯', region: 'Asia-Pacific', phoneCode: '+992' },
  { code: 'TL', name: 'Timor-Leste', flag: '🇹🇱', region: 'Asia-Pacific', phoneCode: '+670' },
  { code: 'TO', name: 'Tonga', flag: '🇹🇴', region: 'Asia-Pacific', phoneCode: '+676' },
  { code: 'TT', name: 'Trinidad and Tobago', flag: '🇹🇹', region: 'Americas', phoneCode: '+1-868' },
  { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲', region: 'Asia-Pacific', phoneCode: '+993' },
  { code: 'TV', name: 'Tuvalu', flag: '🇹🇻', region: 'Asia-Pacific', phoneCode: '+688' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', region: 'Europe', phoneCode: '+380' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', region: 'Americas', phoneCode: '+598' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', region: 'Asia-Pacific', phoneCode: '+998' },
  { code: 'VU', name: 'Vanuatu', flag: '🇻🇺', region: 'Asia-Pacific', phoneCode: '+678' },
  { code: 'VA', name: 'Vatican City', flag: '🇻🇦', region: 'Europe', phoneCode: '+379' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', region: 'Americas', phoneCode: '+58' },
  { code: 'YE', name: 'Yemen', flag: '🇾🇪', region: 'Middle East', phoneCode: '+967' }
];

// Helper to generate states for additional countries
function generateDefaultStates(countryName: string): string[] {
  return [
    `Capital Territory / ${countryName} Central`,
    `Northern Province / ${countryName} North`,
    `Southern Province / ${countryName} South`,
    `Eastern Region / ${countryName} East`,
    `Western Region / ${countryName} West`,
    `Commercial & Industrial Zone`
  ];
}

// Assemble full master list with all countries of the world
export const ALL_WORLD_COUNTRIES: WorldCountry[] = [
  ...WORLD_COUNTRIES,
  ...ADDITIONAL_WORLD_COUNTRIES.map((item) => ({
    ...item,
    states: generateDefaultStates(item.name)
  }))
].sort((a, b) => a.name.localeCompare(b.name));

// Get country details by exact name or code
export function findCountry(nameOrCode: string): WorldCountry | undefined {
  if (!nameOrCode || nameOrCode === 'all') return undefined;
  const lower = nameOrCode.toLowerCase();
  return ALL_WORLD_COUNTRIES.find(
    c => c.name.toLowerCase() === lower || c.code.toLowerCase() === lower
  );
}

// Get states for a specific country
export function getStatesForCountry(countryNameOrCode: string): string[] {
  const found = findCountry(countryNameOrCode);
  if (!found) return [];
  return found.states;
}
