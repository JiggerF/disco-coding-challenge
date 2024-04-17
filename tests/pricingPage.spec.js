// @ts-check
const { test, expect } = require('@playwright/test')
const { PLAN_PACKAGES } = require('../common/planPackagesConfig')

// Define Locators
let litePriceLocator = 'div.PricingPlans > div:nth-child(1) > div > div.PricingPlan_ContentWrapper > div > div > div.PricingPlan_PriceContainer > div.PricingPlan_PriceWrapper > div.Price'
let litePriceSubLocator = 'div.PricingPlans > div:nth-child(1) > div > div.PricingPlan_ContentWrapper > div > div > div.PricingPlan_PriceContainer > div.PricingPlan_SubDescription'
let plusPriceLocator = 'div.PricingPlans > div:nth-child(2) > div > div.PricingPlan_ContentWrapper > div > div > div.PricingPlan_PriceContainer > div.PricingPlan_PriceWrapper > div.Price'
let plusPriceSubLocator = 'div.PricingPlans > div:nth-child(2) > div > div.PricingPlan_ContentWrapper > div > div > div.PricingPlan_PriceContainer > div.PricingPlan_SubDescription'
let proPriceLocator = 'div.PricingPlans > div:nth-child(3) > div > div.PricingPlan_ContentWrapper > div > div > div.PricingPlan_PriceContainer > div.PricingPlan_PriceWrapper > div.Price'
let proPriceSubLocator = 'div.PricingPlans > div:nth-child(3) > div > div.PricingPlan_ContentWrapper > div > div > div.PricingPlan_PriceContainer > div.PricingPlan_SubDescription'
let entPriceSubLocator = 'div.PricingPlans > div:nth-child(4) > div > div.PricingPlan_ContentWrapper > div > div > div.PricingPlan_PriceContainer > div.PricingPlan_SubDescription'

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.disco.ac/pricing')
})

// Test the default pricing state for each plan
test.describe('Pricing Cycle - Default', () => {

  test('select pay Monthly should update all package pricing correctly', async ({ page }) => {

    // Prepare state
    // Assert slider is defaulted to monthly
    await expect(page.locator('.div.Toggle.Toggle--Checked')).toHaveCount(0)

    // Assert LITE => $10 per month for 1 user and 500 tracks
    let litePricingConfig = PLAN_PACKAGES.find(item => item.name === 'lite')?.pricing.find(p => p.cycle == 'monthly')
    let expectedMonthlyLiteAmount = `${litePricingConfig?.price}`
    let expectedMonthlyLiteNumUsers = `${litePricingConfig?.numberOfUsers}`
    let expectedMonthlyLiteNumTracks = `${litePricingConfig?.numberOfTracks}`
    await expect(page.locator(litePriceLocator)).toContainText(`$${expectedMonthlyLiteAmount} per month`);
    await expect(page.locator(litePriceSubLocator)).toContainText(`for ${expectedMonthlyLiteNumUsers} user and  ${expectedMonthlyLiteNumTracks} tracks`);

    // Assert PLUS => $15 per month for 1 user and 1K tracks
    let plusPricingConfig = PLAN_PACKAGES.find(item => item.name === 'plus')?.pricing.find(p => p.cycle == 'monthly')
    let expectedMonthlyPlusAmount = `${plusPricingConfig?.price}`
    let expectedMonthlyPlusNumUsers = `${plusPricingConfig?.numberOfUsers}`
    let expectedMonthlyPlusNumTracks = `${plusPricingConfig?.numberOfTracks}`
    await expect(page.locator(plusPriceLocator)).toContainText(`from $${expectedMonthlyPlusAmount} per month`);
    await expect(page.locator(plusPriceSubLocator)).toContainText(`for ${expectedMonthlyPlusNumUsers} user and ${expectedMonthlyPlusNumTracks} tracks`);

    // ASSERT PRO => $25 per month for 1 user and 1K tracks
    let proPricingConfig = PLAN_PACKAGES.find(item => item.name === 'pro')?.pricing.find(p => p.cycle == 'monthly')
    let expectedMonthlyProAmount = `${proPricingConfig?.price}`
    let expectedMonthlyProNumUsers = `${proPricingConfig?.numberOfUsers}`
    let expectedMonthlyProNumTracks = `${proPricingConfig?.numberOfTracks}`
    await expect(page.locator(proPriceLocator)).toContainText(`from $${expectedMonthlyProAmount} per month`);
    await expect(page.locator(proPriceSubLocator)).toContainText(`for ${expectedMonthlyProNumUsers} user and ${expectedMonthlyProNumTracks} tracks`);

    // ASSERT ENTERPRISE => For enterprise pricing please get in touch
    await expect(page.locator(entPriceSubLocator)).toContainText(`For enterprise pricing please get in touch`);
  })

  test('select pay Annually should update all package pricing correctly', async ({ page }) => {
    // Action - Select Pay Annually slider
    await page.locator('div').filter({ hasText: /^Pay monthlyPay Annually$/ }).locator('div').nth(2).click();

    // Assert LITE => $9 per month for 1 user and 500 tracks
    let litePricingConfig = PLAN_PACKAGES.find(item => item.name === 'lite')?.pricing.find(p => p.cycle == 'annually')
    let expectedYearlyLiteAmount = `${litePricingConfig?.price}`
    let expectedYearlyLiteNumUsers = `${litePricingConfig?.numberOfUsers}`
    let expectedYearlyLiteNumTracks = `${litePricingConfig?.numberOfTracks}`
    await expect(page.locator(litePriceLocator)).toContainText(`$${expectedYearlyLiteAmount} per month`);
    await expect(page.locator(litePriceSubLocator)).toContainText(`for ${expectedYearlyLiteNumUsers} user and  ${expectedYearlyLiteNumTracks} tracks`);

    // Assert PLUS

    // Assert PRO

    // ASSERT ENTERPRISE => For enterprise pricing please get in touch
    await expect(page.locator(entPriceSubLocator)).toContainText(`For enterprise pricing please get in touch`);
  })
})


test.describe('Pricing Page - with nondefault pricing range', () => {
  test('should update price when pricing slider is changed', async ({ page }) => {

    // PLUS
    let userLocatorSlider = 'div:nth-child(2) > .PricingRange > .rc-slider'
    let fileLocatorSlider = 'div:nth-child(3) > .PricingRange > .rc-slider'
    
    await changeSlider(page, userLocatorSlider, .3) // users
    await changeSlider(page, fileLocatorSlider, .5) // tracks

    // Assert UI calculated price
    
  })
})

async function changeSlider(page, locator, percentage) {
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

function calcTracksTotalCharge(numTracks, basePrice) {
  let freeNumTracks = 1000
  return ((numTracks - freeNumTracks) / 1000) * basePrice
}