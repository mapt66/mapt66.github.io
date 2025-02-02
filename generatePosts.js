const fs = require('fs');
const path = require('path');

// Pasta onde os posts serão criados
const postsDir = path.join(__dirname, '_posts');

// Data inicial e final
const startDate = new Date("2025-01-01");
const endDate = new Date();

// Função para gerar os posts
const generatePosts = () => {
    let currentDate = startDate;

    while (currentDate < endDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        const fileName = `${dateString}-ResumoDiario.md`;
        const filePath = path.join(postsDir, fileName);

        // Conteúdo do post
        const content = `---\nlayout: post\ntitle:  "Resumo Diário :  ${dateString}"\ncategories: jekyll update \n---\n<iframe src="https://charts.mongodb.com/charts-lightning-data-ipma-dnwnvco/embed/charts?id=9906d02c-95bd-4374-89a5-7abb796e388b&amp;maxDataAge=86400&amp;theme=dark&amp;autoRefresh=true&amp;filter=&#123;%20date:%20&#123;%20$regex:%20%27${dateString}%27%20&#125;%20&#125;" width="800" height="600" style="border:none; background-color:black"></iframe>\n` ; 
        fs.writeFileSync(filePath, content);
        console.log(`Post criado: ${filePath}`);

       // Incrementa a data
       currentDate.setDate(currentDate.getDate() + 1);
    }
}

generatePosts();
