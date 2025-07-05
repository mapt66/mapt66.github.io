const puppeteer = require('puppeteer');
const fs = require ('fs');
const axios = require('axios');
const path = require('path');

const FormData = require('form-data');


const IMGBB_API_KEY = '210e56153f796445ca6c3922203566f7'
const POST_DATE = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];

const API_DATE_FORMATED = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0].split('-').join('');

(async  () =>{
  const response = await fetch(`https://wunderground-api-extremes-nep6xe7po-marcos-projects-5c8f93fe.vercel.app/data/extremos/${API_DATE_FORMATED}`);
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
        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
        }
        .value {
            font-size: 30px;
            font-weight: bold;
        }
      </style>
    </head>
    <body>
        <div class="grid">
            <div class="card">
                <img class="icon" src="https://www.svgrepo.com/show/472853/temperature-sun.svg" />
                <div class="value">${dadosExtremos.MaxTemp} ºC</div>
            </div>
            <div class="card">
                <img class="icon" src="https://www.svgrepo.com/show/472850/temperature-snow.svg" />
                <div class="value">${dadosExtremos.MinTemp} ºC</div>
            </div>
            <div class="card">
                <img class="icon" src="https://www.svgrepo.com/show/467239/rain.svg" />
                <div class="value">${dadosExtremos.TotalPrecip} mm</div>
            </div>
            <div class="card">
                <img class="icon" src="https://www.svgrepo.com/show/526453/wind.svg" />
                <div class="value">${dadosExtremos.MaxWind} km/h</div>
            </div>
            <div class="card">
                <img class="icon" src="https://www.svgrepo.com/show/26690/humidity.svg" />
                <div class="value">${dadosExtremos.AvgHumidity} %</div>
            </div>
        </div>
    </body>
  </html>
  `;
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});
    const page = await browser.newPage();
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const screenshotBuffer = await page.screenshot({ type: 'png' });
    await browser.close();
    //console.log(screenshotBuffer)
    const buffer = Buffer.from(screenshotBuffer);
    const imageBase64 = buffer.toString('base64');
    const form = new FormData();
    form.append('key', IMGBB_API_KEY);
    form.append('image', imageBase64); 



    try {
          const response = await axios.post('https://api.imgbb.com/1/upload', form, {
            headers: form.getHeaders(),
          });

        console.log('Imagem carregada:', response.data.data.url);
        await createMarkdownPost( response.data.data.url);

    } catch (error) {
        console.error('Erro ao enviar imagem:', error.response?.data || error.message);
    }




})();
 


  async function createMarkdownPost(imageUrl) {
    
  const frontMatter = `---
 layout: post
 title: "Resumo Diário - ${POST_DATE}"
 description: Céu muito nublado de manhã.Periodos de chuva a partir da tarde , com muito vento
 date: ${POST_DATE} ${new Date().toTimeString().split(' ')[0]}
 categories: [Daily Weather]
 tags: [daily, sun,clouds]
 image: ${imageUrl} 
---
    
  
  `;
    const fileName = `2025-06-19-resumo-meteorologico.md`;
    const fullPath = path.join(__dirname, '../_posts', fileName);

    fs.writeFileSync(fullPath, frontMatter);
  }