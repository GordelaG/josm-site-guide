import { Airport } from '../types/airport';

export const INITIAL_AIRPORTS: Airport[] = [
  {
    icao: "SBGR",
    name: "Aeroporto Internacional Governador André Franco Montoro",
    city: "Guarulhos / São Paulo",
    lat: -23.4356,
    lng: -46.4731,
    status: "done",
    version: "v1.2.0",
    lastUpdateTitle: "Vetorização Completa de Pátios e Taxiways T3",
    lastUpdateDescription: "Atualização das linhas centrais das taxiways B, C, D e expansão do pátio 3 conforme layout oficial DECEA.",
    updatesHistory: [
      {
        version: "v1.2.0",
        title: "Vetorização Completa de Pátios e Taxiways T3",
        description: "Alinhamento das posições remotas e reconfiguração dos pontos de espera da pista 10L/28R.",
        date: "2026-08-28T14:30:00Z",
        author: "Equipe VATBRZ",
        afterImageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200",
      },
      {
        version: "v1.0.0",
        title: "Lançamento Inicial da Base Cartográfica de Guarulhos",
        description: "Vetorização inicial das pistas 10L/28R e 10R/28L com taxilines principais.",
        date: "2026-07-15T10:00:00Z",
        author: "Equipe VATBRZ",
      }
    ]
  },
  {
    icao: "SBSP",
    name: "Aeroporto de Congonhas",
    city: "São Paulo",
    lat: -23.6261,
    lng: -46.6564,
    status: "done",
    version: "v1.1.0",
    lastUpdateTitle: "Adequação dos Boxes e Áreas de Giro",
    lastUpdateDescription: "Ajuste na numeração dos gates do terminal principal e novas marcações de taxiway H e M.",
    updatesHistory: [
      {
        version: "v1.1.0",
        title: "Adequação dos Boxes e Áreas de Giro",
        description: "Revisão dos pontos de parada das aeronaves categoria C e taxilane de saída rápida.",
        date: "2026-08-20T18:00:00Z",
        author: "Operações VATBRZ",
        afterImageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200",
      }
    ]
  },
  {
    icao: "SBRJ",
    name: "Aeroporto Santos Dumont",
    city: "Rio de Janeiro",
    lat: -22.9105,
    lng: -43.1631,
    status: "done",
    version: "v1.0.5",
    lastUpdateTitle: "Refinamento das Pistas 02R/20L e 02L/20R",
    lastUpdateDescription: "Correção milimétrica dos limites de cabeceira sobre a Baía de Guanabara.",
    updatesHistory: [
      {
        version: "v1.0.5",
        title: "Refinamento das Pistas 02R/20L e 02L/20R",
        description: "Ajuste fino de aproximação visual e marcações do pátio comercial.",
        date: "2026-08-10T12:00:00Z",
        author: "Equipe VATBRZ",
      }
    ]
  },
  {
    icao: "SBBR",
    name: "Aeroporto Internacional de Brasília (Presidente JK)",
    city: "Brasília",
    lat: -15.8711,
    lng: -47.9186,
    status: "done",
    version: "v1.0.0",
    lastUpdateTitle: "Vetorização dos Píeres Norte e Sul",
    lastUpdateDescription: "Mapeamento completo dos píeres de embarque e pistas paralelas 11R/29L e 11L/29R.",
    updatesHistory: [
      {
        version: "v1.0.0",
        title: "Vetorização dos Píeres Norte e Sul",
        description: "Mapeamento completo dos píeres de embarque e pistas paralelas.",
        date: "2026-07-25T16:00:00Z",
        author: "Operações VATBRZ",
      }
    ]
  },
  {
    icao: "SBGL",
    name: "RIOgaleão — Aeroporto Internacional Tom Jobim",
    city: "Rio de Janeiro",
    lat: -22.8099,
    lng: -43.2505,
    status: "done"
  },
  {
    icao: "SBSV",
    name: "Aeroporto Internacional Dep. Luís Eduardo Magalhães",
    city: "Salvador",
    lat: -12.9086,
    lng: -38.3225,
    status: "done"
  },
  {
    icao: "SBCT",
    name: "Aeroporto Internacional Afonso Pena",
    city: "São José dos Pinhais / Curitiba",
    lat: -25.5285,
    lng: -49.1758,
    status: "done"
  },
  {
    icao: "SBKP",
    name: "Aeroporto Internacional de Viracopos",
    city: "Campinas",
    lat: -23.0074,
    lng: -47.1345,
    status: "done"
  },
  {
    icao: "SBPA",
    name: "Aeroporto Internacional Salgado Filho",
    city: "Porto Alegre",
    lat: -29.9944,
    lng: -51.1714,
    status: "done"
  },
  {
    icao: "SBCF",
    name: "Aeroporto Internacional Tancredo Neves (Confins)",
    city: "Belo Horizonte",
    lat: -19.6244,
    lng: -43.9719,
    status: "done"
  },
  {
    icao: "SBRF",
    name: "Aeroporto Internacional do Recife / Guararapes (Gilberto Freyre)",
    city: "Recife",
    lat: -8.1265,
    lng: -34.9236,
    status: "done"
  },
  {
    icao: "SBFZ",
    name: "Aeroporto Internacional Pinto Martins",
    city: "Fortaleza",
    lat: -3.7763,
    lng: -38.5326,
    status: "done"
  },
  {
    icao: "SBFL",
    name: "Aeroporto Internacional Hercílio Luz",
    city: "Florianópolis",
    lat: -27.6702,
    lng: -48.5525,
    status: "done"
  },
  {
    icao: "SBEG",
    name: "Aeroporto Internacional Eduardo Gomes",
    city: "Manaus",
    lat: -3.0386,
    lng: -60.0497,
    status: "done"
  },
  {
    icao: "SBBE",
    name: "Aeroporto Internacional Val de Cans (Júlio Cezar Ribeiro)",
    city: "Belém",
    lat: -1.3792,
    lng: -48.4762,
    status: "done"
  },
  {
    icao: "SBVT",
    name: "Aeroporto Eurico de Aguiar Salles",
    city: "Vitória",
    lat: -20.2581,
    lng: -40.2869,
    status: "done"
  },
  {
    icao: "SBGO",
    name: "Aeroporto Santa Genoveva",
    city: "Goiânia",
    lat: -16.632,
    lng: -49.2207,
    status: "done"
  },
  {
    icao: "SBFI",
    name: "Aeroporto Internacional Cataratas",
    city: "Foz do Iguaçu",
    lat: -25.6003,
    lng: -54.4852,
    status: "done"
  },
  {
    icao: "SBCY",
    name: "Aeroporto Internacional Marechal Rondon",
    city: "Várzea Grande / Cuiabá",
    lat: -15.6528,
    lng: -56.1167,
    status: "done"
  },
  {
    icao: "SBPS",
    name: "Aeroporto de Porto Seguro",
    city: "Porto Seguro",
    lat: -16.4381,
    lng: -39.0811,
    status: "done"
  },
  {
    icao: "SBSL",
    name: "Aeroporto Internacional Marechal Cunha Machado",
    city: "São Luís",
    lat: -2.5854,
    lng: -44.2341,
    status: "done"
  },
  {
    icao: "SBNF",
    name: "Aeroporto Internacional Ministro Victor Konder",
    city: "Navegantes",
    lat: -26.8799,
    lng: -48.6514,
    status: "done"
  },
  {
    icao: "SBMT",
    name: "Aeroporto Campo de Marte",
    city: "São Paulo",
    lat: -23.5097,
    lng: -46.6375,
    status: "done"
  },
  {
    icao: "SBSG",
    name: "Aeroporto Internacional de São Gonçalo do Amarante",
    city: "Natal",
    lat: -5.7686,
    lng: -35.3664,
    status: "done"
  },
  {
    icao: "SBPV",
    name: "Aeroporto Internacional Governador Jorge Teixeira",
    city: "Porto Velho",
    lat: -8.7093,
    lng: -63.9023,
    status: "done"
  },
  {
    icao: "SBFN",
    name: "Aeroporto de Fernando de Noronha",
    city: "Fernando de Noronha",
    lat: -3.8552,
    lng: -32.4233,
    status: "done"
  },
  {
    icao: "SBRP",
    name: "Aeroporto Dr. Leite Lopes",
    city: "Ribeirão Preto",
    lat: -21.1363,
    lng: -47.7767,
    status: "done"
  },
  {
    icao: "SBTE",
    name: "Aeroporto Senador Petrônio Portella",
    city: "Teresina",
    lat: -5.0599,
    lng: -42.8237,
    status: "done"
  },
  {
    icao: "SBJD",
    name: "Aeroporto Estadual de Jundiaí",
    city: "Jundiaí",
    lat: -23.1816,
    lng: -46.9441,
    status: "done"
  },
  {
    icao: "SBSJ",
    name: "Aeroporto Professor Urbano Ernesto Stumpf",
    city: "São José dos Campos",
    lat: -23.2292,
    lng: -45.8615,
    status: "done"
  },
  {
    icao: "SBDN",
    name: "Aeroporto Estadual de Presidente Prudente",
    city: "Presidente Prudente",
    lat: -22.1755,
    lng: -51.4241,
    status: "done"
  },
  {
    icao: "SBMA",
    name: "Aeroporto João Correa da Rocha",
    city: "Marabá",
    lat: -5.3686,
    lng: -49.138,
    status: "done"
  },
  {
    icao: "SBJR",
    name: "Aeroporto de Jacarepaguá",
    city: "Rio de Janeiro",
    lat: -22.9875,
    lng: -43.3697,
    status: "done"
  },
  {
    icao: "SBCB",
    name: "Aeroporto Internacional de Cabo Frio",
    city: "Cabo Frio",
    lat: -22.9247,
    lng: -42.0791,
    status: "done"
  },
  {
    icao: "SBCG",
    name: "Aeroporto Internacional de Campo Grande",
    city: "Campo Grande",
    lat: -20.4687,
    lng: -54.6725,
    status: "in_progress"
  },
  {
    icao: "SBMO",
    name: "Aeroporto Internacional Zumbi dos Palmares",
    city: "Rio Largo / Maceió",
    lat: -9.5109,
    lng: -35.7917,
    status: "done"
  },
  {
    icao: "SBJP",
    name: "Aeroporto Internacional Presidente Castro Pinto",
    city: "Bayeux / João Pessoa",
    lat: -7.1459,
    lng: -34.9502,
    status: "in_progress"
  },
  {
    icao: "SBUL",
    name: "Aeroporto Brigadeiro César Bombonato",
    city: "Uberlândia",
    lat: -18.8836,
    lng: -48.2253,
    status: "in_progress"
  },
  {
    icao: "SBSM",
    name: "Base Aérea de Santa Maria",
    city: "Santa Maria",
    lat: -29.7113,
    lng: -53.6883,
    status: "in_progress"
  },
  {
    icao: "SBSN",
    name: "Aeroporto Internacional de Santarém (Maestro Wilson Fonseca)",
    city: "Santarém",
    lat: -2.4247,
    lng: -54.7858,
    status: "done"
  },
  {
    icao: "SBAR",
    name: "Aeroporto Santa Maria",
    city: "Aracaju",
    lat: -10.984,
    lng: -37.0703,
    status: "done"
  },
  {
    icao: "SBJV",
    name: "Aeroporto de Joinville / Lauro Carneiro de Loyola",
    city: "Joinville",
    lat: -26.2245,
    lng: -48.7972,
    status: "pending"
  },
  {
    icao: "SBPJ",
    name: "Aeroporto de Palmas (Brigadeiro Lysias Rodrigues)",
    city: "Palmas",
    lat: -10.2917,
    lng: -48.3572,
    status: "in_progress"
  },
  {
    icao: "SBRB",
    name: "Aeroporto Internacional Plácido de Castro",
    city: "Rio Branco",
    lat: -9.8699,
    lng: -67.8981,
    status: "in_progress"
  },
  {
    icao: "SBLO",
    name: "Aeroporto Governador José Richa",
    city: "Londrina",
    lat: -23.3336,
    lng: -51.1301,
    status: "pending"
  },
  {
    icao: "SBIL",
    name: "Aeroporto Jorge Amado",
    city: "Ilhéus",
    lat: -14.816,
    lng: -39.0339,
    status: "pending"
  },
  {
    icao: "SBBV",
    name: "Aeroporto Internacional Atlas Brasil Cantanhede",
    city: "Boa Vista",
    lat: 2.8459,
    lng: -60.6922,
    status: "pending"
  },
  {
    icao: "SBMG",
    name: "Aeroporto Regional de Maringá / Sílvio Name Júnior",
    city: "Maringá",
    lat: -23.479,
    lng: -52.0162,
    status: "pending"
  },
  {
    icao: "SBBH",
    name: "Aeroporto da Pampulha (Carlos Drummond de Andrade)",
    city: "Belo Horizonte",
    lat: -19.8519,
    lng: -43.9506,
    status: "pending"
  },
  {
    icao: "SBMQ",
    name: "Aeroporto Internacional Alberto Alcolumbre",
    city: "Macapá",
    lat: 0.0507,
    lng: -51.0722,
    status: "in_progress"
  },
  {
    icao: "SBSR",
    name: "Aeroporto Prof. Eribelto Manoel Reino",
    city: "São José do Rio Preto",
    lat: -20.8167,
    lng: -49.4064,
    status: "pending"
  },
  {
    icao: "SBZM",
    name: "Aeroporto Regional da Zona da Mata",
    city: "Goianá / Juiz de Fora",
    lat: -21.5131,
    lng: -43.1747,
    status: "pending"
  },
  {
    icao: "SBCH",
    name: "Aeroporto Serafin Enoss Bertaso",
    city: "Chapecó",
    lat: -27.1342,
    lng: -52.6562,
    status: "in_progress"
  },
  {
    icao: "SBCX",
    name: "Aeroporto Hugo Cantergiani",
    city: "Caxias do Sul",
    lat: -29.1971,
    lng: -51.1875,
    status: "pending"
  },
  {
    icao: "SBPL",
    name: "Aeroporto Senador Nilo Coelho",
    city: "Petrolina",
    lat: -9.3622,
    lng: -40.5692,
    status: "pending"
  },
  {
    icao: "SBJH",
    name: "Aeroporto Francisco de Assis",
    city: "Juiz de Fora",
    lat: -21.7912,
    lng: -43.3868,
    status: "pending"
  },
  {
    icao: "SBNT",
    name: "Aeroporto Internacional Governador Aluízio Alves",
    city: "São Gonçalo do Amarante / Natal",
    lat: -5.9114,
    lng: -35.2477,
    status: "pending"
  },
  {
    icao: "SBCA",
    name: "Aeroporto de Cascavel",
    city: "Cascavel",
    lat: -25.0003,
    lng: -53.501,
    status: "pending"
  },
  {
    icao: "SBKG",
    name: "Aeroporto Presidente João Suassuna",
    city: "Campina Grande",
    lat: -7.2697,
    lng: -35.8964,
    status: "pending"
  },
  {
    icao: "SBPF",
    name: "Aeroporto Lauro Kortz",
    city: "Passo Fundo",
    lat: -28.2433,
    lng: -52.3278,
    status: "pending"
  },
  {
    icao: "SBVC",
    name: "Aeroporto Glauber Rocha",
    city: "Vitória da Conquista",
    lat: -14.9083,
    lng: -40.9167,
    status: "pending"
  },
  {
    icao: "SBBI",
    name: "Aeroporto de Bacacheri",
    city: "Curitiba",
    lat: -25.4053,
    lng: -49.2319,
    status: "pending"
  },
  {
    icao: "SBPK",
    name: "Aeroporto Internacional de Pelotas",
    city: "Pelotas",
    lat: -31.7183,
    lng: -52.3277,
    status: "pending"
  },
  {
    icao: "SBJU",
    name: "Aeroporto Regional Orlando Bezerra de Menezes",
    city: "Juazeiro do Norte",
    lat: -7.219,
    lng: -39.2701,
    status: "pending"
  },
  {
    icao: "SBCO",
    name: "Base Aérea de Canoas",
    city: "Canoas / Porto Alegre",
    lat: -29.9458,
    lng: -51.1444,
    status: "pending"
  },
  {
    icao: "SBSI",
    name: "Aeroporto de Sinop (Presidente João Figueiredo)",
    city: "Sinop",
    lat: -11.8847,
    lng: -55.5861,
    status: "pending"
  },
  {
    icao: "SBCZ",
    name: "Aeroporto Internacional de Cruzeiro do Sul",
    city: "Cruzeiro do Sul",
    lat: -7.5997,
    lng: -72.7697,
    status: "pending"
  },
  {
    icao: "SBCJ",
    name: "Aeroporto de Carajás",
    city: "Parauapebas",
    lat: -6.1158,
    lng: -50.0042,
    status: "pending"
  },
  {
    icao: "SBYS",
    name: "Base Aérea de Pirassununga (Campo Fontenelle)",
    city: "Pirassununga",
    lat: -21.9844,
    lng: -47.3392,
    status: "pending"
  },
  {
    icao: "SDCO",
    name: "Aeroporto de Sorocaba (Bertram Luiz Leupolz)",
    city: "Sorocaba",
    lat: -23.4797,
    lng: -47.4872,
    status: "pending"
  },
  {
    icao: "SBNM",
    name: "Aeroporto Regional de Santo Ângelo",
    city: "Santo Ângelo",
    lat: -28.2828,
    lng: -54.1689,
    status: "pending"
  },
  {
    icao: "SBMK",
    name: "Aeroporto Mario Ribeiro (Montes Claros)",
    city: "Montes Claros",
    lat: -16.7069,
    lng: -43.8189,
    status: "pending"
  },
  {
    icao: "SBJE",
    name: "Aeroporto Comandante Ariston Pessoa",
    city: "Jericoacoara / Cruz",
    lat: -2.9056,
    lng: -40.3589,
    status: "pending"
  },
  {
    icao: "SBIZ",
    name: "Aeroporto Prefeito Renato Moreira",
    city: "Imperatriz",
    lat: -5.5313,
    lng: -47.46,
    status: "pending"
  },
  {
    icao: "SBJA",
    name: "Aeroporto Regional de Jaguaruna",
    city: "Jaguaruna",
    lat: -28.6756,
    lng: -49.0664,
    status: "pending"
  },
  {
    icao: "SBAU",
    name: "Aeroporto Estadual de Araçatuba",
    city: "Araçatuba",
    lat: -21.1414,
    lng: -50.4247,
    status: "pending"
  },
  {
    icao: "SBUR",
    name: "Aeroporto Mario de Almeida Franco",
    city: "Uberaba",
    lat: -19.7647,
    lng: -47.9661,
    status: "pending"
  },
  {
    icao: "SBCN",
    name: "Aeroporto de Caldas Novas (Nelson Ribeiro Guimarães)",
    city: "Caldas Novas",
    lat: -17.7247,
    lng: -48.6103,
    status: "pending"
  },
  {
    icao: "SBSC",
    name: "Base Aérea de Santa Cruz",
    city: "Rio de Janeiro",
    lat: -22.9328,
    lng: -43.7189,
    status: "pending"
  },
  {
    icao: "SBBP",
    name: "Aeroporto Estadual de Bragança Paulista",
    city: "Bragança Paulista",
    lat: -22.9792,
    lng: -46.5372,
    status: "pending"
  },
  {
    icao: "SBST",
    name: "Aeroporto Base Aérea de Santos",
    city: "Guarujá / Santos",
    lat: -23.9278,
    lng: -46.2994,
    status: "pending"
  }
];
