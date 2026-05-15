export interface MenuItem {
  id: string
  number: string
  name: string
  category: string
  pieces: number
  image: string | null
}

export const MENU: MenuItem[] = [
  // ENTRÉE
  { id: '1',   number: '1',   name: 'Beignets fromage',              category: 'Entrée',           pieces: 3, image: '/dishes/1_beignets_fromage.jpg' },
  { id: '2',   number: '2',   name: 'Samoussa bœuf',                 category: 'Entrée',           pieces: 3, image: '/dishes/2_samoussa_boeuf.jpg' },
  { id: '3',   number: '3',   name: 'Samoussa légumes',              category: 'Entrée',           pieces: 3, image: '/dishes/3_samoussa_legumes.jpg' },
  { id: '4',   number: '4',   name: 'Beignets crevettes',            category: 'Entrée',           pieces: 3, image: '/dishes/4_beignets_crevettes.jpg' },
  { id: '5',   number: '5',   name: 'Beignets poisson',              category: 'Entrée',           pieces: 3, image: '/dishes/5_beignets_poisson.jpg' },
  { id: '6',   number: '6',   name: 'Beignets poulet',               category: 'Entrée',           pieces: 3, image: '/dishes/6_beignets_poulet.jpg' },
  { id: '7',   number: '7',   name: 'Beignets calamars',             category: 'Entrée',           pieces: 3, image: '/dishes/7_beignets_calamars.jpg' },
  { id: '8',   number: '8',   name: 'Nems poulet',                   category: 'Entrée',           pieces: 3, image: '/dishes/8_nems_poulet.jpg' },
  { id: '8A',  number: '8A',  name: 'Potatoes',                      category: 'Entrée',           pieces: 6, image: '/dishes/8A_potatoes.jpg' },
  { id: '9',   number: '9',   name: 'Raviolis japonais',             category: 'Entrée',           pieces: 4, image: '/dishes/9_raviolis_japonais.jpg' },
  { id: '10',  number: '10',  name: 'Raviolis crevettes',            category: 'Entrée',           pieces: 4, image: '/dishes/10_raviolis_crevettes.jpg' },
  { id: '11',  number: '11',  name: 'Bouchées crevettes',            category: 'Entrée',           pieces: 4, image: '/dishes/11_bouchees_crevettes.jpg' },
  { id: '14',  number: '14',  name: 'Riz nature',                    category: 'Entrée',           pieces: 1, image: '/dishes/14_riz_nature.jpg' },
  { id: '15',  number: '15',  name: 'Riz vinaigré',                  category: 'Entrée',           pieces: 1, image: '/dishes/15_riz_vinagre.jpg' },
  // YAKITORI
  { id: '12',  number: '12',  name: 'Courgette',                     category: 'Yakitori',         pieces: 2, image: '/dishes/12_courgette.jpg' },
  { id: '20',  number: '20',  name: 'Poulet',                        category: 'Yakitori',         pieces: 2, image: '/dishes/20_poulet.jpg' },
  { id: '21',  number: '21',  name: 'Aile poulet',                   category: 'Yakitori',         pieces: 2, image: '/dishes/21_aile_poulet.jpg' },
  { id: '22',  number: '22',  name: 'Boulettes poulet',              category: 'Yakitori',         pieces: 2, image: '/dishes/22_boulettes_poulet.jpg' },
  { id: '23',  number: '23',  name: 'Champignon',                    category: 'Yakitori',         pieces: 2, image: '/dishes/23_champignon.jpg' },
  { id: '24',  number: '24',  name: 'Bœuf',                          category: 'Yakitori',         pieces: 2, image: '/dishes/24_boeuf.jpg' },
  { id: '25',  number: '25',  name: 'Bœuf fromage',                  category: 'Yakitori',         pieces: 2, image: '/dishes/25_boeuf_fromage.jpg' },
  // SUSHI
  { id: '13',  number: '13',  name: 'Omelette',                      category: 'Sushi',            pieces: 2, image: '/dishes/13_omelette.jpg' },
  { id: '13A', number: '13A', name: 'Sushi surimi',                  category: 'Sushi',            pieces: 2, image: '/dishes/13A_sushi_surimi.jpg' },
  { id: '16',  number: '16',  name: 'Saumon',                        category: 'Sushi',            pieces: 2, image: '/dishes/16_saumon.jpg' },
  { id: '17',  number: '17',  name: 'Thon',                          category: 'Sushi',            pieces: 2, image: '/dishes/17_thon.jpg' },
  { id: '18',  number: '18',  name: 'Daurade',                       category: 'Sushi',            pieces: 2, image: '/dishes/18_daurade.jpg' },
  { id: '19',  number: '19',  name: 'Crevette',                      category: 'Sushi',            pieces: 2, image: '/dishes/19_crevette.jpg' },
  // MAKI
  { id: '26',  number: '26',  name: 'Fotu maki',                     category: 'Maki',             pieces: 6, image: '/dishes/26_fotu_maki.jpg' },
  { id: '27',  number: '27',  name: 'Thon',                          category: 'Maki',             pieces: 6, image: '/dishes/27_thon.jpg' },
  { id: '28',  number: '28',  name: 'Saumon',                        category: 'Maki',             pieces: 6, image: '/dishes/28_saumon.jpg' },
  { id: '30',  number: '30',  name: 'Saumon avocat',                 category: 'Maki',             pieces: 6, image: '/dishes/30_saumon_avocat.jpg' },
  { id: '32',  number: '32',  name: 'Concombre cheese',              category: 'Maki',             pieces: 6, image: '/dishes/32_concombre_cheese.jpg' },
  { id: '33',  number: '33',  name: 'Fromage',                       category: 'Maki',             pieces: 6, image: '/dishes/33_fromage.jpg' },
  { id: '33A', number: '33A', name: 'Avocat cheese',                 category: 'Maki',             pieces: 6, image: '/dishes/33A_avocat_cheese.jpg' },
  { id: '34',  number: '34',  name: 'Avocat crevette',               category: 'Maki',             pieces: 6, image: '/dishes/34_avocat_crevette.jpg' },
  // TEMAKI
  { id: '44',  number: '44',  name: 'Saumon avocat',                 category: 'Temaki',           pieces: 1, image: '/dishes/44_saumon_avocat.jpg' },
  { id: '45',  number: '45',  name: 'Thon avocat',                   category: 'Temaki',           pieces: 1, image: '/dishes/45_thon_avocat.jpg' },
  { id: '46',  number: '46',  name: 'Surimi avocat',                 category: 'Temaki',           pieces: 1, image: '/dishes/46_surimi_avocat.jpg' },
  // CALIFORNIA
  { id: '29',  number: '29',  name: 'Saumon cheddar',                category: 'California',       pieces: 6, image: '/dishes/29_saumon_cheddar.jpg' },
  { id: '31',  number: '31',  name: 'Poulet curry',                  category: 'California',       pieces: 6, image: '/dishes/31_poulet_curry.jpg' },
  { id: '35',  number: '35',  name: 'Avocat thon',                   category: 'California',       pieces: 6, image: '/dishes/35_avocat_thon.jpg' },
  { id: '36',  number: '36',  name: 'Avocat saumon',                 category: 'California',       pieces: 6, image: '/dishes/36_avocat_saumon.jpg' },
  { id: '37',  number: '37',  name: 'Avocat thon cuit',              category: 'California',       pieces: 6, image: '/dishes/37_avocat_thon_cuit.jpg' },
  { id: '38',  number: '38',  name: 'Poulet mayonnaise',             category: 'California',       pieces: 6, image: '/dishes/38_poulet_mayonnaise.jpg' },
  { id: '39',  number: '39',  name: 'Avocat crevettes',              category: 'California',       pieces: 6, image: '/dishes/39_avocat_crevettes.jpg' },
  { id: '40',  number: '40',  name: 'Maki royal',                    category: 'California',       pieces: 6, image: '/dishes/40_maki_royal.jpg' },
  { id: '41',  number: '41',  name: 'Concombre fromage',             category: 'California',       pieces: 6, image: '/dishes/41_concombre_fromage.jpg' },
  { id: '42',  number: '42',  name: 'Printemps saumon',              category: 'California',       pieces: 6, image: '/dishes/42_printemps_saumon.jpg' },
  { id: '42A', number: '42A', name: 'Printemps tempura',             category: 'California',       pieces: 6, image: '/dishes/42A_printemps_tempura.jpg' },
  { id: '43',  number: '43',  name: 'Masago saumon',                 category: 'California',       pieces: 6, image: '/dishes/43_masago_saumon.jpg' },
  { id: '60',  number: '60',  name: 'Neige saumon cheese',           category: 'California',       pieces: 6, image: '/dishes/60_neige_saumon_cheese.jpg' },
  { id: '61',  number: '61',  name: 'Oignons saumon avocat',         category: 'California',       pieces: 6, image: '/dishes/61_oignons_saumon_avocat.jpg' },
  { id: '62',  number: '62',  name: 'California cheese',             category: 'California',       pieces: 6, image: '/dishes/62_california_cheese.jpg' },
  { id: '63',  number: '63',  name: 'California surimi',             category: 'California',       pieces: 6, image: '/dishes/63_california_surimi.jpg' },
  // SOIR UNIQUEMENT
  { id: '48',  number: '48',  name: 'Gambas',                        category: 'Soir uniquement',  pieces: 2, image: '/dishes/48_gambas.jpg' },
  { id: '49',  number: '49',  name: 'Thon',                          category: 'Soir uniquement',  pieces: 2, image: '/dishes/49_thon.jpg' },
  { id: '50',  number: '50',  name: 'Saumon',                        category: 'Soir uniquement',  pieces: 2, image: '/dishes/50_saumon.jpg' },
  { id: '51',  number: '51',  name: 'Nem crevettes',                 category: 'Soir uniquement',  pieces: 3, image: '/dishes/51_nem_crevettes.jpg' },
  { id: '48A', number: '48A', name: 'Maki tomate séchée chèvre',     category: 'Soir uniquement',  pieces: 6, image: '/dishes/48A_maki_tomate_sechee_chevre.jpg' },
  { id: '28A', number: '28A', name: 'Maki saumon cheese',            category: 'Soir uniquement',  pieces: 6, image: '/dishes/28A_maki_saumon_cheese.jpg' },
  { id: '52',  number: '52',  name: 'Dragon roll',                   category: 'Soir uniquement',  pieces: 6, image: '/dishes/52_dragon_roll.jpg' },
  { id: '53',  number: '53',  name: 'Tarte saumon',                  category: 'Soir uniquement',  pieces: 4, image: '/dishes/53_tarte_saumon.jpg' },
  { id: '54',  number: '54',  name: 'Sushi saumon cheese',           category: 'Soir uniquement',  pieces: 2, image: '/dishes/54_sushi_saumon_cheese.jpg' },
  { id: '55',  number: '55',  name: 'Œuf saumon',                    category: 'Soir uniquement',  pieces: 2, image: '/dishes/55_oeuf_saumon.jpg' },
  { id: '56',  number: '56',  name: 'Sushi anguille',                category: 'Soir uniquement',  pieces: 2, image: '/dishes/56_sushi_anguille.jpg' },
  { id: '57',  number: '57',  name: 'Sashimi saumon',                category: 'Soir uniquement',  pieces: 3, image: '/dishes/57_sashimi_saumon.jpg' },
  { id: '64',  number: '64',  name: 'Maki egg cheese',               category: 'Soir uniquement',  pieces: 6, image: '/dishes/64_maki_egg_cheese.jpg' },
  { id: '65',  number: '65',  name: 'California oignon thon',        category: 'Soir uniquement',  pieces: 6, image: '/dishes/65_california_oignon_thon.jpg' },
  { id: '66',  number: '66',  name: 'California saumon fumé cheese', category: 'Soir uniquement',  pieces: 6, image: '/dishes/66_california_saumon_fume_cheese.jpg' },
  { id: '67',  number: '67',  name: 'California tempura',            category: 'Soir uniquement',  pieces: 6, image: '/dishes/67_california_tempura.jpg' },
  { id: '68',  number: '68',  name: 'Sushi saumon braisé',           category: 'Soir uniquement',  pieces: 2, image: '/dishes/68_sushi_saumon_braise.jpg' },
  { id: '69',  number: '69',  name: 'Sushi thon braisé',             category: 'Soir uniquement',  pieces: 2, image: '/dishes/69_sushi_thon_braise.jpg' },
]

export const CATEGORIES = [...new Set(MENU.map((m) => m.category))]
