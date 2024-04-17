const { test, expect } = require('@playwright/test')
const { PLAN_PACKAGES } = require('../common/planPackagesConfig')

import * as utils from '../common/utils.js'
import * as loc from '../common/locators.js'
import * as charges from '../common/constants.js'

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.disco.ac/pricing')
})

test.describe('Pricing Page - Default', () => {
  test('select pay Monthly should update all package pricing correctly', async ({ page }) => {

    // Prepare state
    // Assert slider is defaulted to monthly
    await expect(page.locator('.div.Toggle.Toggle--Checked')).toHaveCount(0)

    // Assert LITE => $10 per month for 1 user and 500 tracks
    let litePricingConfig = PLAN_PACKAGES.find(item => item.name === 'lite')?.pricing.find(p => p.cycle == 'monthly')
    let expectedMonthlyLiteAmount = `${litePricingConfig?.price}`
    let expectedMonthlyLiteNumUsers = `${litePricingConfig?.numberOfUsers}`
    let expectedMonthlyLiteNumTracks = `${litePricingConfig?.numberOfTracks}`
    await expect(page.locator(loc.litePriceLocator)).toContainText(`$${expectedMonthlyLiteAmount} per month`);
    await expect(page.locator(loc.litePriceSubLocator)).toContainText(`for ${expectedMonthlyLiteNumUsers} user and  ${expectedMonthlyLiteNumTracks} tracks`);

    // Assert PLUS => $15 per month for 1 user and 1K tracks
    let plusPricingConfig = PLAN_PACKAGES.find(item => item.name === 'plus')?.pricing.find(p => p.cycle == 'monthly')
    let expectedMonthlyPlusAmount = `${plusPricingConfig?.price}`
    let expectedMonthlyPlusNumUsers = `${plusPricingConfig?.numberOfUsers}`
    let expectedMonthlyPlusNumTracks = `${plusPricingConfig?.numberOfTracks}`
    await expect(page.locator(loc.plusPriceLocator)).toContainText(`from $${expectedMonthlyPlusAmount} per month`);
    await expect(page.locator(loc.plusPriceSubLocator)).toContainText(`for ${expectedMonthlyPlusNumUsers} user and ${expectedMonthlyPlusNumTracks} tracks`);

    // ASSERT PRO => $25 per month for 1 user and 1K tracks
    let proPricingConfig = PLAN_PACKAGES.find(item => item.name === 'pro')?.pricing.find(p => p.cycle == 'monthly')
    let expectedMonthlyProAmount = `${proPricingConfig?.price}`
    let expectedMonthlyProNumUsers = `${proPricingConfig?.numberOfUsers}`
    let expectedMonthlyProNumTracks = `${proPricingConfig?.numberOfTracks}`
    await expect(page.locator(loc.proPriceLocator)).toContainText(`from $${expectedMonthlyProAmount} per month`);
    await expect(page.locator(loc.proPriceSubLocator)).toContainText(`for ${expectedMonthlyProNumUsers} user and ${expectedMonthlyProNumTracks} tracks`);

    // ASSERT ENTERPRISE => For enterprise pricing please get in touch
    await expect(page.locator(loc.entPriceSubLocator)).toContainText(`For enterprise pricing please get in touch`);
  })


  test('select pay Annually should update all package pricing correctly', async ({ page }) => {
    
    // Action - Select Pay Annually button
    await page.locator('div').filter({ hasText: /^Pay monthlyPay Annually$/ }).locator('div').nth(2).click();

    // Assert LITE => $9 per month for 1 user and 500 tracks
    let litePricingConfig = PLAN_PACKAGES.find(item => item.name === 'lite')?.pricing.find(p => p.cycle == 'annually')
    let expectedYearlyLiteAmount = `${litePricingConfig?.price}`
    let expectedYearlyLiteNumUsers = `${litePricingConfig?.numberOfUsers}`
    let expectedYearlyLiteNumTracks = `${litePricingConfig?.numberOfTracks}`
    await expect(page.locator(loc.litePriceLocator)).toContainText(`$${expectedYearlyLiteAmount} per month`);
    await expect(page.locator(loc.litePriceSubLocator)).toContainText(`for ${expectedYearlyLiteNumUsers} user and  ${expectedYearlyLiteNumTracks} tracks`);

    // Assert PLUS

    // Assert PRO

    // ASSERT ENTERPRISE => For enterprise pricing please get in touch
    await expect(page.locator(loc.entPriceSubLocator)).toContainText(`For enterprise pricing please get in touch`);
  })
})


test.describe('Pricing Page - pricing slider change', () => {
  test('should update price when pricing slider is changed', async ({ page }) => {
    // Assert slider is defaulted to monthly
    await expect(page.locator('.div.Toggle.Toggle--Checked')).toHaveCount(0)

    // PLUS plan
    let userLocatorSlider = 'div:nth-child(2) > .PricingRange > .rc-slider'
    let fileLocatorSlider = 'div:nth-child(3) > .PricingRange > .rc-slider'

    // $99 per month for 1 users and 15K Tracks
    await utils.changeSlider(page, userLocatorSlider, 0) // user slider set to zero, selecting the selector is flaky
    await utils.changeSlider(page, fileLocatorSlider, .5) // tracks

    // Assert UI calculated price
    let uiPricingPlanTotal = (await page.locator(loc.plusPriceLocator).textContent())?.replace(/\D/g,'')
    let uiSubText = await page.locator(loc.plusPriceSubLocator).textContent()

    let expectedTotalUserCost = utils.calcUserTotalCharge(1, charges.plusMonthlyChargePerUserInDollars)
    let expectedTotalTrackCost = utils.calcTracksTotalCharge(15000, charges.plusMonthlyChargePerTracksInDollars)

    expect(parseInt(uiPricingPlanTotal)).toBe(expectedTotalUserCost + expectedTotalTrackCost)
  })
})