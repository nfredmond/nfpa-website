export type CensusSource = {
  label: string
  dataset: string
  vintage: string
  geography: string
  url: string
}

type CensusSnapshot = {
  geographyLabel: string
  population: number | null
  medianHouseholdIncome: number | null
  medianAge: number | null
  povertyRatePercent: number | null
  stateFips: string
  countyFips?: string
}

const ACS_VINTAGE = '2023'
const ACS_DATASET = 'ACS 5-year'
const ACS_ENDPOINT = `https://api.census.gov/data/${ACS_VINTAGE}/acs/acs5`
const ACS_VARIABLES = 'NAME,B01003_001E,B19013_001E,B01002_001E,B17001_001E,B17001_002E'

const STATE_ABBR_TO_FIPS: Record<string, string> = {
  AL: '01',
  AK: '02',
  AZ: '04',
  AR: '05',
  CA: '06',
  CO: '08',
  CT: '09',
  DE: '10',
  DC: '11',
  FL: '12',
  GA: '13',
  HI: '15',
  ID: '16',
  IL: '17',
  IN: '18',
  IA: '19',
  KS: '20',
  KY: '21',
  LA: '22',
  ME: '23',
  MD: '24',
  MA: '25',
  MI: '26',
  MN: '27',
  MS: '28',
  MO: '29',
  MT: '30',
  NE: '31',
  NV: '32',
  NH: '33',
  NJ: '34',
  NM: '35',
  NY: '36',
  NC: '37',
  ND: '38',
  OH: '39',
  OK: '40',
  OR: '41',
  PA: '42',
  RI: '44',
  SC: '45',
  SD: '46',
  TN: '47',
  TX: '48',
  UT: '49',
  VT: '50',
  VA: '51',
  WA: '53',
  WV: '54',
  WI: '55',
  WY: '56',
}

const STATE_NAME_TO_FIPS: Record<string, string> = {
  alabama: '01',
  alaska: '02',
  arizona: '04',
  arkansas: '05',
  california: '06',
  colorado: '08',
  connecticut: '09',
  delaware: '10',
  'district of columbia': '11',
  florida: '12',
  georgia: '13',
  hawaii: '15',
  idaho: '16',
  illinois: '17',
  indiana: '18',
  iowa: '19',
  kansas: '20',
  kentucky: '21',
  louisiana: '22',
  maine: '23',
  maryland: '24',
  massachusetts: '25',
  michigan: '26',
  minnesota: '27',
  mississippi: '28',
  missouri: '29',
  montana: '30',
  nebraska: '31',
  nevada: '32',
  'new hampshire': '33',
  'new jersey': '34',
  'new mexico': '35',
  'new york': '36',
  'north carolina': '37',
  'north dakota': '38',
  ohio: '39',
  oklahoma: '40',
  oregon: '41',
  pennsylvania: '42',
  'rhode island': '44',
  'south carolina': '45',
  'south dakota': '46',
  tennessee: '47',
  texas: '48',
  utah: '49',
  vermont: '50',
  virginia: '51',
  washington: '53',
  'west virginia': '54',
  wisconsin: '55',
  wyoming: '56',
}

function parseNullableNumber(value: unknown): number | null {
  if (typeof value !== 'string' && typeof value !== 'number') return null
  const n = Number(value)
  if (!Number.isFinite(n) || n < 0) return null
  return n
}

function formatInt(value: number | null): string {
  if (value == null) return 'Not available'
  return value.toLocaleString('en-US')
}

function formatMoney(value: number | null): string {
  if (value == null) return 'Not available'
  return `$${value.toLocaleString('en-US')}`
}

function formatPercent(value: number | null): string {
  if (value == null) return 'Not available'
  return `${value.toFixed(1)}%`
}

function hasCensusIntent(query: string): boolean {
  return /\b(census|acs|american community survey|demograph|population|median income|poverty|household income|age distribution|income data)\b/i.test(
    query
  )
}

function detectStateFips(query: string): string {
  const lower = query.toLowerCase()

  for (const [name, fips] of Object.entries(STATE_NAME_TO_FIPS)) {
    if (lower.includes(name)) return fips
  }

  const abbrMatch = query.match(/\b([A-Z]{2})\b/)
  if (abbrMatch) {
    const fips = STATE_ABBR_TO_FIPS[abbrMatch[1].toUpperCase()]
    if (fips) return fips
  }

  // Nationwide default: if no explicit state is detected, fall back to U.S.-level context.
  return 'us'
}

function detectCounty(query: string): string | null {
  const match = query.match(/(?:^|,|\b(?:in|for|of|at|near|within)\s+)([A-Za-z][A-Za-z\s'\.-]+?)\s+County\b/i)
  if (!match) return null
  return match[1].trim().toLowerCase()
}

function normalizeCountyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/ county,.*$/i, '')
    .replace(/ county$/i, '')
    .replace(/[^a-z\s'\.-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function buildCensusUrl(forClause: string, inClause?: string): string {
  const key = process.env.CENSUS_API_KEY
  const params = new URLSearchParams({
    get: ACS_VARIABLES,
    for: forClause,
  })

  if (inClause) {
    params.set('in', inClause)
  }

  if (key) {
    params.set('key', key)
  }

  return `${ACS_ENDPOINT}?${params.toString()}`
}

async function fetchCensusRows(url: string): Promise<string[][] | null> {
  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  })

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as unknown
  if (!Array.isArray(data) || data.length < 2) {
    return null
  }

  return data as string[][]
}

function toSnapshot(row: string[], stateFips: string, countyFips?: string): CensusSnapshot | null {
  if (row.length < 6) return null

  const name = row[0]
  const population = parseNullableNumber(row[1])
  const medianIncome = parseNullableNumber(row[2])
  const medianAge = parseNullableNumber(row[3])
  const povertyUniverse = parseNullableNumber(row[4])
  const povertyCount = parseNullableNumber(row[5])

  const povertyRatePercent =
    povertyUniverse && povertyCount != null && povertyUniverse > 0 ? (povertyCount / povertyUniverse) * 100 : null

  return {
    geographyLabel: name,
    population,
    medianHouseholdIncome: medianIncome,
    medianAge,
    povertyRatePercent,
    stateFips,
    countyFips,
  }
}

async function fetchCountySnapshot(stateFips: string, countyName: string): Promise<CensusSnapshot | null> {
  const url = buildCensusUrl('county:*', `state:${stateFips}`)
  const rows = await fetchCensusRows(url)
  if (!rows) return null

  const bodyRows = rows.slice(1)
  const normalizedTarget = normalizeCountyName(countyName)

  for (const row of bodyRows) {
    const name = normalizeCountyName(row[0] ?? '')
    if (name === normalizedTarget || name.includes(normalizedTarget) || normalizedTarget.includes(name)) {
      const countyFips = row[7]
      return toSnapshot(row, stateFips, countyFips)
    }
  }

  return null
}

async function fetchStateSnapshot(stateFips: string): Promise<CensusSnapshot | null> {
  const url = buildCensusUrl(`state:${stateFips}`)
  const rows = await fetchCensusRows(url)
  if (!rows) return null
  return toSnapshot(rows[1], stateFips)
}

async function fetchUsSnapshot(): Promise<CensusSnapshot | null> {
  const url = buildCensusUrl('us:1')
  const rows = await fetchCensusRows(url)
  if (!rows) return null
  return toSnapshot(rows[1], 'us')
}

function buildPromptBlock(snapshot: CensusSnapshot): string {
  return [
    'Verified Census context (use these numbers exactly if referenced):',
    `- Geography: ${snapshot.geographyLabel}`,
    `- Population (ACS ${ACS_VINTAGE} ${ACS_DATASET} B01003_001E): ${formatInt(snapshot.population)}`,
    `- Median household income (B19013_001E): ${formatMoney(snapshot.medianHouseholdIncome)}`,
    `- Median age (B01002_001E): ${snapshot.medianAge == null ? 'Not available' : snapshot.medianAge.toFixed(1)}`,
    `- Poverty rate (derived from B17001_002E / B17001_001E): ${formatPercent(snapshot.povertyRatePercent)}`,
    'When answering with Census figures, cite source and vintage explicitly in plain text.',
  ].join('\n')
}

function buildSources(snapshot: CensusSnapshot): CensusSource[] {
  const forClause = snapshot.countyFips ? `county:${snapshot.countyFips}` : snapshot.stateFips === 'us' ? 'us:1' : `state:${snapshot.stateFips}`
  const inClause = snapshot.countyFips ? `state:${snapshot.stateFips}` : undefined
  const apiUrl = buildCensusUrl(forClause, inClause)

  return [
    {
      label: `${ACS_DATASET} (${ACS_VINTAGE}) · ${snapshot.geographyLabel}`,
      dataset: ACS_DATASET,
      vintage: ACS_VINTAGE,
      geography: snapshot.geographyLabel,
      url: apiUrl,
    },
    {
      label: 'U.S. Census Bureau API dataset reference',
      dataset: ACS_DATASET,
      vintage: ACS_VINTAGE,
      geography: snapshot.geographyLabel,
      url: `${ACS_ENDPOINT}.html`,
    },
  ]
}

export async function getCensusContextForPrompt(query: string): Promise<{ promptBlock: string | null; sources: CensusSource[] }> {
  if (!hasCensusIntent(query)) {
    return {
      promptBlock: null,
      sources: [],
    }
  }

  try {
    const stateFips = detectStateFips(query)
    const county = detectCounty(query)

    const countySnapshot = county && stateFips !== 'us' ? await fetchCountySnapshot(stateFips, county) : null
    const stateSnapshot = stateFips !== 'us' ? await fetchStateSnapshot(stateFips) : null

    const snapshot = countySnapshot ?? stateSnapshot ?? (await fetchUsSnapshot())

    if (!snapshot) {
      return {
        promptBlock:
          'User requested Census-backed data, but no reliable Census API result resolved for the requested geography. Do not fabricate values. Explain this clearly and ask for a more specific geography (state, county, or city/county pair).',
        sources: [
          {
            label: `U.S. Census Bureau ACS API (${ACS_VINTAGE})`,
            dataset: ACS_DATASET,
            vintage: ACS_VINTAGE,
            geography: 'Unresolved geography',
            url: `${ACS_ENDPOINT}.html`,
          },
        ],
      }
    }

    return {
      promptBlock: buildPromptBlock(snapshot),
      sources: buildSources(snapshot),
    }
  } catch (error) {
    console.error('Census context lookup failed', error)
    return {
      promptBlock:
        'User requested Census-backed data, but Census API lookup is currently unavailable. Do not fabricate values. State that live Census lookup is unavailable and continue with non-numeric planning guidance unless user provides verified figures.',
      sources: [
        {
          label: `U.S. Census Bureau ACS API (${ACS_VINTAGE})`,
          dataset: ACS_DATASET,
          vintage: ACS_VINTAGE,
          geography: 'Lookup unavailable',
          url: `${ACS_ENDPOINT}.html`,
        },
      ],
    }
  }
}
