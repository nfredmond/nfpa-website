import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

type GeocodeResponse = {
  features?: Array<{
    center?: [number, number]
  }>
}

function getToken() {
  const candidates = [
    process.env.MAPBOX_ACCESS_TOKEN,
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
    // Backward-compatible aliases used in prior docs/setup guides.
    process.env.MAPBOX_TOKEN,
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  ]

  return candidates.find((value) => typeof value === 'string' && value.trim().length > 0)?.trim() || ''
}

export async function GET(req: NextRequest) {
  try {
    const location = req.nextUrl.searchParams.get('location')?.trim() || ''
    if (location.length < 3) {
      return NextResponse.json({ ok: false, message: 'Missing location query.' }, { status: 400 })
    }

    const token = getToken()
    if (!token) {
      return NextResponse.json({ ok: false, message: 'Map preview is not configured.' }, { status: 503 })
    }

    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?limit=1&country=us&access_token=${token}`
    const geocodeResponse = await fetch(geocodeUrl, { cache: 'no-store' })

    if (!geocodeResponse.ok) {
      return NextResponse.json({ ok: false, message: 'Map lookup failed.' }, { status: 502 })
    }

    const geocodePayload = (await geocodeResponse.json()) as GeocodeResponse
    const center = geocodePayload.features?.[0]?.center
    if (!center || center.length < 2) {
      return NextResponse.json({ ok: false, message: 'Location not found.' }, { status: 404 })
    }

    const [lng, lat] = center
    const pin = `pin-s+2f855a(${lng},${lat})`
    const staticUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${pin}/${lng},${lat},10.8,0/900x360?access_token=${token}`
    const staticResponse = await fetch(staticUrl, { cache: 'no-store' })

    if (!staticResponse.ok) {
      return NextResponse.json({ ok: false, message: 'Map render failed.' }, { status: 502 })
    }

    const arrayBuffer = await staticResponse.arrayBuffer()
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'content-type': staticResponse.headers.get('content-type') || 'image/png',
        'cache-control': 'public, max-age=300, s-maxage=300',
      },
    })
  } catch (error) {
    console.error('Map preview route error', error)
    return NextResponse.json({ ok: false, message: 'Unexpected map preview error.' }, { status: 500 })
  }
}
