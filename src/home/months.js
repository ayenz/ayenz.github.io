// Photos live in ./photos named by month number: 01.jpg … 10.jpg
// (resized, metadata stripped). Missing months show a gradient placeholder.
const files = import.meta.glob('./photos/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' })
const photoFor = (n) => {
  const key = Object.keys(files).find((f) => f.match(/\/(\d{2})\.\w+$/)?.[1] === n)
  return key ? files[key] : null
}

// place / loc: city-level only (read from photo GPS, never exact coordinates)
const MONTHS = [
  { m: 'Jan', loc: [39.91, 116.46], place: 'Beijing', hue: 80, tag: 'travel', title: 'Main character in Beijing',
    body: 'Kicked off the year in Beijing doing my best album-cover pose. The trees were bare. The drip was not.' },
  { m: 'Feb', loc: [-5.45, 105.27], place: 'Bandar Lampung', hue: 340, tag: 'family', title: 'Gong Xi Fa Cai, family edition',
    body: 'Red outfits: coordinated. Cherry blossoms: fake but fabulous. Angpao count: strictly classified.' },
  { m: 'Mar', loc: [-6.24, 106.63], place: 'Tangerang', hue: 30, tag: 'snacks', title: 'The cookie box era',
    body: 'March was basically cookies in very aesthetic boxes. Was I hungry or just vibing? Yes.' },
  { m: 'Apr', loc: [-4.13, 104.17], place: 'Baturaja', hue: 150, tag: 'tradition', title: 'Qing Ming with the crew',
    body: 'Showed up for the ancestors with the whole squad — incense lit, offerings set, sun hats on. Plus one selfie for the family archive.' },
  { m: 'May', loc: [-6.26, 106.81], place: 'South Jakarta', hue: 40, tag: 'food', title: 'Carbs & caffeine',
    body: 'Noodles topped with roast pork, iced coffee on the side. May’s official diet plan, and I stuck to it religiously.' },
  { m: 'Jun', loc: [-6.25, 106.78], place: 'South Jakarta', hue: 200, tag: 'newtoy', title: 'Osmo Pocket, episode one',
    body: 'Got a tiny camera and instantly became a vlogger. Content: pending. Confidence: already in 4K.' },
  { m: 'Jul', loc: [-6.26, 106.81], place: 'South Jakarta', hue: 260, tag: 'ride', title: 'New ride unlocked',
    body: 'Meet the N-Max. Black, sleek, and honestly better at parallel parking than me.' },
  { m: 'Aug', loc: [-6.24, 106.63], place: 'Tangerang', hue: 220, tag: 'squad', title: 'Me and the bois',
    body: 'Squad outing, mid-crisis: staring at the menu board like it’s a final exam. We ordered everything anyway.' },
  { m: 'Sep', loc: [-6.25, 106.78], place: 'South Jakarta', hue: 320, tag: 'birthday', title: 'Sista’s birthday',
    body: 'Gift bag reveal in progress. The family photobombed from the corner of the frame, as tradition demands.' },
  { m: 'Oct', loc: [-6.26, 106.81], place: 'South Jakarta', hue: 10, tag: 'treatyourself', title: 'Ending on a pizza note',
    body: 'Prosciutto, arugula and a pink cocktail. October said “treat yourself” and I said “okay, fine.”' },
]

export const months = MONTHS.map((x, i) => {
  const n = String(i + 1).padStart(2, '0')
  return {
    ...x,
    n,
    photo: photoFor(n),
  }
})
