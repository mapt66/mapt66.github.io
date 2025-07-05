const puppeteer = require('puppeteer');
const fs = require ('fs');
const axios = require('axios');
const path = require('path');

const FormData = require('form-data');


const IMGBB_API_KEY = '528ecd7bdb85f664c5e040957c42d38f';
const POST_DATE = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0]    ;

(async  () =>   {
  const response = await fetch('https://wunderground-api-extremes-nep6xe7po-marcos-projects-5c8f93fe.vercel.app/data/extremos/20250619');
  const dadosExtremos =  await response.json();
  const html = ` <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: white;
          color: #333;
          padding: 20px;
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
        }
        .card {
          text-align: center;
        }
        .icon {
          width: 64px;
          height: 64px;
          margin-bottom: 8px;
        }
        .value {
          font-size: 20px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <img class="icon" src="https://www.svgrepo.com/show/488250/sun.svg" />
        <div class="value">${dadosExtremos.MaxTemp} ºC</div>
      </div>
      <div class="card">
        <img class="icon" src="https://www.svgrepo.com/show/488259/drops.svg" />
        <div class="value">${dadosExtremos.AvgHumidity} %</div>
      </div>
      <div class="card">
        <img class="icon" src="https://www.svgrepo.com/show/488255/wind.svg" />
        <div class="value">${dadosExtremos.MaxWind} km/h</div>
      </div>
      <div class="card">
        <img class="icon" src="https://www.svgrepo.com/show/488261/rainy.svg" />
        <div class="value">${dadosExtremos.TotalPrecip} mm</div>
      </div>
    </body>
  </html>
  `;
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const screenshotBuffer = await page.screenshot({ type: 'png' });
    await browser.close();
   
    const form = new FormData();
    form.append('key', IMGBB_API_KEY);
    form.append('image', screenshotBuffer);


    try {
        const response = await axios.post('https://api.imgbb.com/1/upload', form, {
            headers: form.getHeaders(),
        });
        console.log('Imagem carregada:', response.data.data.url);
        await createMarkdownPost(POST_TITLE,response.data.data.url);

    } catch (error) {
        console.error('Erro ao enviar imagem:', error);
    }


})();
 


  async function createMarkdownPost(title, imageUrl) {
    const slug = title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
    const postPath = path.join(process.cwd(), '_posts', `${POST_DATE}-${slug}.md`);
    
    const frontMatter = `
    ---
      layout: post
      title: "Resumo Diário - ${POST_DATE}"
      description: Céu muito nublado de manhã.Periodos de chuva a partir da tarde , com muito vento
      date: ${POST_DATE} ${new Date().toTimeString().split(' ')[0]}
      categories: [Daily Weather]
      tags: [daily, sun,clouds]
      image: ${imageUrl}
    ---
    
      ![Imagem do post](${imageUrl})
  
  `;
  
    fs.writeFileSync(postPath, frontMatter);
  }