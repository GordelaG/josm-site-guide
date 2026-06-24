/* airports.js — Dataset local de aeroportos brasileiros
   Busca instantânea sem depender de APIs externas.
   Fonte: dados públicos OSM/ANAC/Infraero
*/

window.AIRPORTS_BR = [
  // ── Sudeste ──
  { icao:"SBGR", name:"Aeroporto Internacional Governador André Franco Montoro", city:"Guarulhos / São Paulo", lat:-23.4356, lng:-46.4731 },
  { icao:"SBSP", name:"Aeroporto de Congonhas", city:"São Paulo", lat:-23.6261, lng:-46.6564 },
  { icao:"SBKP", name:"Aeroporto Internacional de Viracopos", city:"Campinas", lat:-23.0074, lng:-47.1345 },
  { icao:"SBGL", name:"RIOgaleão — Aeroporto Internacional Tom Jobim", city:"Rio de Janeiro", lat:-22.8099, lng:-43.2505 },
  { icao:"SBRJ", name:"Aeroporto Santos Dumont", city:"Rio de Janeiro", lat:-22.9105, lng:-43.1631 },
  { icao:"SBCF", name:"Aeroporto Internacional Tancredo Neves (Confins)", city:"Belo Horizonte", lat:-19.6244, lng:-43.9719 },
  { icao:"SBPR", name:"Aeroporto Carlos Prates (Pampulha)", city:"Belo Horizonte", lat:-19.8519, lng:-43.9506 },
  { icao:"SBVT", name:"Aeroporto Eurico de Aguiar Salles", city:"Vitória", lat:-20.2581, lng:-40.2869 },
  { icao:"SBJF", name:"Aeroporto Francisco de Assis", city:"Juiz de Fora", lat:-21.7912, lng:-43.3868 },
  { icao:"SBUR", name:"Aeroporto Mario de Almeida Franco", city:"Uberaba", lat:-19.7647, lng:-47.9661 },
  { icao:"SBUL", name:"Aeroporto Brigadeiro César Bombonato", city:"Uberlândia", lat:-18.8836, lng:-48.2253 },
  { icao:"SBMK", name:"Aeroporto Mario Ribeiro (Montes Claros)", city:"Montes Claros", lat:-16.7069, lng:-43.8189 },
  { icao:"SBIP", name:"Aeroporto Usiminas", city:"Ipatinga", lat:-19.4707, lng:-42.4876 },
  { icao:"SBRP", name:"Aeroporto Dr. Leite Lopes", city:"Ribeirão Preto", lat:-21.1363, lng:-47.7767 },
  { icao:"SBSR", name:"Aeroporto Prof. Eribelto Manoel Reino", city:"São José do Rio Preto", lat:-20.8167, lng:-49.4064 },
  { icao:"SBBU", name:"Aeroporto de Bauru / Arealva", city:"Bauru", lat:-22.3450, lng:-49.0537 },
  { icao:"SBAQ", name:"Aeroporto Bartolomeu de Gusmão", city:"Araraquara", lat:-21.8046, lng:-48.1394 },
  { icao:"SBST", name:"Aeroporto Base Aérea de Santos", city:"Guarujá / Santos", lat:-23.9278, lng:-46.2994 },
  { icao:"SBSJ", name:"Aeroporto Professor Urbano Ernesto Stumpf", city:"São José dos Campos", lat:-23.2292, lng:-45.8615 },
  { icao:"SBCM", name:"Aeroporto Regional de Criciúma", city:"Forquilhinha / Criciúma", lat:-28.7244, lng:-49.4214 },

  // ── Sul ──
  { icao:"SBPA", name:"Aeroporto Internacional Salgado Filho", city:"Porto Alegre", lat:-29.9944, lng:-51.1714 },
  { icao:"SBFL", name:"Aeroporto Internacional Hercílio Luz", city:"Florianópolis", lat:-27.6702, lng:-48.5525 },
  { icao:"SBCT", name:"Aeroporto Internacional Afonso Pena", city:"São José dos Pinhais / Curitiba", lat:-25.5285, lng:-49.1758 },
  { icao:"SBFI", name:"Aeroporto Internacional Cataratas", city:"Foz do Iguaçu", lat:-25.6003, lng:-54.4852 },
  { icao:"SBLO", name:"Aeroporto Governador José Richa", city:"Londrina", lat:-23.3336, lng:-51.1301 },
  { icao:"SBMG", name:"Aeroporto Regional de Maringá / Sílvio Name Júnior", city:"Maringá", lat:-23.4790, lng:-52.0162 },
  { icao:"SBCA", name:"Aeroporto de Cascavel", city:"Cascavel", lat:-25.0003, lng:-53.5010 },
  { icao:"SBPG", name:"Aeroporto Regional dos Campos Gerais", city:"Ponta Grossa", lat:-25.1847, lng:-50.1432 },
  { icao:"SBPK", name:"Aeroporto Internacional de Pelotas", city:"Pelotas", lat:-31.7183, lng:-52.3277 },
  { icao:"SBUG", name:"Aeroporto Internacional Rubem Berta", city:"Uruguaiana", lat:-29.7822, lng:-57.0382 },
  { icao:"SBJV", name:"Aeroporto de Joinville / Lauro Carneiro de Loyola", city:"Joinville", lat:-26.2245, lng:-48.7972 },
  { icao:"SBCH", name:"Aeroporto Serafin Enoss Bertaso", city:"Chapecó", lat:-27.1342, lng:-52.6562 },
  { icao:"SBNF", name:"Aeroporto Internacional Ministro Victor Konder", city:"Navegantes", lat:-26.8799, lng:-48.6514 },

  // ── Centro-Oeste ──
  { icao:"SBBR", name:"Aeroporto Internacional de Brasília (Presidente JK)", city:"Brasília", lat:-15.8711, lng:-47.9186 },
  { icao:"SBCY", name:"Aeroporto Internacional Marechal Rondon", city:"Várzea Grande / Cuiabá", lat:-15.6528, lng:-56.1167 },
  { icao:"SBCG", name:"Aeroporto Internacional de Campo Grande", city:"Campo Grande", lat:-20.4687, lng:-54.6725 },
  { icao:"SBDO", name:"Aeroporto de Dourados", city:"Dourados", lat:-22.2019, lng:-54.9267 },
  { icao:"SBPP", name:"Aeroporto Aquidauana / Ponta Porã", city:"Ponta Porã", lat:-22.5496, lng:-55.7026 },
  { icao:"SWKO", name:"Aeroporto de Rondonópolis", city:"Rondonópolis", lat:-16.5860, lng:-54.7248 },
  { icao:"SBGO", name:"Aeroporto Santa Genoveva", city:"Goiânia", lat:-16.6320, lng:-49.2207 },
  { icao:"SBBW", name:"Aeroporto de Barra do Garças", city:"Barra do Garças", lat:-15.8614, lng:-52.3892 },

  // ── Nordeste ──
  { icao:"SBSV", name:"Aeroporto Internacional Dep. Luís Eduardo Magalhães", city:"Salvador", lat:-12.9086, lng:-38.3225 },
  { icao:"SBRF", name:"Aeroporto Internacional do Recife / Guararapes (Gilberto Freyre)", city:"Recife", lat:-8.1265, lng:-34.9236 },
  { icao:"SBFZ", name:"Aeroporto Internacional Pinto Martins", city:"Fortaleza", lat:-3.7763, lng:-38.5326 },
  { icao:"SBNT", name:"Aeroporto Internacional Governador Aluízio Alves", city:"São Gonçalo do Amarante / Natal", lat:-5.9114, lng:-35.2477 },
  { icao:"SBMO", name:"Aeroporto Internacional Zumbi dos Palmares", city:"Rio Largo / Maceió", lat:-9.5109, lng:-35.7917 },
  { icao:"SBJP", name:"Aeroporto Internacional Presidente Castro Pinto", city:"Bayeux / João Pessoa", lat:-7.1459, lng:-34.9502 },
  { icao:"SBAR", name:"Aeroporto Santa Maria", city:"Aracaju", lat:-10.9840, lng:-37.0703 },
  { icao:"SBTE", name:"Aeroporto Senador Petrônio Portella", city:"Teresina", lat:-5.0599, lng:-42.8237 },
  { icao:"SBSL", name:"Aeroporto Internacional Marechal Cunha Machado", city:"São Luís", lat:-2.5854, lng:-44.2341 },
  { icao:"SBIL", name:"Aeroporto Jorge Amado", city:"Ilhéus", lat:-14.8160, lng:-39.0339 },
  { icao:"SBFE", name:"Aeroporto Internacional de Petrolina (Senador Nilo Coelho)", city:"Petrolina", lat:-9.3624, lng:-40.5691 },
  { icao:"SBJU", name:"Aeroporto Regional Orlando Bezerra de Menezes", city:"Juazeiro do Norte", lat:-7.2190, lng:-39.2701 },
  { icao:"SBPB", name:"Aeroporto Internacional de Parnaíba (Prefeito Dr. João Silva Filho)", city:"Parnaíba", lat:-2.8944, lng:-41.7320 },
  { icao:"SBCX", name:"Aeroporto Hugo Cantergiani", city:"Caxias do Sul", lat:-29.1971, lng:-51.1875 },
  { icao:"SBCI", name:"Aeroporto Carolina", city:"Carolina", lat:-7.3204, lng:-47.4589 },
  { icao:"SBIZ", name:"Aeroporto Prefeito Renato Moreira", city:"Imperatriz", lat:-5.5313, lng:-47.4600 },

  // ── Norte ──
  { icao:"SBMN", name:"Aeroporto Internacional Eduardo Gomes", city:"Manaus", lat:-3.0386, lng:-60.0497 },
  { icao:"SBBE", name:"Aeroporto Internacional Val de Cans (Júlio Cezar Ribeiro)", city:"Belém", lat:-1.3792, lng:-48.4762 },
  { icao:"SBBV", name:"Aeroporto Internacional Atlas Brasil Cantanhede", city:"Boa Vista", lat:2.8459, lng:-60.6922 },
  { icao:"SBMQ", name:"Aeroporto Internacional Alberto Alcolumbre", city:"Macapá", lat:0.0507, lng:-51.0722 },
  { icao:"SBRB", name:"Aeroporto Internacional Plácido de Castro", city:"Rio Branco", lat:-9.8699, lng:-67.8981 },
  { icao:"SBPV", name:"Aeroporto Internacional Governador Jorge Teixeira", city:"Porto Velho", lat:-8.7093, lng:-63.9023 },
  { icao:"SBVH", name:"Aeroporto de Vilhena", city:"Vilhena", lat:-12.6944, lng:-60.0983 },
  { icao:"SBMA", name:"Aeroporto João Correa da Rocha", city:"Marabá", lat:-5.3686, lng:-49.1380 },
  { icao:"SBSN", name:"Aeroporto Internacional de Santarém (Maestro Wilson Fonseca)", city:"Santarém", lat:-2.4247, lng:-54.7858 },
  { icao:"SBPV", name:"Aeroporto Governador Jorge Teixeira", city:"Porto Velho", lat:-8.7093, lng:-63.9023 },
  { icao:"SBTT", name:"Aeroporto de Tabatinga", city:"Tabatinga", lat:-4.2556, lng:-69.9358 },
  { icao:"SBCR", name:"Aeroporto de Corumbá", city:"Corumbá", lat:-19.0119, lng:-57.6714 },
  { icao:"SBMG", name:"Aeroporto Regional de Maringá", city:"Maringá", lat:-23.4790, lng:-52.0162 },

  // ── Internacionais próximos (referência) ──
  { icao:"SUAA", name:"Aeroporto Internacional de Carrasco (Montevidéu)", city:"Montevidéu, Uruguay", lat:-34.8384, lng:-56.0308 },
  { icao:"SAEZ", name:"Aeroporto Internacional Ministro Pistarini (Buenos Aires)", city:"Ezeiza, Argentina", lat:-34.8222, lng:-58.5358 },
  { icao:"SCEL", name:"Aeroporto Internacional Comodoro Arturo Merino Benítez", city:"Santiago, Chile", lat:-33.3930, lng:-70.7858 },
  { icao:"SEQM", name:"Aeroporto Internacional Mariscal Sucre", city:"Quito, Equador", lat:-0.1292, lng:-78.3575 },
  { icao:"SPJC", name:"Aeroporto Internacional Jorge Chávez", city:"Lima, Peru", lat:-12.0219, lng:-77.1143 },
  { icao:"SGAS", name:"Aeroporto Internacional Silvio Pettirossi", city:"Assunção, Paraguai", lat:-25.2400, lng:-57.5198 },
  { icao:"SBCY", name:"Aeroporto Internacional Marechal Rondon", city:"Cuiabá", lat:-15.6528, lng:-56.1167 },
];

/**
 * Busca rápida local por ICAO ou nome/cidade
 * @param {string} query
 * @returns {Array} lista de resultados (max 8)
 */
window.searchAirportsLocal = function(query) {
  const q = query.trim().toUpperCase();
  if (!q || q.length < 2) return [];

  const results = [];

  // 1. Busca exata por ICAO
  const exactICAO = window.AIRPORTS_BR.find(a => a.icao === q);
  if (exactICAO) return [exactICAO];

  // 2. ICAO começa com o query (ex: "SBG" → SBGR, SBGL...)
  const icaoPrefix = window.AIRPORTS_BR.filter(a => a.icao.startsWith(q));
  results.push(...icaoPrefix);

  // 3. Busca por nome / cidade (case-insensitive)
  const qLower = query.toLowerCase();
  const nameMatches = window.AIRPORTS_BR.filter(a => {
    if (icaoPrefix.includes(a)) return false; // já adicionado
    return (
      a.name.toLowerCase().includes(qLower) ||
      a.city.toLowerCase().includes(qLower) ||
      a.icao.includes(q)
    );
  });
  results.push(...nameMatches);

  // Deduplica e limita a 8
  const seen = new Set();
  return results.filter(a => {
    if (seen.has(a.icao)) return false;
    seen.add(a.icao);
    return true;
  }).slice(0, 8);
};
