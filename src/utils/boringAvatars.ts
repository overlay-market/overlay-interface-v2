export function getRandomColors() {
  const colorSets = [
    ['#edb7d1', '#fca3b9', '#f6e8ff', '#fde1b2', '#ecc848'],
  ['#edb2fb', '#fcf6bd', '#ccdbfd', '#a1defe', '#abc4ff'],
  ['#e8adc5', '#fce1e4', '#aca4dd', '#ddedea', '#dada76'],
  ['#d3ab9e', '#d1c9a1', '#ebd8d0', '#dffbaa', '#feda7c'],
  ['#f08080', '#da978e', '#d8ad9d', '#7bc4ab', '#ffdab9'],
  ['#a7bed3', '#c6e2e9', '#f1ffc4', '#ffcaaf', '#dab894'],
  ['#edede9', '#d6a4c2', '#f5ebe0', '#a3d57a', '#d5bdaf'],
  ['#ccd5ae', '#c9edc9', '#9deded', '#faedcd', '#d4a373'],
  ]
  return colorSets[Math.floor(Math.random() * colorSets.length)]
}

export function getRandomName() {
  const names = [
    'Mary Baker',
    'Maya Angelou',
    'Mary Edwards',
    'Carrie Chapman',
    'Elizabeth Cady',
    'Felisa Rincon',
    'Wilma Rudolph',
    'Betty Ford',
    'Grace Hopper',
    'Chien-Shiung',
    'Queen Lili',
    'Nellie Bly',
  ]
  return names[Math.floor(Math.random() * names.length)]
}