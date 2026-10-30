// Every fact below comes from Britannica's "Major Events of 2026"
// (Amy Tikkanen & Britannica Editors, updated Oct. 28, 2026). Copy is
// reworded casually; numbers, names and dates are kept as published.

export const SOURCE = {
  title: 'Major Events of 2026',
  publisher: 'Encyclopaedia Britannica',
  authors: 'Amy Tikkanen & Britannica Editors',
  updated: 'Oct. 28, 2026',
  url: 'https://www.britannica.com/topic/Major-Events-of-2026',
}

export const CATEGORIES = [
  { id: 'world', label: 'World', color: '#ff3b1f' },
  { id: 'politics', label: 'Politics', color: '#ffb000' },
  { id: 'science', label: 'Space & Science', color: '#4fc3ff' },
  { id: 'culture', label: 'Culture', color: '#ff5fa2' },
  { id: 'sports', label: 'Sports', color: '#9dff4f' },
  { id: 'money', label: 'Money', color: '#c8a2ff' },
]

const P = {
  nyc: [40.71, -74.01], caracas: [10.49, -66.88], tehran: [35.69, 51.39], minneapolis: [44.98, -93.27],
  dc: [38.9, -77.04], milan: [45.46, 9.19], santaClara: [37.4, -121.97], canterbury: [51.28, 1.08],
  kennedy: [28.57, -80.65], budapest: [47.5, 19.04], kolkata: [22.57, 88.36], abuDhabi: [24.45, 54.38],
  louisville: [38.2, -85.77], mongbwalu: [1.95, 30.03], indy: [39.79, -86.23], vatican: [41.9, 12.45],
  barcelona: [41.4, 2.17], catia: [10.6, -67.03], chicago: [41.78, -87.58], philly: [39.95, -75.15],
  eastRutherford: [40.81, -74.07], london: [51.5, -0.13], wimbledon: [51.43, -0.21], paris: [48.87, 2.3],
  spainNorth: [42.6, -5.6], devighat: [27.88, 85.15], oslo: [59.91, 10.75], stockholm: [59.33, 18.07],
  brasilia: [-15.79, -47.88], jerusalem: [31.77, 35.21], milwaukee: [43.04, -87.91],
}

export const EVENTS = [
  // January
  { id: 'mamdani', date: '2026-01-01', cat: 'politics', loc: P.nyc, place: 'New York City', img: 'mamdani',
    title: 'NYC gets a democratic socialist mayor',
    body: 'Zohran Mamdani, a self-described democratic socialist, is sworn in as mayor of New York City.' },
  { id: 'maduro', date: '2026-01-03', cat: 'world', loc: P.caracas, place: 'Venezuela', serious: true,
    title: 'U.S. military captures Nicolás Maduro',
    body: 'During a large-scale attack on Venezuela, the U.S. military captures Pres. Nicolás Maduro and his wife, Cilia Flores. They’re flown to the U.S., where Maduro is charged with crimes including narco-terrorism and cocaine trafficking.' },
  { id: 'iran-protests', date: '2026-01-08', cat: 'world', loc: P.tehran, place: 'Iran', serious: true,
    title: 'Iran’s deadliest crackdown since 1979',
    body: 'Iranian forces crack down on nationwide protests amid an economic crisis — the deadliest repression since the Islamic Republic took power in 1979, with death tolls estimated between 12,000 and 30,000.' },
  { id: 'minneapolis', date: '2026-01-24', cat: 'politics', loc: P.minneapolis, place: 'Minneapolis', serious: true,
    title: 'Fatal shooting amid ICE unrest',
    body: 'American nurse Alex Jeffrey Pretti is fatally shot by federal officials in Minneapolis, amid growing unrest over ICE deployments in Minnesota — only weeks after Renee Nicole Macklin Good was fatally shot by an ICE agent.' },
  { id: 'epstein', date: '2026-01-30', cat: 'politics', loc: P.dc, place: 'Washington, D.C.',
    title: '3 million pages of Epstein files drop',
    body: 'The U.S. Department of Justice releases more than three million pages that are part of the Epstein files.' },

  // February
  { id: 'kendrick', date: '2026-02-01', cat: 'culture', img: 'kendrick',
    title: 'Kendrick becomes hip-hop’s Grammy king',
    body: 'Kendrick Lamar wins 5 awards, bringing his total to 27 — the most Grammys ever for a hip-hop artist.' },
  { id: 'olympics', date: '2026-02-06', dateLabel: 'Feb 6–22', cat: 'sports', loc: P.milan, place: 'Milan & Cortina d’Ampezzo', img: 'olympics',
    title: 'Norway goes absolutely nuts at the Winter Olympics',
    body: 'At Milano Cortina, Norway claims a record-setting 41 medals. Cross-country skier Johannes Høsflot Klæbo wins six golds — the most ever at a single Winter Olympics.' },
  { id: 'superbowl', date: '2026-02-08', cat: 'sports', loc: P.santaClara, place: 'Super Bowl LX', img: 'badbunny',
    title: 'Seahawks win it all, Bad Bunny makes history',
    body: 'The Seattle Seahawks beat the New England Patriots 29–13 for their second Super Bowl title. Bad Bunny headlines the first halftime show performed primarily in Spanish.' },
  { id: 'iran-war', date: '2026-02-28', cat: 'world', loc: P.tehran, place: 'Iran', serious: true,
    title: 'The U.S. and Israel attack Iran',
    body: 'The United States and Israel launch an attack on Iran, which retaliates with its own strikes. The first weeks leave thousands dead — including Supreme Leader Ali Khamenei — and millions displaced, while upending the world economy.' },

  // March
  { id: 'oscars', date: '2026-03-15', cat: 'culture',
    title: '“One Battle After Another” takes best picture',
    body: 'Paul Thomas Anderson’s film wins six Oscars. “Sinners,” with a record 16 nominations, wins four — including best original screenplay for Ryan Coogler and best actor for Michael B. Jordan.' },
  { id: 'mullally', date: '2026-03-25', cat: 'world', loc: P.canterbury, place: 'Canterbury', img: 'mullally',
    title: 'First woman archbishop of Canterbury',
    body: 'Sarah Mullally is formally installed as the archbishop of Canterbury, the first woman to hold the post.' },

  // April
  { id: 'artemis', date: '2026-04-01', cat: 'science', loc: P.kennedy, place: 'Kennedy Space Center', img: 'artemis', feature: true,
    title: 'Humans go back to the Moon (well, around it)',
    body: 'Artemis II launches — the first crewed flight to the Moon since 1972. The crew sets a record for the farthest humans have ever traveled from Earth: 252,756 miles (406,771 km). They splash home on April 10.' },
  { id: 'india', date: '2026-05-04', dateLabel: 'Apr 9 – May 4', cat: 'politics', loc: P.kolkata, place: 'India',
    title: 'India’s state elections flip three governments',
    body: 'The BJP unseats Mamata Banerjee’s Trinamool Congress in West Bengal, actor Vijay makes a blockbuster political debut in Tamil Nadu, and Kerala votes out a communist-led coalition.' },
  { id: 'orban', date: '2026-04-12', cat: 'politics', loc: P.budapest, place: 'Hungary', img: 'magyar',
    title: 'Orbán is out in Hungary',
    body: 'Viktor Orbán is defeated in Hungary’s general elections amid corruption allegations and frustration with his right-wing populist government. Péter Magyar succeeds him on May 9.' },
  { id: 'michael', date: '2026-04-24', cat: 'culture',
    title: '“Michael” moonwalks past $600M',
    body: 'The Michael Jackson biopic hits U.S. theaters and becomes the second highest-grossing music biopic ever, earning more than $600 million worldwide.' },

  // May
  { id: 'opec', date: '2026-05-01', cat: 'money', loc: P.abuDhabi, place: 'United Arab Emirates',
    title: 'The UAE quits OPEC',
    body: 'The United Arab Emirates withdraws from OPEC, the organization set up to coordinate its members’ petroleum policies.' },
  { id: 'derby', date: '2026-05-02', cat: 'sports', loc: P.louisville, place: 'Kentucky Derby',
    title: 'Golden Tempo makes Derby history',
    body: 'Golden Tempo wins the Kentucky Derby — the first winner ever trained by a woman, Cherie DeVaux.' },
  { id: 'ebola', date: '2026-05-17', cat: 'world', loc: P.mongbwalu, place: 'DR Congo & Uganda', serious: true,
    title: 'WHO declares an Ebola emergency',
    body: 'The WHO declares a public health emergency amid a growing Ebola outbreak in the Democratic Republic of the Congo and Uganda.' },
  { id: 'indy', date: '2026-05-24', cat: 'sports', loc: P.indy, place: 'Indianapolis',
    title: 'The Indy 500 is decided by 0.0233 seconds',
    body: 'In the closest finish in the race’s history, Sweden’s Felix Rosenqvist edges out David Malukas to win the Indianapolis 500.' },
  { id: 'encyclical', date: '2026-05-25', cat: 'science', loc: P.vatican, place: 'Vatican City', img: 'pope',
    title: 'The Pope writes 42,300 words about AI',
    body: 'Pope Leo XIV releases his first encyclical, “Magnifica humanitas,” warning about the risks of AI and its potential to harm humanity — especially workers.' },

  // June
  { id: 'gaudi', date: '2026-06-10', cat: 'culture', loc: P.barcelona, place: 'Barcelona', img: 'sagrada',
    title: 'Sagrada Família’s tower of Jesus gets blessed',
    body: 'Pope Leo XIV blesses the basilica’s tower of Jesus, in festivities that also mark 100 years since the death of its architect, Antoni Gaudí.' },
  { id: 'spacex', date: '2026-06-12', cat: 'money',
    title: 'SpaceX IPO mints the first trillionaire',
    body: 'SpaceX raises a record $75 billion in its IPO, valuing the company at $1.77 trillion — and making CEO Elon Musk the world’s first trillionaire.' },
  { id: 'knicks', date: '2026-06-13', cat: 'sports', loc: P.nyc, place: 'New York City', img: 'knicks',
    title: 'The Knicks are champions. Yes, really.',
    body: 'The New York Knicks beat the San Antonio Spurs in five games for the franchise’s third NBA title. Jalen Brunson is named Finals MVP.' },
  { id: 'ufc', date: '2026-06-14', cat: 'sports', loc: P.dc, place: 'The White House',
    title: 'A UFC card on the White House lawn',
    body: 'UFC Freedom 250 is held on the South Lawn of the White House — attended by Pres. Donald Trump, whose 80th birthday is that same day.' },
  { id: 'obama', date: '2026-06-19', cat: 'culture', loc: P.chicago, place: 'Chicago', img: 'obama',
    title: 'The Obama Presidential Center opens',
    body: 'The sprawling Chicago complex, centered on a museum dedicated to the 44th U.S. president, opens to the public.' },
  { id: 'quake', date: '2026-06-24', cat: 'world', loc: P.catia, place: 'Northwestern Venezuela', serious: true,
    title: 'Twin earthquakes strike Venezuela',
    body: 'Earthquakes of magnitude 7.2 and 7.5 hit northwestern Venezuela, toppling more than 100 buildings. Some 1,430 people are confirmed dead, with thousands more missing.' },

  // July
  { id: 'swift', date: '2026-07-03', cat: 'culture', loc: P.nyc, place: 'Madison Square Garden', img: 'swift',
    title: 'Taylor Swift & Travis Kelce tie the knot',
    body: 'The pop sensation and the football star get married at Madison Square Garden. About 1,000 guests attend while thousands of fans gather outside.' },
  { id: 'usa250', date: '2026-07-04', cat: 'world', loc: P.philly, place: 'Philadelphia', img: 'usa250',
    title: 'America turns 250',
    body: 'The U.S. celebrates its semiquincentennial. A time capsule with materials from all three branches of government, the states and territories is buried in Philadelphia.' },
  { id: 'sinner', date: '2026-07-12', cat: 'sports', loc: P.wimbledon, place: 'Wimbledon', img: 'sinner',
    title: 'Sinner defends Wimbledon',
    body: 'Italy’s Jannik Sinner beats Germany’s Alexander Zverev in four sets to defend his Wimbledon singles title.' },
  { id: 'odyssey', date: '2026-07-17', cat: 'culture',
    title: 'Nolan’s “The Odyssey” sails into theaters',
    body: 'Christopher Nolan’s take on Homer’s epic hits U.S. theaters, starring Matt Damon, Tom Holland, Zendaya, Robert Pattinson and Anne Hathaway.' },
  { id: 'worldcup', date: '2026-07-19', cat: 'sports', loc: P.eastRutherford, place: 'FIFA World Cup final', img: 'spain', feature: true,
    title: 'Spain are world champions',
    body: 'Spain beats Argentina 1–0 in extra time to win the 2026 FIFA World Cup. A day earlier, England took third after beating France 6–4.' },
  { id: 'burnham', date: '2026-07-20', cat: 'politics', loc: P.london, place: 'London',
    title: 'Andy Burnham becomes UK prime minister',
    body: 'Days after being elected Labour leader, Andy Burnham replaces Keir Starmer as prime minister of the United Kingdom.' },
  { id: 'pogacar', date: '2026-07-26', cat: 'sports', loc: P.paris, place: 'Tour de France', img: 'pogacar',
    title: 'Pogačar wins Tour No. 5',
    body: 'Slovenia’s Tadej Pogačar wins the Tour de France for a record-tying fifth time.' },

  // August
  { id: 'eclipse', date: '2026-08-12', cat: 'science', loc: P.spainNorth, place: 'Greenland → Spain', img: 'eclipse',
    title: 'Total solar eclipse over Europe',
    body: 'A total solar eclipse passes over Greenland, Iceland, Portugal and northern Spain.' },
  { id: 'nepal', date: '2026-08-26', cat: 'world', loc: P.devighat, place: 'Nepal & Tibet', serious: true,
    title: 'Glacier collapse triggers deadly floods',
    body: 'The collapse of a glacier triggers flash flooding in Nepal and Tibet, causing widespread devastation and killing hundreds.' },
  { id: 'haakon', date: '2026-08-28', cat: 'world', loc: P.oslo, place: 'Oslo', img: 'haakon',
    title: 'Norway has a new king',
    body: 'Haakon VIII becomes king of Norway after the death of his father, Harald V. Mette-Marit becomes queen.' },
  { id: 'tupac', date: '2026-08-31', cat: 'culture',
    title: 'Guilty verdict in Tupac’s murder',
    body: 'Duane “Keffe D” Davis is found guilty of first-degree murder for orchestrating the 1996 killing of Tupac Shakur.' },

  // September
  { id: 'nine-eleven', date: '2026-09-11', cat: 'world', loc: P.nyc, place: 'United States', serious: true,
    title: '25 years since 9/11',
    body: 'The 25th anniversary of the September 11 attacks is marked with ceremonies across the United States.' },
  { id: 'usopen', date: '2026-09-13', dateLabel: 'Sep 12–13', cat: 'sports', loc: [40.75, -73.85], place: 'U.S. Open',
    title: 'Rybakina and Zverev rule the U.S. Open',
    body: 'Kazakhstan’s Elena Rybakina beats Aryna Sabalenka for the women’s title; a day later Germany’s Alexander Zverev beats Ben Shelton for the men’s.' },
  { id: 'emmys', date: '2026-09-14', cat: 'culture',
    title: '“Widow’s Bay” sweeps the Emmys',
    body: '“Widow’s Bay” wins 14 Emmys, including best comedy and best lead actor for Matthew Rhys. “The Pitt” wins best drama, and Jean Smart and Allison Janney tie the record for most acting Emmys.' },

  // October
  { id: 'nobel', date: '2026-10-05', dateLabel: 'Oct 5–12', cat: 'culture', loc: P.stockholm, place: 'Stockholm & Oslo',
    title: 'Nobel season: Anne Carson & Navi Pillay',
    body: 'The Nobel Prizes are announced. Notable winners include Anne Carson for literature and Navi Pillay for peace.' },
  { id: 'lula', date: '2026-10-25', cat: 'politics', loc: P.brasilia, place: 'Brazil', img: 'lula',
    title: 'Lula wins Brazil’s runoff',
    body: 'Incumbent Pres. Luiz Inácio Lula da Silva defeats Flávio Bolsonaro in Brazil’s presidential runoff.' },
  { id: 'kane', date: '2026-10-26', cat: 'sports', loc: P.paris, place: 'Ballon d’Or', img: 'kane',
    title: 'Harry Kane finally gets his Ballon d’Or',
    body: 'England’s Harry Kane wins his first Ballon d’Or, and Spain’s Alexia Putellas claims her third Ballon d’Or Féminin.' },
  { id: 'israel', date: '2026-10-27', cat: 'politics', loc: P.jerusalem, place: 'Israel',
    title: 'Israel votes — and nobody gets a majority',
    body: 'Early results show neither Benjamin Netanyahu’s bloc nor Gadi Eisenkot’s bloc secured a Knesset majority, so both need extra support to form a government.' },
  { id: 'brewers', date: '2026-10-28', cat: 'sports', loc: P.milwaukee, place: 'Milwaukee', img: 'brewers',
    title: 'The Brewers win their first World Series',
    body: 'The Milwaukee Brewers beat the Tampa Bay Rays in five games for the franchise’s first-ever World Series title.' },
].sort((a, b) => a.date.localeCompare(b.date))

export const NUMBERS = [
  { value: 252756, prefix: '', suffix: ' mi', label: 'Farthest humans have ever traveled from Earth (Artemis II)' },
  { value: 1.77, prefix: '$', suffix: 'T', decimals: 2, label: 'SpaceX’s valuation after a record $75B IPO' },
  { value: 0.0233, prefix: '', suffix: 's', decimals: 4, label: 'Winning margin at the Indy 500 — the closest ever' },
  { value: 27, prefix: '', suffix: '', label: 'Grammys for Kendrick Lamar, the most by any hip-hop artist' },
  { value: 41, prefix: '', suffix: '', label: 'Medals for Norway at Milano Cortina — a Winter Olympics record' },
  { value: 3, prefix: '', suffix: 'M+', label: 'Pages of Epstein files released by the DOJ' },
  { value: 16, prefix: '', suffix: '', label: 'Oscar nominations for “Sinners” — a new record' },
  { value: 250, prefix: '', suffix: '', label: 'Birthday candles for the United States' },
]

export const UPCOMING = [
  { id: 'midterms', date: '2026-11-03T00:00:00', title: 'U.S. midterms', body: 'Control of the Senate and the House of Representatives is on the line.' },
  { id: 'route66', date: '2026-11-11T00:00:00', title: 'Route 66 turns 100', body: 'The iconic U.S. highway celebrates the 100th anniversary of its opening.', img: 'route66' },
]

export const fmtDate = (e) =>
  e.dateLabel || new Date(e.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
