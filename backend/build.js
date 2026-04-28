const fs = require('fs');
const path = require('path');

const tsv = fs.readFileSync(path.join(__dirname, 'products.tsv'), 'utf16le').replace(/^\uFEFF/, '');
const lines = tsv.split('\n').filter(Boolean);

let colchoesHtml = '';
let estofariaHtml = '';
let cortinasHtml = '';

lines.forEach(line => {
    const [title, name] = line.split('\t');
    if (!title) return;
    
    const tLower = title.toLowerCase();
    let category = 'estofaria'; // default
    
    if (tLower.includes('espuma') || tLower.includes('colchao') || tLower.includes('molas') || tLower.includes('rabatan') || tLower.includes('perfilado') || tLower.includes('ag ') || tLower.includes('eps ')) {
        category = 'colchoes';
    } else if (tLower.includes('cortina') || tLower.includes('wave') || tLower.includes('abracadeira') || tLower.includes('cordao') || tLower.includes('entretela') || tLower.includes('franzidor') || tLower.includes('jakarta') || tLower.includes('cordone') || tLower.includes('infinity') || tLower.includes('palma') || tLower.includes('london') || tLower.includes('juncao')) {
        category = 'cortinas';
    } else if (tLower.includes('tecido') || tLower.includes('suede') || tLower.includes('veludo') || tLower.includes('corino') || tLower.includes('linho') || tLower.includes('cabeceira') || tLower.includes('amortecedor') || tLower.includes('dobradiça') || tLower.includes('pes ') || tLower.includes('cantoneira') || tLower.includes('puxador') || tLower.includes('respiro') || tLower.includes('botão') || tLower.includes('fitilho') || tLower.includes('linha') || tLower.includes('cola') || tLower.includes('tarugo') || tLower.includes('tnt') || tLower.includes('feltro') || tLower.includes('articulacao')) {
        category = 'estofaria';
    }
    
    let img = 'woocommerce-placeholder.webp'; // fallback
    if (category === 'colchoes') img = 'colchao-produto.jpg';
    if (category === 'estofaria') img = '16-Suede.png';
    if (category === 'cortinas') img = 'cortinas2.jpg';
    
    // specific mappings
    if(tLower.includes('abracadeira')) img = 'abracadeira_gold.webp';
    if(tLower.includes('molas')) img = 'colchao-aberto.webp';
    
    const card = `
      <div class="catalog-item">
        <img src="assets/images/${img}" alt="${title}" class="catalog-img">
        <h4>${title}</h4>
        <div class="catalog-footer">
          <span class="catalog-price">Sob consulta</span>
          <a href="#" class="btn-cotar">Cotar Agora</a>
        </div>
      </div>`;

    if (category === 'colchoes') colchoesHtml += card;
    if (category === 'estofaria') estofariaHtml += card;
    if (category === 'cortinas') cortinasHtml += card;
});

function injectHtml(file, htmlContent) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/<div class="catalog-grid">[\s\S]*?<\/div>\s*<\/section>/, '<div class="catalog-grid">\n' + htmlContent + '\n    </div>\n  </section>');
    fs.writeFileSync(file, content);
}

injectHtml(path.join(__dirname, '../frontend/colchoes.html'), colchoesHtml);
injectHtml(path.join(__dirname, '../frontend/estofaria.html'), estofariaHtml);
injectHtml(path.join(__dirname, '../frontend/cortinas.html'), cortinasHtml);

console.log('Database loaded! Injected ' + lines.length + ' products into the frontend.');
