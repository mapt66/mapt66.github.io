import  puppeteer from 'puppeteer'
import fs from 'fs'
import axios from 'axios'


const IMGBB_API_KEY = '528ecd7bdb85f664c5e040957c42d38f';

async function caputureDashboard ()  {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    debugger
    const pastDay = new Date().toISOString().split('T')[0];
    const pathImg = 'grafico_resumo_diario_'+pastDay;
    // Abre a página que queres capturar
    await page.goto(`https://www.https://www.wunderground.com/dashboard/pws/IANGEJ2/graph/${pastDay}/${pastDay}/daily`);

    // Tira um screenshot e guarda localmente
    const fileElement = await page.waitForSelector('.summary-table');
    await fileElement.screenshot({
      path: pathImg,
    });
    // Fecha o navegador
    await browser.close();

    // Fazer upload para ImgBB
    const imageData = fs.readFileSync(pathImg, { encoding: 'base64' });

    const form = new FormData();
    form.append('key', IMGBB_API_KEY);
    form.append('image', imageData);

    try {
        const response = await axios.post('https://api.imgbb.com/1/upload', form, {
            headers: form.getHeaders(),
        });

        console.log('Imagem carregada:', response.data.data.url);
    } catch (error) {
        console.error('Erro ao enviar imagem:', error);
    }
};

module.exports = { caputureDashboard };

 