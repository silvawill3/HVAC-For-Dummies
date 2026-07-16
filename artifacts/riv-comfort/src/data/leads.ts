export interface Lead {
  stop: number;
  name: string;
  address: string;
  phone: string;
  category: string;
}

export interface CityBlock {
  city: string;
  count: number;
  leads: Lead[];
}

export const LEADS_BY_CITY: CityBlock[] = [
  {
    "city": "Beaumont",
    "count": 5,
    "leads": [
      {
        "stop": 1,
        "name": "Jerad Gehrke",
        "address": "1025 Violet Ct, Beaumont, CA",
        "phone": "1 (760) 552-2844",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 2,
        "name": "Angel Lara",
        "address": "1497 Willowbend Way, Beaumont, CA",
        "phone": "1 (909) 676-9214",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 3,
        "name": "Kristopher Hamlin",
        "address": "937 Massachusetts Ave, Beaumont, CA",
        "phone": "1 (951) 851-0404",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 4,
        "name": "Matthias Blanchard",
        "address": "1728 Brittney Rd, Beaumont, CA",
        "phone": "1 (405) 406-4950",
        "category": "Recent HVAC permit"
      },
      {
        "stop": 5,
        "name": "Sandrine Petit Fulton",
        "address": "37103 Winged Foot Rd, Beaumont, CA 92223",
        "phone": "1 (951) 204-2793",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "Bloomington",
    "count": 6,
    "leads": [
      {
        "stop": 1,
        "name": "Robert Thach",
        "address": "10513 Horseshoe Dr, Bloomington, CA",
        "phone": "1 (909) 244-4698",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 2,
        "name": "German Martinez",
        "address": "18614 Sequoia Ave, Bloomington, CA",
        "phone": "1 (714) 429-6892",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 3,
        "name": "Salvador Carbajal",
        "address": "889 S Wisteria St, Rialto, CA",
        "phone": "1 (951) 204-9470",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 4,
        "name": "Yvonne Delgado",
        "address": "9668 Vine St, Bloomington, CA",
        "phone": "1 (909) 900-8461",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 5,
        "name": "Julio Gomez",
        "address": "9764 Larch Ave, Bloomington, CA",
        "phone": "1 (909) 265-5738",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 6,
        "name": "Arnoldo Gallo",
        "address": "1068 W Granada St, Bloomington, CA 92316",
        "phone": "1 (909) 749-0141",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "CORONA",
    "count": 3,
    "leads": [
      {
        "stop": 1,
        "name": "TRACIE DUNCAN",
        "address": "1557 Deer Run, Corona, CA",
        "phone": "1(951) 818-6945",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 2,
        "name": "WINSTON SHI",
        "address": "7404 Morning Hills Dr, Eastvale, CA",
        "phone": "1 (626) 242-0232",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 3,
        "name": "KASANDRA GUTIERREZ",
        "address": "10380 Stageline St , CORONA, CA 92883",
        "phone": "1 (714) 743-4558",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "Chino",
    "count": 14,
    "leads": [
      {
        "stop": 1,
        "name": "Jose Munoz",
        "address": "13352 5Th St, Chino, CA",
        "phone": "1 (323) 992-1021",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 2,
        "name": "Eva Menchaca",
        "address": "12357 Lemon Pl, Chino, CA",
        "phone": "1 (909) 963-8822",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 3,
        "name": "frode sveen",
        "address": "12697 Orgren Ave, Chino, CA",
        "phone": "1 (909) 210-8363",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 4,
        "name": "Jose Castillo",
        "address": "12739 Ramona Ave, Chino, CA",
        "phone": "1 (714) 290-2330",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 5,
        "name": "Brian Yarbrough",
        "address": "5426 Union Ct, Chino, CA",
        "phone": "1 (209) 969-4432",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 6,
        "name": "Ann Hsu",
        "address": "6770 Vanderbilt St, Chino, CA",
        "phone": "1 (909) 618-5131",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 7,
        "name": "Teresa Cate",
        "address": "6771 Homan St, Chino, CA",
        "phone": "1 (909) 292-8802",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 8,
        "name": "Robert Bryan",
        "address": "12872 Harmony Ave, Chino, CA",
        "phone": "1 (562) 413-3152",
        "category": "Recent HVAC permit"
      },
      {
        "stop": 9,
        "name": "Christine Young",
        "address": "6003 C St, Chino, CA",
        "phone": "1 (909) 240-4440",
        "category": "Recent HVAC permit"
      },
      {
        "stop": 10,
        "name": "Corrine Jones",
        "address": "6056 Ida Ct, Chino, CA",
        "phone": "1 (909) 217-1215",
        "category": "Recent HVAC permit"
      },
      {
        "stop": 11,
        "name": "Susana Okada",
        "address": "4385 Roosevelt St, Chino, CA",
        "phone": "1 (909) 678-7720",
        "category": "Recent HVAC permit"
      },
      {
        "stop": 12,
        "name": "Jackelyn  Lukito",
        "address": "12583 Arlington Pl, Chino, CA 91710",
        "phone": "1 (909) 319-9103",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 13,
        "name": "Miguel Yanez",
        "address": "12761 Jalepeno Pl, Chino, CA 91710",
        "phone": "1 (213) 258-5296",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 14,
        "name": "Hiro Takano",
        "address": "14050 San Antonio avenue, Chino, CA 91710",
        "phone": "1 (801) 615-0649",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "Chino Hills",
    "count": 9,
    "leads": [
      {
        "stop": 1,
        "name": "Jonathan Tiongco",
        "address": "15920 Silver Springs Dr, Chino Hills, CA",
        "phone": "1 (310) 367-6183",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 2,
        "name": "Maria Agudello",
        "address": "16395 Argent Rd, Chino Hills, CA",
        "phone": "1 (909) 614-5891",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 3,
        "name": "jose meza",
        "address": "1942 Big Oak Ave, Chino Hills, CA",
        "phone": "1 (909) 730-6982",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 4,
        "name": "eugene parker",
        "address": "1970 Nordic Ave, Chino Hills, CA",
        "phone": "1 (951) 315-8248",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 5,
        "name": "Derek Nguyen",
        "address": "3430 Royal Ridge Rd, Chino Hills, CA",
        "phone": "1 (626) 636-0565",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 6,
        "name": "Ziguang Lin",
        "address": "5267 Monet Ct, Chino Hills, CA",
        "phone": "1 (626) 825-4587",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 7,
        "name": "Sufwan Khan",
        "address": "5569 Veronese Dr, Chino Hills, CA",
        "phone": "1 (909) 731-2025",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 8,
        "name": "Chris Custodio",
        "address": "5857 Ridgegate Dr, Chino Hills, CA",
        "phone": "1 (626) 715-7719",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 9,
        "name": "Wesley Zhao",
        "address": "6306 Gladiola Cir, Chino Hills, CA",
        "phone": "1 (626) 262-1138",
        "category": "No HVAC permit on record"
      }
    ]
  },
  {
    "city": "Claremont",
    "count": 2,
    "leads": [
      {
        "stop": 1,
        "name": "Scott Barnes",
        "address": "2432 San Mateo Ct, Claremont, CA 91711",
        "phone": "1 (909) 519-5360",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 2,
        "name": "Bruce Simms",
        "address": "883 Ottawa Dr, Claremont, CA 91711",
        "phone": "1 (323) 496-7323",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "Corona",
    "count": 53,
    "leads": [
      {
        "stop": 1,
        "name": "Jose Lopez",
        "address": "1890 Duncan Way, Corona, CA",
        "phone": "1 (951) 707-7645",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 2,
        "name": "Tina Ovbude",
        "address": "2711 Greenfield Dr, Corona, CA",
        "phone": "1 (951) 454-5297",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 3,
        "name": "Austin Biaggi",
        "address": "970 Big Spring Ct, Corona, CA",
        "phone": "1 (707) 816-2075",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 4,
        "name": "Alan Kornbluth",
        "address": "854 Crestmont Cir, Corona, CA",
        "phone": "1 (949) 291-2369",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 5,
        "name": "Peter Khun",
        "address": "3451 White Sage St, Corona, CA",
        "phone": "1 (714) 206-8200",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 6,
        "name": "Sonia Silva",
        "address": "695 Sky Ridge Dr, Corona, CA",
        "phone": "1 (951) 818-7516",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 7,
        "name": "David Brown",
        "address": "1701 Via Sevilla St, Corona, CA",
        "phone": "1 (714) 616-6300",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 8,
        "name": "Mohammed Ali",
        "address": "2170 Kiwi Cir, Corona, CA",
        "phone": "1 (313) 213-2194",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 9,
        "name": "EARL DILLON",
        "address": "121 Kilworth Dr, Corona, CA",
        "phone": "1 (714) 482-7309",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 10,
        "name": "Gary Mather",
        "address": "1789 Kapalua Bay Ln, Corona, CA",
        "phone": "1 (763) 843-0783",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 11,
        "name": "Terri Boillin",
        "address": "857 Payette Dr, Corona, CA",
        "phone": "1 (951) 833-4307",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 12,
        "name": "Chi Won Choi",
        "address": "1935 Eureka St, Corona, CA",
        "phone": "1 (714) 251-6759",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 13,
        "name": "Charlie Navarro",
        "address": "2770 Amber Cir, Corona, CA",
        "phone": "1 (714) 287-6214",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 14,
        "name": "David Ganahl",
        "address": "1926 Nutwood Cir, Corona, CA",
        "phone": "1 (951) 533-2209",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 15,
        "name": "Juan Serrato",
        "address": "1411 Hearthside Dr, Corona, CA",
        "phone": "1 (714) 860-9493",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 16,
        "name": "James Ayres",
        "address": "1750 Yellow Pine Rdg, Corona, CA",
        "phone": "1 (951) 961-9600",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 17,
        "name": "Christopher Veil",
        "address": "863 Cottonwood St, Corona, CA",
        "phone": "1 (424) 215-1309",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 18,
        "name": "John Bangean",
        "address": "1022 Chamise Cir, Corona, CA",
        "phone": "1 (951) 271-2512",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 19,
        "name": "ISAAC VERDUZCO",
        "address": "1130 Springbrook St, Corona, CA",
        "phone": "1 (714) 605-0012",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 20,
        "name": "Lisa Frink",
        "address": "1145 Archer Cir, Corona, CA",
        "phone": "1 (330) 310-4327",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 21,
        "name": "Nathan Theune",
        "address": "1260 Lakeport Ln, Corona, CA",
        "phone": "1 (951) 316-3519",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 22,
        "name": "Jones Huynh",
        "address": "1341 Oakburl Cir, Corona, CA",
        "phone": "1 (951) 427-0877",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 23,
        "name": "Khoa Tran",
        "address": "1375 Peridot Dr, Corona, CA",
        "phone": "1 (949) 482-8482",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 24,
        "name": "MICHAEL BALISACAN",
        "address": "14191 Spruce Grove Ct, Eastvale, CA",
        "phone": "1(562) 348-8590",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 25,
        "name": "Sarahlee Bilavarn",
        "address": "1436 Iris Grove Cir, Corona, CA",
        "phone": "1 (909) 630-2192",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 26,
        "name": "Derrick Thweatt",
        "address": "14645 Rick Ln, Eastvale, CA",
        "phone": "1 (626) 393-7969",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 27,
        "name": "Polanco Augustine",
        "address": "1573 Jadestone Ln, Corona, CA",
        "phone": "1 (323) 302-3485",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 28,
        "name": "Jose McDonald",
        "address": "1624 Tamarron Dr, Corona, CA",
        "phone": "1 (951) 264-4074",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 29,
        "name": "Ruben Delgado",
        "address": "1647 Camino De Salmon St, Corona, CA",
        "phone": "1 (714) 900-0580",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 30,
        "name": "Jose Charles",
        "address": "1721 Chisholm Trail Cir, Corona, CA",
        "phone": "1 (949) 300-4496",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 31,
        "name": "Ibtihal Kadour",
        "address": "1798 Kapalua Bay Ln, Corona, CA",
        "phone": "1 (714) 209-5111",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 32,
        "name": "Alejandro Lopez",
        "address": "23311 Claystone Ave, Corona, CA",
        "phone": "1 (562) 708-3409",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 33,
        "name": "Javier Montoya",
        "address": "2394 Centennial Way, Corona, CA",
        "phone": "1 (562) 458-8108",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 34,
        "name": "james evans",
        "address": "2567 Via Pacifica, Corona, CA",
        "phone": "1 (951) 660-1784",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 35,
        "name": "Habeeb Sulaiman",
        "address": "2618 Harvest Crest Ln, Corona, CA",
        "phone": "1 (714) 425-7527",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 36,
        "name": "Shirish Patel",
        "address": "2659 Raven Cir, Corona, CA",
        "phone": "1 (909) 510-1258",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 37,
        "name": "Georgina Bakerjian",
        "address": "3318 Rochelle Ln, Corona, CA",
        "phone": "1 (949) 290-1750",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 38,
        "name": "Mariadelcarmen Torres",
        "address": "337 N Garfield Ave, Corona, CA",
        "phone": "1 (951) 963-1719",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 39,
        "name": "Rachael Lance",
        "address": "3570 Ambrose Cir, Corona, CA",
        "phone": "1 (909) 565-0029",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 40,
        "name": "Vaughn Ackman",
        "address": "3750 San Ramon Dr, Corona, CA",
        "phone": "1 (909) 670-4607",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 41,
        "name": "Elizabeth Knapp",
        "address": "7254 Tiburon Dr, Eastvale, CA",
        "phone": "1 (714) 865-5082",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 42,
        "name": "Jasbir Virk",
        "address": "760 Payette Dr, Corona, CA",
        "phone": "1 (951) 322-6387",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 43,
        "name": "Jesus Nuno",
        "address": "831 Cottonwood St, Corona, CA",
        "phone": "1 (714) 371-3623",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 44,
        "name": "Allie Kao",
        "address": "877 N Temescal St, Corona, CA",
        "phone": "1 (714) 385-7318",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 45,
        "name": "Oscar Ramirez",
        "address": "906 Brookwood Dr, Corona, CA",
        "phone": "1 (714) 231-5780",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 46,
        "name": "DENISE BARNES",
        "address": "924 Cadiz St, Corona, CA",
        "phone": "1 (714) 270-9488",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 47,
        "name": "Fabiola Sargeant",
        "address": "1260 Emeraldport St, Corona, CA",
        "phone": "1 (714) 351-2962",
        "category": "Recent HVAC permit"
      },
      {
        "stop": 48,
        "name": "Quinn Forman",
        "address": "2471 Dakin Dr, Corona, CA",
        "phone": "1 (760) 625-3988",
        "category": "Recent HVAC permit"
      },
      {
        "stop": 49,
        "name": "Ice Nguyen",
        "address": "13118 Waterwheel Dr, Corona, CA",
        "phone": "1 (949) 350-5991",
        "category": "Recent HVAC permit"
      },
      {
        "stop": 50,
        "name": "Michael Hernandez",
        "address": "1498 Chalgrove Dr, Corona, CA",
        "phone": "1 (951) 382-2797",
        "category": "Recent HVAC permit"
      },
      {
        "stop": 51,
        "name": "Erik Fuentes",
        "address": "13229 Kara Ct, Corona, CA 92880",
        "phone": "1 (909) 615-6180",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 52,
        "name": "Fausto Chagollan Jr.",
        "address": "14295 Brant Ct, Corona, CA 92880",
        "phone": "1 (714) 697-1077",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 53,
        "name": "Mark Balisacan",
        "address": "1991 Cypress Point Dr, Corona, CA 92882",
        "phone": "1 (714) 488-2857",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "Eastvale",
    "count": 5,
    "leads": [
      {
        "stop": 1,
        "name": "Ernesto Zamora",
        "address": "6293 Arcadia St, Eastvale, CA",
        "phone": "1 (714) 313-4779",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 2,
        "name": "Joanna Park",
        "address": "7155 Montecito Ln, Eastvale, CA",
        "phone": "1 (714) 507-5879",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 3,
        "name": "Hernan Moreno",
        "address": "12307 Columbia Ln, Eastvale, CA 91752",
        "phone": "1 (714) 553-9203",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 4,
        "name": "Yu Huang",
        "address": "13682 Sandhill Crane Road, Eastvale, CA 92880",
        "phone": "1 (951) 496-9718",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 5,
        "name": "Fang Sheng",
        "address": "7053 Montecito Ln, Eastvale, CA 92880",
        "phone": "1 (415) 885-9158",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "FONTANA",
    "count": 1,
    "leads": [
      {
        "stop": 1,
        "name": "GILBERT MALIJEN",
        "address": "9339 Emerald Ave, Fontana, CA",
        "phone": "1 (323) 833-0454",
        "category": "No HVAC permit on record"
      }
    ]
  },
  {
    "city": "Fontana",
    "count": 53,
    "leads": [
      {
        "stop": 1,
        "name": "Esteban Castro",
        "address": "8201 Oleander Ave, Fontana, CA",
        "phone": "1 (626) 450-5163",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 2,
        "name": "John Days",
        "address": "15569 Willow Dr, Fontana, CA",
        "phone": "1 (909) 202-7574",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 3,
        "name": "Randall Morris",
        "address": "7123 Indiana Ct, Fontana, CA",
        "phone": "1 (909) 268-1964",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 4,
        "name": "Michelle Ford",
        "address": "7510 Lily Ct, Fontana, CA",
        "phone": "1 (626) 230-7398",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 5,
        "name": "Koang Tong",
        "address": "10950 Mayberry St, Fontana, CA",
        "phone": "1 (909) 827-5833",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 6,
        "name": "Anna Nicolay",
        "address": "11480 Sheffield Rd, Fontana, CA",
        "phone": "1 (909) 561-1069",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 7,
        "name": "Ramon Arzate",
        "address": "11661 Robin Dr, Fontana, CA",
        "phone": "1 (909) 815-2671",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 8,
        "name": "Shawn Wright",
        "address": "11825 Cardinal Ct, Fontana, CA",
        "phone": "1 (562) 209-0080",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 9,
        "name": "maria verdin",
        "address": "12009 Spartan Ln, Fontana, CA",
        "phone": "1 (909) 999-4245",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 10,
        "name": "Yolanda Navas",
        "address": "13986 Green Vista Dr, Fontana, CA",
        "phone": "1 (840) 217-6210",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 11,
        "name": "Martin Gomez",
        "address": "13989 El Camino Pl, Fontana, CA",
        "phone": "1 (909) 278-1260",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 12,
        "name": "Art Correa",
        "address": "14631 Texas Ct, Fontana, CA",
        "phone": "1 (626) 780-5074",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 13,
        "name": "Terry Smith",
        "address": "14665 Decoy Ln, Fontana, CA",
        "phone": "1 (626) 274-9263",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 14,
        "name": "Gina Zamorano",
        "address": "14881 Rosetown Ave, Fontana, CA",
        "phone": "1 (909) 234-8862",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 15,
        "name": "Joseph Lee",
        "address": "15160 Hawk St, Fontana, CA",
        "phone": "1 (909) 953-0939",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 16,
        "name": "Felix Sanchez",
        "address": "15356 Tobarra Rd, Fontana, CA",
        "phone": "1 (909) 573-3251",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 17,
        "name": "Marc Dobias",
        "address": "15360 Crimson St, Fontana, CA",
        "phone": "1 (909) 689-5144",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 18,
        "name": "Jorge Alvarado",
        "address": "15419 Coleen St, Fontana, CA",
        "phone": "1 (760) 840-3207",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 19,
        "name": "Menkir Girma",
        "address": "15435 Caroline St, Fontana, CA",
        "phone": "1 (720) 496-7577",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 20,
        "name": "Erik Vaughn",
        "address": "15480 Petunia St, Fontana, CA",
        "phone": "1 (310) 490-8774",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 21,
        "name": "Daniel Blanco",
        "address": "15483 Petunia St, Fontana, CA",
        "phone": "1 (310) 954-6078",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 22,
        "name": "Esteban Santana",
        "address": "15559 Cleveland Dr, Fontana, CA",
        "phone": "1 (909) 957-8907",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 23,
        "name": "Eric Jones",
        "address": "15800 Willow Dr, Fontana, CA",
        "phone": "1 (909) 229-3245",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 24,
        "name": "Jose Moreno",
        "address": "15907 Windcrest Dr, Fontana, CA",
        "phone": "1 (909) 368-4651",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 25,
        "name": "Robert McClain",
        "address": "16172 Plum St, Fontana, CA",
        "phone": "1 (626) 310-2155",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 26,
        "name": "Roberto Jimenez",
        "address": "16234 Soapberry Ln, Fontana, CA",
        "phone": "1 (323) 313-9194",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 27,
        "name": "eduardo lomelin",
        "address": "16275 Walnut St, Fontana, CA",
        "phone": "1 (909) 682-1387",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 28,
        "name": "Robert Kolvas",
        "address": "16346 San Jacinto Ave, Fontana, CA",
        "phone": "1 (909) 697-6144",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 29,
        "name": "Liberty Perez",
        "address": "16608 Pennard Ln, Fontana, CA",
        "phone": "1 (909) 929-5466",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 30,
        "name": "Joseph Herrera",
        "address": "17062 Cerritos St, Fontana, CA",
        "phone": "1 (562) 416-5433",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 31,
        "name": "David Acosta",
        "address": "17197 Athol St, Fontana, CA",
        "phone": "1 (909) 648-8847",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 32,
        "name": "Juan Manuel Garcia",
        "address": "17361 Orange Way, Fontana, CA",
        "phone": "1 (310) 936-3321",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 33,
        "name": "jorge flores",
        "address": "17380 Randall Ave, Fontana, CA",
        "phone": "1 (626) 347-2067",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 34,
        "name": "Isaac Banos",
        "address": "17626 Ivy Ave, Fontana, CA",
        "phone": "1 (626) 926-5131",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 35,
        "name": "Sophia Hodanu",
        "address": "5087 Oak Moss Ave, Fontana, CA",
        "phone": "1 (909) 261-2776",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 36,
        "name": "Aaron Clark",
        "address": "5152 Wisteria Ln, Fontana, CA",
        "phone": "1 (909) 775-4494",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 37,
        "name": "salem aboud",
        "address": "5902 Flying Arrow Ln, Fontana, CA",
        "phone": "1 (909) 358-0993",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 38,
        "name": "Gerald Allen",
        "address": "6720 Gabels Crest Way, Fontana, CA",
        "phone": "1 (909) 509-2211",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 39,
        "name": "roxane leavitt",
        "address": "6765 Lucero Dr, Fontana, CA",
        "phone": "1 (909) 518-5038",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 40,
        "name": "Julius Sistoza",
        "address": "6841 Earhart Ave, Fontana, CA",
        "phone": "1 (909) 561-2200",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 41,
        "name": "Jesus Perez",
        "address": "7040 Sagebrush Way, Fontana, CA",
        "phone": "1 (909) 653-0752",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 42,
        "name": "Doris Lainez",
        "address": "7182 Andrea St, Fontana, CA",
        "phone": "1 (562) 206-3727",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 43,
        "name": "Alem Abraham",
        "address": "7230 Avocado Ct, Fontana, CA",
        "phone": "1 (310) 210-9698",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 44,
        "name": "Norman Maletsky",
        "address": "7270 Myrtle Pl, Fontana, CA",
        "phone": "1 (909) 333-9722",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 45,
        "name": "Natasha Newman",
        "address": "7459 Blanchard Ave, Fontana, CA",
        "phone": "1 (626) 283-7697",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 46,
        "name": "Maricela Ramirez",
        "address": "8430 Calabash Ave, Fontana, CA",
        "phone": "1 (909) 938-9284",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 47,
        "name": "Jose Estrella",
        "address": "9876 Venus Ln, Fontana, CA",
        "phone": "1 (323) 580-7123",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 48,
        "name": "Maritza Rodriguez",
        "address": "11761 Fernwood Ave, Fontana, CA",
        "phone": "1 (909) 969-7759",
        "category": "Recent HVAC permit"
      },
      {
        "stop": 49,
        "name": "Erick Morales",
        "address": "8745 Encina Dr, Fontana, CA",
        "phone": "1 (909) 871-5405",
        "category": "Recent HVAC permit"
      },
      {
        "stop": 50,
        "name": "Cesar Gonzalez",
        "address": "13873 Cobblestone Ct, Fontana, CA 92335",
        "phone": "1 (909) 559-0772",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 51,
        "name": "Ana Magdaleno",
        "address": "14934 Oak Valley Dr, Fontana, CA 92336",
        "phone": "1 (909) 368-5445",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 52,
        "name": "Daniel Iraheta",
        "address": "8274 Concord Ave, Fontana, CA 92335",
        "phone": "1 (909) 374-0264",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 53,
        "name": "Claridel Alas",
        "address": "9661 Cherimoya Dr, Fontana, CA 92335",
        "phone": "1 (909) 276-6198",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "Grand Terrace",
    "count": 1,
    "leads": [
      {
        "stop": 1,
        "name": "Gary Krogstad",
        "address": "12114 Country Club Ln, Grand Terrace, CA 92313",
        "phone": "1 (909) 213-5307",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "Highland",
    "count": 3,
    "leads": [
      {
        "stop": 1,
        "name": "David Cruz",
        "address": "1694 Seine Avenue, Highland, CA 92346",
        "phone": "1 (909) 705-7491",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 2,
        "name": "Brittany Salcedo",
        "address": "2434 Bonita Drive, Highland, CA 92346",
        "phone": "1 (626) 893-8287",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 3,
        "name": "Ezequiel Martinez",
        "address": "28262 cornus ct, highland, CA 92346",
        "phone": "1 (909) 496-5206",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "JURUPA VALLEY",
    "count": 1,
    "leads": [
      {
        "stop": 1,
        "name": "Nicole Anda",
        "address": "6355 Indian Camp Rd, Jurupa Valley, CA",
        "phone": "1 (909) 223-6778",
        "category": "No HVAC permit on record"
      }
    ]
  },
  {
    "city": "Jurupa Valley",
    "count": 4,
    "leads": [
      {
        "stop": 1,
        "name": "Chelo Bermeo",
        "address": "11949 Nuthatch Ct, Jurupa Valley, CA",
        "phone": "1 (909) 210-2221",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 2,
        "name": "Pamela Oneal",
        "address": "2171 Sandra Dr, Jurupa Valley, CA",
        "phone": "1 (951) 360-0788",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 3,
        "name": "Maruf Kabir",
        "address": "6320 Emerald Ridge Way, Jurupa Valley, CA",
        "phone": "1 (213) 804-0677",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 4,
        "name": "Jorge Torres",
        "address": "8150 David Way, Jurupa Valley, CA",
        "phone": "1 (949) 648-2867",
        "category": "Recent HVAC permit"
      }
    ]
  },
  {
    "city": "LAKE ELSINORE",
    "count": 2,
    "leads": [
      {
        "stop": 1,
        "name": "MARY REID",
        "address": "4172 Isabella Circle , LAKE ELSINORE, CA 92530",
        "phone": "1 (760) 672-7011",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 2,
        "name": "MARY REID",
        "address": "4172 Isabella Circle, LAKE ELSINORE, CA 92530",
        "phone": "1 (760) 458-6136",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "Lake Elsinore",
    "count": 26,
    "leads": [
      {
        "stop": 1,
        "name": "Sergio Yanez",
        "address": "16495 Lincoln St, Lake Elsinore, CA",
        "phone": "1 (949) 558-4222",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 2,
        "name": "Jesus Bernabe",
        "address": "18450 Purnell Rd, Lake Elsinore, CA",
        "phone": "1 (951) 567-0501",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 3,
        "name": "Cesar Reyes",
        "address": "29289 Sandpiper Dr, Lake Elsinore, CA",
        "phone": "1 (562) 619-5244",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 4,
        "name": "Juan Garcia",
        "address": "33071 Esther St, Lake Elsinore, CA",
        "phone": "1 (951) 500-9471",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 5,
        "name": "Marco Garcia",
        "address": "1023 Meadowlake Lane, Lake Elsinore, CA 92530",
        "phone": "1 (951) 591-5538",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 6,
        "name": "Pedro Elizalde",
        "address": "1107 Taylor Ct, Lake Elsinore, CA 92530",
        "phone": "1 (951) 221-2794",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 7,
        "name": "Steven Carello",
        "address": "16503 Arnold Ave, Lake Elsinore, CA 92530",
        "phone": "1 (808) 772-3468",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 8,
        "name": "Ursula Woelcken",
        "address": "17600 Hayes Ave, Lake Elsinore, CA 92530",
        "phone": "1 (951) 796-0669",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 9,
        "name": "Mathew Campbell",
        "address": "181 South Torn Ranch Road, Lake Elsinore, CA 92530",
        "phone": "1 (951) 545-0335",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 10,
        "name": "Diane Flores",
        "address": "19385 Live Oak Lane, Lake Elsinore, CA 92530",
        "phone": "1 (909) 231-4398",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 11,
        "name": "Keskim Shillingford",
        "address": "23 Via Del Macci Court, Lake Elsinore, CA 92532",
        "phone": "1 (713) 806-9658",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 12,
        "name": "Jose Huerta",
        "address": "29192 Outrigger St, Lake Elsinore, CA 92530",
        "phone": "1 (714) 357-3458",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 13,
        "name": "Christopher Johnson",
        "address": "29313 Quiet Harbor St, Lake Elsinore, CA 92530",
        "phone": "1 (909) 267-8255",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 14,
        "name": "Tasha Hurd",
        "address": "29496 Stadium, Lake Elsinore, CA 92530",
        "phone": "1 (562) 552-8652",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 15,
        "name": "jesus martinez",
        "address": "29580 Hague St, lake elsinore, CA 92530",
        "phone": "1 (951) 522-4442",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 16,
        "name": "Zulema Saenz",
        "address": "30014 Cottage Lane, Lake Elsinore, CA 92530",
        "phone": "1 (562) 753-7529",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 17,
        "name": "Marisol Alvarez",
        "address": "30015 Victoria Way, Lake Elsinore, CA 92530",
        "phone": "1 (949) 649-9079",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 18,
        "name": "Alfonso Lima",
        "address": "30021 Cottage Ln, Lake Elsinore, CA 92530",
        "phone": "1 (323) 387-9017",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 19,
        "name": "Marcela Ascue-Gonzalez",
        "address": "31700 Ridgeview Dr, Lake Elsinore, CA 92532",
        "phone": "1 (714) 586-4271",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 20,
        "name": "Pablo Brito",
        "address": "33115 Victoria Brooke Ln, Lake Elsinore, CA 92530",
        "phone": "1 (949) 285-4078",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 21,
        "name": "Teresa Zamora",
        "address": "34112 Woodruff Dr, Lake Elsinore, CA 92532",
        "phone": "1 (714) 394-9321",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 22,
        "name": "Salvador Padilla",
        "address": "3581 Lake Crest Drive, Lake Elsinore, CA 92530",
        "phone": "1 (951) 609-4313",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 23,
        "name": "Monica Paez",
        "address": "36414 Nettle Ct, Lake Elsinore, CA 92532",
        "phone": "1 (714) 586-2627",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 24,
        "name": "Ifeoma Baadi",
        "address": "36430 Geranium Drive, Lake Elsinore, CA 92532",
        "phone": "1 (323) 245-7848",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 25,
        "name": "Joseph Griffith",
        "address": "52983 Alba St, Lake Elsinore, CA 92532",
        "phone": "1 (951) 440-3845",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 26,
        "name": "Jonathan Grier",
        "address": "53217 Savannah Ct, Lake Elsinore, CA 92532",
        "phone": "1 (562) 225-5296",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "Loma Linda",
    "count": 1,
    "leads": [
      {
        "stop": 1,
        "name": "Magdalena Maldonado",
        "address": "25576 State St, Loma Linda, CA 92354",
        "phone": "1 (909) 213-7220",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "MENIFEE",
    "count": 2,
    "leads": [
      {
        "stop": 1,
        "name": "LINDA RITCHIE",
        "address": "25175 Malone Ave , MENIFEE, CA 92585",
        "phone": "1 (951) 315-6429",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 2,
        "name": "AARON HERNANDEZ",
        "address": "26135 Scott Rd Menifee, CA 92584 , MENIFEE, CA 92584",
        "phone": "1 (951) 690-1990",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "Menifee",
    "count": 21,
    "leads": [
      {
        "stop": 1,
        "name": "Dorrena Hobbs",
        "address": "29535 Grechen Ln, Menifee, CA",
        "phone": "1 (951) 238-8517",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 2,
        "name": "Ronald Eusebio",
        "address": "24240 Deputy Way, Menifee, CA 92584",
        "phone": "1 (951) 639-4041",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 3,
        "name": "Carlos Pena",
        "address": "25491 Mountain Springs Street, Menifee, CA 92584",
        "phone": "1 (619) 761-2932",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 4,
        "name": "Megan White",
        "address": "25673 Lola Ct, Menifee, CA 92586",
        "phone": "1 (931) 337-2258",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 5,
        "name": "Michael Kampen",
        "address": "27492 Rio Vista Dr, Menifee, CA 92586",
        "phone": "1 (951) 202-0192",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 6,
        "name": "Judy Akhamlich",
        "address": "27810 Foxfire St, Menifee, CA 92586",
        "phone": "1 (909) 224-6497",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 7,
        "name": "Carola Guardado",
        "address": "27898 Monroe Ave, Menifee, CA 92585",
        "phone": "1 (951) 627-2539",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 8,
        "name": "Olivia Ramos",
        "address": "27928 Lemonwood Drive, Menifee, CA 92584",
        "phone": "1 (714) 292-8416",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 9,
        "name": "Esther Quiroz",
        "address": "28036 Cannon Drive, Menifee, CA 92585",
        "phone": "1 (714) 595-6181",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 10,
        "name": "luci ramos",
        "address": "28290 Los Cielos Rd, menifee, CA 92586",
        "phone": "1 (951) 400-8209",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 11,
        "name": "Russell Breeding",
        "address": "28313 Sunrise Skies Way, Menifee, CA 92585",
        "phone": "1 (951) 756-1243",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 12,
        "name": "David Daniels",
        "address": "28365 Raintree Dr, Menifee, CA 92584",
        "phone": "1 (760) 525-0000",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 13,
        "name": "Aleks Rylov",
        "address": "28686 Sunridge Ct, Menifee, CA 92584",
        "phone": "1 (951) 205-4479",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 14,
        "name": "Lucas Burns",
        "address": "29121 Ave De Las Flores, Menifee, CA 92587",
        "phone": "1 (951) 458-3659",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 15,
        "name": "Sharon Carrington",
        "address": "29327 Summerset Dr, Menifee, CA 92586",
        "phone": "1 (562) 650-6613",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 16,
        "name": "Daisy Lutap",
        "address": "29366 Warm Creek Way, Menifee, CA 92584",
        "phone": "1 (951) 519-2998",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 17,
        "name": "Robert Vincent",
        "address": "29564 Caveat Ln, Menifee, CA 92584",
        "phone": "1 (951) 434-8691",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 18,
        "name": "Venance Perez",
        "address": "29889 Gifhorn Rd, Menifee, CA 92584",
        "phone": "1 (619) 874-6142",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 19,
        "name": "Kevin Schuder",
        "address": "30551 Covecrest Cir, Menifee, CA 92584",
        "phone": "1 (909) 208-1967",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 20,
        "name": "Federico Martinez",
        "address": "30706 Shoreridge Dr, Menifee, CA 92584",
        "phone": "1 (951) 837-5038",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 21,
        "name": "Paulette Asselin",
        "address": "31075 Durham Dr, Menifee, CA 92584",
        "phone": "1 (951) 370-0004",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "Montclair",
    "count": 5,
    "leads": [
      {
        "stop": 1,
        "name": "Valerie Martin",
        "address": "10159 Felipe Ave, Montclair, CA",
        "phone": "1 (562) 551-1362",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 2,
        "name": "Rebecca Jimenez",
        "address": "5510 Yale St, Montclair, CA",
        "phone": "1 (626) 485-2860",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 3,
        "name": "Saul canas Rodriguez",
        "address": "5409 San Bernardino St, Montclair, CA",
        "phone": "1 (909) 545-4813",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 4,
        "name": "Maria Garcia",
        "address": "5468 Princeton St, Montclair, CA",
        "phone": "1 (626) 206-2178",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 5,
        "name": "Claudia Guerrero",
        "address": "9751 Mills Ave, Montclair, CA",
        "phone": "1 (909) 734-8258",
        "category": "No HVAC permit on record"
      }
    ]
  },
  {
    "city": "Moreno Valley",
    "count": 46,
    "leads": [
      {
        "stop": 1,
        "name": "Gabriel Ramirez",
        "address": "23137 Mansfield Ln, Moreno Valley, CA",
        "phone": "1 (951) 258-3471",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 2,
        "name": "Ogba Gebre",
        "address": "12345 Lantz Ln, Moreno Valley, CA",
        "phone": "1 (951) 229-3340",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 3,
        "name": "Tommy Arnold",
        "address": "10088 Thunderhead, Moreno Valley, CA",
        "phone": "1 (951) 208-3680",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 4,
        "name": "Autumn Valencia",
        "address": "10938 Breezy Meadow Dr, Moreno Valley, CA",
        "phone": "1 (951) 795-0278",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 5,
        "name": "Mauricio Mendez",
        "address": "11098 Debra Way, Moreno Valley, CA",
        "phone": "1 (909) 634-6487",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 6,
        "name": "Roman Maciel",
        "address": "11887 Fouch Ln, Moreno Valley, CA",
        "phone": "1 (951) 575-9481",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 7,
        "name": "Charles Coates",
        "address": "12387 Marmont Pl, Moreno Valley, CA",
        "phone": "1 (909) 238-4488",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 8,
        "name": "Abel Topete",
        "address": "12809 Lambeth St, Moreno Valley, CA",
        "phone": "1 (951) 616-8964",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 9,
        "name": "Aaron Dominguez",
        "address": "12880 Sample Ct, Moreno Valley, CA",
        "phone": "1 (951) 807-0828",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 10,
        "name": "Rosario Sanchez",
        "address": "12919 Sunnymeadows Dr, Moreno Valley, CA",
        "phone": "1 (951) 655-0008",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 11,
        "name": "Roxana Palacios",
        "address": "13380 Larkhaven Dr, Moreno Valley, CA",
        "phone": "1 (909) 368-9335",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 12,
        "name": "Jorge Rivera",
        "address": "13752 Red Mahogany Dr, Moreno Valley, CA",
        "phone": "1 (951) 906-3175",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 13,
        "name": "Gildardo Flores",
        "address": "14128 Austene Cir, Moreno Valley, CA",
        "phone": "1 (951) 490-9919",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 14,
        "name": "Margarito Benitez",
        "address": "14348 Farmwood Dr, Moreno Valley, CA",
        "phone": "1 (951) 221-2616",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 15,
        "name": "Ivan Huerta Gomez",
        "address": "14523 Medinah Way, Moreno Valley, CA",
        "phone": "1 (424) 240-3094",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 16,
        "name": "Alfredo Gonzalez",
        "address": "14611 Antilles Dr, Moreno Valley, CA",
        "phone": "1 (323) 906-4334",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 17,
        "name": "Arturo Chavez",
        "address": "14624 Antilles Dr, Moreno Valley, CA",
        "phone": "1 (951) 567-1213",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 18,
        "name": "Jose Lerma",
        "address": "14942 Silvertree Rd, Moreno Valley, CA",
        "phone": "1 (951) 312-9980",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 19,
        "name": "Alfredo Rubalcaba",
        "address": "15020 Ryder Way, Moreno Valley, CA",
        "phone": "1 (714) 486-8548",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 20,
        "name": "Jose Arevalo",
        "address": "15333 Via Rio, Moreno Valley, CA",
        "phone": "1 (951) 655-0154",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 21,
        "name": "Michael Horne",
        "address": "15605 Guajome Rd, Moreno Valley, CA",
        "phone": "1 (909) 586-0840",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 22,
        "name": "Jeremy Parker",
        "address": "15720 Biarritz Ct, Moreno Valley, CA",
        "phone": "1 (909) 717-1619",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 23,
        "name": "Ledezma Margarita",
        "address": "16120 Palomino Ln, Moreno Valley, CA",
        "phone": "1 (714) 247-9328",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 24,
        "name": "Jimmy Rodriguez",
        "address": "16445 Heather Glen Rd, Moreno Valley, CA",
        "phone": "1 (310) 259-6153",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 25,
        "name": "Estela Wainwright",
        "address": "23466 Shady Glen Ct, Moreno Valley, CA",
        "phone": "1 (909) 684-6680",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 26,
        "name": "David Martinez",
        "address": "24213 Linnea Ct, Moreno Valley, CA",
        "phone": "1 (951) 567-1989",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 27,
        "name": "Horacio Garcia",
        "address": "24299 Electra Ct, Moreno Valley, CA",
        "phone": "1 (909) 549-6272",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 28,
        "name": "Aurora Maravilla",
        "address": "24396 Carolee Ave, Moreno Valley, CA",
        "phone": "1 (951) 388-9308",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 29,
        "name": "Jose Torres",
        "address": "25281 Morning Dove Way, Moreno Valley, CA",
        "phone": "1 (951) 946-9263",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 30,
        "name": "Roberto Rodriguez",
        "address": "25862 Flint Dr, Moreno Valley, CA",
        "phone": "1 (562) 824-6581",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 31,
        "name": "Sherrell Draves",
        "address": "25891 Coriander Ct, Moreno Valley, CA",
        "phone": "1 (626) 712-8452",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 32,
        "name": "Sandra Gonzalez-Castro",
        "address": "25932 Avenida Espaldar, Moreno Valley, CA",
        "phone": "1 (909) 446-6663",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 33,
        "name": "Erick Cruz",
        "address": "25948 Delphinium Ave, Moreno Valley, CA",
        "phone": "1 (951) 210-9893",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 34,
        "name": "Andres Lopez",
        "address": "26191 Fir Ave, Moreno Valley, CA",
        "phone": "1 (909) 486-9344",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 35,
        "name": "Sheila Thomas",
        "address": "27157 Arla St, Moreno Valley, CA",
        "phone": "1 (951) 581-9577",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 36,
        "name": "Lidia Haro",
        "address": "27340 Ocean Dunes St, Moreno Valley, CA",
        "phone": "1 (310) 528-9315",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 37,
        "name": "Amarjeet Singh",
        "address": "27360 Hammett Ct, Moreno Valley, CA",
        "phone": "1 (267) 342-3791",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 38,
        "name": "Miguel Garzon",
        "address": "9770 Via Montara, Moreno Valley, CA",
        "phone": "1 (714) 371-6647",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 39,
        "name": "Maria Ramirez",
        "address": "9876 Paseo Cayuco, Moreno Valley, CA",
        "phone": "1 (909) 952-9271",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 40,
        "name": "Jose Clemente",
        "address": "12255 Chukar Ln, Moreno Valley, CA",
        "phone": "1 (323) 423-4585",
        "category": "Recent HVAC permit"
      },
      {
        "stop": 41,
        "name": "Lorenzo Carrasco Mata",
        "address": "10055 Sycamore Canyon Rd, Moreno Valley, CA",
        "phone": "1 (951) 261-4047",
        "category": "Recent HVAC permit"
      },
      {
        "stop": 42,
        "name": "George Fernandez",
        "address": "13763 Pheasant Knoll Ln, Moreno Valley, CA",
        "phone": "1 (951) 807-9449",
        "category": "Recent HVAC permit"
      },
      {
        "stop": 43,
        "name": "Glenn Scott",
        "address": "21147 Gallant Fox Dr, Moreno Valley, CA",
        "phone": "1 (951) 840-5322",
        "category": "Recent HVAC permit"
      },
      {
        "stop": 44,
        "name": "Robert Valdez",
        "address": "24307 Bairndale Dr, Moreno Valley, CA",
        "phone": "1 (323) 519-9869",
        "category": "Recent HVAC permit"
      },
      {
        "stop": 45,
        "name": "Naomi Casiano",
        "address": "14415 Sylvester Dr, Moreno Valley, CA 92553",
        "phone": "1 (951) 478-0485",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 46,
        "name": "Anthoney Woolley",
        "address": "22710 Temeco St, Moreno Valley, CA 92553",
        "phone": "1 (951) 497-0193",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "Norco",
    "count": 2,
    "leads": [
      {
        "stop": 1,
        "name": "Stephen Pace IV",
        "address": "2977 Shadow Canyon Cir, Norco, CA 92860",
        "phone": "1 (951) 314-0604",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 2,
        "name": "Dipika Kadakia",
        "address": "4453 Hillside Ave, Norco, CA 92860",
        "phone": "1 (949) 282-9461",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "Ontario",
    "count": 22,
    "leads": [
      {
        "stop": 1,
        "name": "Angel Martinez",
        "address": "1028 E I St, Ontario, CA",
        "phone": "1 (909) 758-3003",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 2,
        "name": "Milton Melgar",
        "address": "1331 N Isadora Way, Ontario, CA",
        "phone": "1 (909) 240-8811",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 3,
        "name": "Ricardo Solorio",
        "address": "1409 E Sycamore St, Ontario, CA",
        "phone": "1 (909) 680-5406",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 4,
        "name": "Robert Subia",
        "address": "1439 E Bermuda Dunes St, Ontario, CA",
        "phone": "1 (626) 646-8452",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 5,
        "name": "Lilia Garibaldi",
        "address": "1503 N Mariposa Ave, Ontario, CA",
        "phone": "1 (562) 445-5943",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 6,
        "name": "Gloria Galindo",
        "address": "1608 N Hacienda Dr, Ontario, CA",
        "phone": "1 (951) 675-7042",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 7,
        "name": "Leonel Olmos",
        "address": "1738 E Plaza Serena St, Ontario, CA",
        "phone": "1 (323) 997-0895",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 8,
        "name": "Maria Valenzuela",
        "address": "2246 S Goldcrest Ave, Ontario, CA",
        "phone": "1 (909) 331-9722",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 9,
        "name": "Vivian Manzano",
        "address": "2507 E Mabel Ln, Ontario, CA",
        "phone": "1 (626) 674-5776",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 10,
        "name": "Lissette Reeder",
        "address": "2873 E Alberta St, Ontario, CA",
        "phone": "1 (626) 347-0672",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 11,
        "name": "Michael Abreu",
        "address": "2883 S Butte Creek Pl, Ontario, CA",
        "phone": "1 (909) 331-8517",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 12,
        "name": "Aida Segura",
        "address": "2902 E Palomino Ct, Ontario, CA",
        "phone": "1 (912) 506-0580",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 13,
        "name": "Michael Terry",
        "address": "2925 E Palomino Ct, Ontario, CA",
        "phone": "1 (909) 851-0439",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 14,
        "name": "Armando Gonzalez",
        "address": "3107 E Buffalo Rd, Ontario, CA",
        "phone": "1 (909) 767-8304",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 15,
        "name": "Chris Cruz",
        "address": "3208 E Painted Crescent St, Ontario, CA",
        "phone": "1 (562) 682-3607",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 16,
        "name": "Norma Morales",
        "address": "3620 E Honeyglen Way, Ontario, CA",
        "phone": "1 (909) 504-9488",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 17,
        "name": "Danielle Lowe",
        "address": "3872 E Antelope Creek Dr, Ontario, CA",
        "phone": "1 (909) 229-6289",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 18,
        "name": "Eddie Garcia",
        "address": "530 E Cedar St, Ontario, CA",
        "phone": "1 (626) 297-6487",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 19,
        "name": "dianne towner",
        "address": "2856 E Joshua Tree St, Ontario, CA",
        "phone": "1 (909) 923-9944",
        "category": "Recent HVAC permit"
      },
      {
        "stop": 20,
        "name": "Frankie Sheldon",
        "address": "1401 E 5th St, Ontario, CA 91764",
        "phone": "1 (909) 391-6331",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 21,
        "name": "Connie Nicholson",
        "address": "2432 Black Pine Pl, Ontario, CA 91761",
        "phone": "1 (909) 563-0394",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 22,
        "name": "Saul Ramirez",
        "address": "631 e de anza st, ontario, CA 91761",
        "phone": "1 (909) 239-7659",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "PERRIS",
    "count": 2,
    "leads": [
      {
        "stop": 1,
        "name": "JESUS CASTELLANOS",
        "address": "2893 Discovery Ct, Perris, CA",
        "phone": "1 (323) 867-0978",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 2,
        "name": "JOSE OSUNA",
        "address": "1262 Mount Diablo St, Perris, CA",
        "phone": "1(760) 712-2472",
        "category": "Recent HVAC permit"
      }
    ]
  },
  {
    "city": "Perris",
    "count": 11,
    "leads": [
      {
        "stop": 1,
        "name": "Mark Taylor",
        "address": "1642 Sorrel Ln, Perris, CA",
        "phone": "1 (714) 745-3090",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 2,
        "name": "Neeraj Mudaliar",
        "address": "2143 Jean Marie Way, Perris, CA",
        "phone": "1 (951) 323-1588",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 3,
        "name": "Liza Hurtado",
        "address": "2360 Candlestick Way, Perris, CA",
        "phone": "1 (323) 803-8911",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 4,
        "name": "Fidel Leaños",
        "address": "2531 Wilson Ave, Perris, CA",
        "phone": "19 (512) 204-0088",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 5,
        "name": "Javier Lopez",
        "address": "3691 Cherisa St, Perris, CA",
        "phone": "1 (909) 644-3866",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 6,
        "name": "Waqar Chaudhary",
        "address": "3781 Raintree Cir, Perris, CA",
        "phone": "1 (951) 850-2329",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 7,
        "name": "Raquel Cortes",
        "address": "401 La Bonita Ave, Perris, CA",
        "phone": "1 (714) 580-4554",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 8,
        "name": "Jose Luis Grimaldo",
        "address": "545 Amaranta Ave, Perris, CA",
        "phone": "1 (951) 221-7051",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 9,
        "name": "Almira Buensuceso",
        "address": "828 Amadova Dr, Perris, CA",
        "phone": "1 (951) 337-0740",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 10,
        "name": "Jose Lopez",
        "address": "141 Oaktree Dr, Perris, CA 92571",
        "phone": "1 (323) 479-3064",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 11,
        "name": "Jesus Rosado",
        "address": "1856 Bluespruce Ct, Perris, CA 92571",
        "phone": "1 (951) 218-3901",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "Pomona",
    "count": 9,
    "leads": [
      {
        "stop": 1,
        "name": "Vivian Griego",
        "address": "1168 Baldwin Ave, Pomona, CA 91767",
        "phone": "1 (909) 277-8769",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 2,
        "name": "Marcos Reyes",
        "address": "1336 S Thomas St, Pomona, CA 91766",
        "phone": "1 (626) 864-7442",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 3,
        "name": "Ana Contreras",
        "address": "1798 S Towne Ave, Pomona, CA 91766",
        "phone": "1 (909) 461-0771",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 4,
        "name": "Jesus Herrera",
        "address": "1888 Brea Canyon Rd, Pomona, CA 91766",
        "phone": "1 (818) 568-2921",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 5,
        "name": "Salvador Arredondo",
        "address": "1919 Fleming St, Pomona, CA 91766",
        "phone": "1 (909) 910-6948",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 6,
        "name": "Maricela Olmos",
        "address": "2541 Kathryn Ave, Pomona, CA 91766",
        "phone": "1 (909) 229-2446",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 7,
        "name": "Ryan Sarmiento",
        "address": "623 Garden Ave, Pomona, CA 91767",
        "phone": "1 (626) 826-9919",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 8,
        "name": "Jacquelyn Kozar",
        "address": "801 Pavilion Dr, Pomona, CA 91768",
        "phone": "1 (909) 645-0045",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 9,
        "name": "David Stevens",
        "address": "905 Patrick Ave, Pomona, CA 91767",
        "phone": "1 (909) 622-7993",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "RIALTO",
    "count": 1,
    "leads": [
      {
        "stop": 1,
        "name": "OGOCHUKWU UZOUKWU",
        "address": "2401 Crater Ave, Rialto, CA",
        "phone": "1 (909) 488-2333",
        "category": "No HVAC permit on record"
      }
    ]
  },
  {
    "city": "RIVERSIDE",
    "count": 1,
    "leads": [
      {
        "stop": 1,
        "name": "LUIS GUTIERREZ",
        "address": "3468 LILLIAN ST, RIVERSIDE, CA 92504",
        "phone": "#ERROR!",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "Rancho Cucamonga",
    "count": 10,
    "leads": [
      {
        "stop": 1,
        "name": "Misty Girgle",
        "address": "10141 Kernwood Ct, Rancho Cucamonga, CA",
        "phone": "1 (909) 264-4637",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 2,
        "name": "William Holloway",
        "address": "6901 Verdet Ct, Rancho Cucamonga, CA",
        "phone": "1 (909) 210-5204",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 3,
        "name": "Jose Rodriguez",
        "address": "6911 Dahlia Ct, Rancho Cucamonga, CA",
        "phone": "1 (818) 450-7237",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 4,
        "name": "Kenneth Arredondo",
        "address": "6995 Penny Ct, Rancho Cucamonga, CA",
        "phone": "1 (323) 828-0003",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 5,
        "name": "Sean Mcpherson",
        "address": "7179 Parkside Pl, Rancho Cucamonga, CA",
        "phone": "1 (626) 731-0339",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 6,
        "name": "Denise Lescrinier",
        "address": "7422 Aurora Pl, Rancho Cucamonga, CA",
        "phone": "1 (909) 224-1232",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 7,
        "name": "Mike Farmer",
        "address": "8408 Hunter Dr, Rancho Cucamonga, CA",
        "phone": "1 (909) 963-6431",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 8,
        "name": "Maria del Socorro Padilla de Nova",
        "address": "8623 Vinmar Ave, Rancho Cucamonga, CA",
        "phone": "1 (909) 374-8883",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 9,
        "name": "Debbie Mansfield",
        "address": "8931 Whirlaway Ct, Rancho Cucamonga, CA",
        "phone": "1 (909) 921-2543",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 10,
        "name": "Marlen Marquez",
        "address": "6297 Jadeite Ave, Rancho Cucamonga, CA",
        "phone": "1 (909) 938-6023",
        "category": "Recent HVAC permit"
      }
    ]
  },
  {
    "city": "Redlands",
    "count": 4,
    "leads": [
      {
        "stop": 1,
        "name": "Juan Beltran",
        "address": "10742 Independence Ct, Redlands, CA",
        "phone": "1 (818) 932-8037",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 2,
        "name": "Martin Fontenot",
        "address": "12 S Ash St, Redlands, CA",
        "phone": "1 (619) 270-6836",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 3,
        "name": "David Thompson",
        "address": "1576 Columbia St, Redlands, CA 92374",
        "phone": "1 (909) 583-3606",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 4,
        "name": "Kevin Mccartney",
        "address": "614 Lido Street, Redlands, CA 92374",
        "phone": "1 (909) 353-9684",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "Rialto",
    "count": 12,
    "leads": [
      {
        "stop": 1,
        "name": "Marco Gomez",
        "address": "1049 N Sandalwood Ave, Rialto, CA",
        "phone": "1 (909) 258-6300",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 2,
        "name": "David Talkington",
        "address": "1464 N Mulberry Ave, Rialto, CA",
        "phone": "1 (909) 904-4008",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 3,
        "name": "Lesa Turner-Mcafee",
        "address": "1273 N Iris, Rialto, CA",
        "phone": "1 (626) 399-1922",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 4,
        "name": "Florence Karanja",
        "address": "1506 E Olive Ave, Rialto, CA",
        "phone": "1 (818) 521-3678",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 5,
        "name": "Elizabeth Garcia",
        "address": "526 N Eucalyptus Ave, Rialto, CA",
        "phone": "1 (909) 831-9010",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 6,
        "name": "Maritza Aquino",
        "address": "622 W Lourdes Ln, Rialto, CA",
        "phone": "1 (909) 704-9671",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 7,
        "name": "Sally Duron",
        "address": "725 W Winchester Dr, Rialto, CA",
        "phone": "1 (951) 203-0780",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 8,
        "name": "Bart Odums",
        "address": "881 W Woodhill St, Rialto, CA",
        "phone": "1 (951) 536-8688",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 9,
        "name": "Arnoldo Hernandez",
        "address": "1024 N Mulberry Ave, Rialto, CA",
        "phone": "1 (909) 684-3149",
        "category": "Recent HVAC permit"
      },
      {
        "stop": 10,
        "name": "Humberto Diaz",
        "address": "574 n chestnut ave, rialto, CA 92376",
        "phone": "1 (323) 919-6472",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 11,
        "name": "Charles Miles",
        "address": "6012 N Sycamore Avenue, Rialto, CA 92377",
        "phone": "1 (909) 856-2477",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 12,
        "name": "Maricella Solis",
        "address": "870 Martin Ct, Rialto, CA 92376",
        "phone": "1 (951) 741-5120",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "Riverside",
    "count": 14,
    "leads": [
      {
        "stop": 1,
        "name": "Manuel Zambrano",
        "address": "7439 Lakeside Dr, Jurupa Valley, CA",
        "phone": "1 (626) 201-5444",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 2,
        "name": "Kevin Haney",
        "address": "12156 Kingswood Ct, Riverside, CA",
        "phone": "1 (909) 224-3745",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 3,
        "name": "Beverly Miller",
        "address": "16800 Canyon View Dr, Riverside, CA",
        "phone": "1 (909) 938-6564",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 4,
        "name": "Jason Ransom",
        "address": "7369 Lakeside Dr, Jurupa Valley, CA",
        "phone": "1 (909) 996-3315",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 5,
        "name": "Noelle Galindo",
        "address": "7505 Smokestack Rd, Riverside, CA",
        "phone": "1 (951) 897-3885",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 6,
        "name": "Sandra Loria",
        "address": "7595 High Prairie Trl, Jurupa Valley, CA",
        "phone": "1 (951) 323-6603",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 7,
        "name": "Jose Guillen",
        "address": "9089 Hastings Blvd, Jurupa Valley, CA",
        "phone": "1 (714) 673-3116",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 8,
        "name": "Debra George",
        "address": "2987 Mary Ellen Dr, Jurupa Valley, CA",
        "phone": "1 (951) 237-6200",
        "category": "Recent HVAC permit"
      },
      {
        "stop": 9,
        "name": "Einar Hansen",
        "address": "15832 Shorb St, Riverside, CA 92508",
        "phone": "1 (216) 246-9125",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 10,
        "name": "Jose Esquivel",
        "address": "3537 Hancock Dr, Riverside, CA 92503",
        "phone": "1 (424) 308-5818",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 11,
        "name": "Roberto Hernandez",
        "address": "4164 Mobley Ave, Riverside, CA 92505",
        "phone": "1 (714) 469-8561",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 12,
        "name": "Juan Jorge Poemape Diaz_BE54544a",
        "address": "5551 Ave Juan Bautista, Riverside, CA 92509",
        "phone": "1 (801) 636-3168",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 13,
        "name": "Desiree Allison",
        "address": "6938 Yellowstone Dr, Riverside, CA 92506",
        "phone": "1 (951) 977-0559",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 14,
        "name": "Gerardo Marmolejo",
        "address": "933 High View Drive, Riverside, CA 92506",
        "phone": "1 (714) 472-5818",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "SAN BERNARDINO",
    "count": 2,
    "leads": [
      {
        "stop": 1,
        "name": "MICHELLE MORGAN",
        "address": "18354 Evening Primrose Ln, San Bernardino, CA",
        "phone": "1 (909) 917-8183",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 2,
        "name": "WAYNE BRYSON",
        "address": "1400 N Mountain View Ave, SAN BERNARDINO, CA 92405",
        "phone": "1 (909) 534-7441",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "San Bernardino",
    "count": 47,
    "leads": [
      {
        "stop": 1,
        "name": "Marina Leano",
        "address": "25456 Toluca Dr, San Bernardino, CA",
        "phone": "1 (909) 685-3308",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 2,
        "name": "Andres Rubio",
        "address": "718 Lassen Ave, San Bernardino, CA",
        "phone": "1 (909) 246-0529",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 3,
        "name": "Javier Calderon",
        "address": "1054 W 7th St, San Bernardino, CA 92411",
        "phone": "1 (909) 419-1694",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 4,
        "name": "Erika Guzman",
        "address": "1081 medical center drive, san bernardino, CA 92411",
        "phone": "1 (951) 544-5044",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 5,
        "name": "araceli Santana",
        "address": "1104 Amberwood Ct, San Bernardino, CA 92407",
        "phone": "1 (909) 453-9971",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 6,
        "name": "Eliseo Zelaya",
        "address": "1189 W Trenton St, San Bernardino, CA 92411",
        "phone": "1 (909) 368-3680",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 7,
        "name": "Javier Molina",
        "address": "1214 W Trenton St, San Bernardino, CA 92411",
        "phone": "1 (909) 559-1494",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 8,
        "name": "David Devillanueva",
        "address": "1256 West Alexander Avenue, San Bernardino, CA 92405",
        "phone": "1 (951) 373-0969",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 9,
        "name": "Ana Barranco",
        "address": "1328 Wall Ave San Bernardino, CA 92404, San Bernardino, CA 92404",
        "phone": "1 (909) 265-8493",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 10,
        "name": "Efrain Davila",
        "address": "1331 W Victoria St, San Bernardino, CA 92411",
        "phone": "1 (909) 277-5162",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 11,
        "name": "Lucia Espinoza",
        "address": "1356 Wall Ave, San Bernardino, CA 92404",
        "phone": "1 (909) 846-1783",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 12,
        "name": "Luis Alejandre",
        "address": "144 W 10th St, San Bernardino, CA 92410",
        "phone": "1 (909) 890-7328",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 13,
        "name": "LC Green",
        "address": "1494 N Hancock St, San Bernardino, CA 92411",
        "phone": "1 (909) 218-0610",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 14,
        "name": "Jesus Bautista",
        "address": "1695 Glenview St, San Bernardino, CA 92411",
        "phone": "1 (909) 521-2049",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 15,
        "name": "Maria Martinez",
        "address": "194 Big Horn Mountain Rd, San Bernardino, CA 92410",
        "phone": "1 (909) 327-8756",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 16,
        "name": "Feliciano Torres",
        "address": "1960 Turrill Avenue, San Bernardino, CA 92411",
        "phone": "1 (909) 242-0798",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 17,
        "name": "Joe Martinez",
        "address": "2249 Toluca Dr E, San Bernardino, CA 92404",
        "phone": "1 (626) 257-1455",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 18,
        "name": "Oscar Mendez",
        "address": "227 East 44th Street, San Bernardino, CA 92404",
        "phone": "1 (909) 277-8996",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 19,
        "name": "Hector Ramirez",
        "address": "2271 la salle ave, san bernardino, CA 92407",
        "phone": "1 (909) 648-8434",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 20,
        "name": "Timothy McGowan",
        "address": "2322 W College Ave, San Bernardino, CA 92407",
        "phone": "1 (951) 640-9261",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 21,
        "name": "Wilmer Miralda",
        "address": "2361 N Alameda Ave, San Bernardino, CA 92404",
        "phone": "1 (909) 827-5004",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 22,
        "name": "Victor Palestin",
        "address": "2406 W 6th St, San Bernardino, CA 92410",
        "phone": "1 (909) 300-1343",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 23,
        "name": "Josephine Luis",
        "address": "2444 James Place, San Bernardino, CA 92407",
        "phone": "1 (909) 456-9293",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 24,
        "name": "Luis Marroquin",
        "address": "24551 Monterey Ave, San Bernardino, CA 92410",
        "phone": "1 (909) 587-9324",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 25,
        "name": "Manuel Gonzalez",
        "address": "25456 Paloma Rd, San Bernardino, CA 92410",
        "phone": "1 (323) 855-9470",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 26,
        "name": "Antonio Alcaraz",
        "address": "2569 Etiwanda Ave, San Bernardino, CA 92410",
        "phone": "1 (626) 638-8836",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 27,
        "name": "Jesus Gomez",
        "address": "2815 Majestic Ave, San Bernardino, CA 92407",
        "phone": "1 (909) 419-4944",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 28,
        "name": "Oscar Dominguez",
        "address": "2845 San Anselmo Court, San Bernardino, CA 92407",
        "phone": "1 (909) 521-6424",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 29,
        "name": "Ubaldo Garrido",
        "address": "288 East 41st Street, San Bernardino, CA 92404",
        "phone": "1 (909) 855-5767",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 30,
        "name": "Charles watson",
        "address": "2896 N State St, San Bernardino, CA 92407",
        "phone": "1 (909) 684-8713",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 31,
        "name": "Carlos Ramirez",
        "address": "3057 N State st, San bernardino, CA 92407",
        "phone": "1 (909) 677-1909",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 32,
        "name": "Horacio Cortes",
        "address": "3208 N Mountain View Ave, san Bernardino, CA 92405",
        "phone": "1 (909) 855-7056",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 33,
        "name": "Matthew Neal",
        "address": "3479 North Pershing Avenue, San Bernardino, CA 92405",
        "phone": "1 (909) 723-4191",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 34,
        "name": "Andrea Magdaleno",
        "address": "3525 Belle Street, San Bernardino, CA 92404",
        "phone": "1 (951) 376-6469",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 35,
        "name": "Raul Ramirez Lara",
        "address": "3635 N Arrowhead Ave, San Bernardino, CA 92405",
        "phone": "1 (909) 659-6716",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 36,
        "name": "Jose Olguin",
        "address": "3834 Leroy Court, San Bernardino, CA 92404",
        "phone": "1 (840) 247-7652",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 37,
        "name": "Dennis Aceves",
        "address": "4064 Conejo Dr, San Bernardino, CA 92404",
        "phone": "1 (909) 910-1631",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 38,
        "name": "Juan Carlos Flores Flores",
        "address": "5205 Revere Avenue, San Bernardino, CA 92407",
        "phone": "1 (714) 227-9301",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 39,
        "name": "Gustavo Cordero",
        "address": "588 E Evans St, San Bernardino, CA 92404",
        "phone": "1 (323) 718-5260",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 40,
        "name": "Weston Lauder",
        "address": "5995 Orange Knoll Ave, San Bernardino, CA 92404",
        "phone": "1 (951) 712-8946",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 41,
        "name": "William B. Garcia",
        "address": "6165 Olive Ave, San Bernardino, CA 92407",
        "phone": "1 (323) 273-0305",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 42,
        "name": "Armando Reyes",
        "address": "642 W Olive St, San Bernardino, CA 92410",
        "phone": "1 (909) 522-1033",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 43,
        "name": "Manjula Kaloor",
        "address": "6820 North Melvin Avenue, San Bernardino, CA 92407",
        "phone": "1 (626) 679-6336",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 44,
        "name": "Aurelia Barerra",
        "address": "731 W 20th St, San Bernardino, CA 92405",
        "phone": "1 (909) 246-3069",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 45,
        "name": "Miguel Zaragoza",
        "address": "763 W 19th St, San Bernardino, CA 92405",
        "phone": "1 (909) 780-0131",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 46,
        "name": "Margarita Fonseca",
        "address": "772 N Perris St, San Bernardino, CA 92411",
        "phone": "1 (909) 277-4432",
        "category": "Address not in Shovels DB"
      },
      {
        "stop": 47,
        "name": "Arturo Monzon",
        "address": "816 W Campus Way, San Bernardino, CA 92405",
        "phone": "1 (909) 693-2604",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "Upland",
    "count": 14,
    "leads": [
      {
        "stop": 1,
        "name": "Darah Martinez",
        "address": "1340 Mulberry Ave, Upland, CA",
        "phone": "1 (909) 261-8043",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 2,
        "name": "Jeremiah Johnson",
        "address": "1358 Bowen St, Upland, CA",
        "phone": "1 (909) 202-7516",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 3,
        "name": "Chris Hernandez",
        "address": "1463 Pluma St, Upland, CA",
        "phone": "1 (626) 274-2000",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 4,
        "name": "Richard Mays",
        "address": "1477 Francis Ave, Upland, CA",
        "phone": "1 (805) 791-7417",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 5,
        "name": "Donald Bowers",
        "address": "1568 Sun River St, Upland, CA",
        "phone": "1 (323) 630-0269",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 6,
        "name": "David Merrill",
        "address": "1697 W Lisbon St, Upland, CA",
        "phone": "1 (909) 908-3069",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 7,
        "name": "Chuiying Zheng",
        "address": "1727 Partridge Ave, Upland, CA",
        "phone": "1 (909) 354-1772",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 8,
        "name": "Daniel Kressin",
        "address": "1778 Jeanna Pl, Upland, CA",
        "phone": "1 (760) 468-1731",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 9,
        "name": "Mark Sackett",
        "address": "1832 Pinnacle Way, Upland, CA",
        "phone": "1 (951) 966-9741",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 10,
        "name": "Florella Deocampo",
        "address": "1849 Old Baldy Way, Upland, CA",
        "phone": "1 (909) 568-9766",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 11,
        "name": "Ryan Kolodge",
        "address": "2321 Fairfield Way, Upland, CA",
        "phone": "1 (909) 239-4139",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 12,
        "name": "Antonio Roman",
        "address": "237 1St Ave, Upland, CA",
        "phone": "1 (909) 609-9715",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 13,
        "name": "Henning Brandes",
        "address": "839 Linden Ct, Upland, CA",
        "phone": "1 (909) 477-7856",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 14,
        "name": "Dionicio Ventura",
        "address": "1848 N Millsweet Dr, Upland, CA 91784",
        "phone": "1 (909) 702-4263",
        "category": "Address not in Shovels DB"
      }
    ]
  },
  {
    "city": "Yucaipa",
    "count": 6,
    "leads": [
      {
        "stop": 1,
        "name": "Cody Blodgett",
        "address": "35101 Ravencrest Ct, Yucaipa, CA",
        "phone": "1 (909) 222-3608",
        "category": "TARGET — HVAC permit 8+ yrs old"
      },
      {
        "stop": 2,
        "name": "Jason Cox",
        "address": "11664 Vista Ln, Yucaipa, CA",
        "phone": "1 (909) 921-9683",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 3,
        "name": "Pablo Hidalgo",
        "address": "12634 12Th St, Yucaipa, CA",
        "phone": "1 (909) 723-2305",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 4,
        "name": "Martin Trujillo",
        "address": "12635 Oday Ct, Yucaipa, CA",
        "phone": "1 (951) 906-3031",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 5,
        "name": "David Bartholomew",
        "address": "12885 Brigid Ct, Yucaipa, CA",
        "phone": "1 (909) 763-9407",
        "category": "No HVAC permit on record"
      },
      {
        "stop": 6,
        "name": "Robert Lines",
        "address": "34264 Ave G, Yucaipa, CA 92399",
        "phone": "1 (909) 754-1700",
        "category": "Address not in Shovels DB"
      }
    ]
  }
];