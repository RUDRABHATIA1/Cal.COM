const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('c:/Users/Rudra/Downloads/cal.com/cal.com/index.html', 'utf8');
const $ = cheerio.load(html);

let css = '';
$('style').each((i, el) => {
    css += $(el).html() + '\n';
});
fs.writeFileSync('c:/Users/Rudra/Downloads/cal.com/CAN/frontend/src/calcom_scraped.css', css);

$('img').each((i, el) => {
    let src = $(el).attr('src');
    if (src && src.includes('framerusercontent.com')) {
        console.log(`IMG: ${src}`);
    }
});

