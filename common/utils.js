
export async function changeSlider(page, locator, percentage) {
  page.mouse.wheel(0, 400)

  const sliderTrack = await page.locator(locator).first()
  const sliderOffsetWidth = await sliderTrack.evaluate(el => {
    let slideWidth = el.getBoundingClientRect().width
    return slideWidth
  })

  const sliderOffsetHeight = await sliderTrack.evaluate(el => {
    let slideHeight = el.getBoundingClientRect().height
    return slideHeight
  })

  // Using the hover method to place the mouse cursor then moving it to the right
  await sliderTrack.hover({ force: true, position: { x: 0, y: 0 } })
  await page.mouse.down()
  await sliderTrack.hover({ force: true, position: { x: sliderOffsetWidth * percentage, y: sliderOffsetHeight / 2 } })
  await page.mouse.up()
}

export function calcUserTotalCharge(numUser, basePrice) {
  return numUser * basePrice
}

export function calcTracksTotalCharge(numTracks, basePrice) {
  let freeNumTracks = 1000
  return ((numTracks - freeNumTracks) / 1000) * basePrice
}