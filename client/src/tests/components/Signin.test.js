import puppeteer from 'puppeteer'


it('Should have a signin button', async()=>{
    const browser = await puppeteer.launch()
    const context = await browser.createIncognitoBrowserContext()
    const page = await context.newPage()
    await page.goto('http://localhost:3000/signin')
    expect(await page.$('.signin-form button')).toBeTruthy()
    await context.close()
})