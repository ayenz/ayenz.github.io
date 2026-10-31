// Photos live in ./photos named month-index: 01-1.jpg, 01-2.jpg, 02-1.jpg …
// (a plain 03.jpg also works). Resized, metadata stripped, plates blurred.
const files = import.meta.glob('./photos/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' })
const photosFor = (n) =>
  Object.keys(files)
    .map((f) => ({ f, m: f.match(/\/(\d{2})(?:-(\d+))?[^/]*\.\w+$/) }))
    .filter(({ m }) => m && m[1] === n)
    .map(({ f, m }) => ({ key: `${n}-${m[2] || 1}`, k: Number(m[2] || 1), src: files[f] }))
    .sort((a, b) => a.k - b.k)

// Per-photo caption + place. place / loc are city-level only (never exact coordinates).
const PHOTOS = {
  '01-1': { caption: 'Darmstadt bois, reunited (and fed)', place: 'West Jakarta', loc: [-6.19, 106.77] },
  '01-2': { caption: 'Me & bro, suited up', place: 'South Jakarta', loc: [-6.29, 106.8] },
  '01-3': { caption: 'Support pillars, CNY edition', place: 'Bandar Lampung', loc: [-5.39, 105.29] },
  '01-4': { caption: 'Support pillars, round two (dragon included)' },
  '02-1': { place: 'West Jakarta', loc: [-6.18, 106.79] },
  '03-1': { caption: 'The office we didn’t get. Lmao.', place: 'South Jakarta', loc: [-6.28, 106.82] },
  '03-2': { caption: 'Coffee time with the fam', place: 'South Jakarta', loc: [-6.24, 106.78] },
  '04-1': { place: 'North Jakarta', loc: [-6.1, 106.74] },
  '05-1': { place: 'South Jakarta', loc: [-6.24, 106.78] },
  '06-1': { place: 'Bogor', loc: [-6.58, 106.88] },
  '07-1': { place: 'Tangerang', loc: [-6.3, 106.64] },
  '08-1': { place: 'South Jakarta', loc: [-6.22, 106.81] },
  '09-1': { place: 'South Jakarta', loc: [-6.24, 106.77] },
  '10-1': { place: 'North Jakarta', loc: [-6.07, 106.7] },
  '11-1': { place: 'South Jakarta', loc: [-6.28, 106.81] },
  '12-1': { place: 'South Jakarta', loc: [-6.27, 106.82] },
}

const MONTHS = [
  { m: 'Jan', tag: 'reunions', title: 'January, fully booked',
    body: 'Four frames, four reunions: the Darmstadt bois, a suited-up night with bro, and two rounds of Chinese New Year with my support pillars.' },
  { m: 'Feb', tag: 'date', title: 'Swiped right, showed up',
    body: 'First date from a dating app. Pizza, a spritz, and surprisingly few awkward silences. (Okay, maybe one.)' },
  { m: 'Mar', tag: 'coffee', title: 'Plot twists & flat whites',
    body: 'The shiny new office was almost done — turns out we didn’t get picked to move in. Lmao. Coffee with the fam fixed it.' },
  { m: 'Apr', tag: 'family', title: 'My whole world',
    body: 'Some photos don’t need a fancy caption. This one is just my world, posing next to the car like absolute pros.' },
  { m: 'May', tag: 'tech', title: 'New phone, same best friend',
    body: 'Upgraded the iPhone, kept the best friend. The peace sign was not optional.' },
  { m: 'Jun', tag: 'nightout', title: 'Bar & chill',
    body: 'Twin-bottle specials, warm lights and zero plans for the rest of the night. June knew exactly what it was doing.' },
  { m: 'Jul', tag: 'cars', title: 'Window shopping, car edition',
    body: 'Walked the whole auto show pretending I could afford at least one of them. The lights were free, at least.' },
  { m: 'Aug', tag: 'work', title: 'Lanyard on, chandelier mode',
    body: 'Work event, badge scanned, staring at a chandelier the size of my apartment. Corporate glow-up unlocked.' },
  { m: 'Sep', tag: 'birthday', title: 'Sista’s birthday',
    body: 'A dozen donuts, one birthday girl, and bro standing guard right beside her.' },
  { m: 'Oct', tag: 'coffee', title: 'Found a noice coffee shop',
    body: 'Clean lines, good beans, very minimalist. Ordered the most basic drink and still felt cool.' },
  { m: 'Nov', tag: 'food', title: 'Nothing beats Pagi Sore',
    body: 'Every plate on the table, no regrets, no leftovers. Nothing beats Pagi Sore. Nothing.' },
  { m: 'Dec', tag: 'food', title: 'Pizza with a view',
    body: 'Closed the year with a slice, a lawn and a whole lot of green. Not a bad last frame for the roll.' },
]

export const months = MONTHS.map((x, i) => {
  const n = String(i + 1).padStart(2, '0')
  const photos = photosFor(n).map((p) => ({ ...p, ...PHOTOS[p.key] }))
  const firstLoc = photos.find((p) => p.loc)
  return {
    title: 'Still in the darkroom',
    body: 'This frame hasn’t been developed yet. Check back soon.',
    ...x,
    n,
    photos,
    photo: photos[0]?.src || null,
    place: firstLoc?.place || null,
    loc: firstLoc?.loc || null,
  }
})

// Every print in order, each knowing its month — what the desk deals and the lightbox steps through.
export const prints = months.flatMap((mo, mi) =>
  mo.photos.map((p, pi) => ({
    ...p,
    mi,
    m: mo.m,
    n: mo.n,
    title: mo.title,
    body: mo.body,
    of: mo.photos.length,
    pi,
    caption: p.caption || mo.title,
  })),
)
