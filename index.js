const puppeteer = require('puppeteer');

const launchConfig = {
    headless: true,
    slowMo: 0,
    args: ['--start-maximized', '--disable-extensions', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-web-security']
  };

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  
(async () => {
    let success = false;
    let count = 0;
    
    while (!success && count < 10) {
      try {
        const browser = await puppeteer.launch(launchConfig);
        const page = await browser.newPage();
        await page.setViewport({
          width: 1920,
          height: 1080
        });
        await page.goto('https://wildberries.ru');
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        await page.type('input[id="searchInput"]', 'рыбный коллаген');
        await page.click('#applySearchBtn');
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        
        await page.evaluate(async () => {
            while (true) {
              const elements = document.querySelectorAll('.product-card .brand-name');
              const elementsNames = elements ? [...elements].map(e => e.innerText) : undefined;
              let elementIndex = 0;

              if (elementsNames.length && elementsNames.includes('Orzax')) {
                elementIndex = elementsNames.indexOf('Orzax');
                elements[elementIndex].closest('.product-card__main').click();
                break;
              }
              
              window.scrollBy(0, 1000);
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          });

        const brandNames = await page.$$('.product-card');
        // const brandNames = await page.$$eval('.product-card .brand-name', elements => {
        //     return elements.map(element => element.textContent);
        //   });
        
      
        // await page.evaluate(async () => {
        //     await new Promise((resolve) => {
        //     let totalHeight = 0;
        //     const distance = 100;
        //     const timer = setInterval(() => {
        //         const scrollHeight = document.body.scrollHeight;
        //         window.scrollBy(0, distance);
        //         totalHeight += distance;

        //         if (totalHeight >= scrollHeight) {
        //         clearInterval(timer);
        //         resolve();
        //         }
        //     }, 50);
        //     });
        //   });

        //await brandNames[elementIndex].click();
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        await delay(5000);
        await page.screenshot({ path: 'screenshot.png' });
        await browser.close();
    
        success = true;
      } catch (error) {
        console.log(`Attempt ${count + 1} failed. Error: ${error}`);
      }
      
      count++;
    }    
})();
