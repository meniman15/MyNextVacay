export const dan: HotelChain = {
  hotelsByCity: {
    jerusalem: [
      { id: 10118, name: "King David Jerusalem" },
      { id: 10121, name: "Dan Jerusalem" },
      { id: 10119, name: "Dan Panorama Jerusalem" },
      { id: 10120, name: "Dan Boutique Jerusalem" },
    ],
    telAviv: [
      { id: 10122, name: "Dan Tel Aviv" },
      { id: 10123, name: "Dan Panorama Tel Aviv" },
      { id: 10537, name: "Link Hotel & Hub" },
    ],
    eilat: [
      { id: 10124, name: "Dan Eilat" },
      { id: 10125, name: "Dan Panorama Eilat" },
      { id: 10706, name: "Neptune Eilat" },
    ],
    haifa: [
      { id: 10126, name: "Dan Carmel Haifa" },
      { id: 10127, name: "Dan Panorama Haifa" },
    ],
    herzliya: [
      { id: 10129, name: "Dan Accadia Resort" },
    ],
    caesarea: [
      { id: 10130, name: "Dan Caesarea Resort" },
    ],
    safed: [
      { id: 10698, name: "Ruth Safed" },
    ],
    nazareth: [
      { id: 10697, name: "Marys Well Nazareth" },
    ]
  }
};

export const fattal: HotelChain = {
  hotelsByCity: {
    jerusalem: [
      { slug: 'leonardo-plaza-hotel-jerusalem', name: 'Leonardo Plaza Jerusalem' },
      { slug: 'leonardo-hotel-jerusalem', name: 'Leonardo Jerusalem' },
      { slug: 'leonardo-boutique-jerusalem', name: 'Leonardo Boutique Jerusalem' },
    ],
    telAviv: [
      { slug: 'leonardo-city-tower-tel-aviv', name: 'Leonardo City Tower Tel Aviv' },
      { slug: 'bachar-house', name: 'Bachar House' },
      { slug: 'bazaar-hotel', name: 'Bazaar Hotel' },
      { slug: 'herods-tel-aviv-hotel', name: 'Herods Tel Aviv Hotel' },
      { slug: 'hotel-rothschild-22-tel-aviv', name: 'Hotel Rothschild 22 Tel Aviv' },
      { slug: 'leonardo-boutique-hotel-tel-aviv', name: 'Leonardo Boutique Hotel Tel Aviv' },
      { slug: 'leonardo-gordon-beach-tel-aviv', name: 'Leonardo Gordon Beach Tel Aviv' },
      { slug: 'nyx-hotel-tel-aviv', name: 'NYX Hotel Tel Aviv' },
      { slug: 'nordoy-hotel', name: 'Nordoy Hotel' },
      { slug: 'sam-and-blondi', name: 'Sam & Blondi' },
      { slug: 'the-jaffa-hotel', name: 'The Jaffa' },
    ],
    herzliya: [
      { slug: 'herods-herzliya', name: 'Herods Herzliya' },
      { slug: 'nyx-hotel-herzliya', name: 'NYX Hotel Herzliya' },
    ],
    ashdod: [
      { slug: 'leonardo-plaza-hotel-ashdod', name: 'Leonardo Plaza Ashdod' },
    ],
    tiberias: [
      { slug: 'leonardo-club-tiberias', name: 'Leonardo Club Tiberias' },
      { slug: 'leonardo-tiberias', name: 'Leonardo Tiberias' },
      { slug: 'leonardo-plaza-tiberias', name: 'Leonardo Plaza Tiberias' },
      { slug: 'u-boutique-kinneret', name: 'U Boutique Kinneret' },
    ],
    haifa: [
      { slug: 'hotel-botanica-haifa', name: 'Hotel Botanica Haifa' },
      { slug: 'leonardo-plaza-haifa', name: 'Leonardo Plaza Haifa' },
    ],
    rehovot: [
      { slug: 'leonardo-boutique-rehovot', name: 'Leonardo Boutique Rehovot' },
    ],
    safed: [
      { slug: 'canaan-hotel', name: 'Canaan Hotel' },
    ],
    eilat: [
      { slug: 'leonardo-club-hotel-eilat-all-inclusive', name: 'Leonardo Club Eilat' },
      { slug: 'leonardo-privilege-hotel-eilat-all-inclusive', name: 'Leonardo Privilege Eilat' },
      { slug: 'leonardo-plaza-hotel-eilat', name: 'Leonardo Plaza Eilat' },
      { slug: 'herods-palace-eilat-hotel', name: 'Herods Palace Hotel Eilat' },
    ]
  }
};

export type HotelIds = {
  dan: HotelChain;
  fattal: HotelChain;
};

export type HotelChain = {
  hotelsByCity: HotelsByCity;
};

export type HotelsByCity = {
  [cityName: string]: Hotel[];
};

export type Hotel = {
  name: string;
  id?: number;
  slug?: string;
};