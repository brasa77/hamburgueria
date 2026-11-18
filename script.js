const catalog = [
  { id:'esfirra-cebola', category:'entradas', name:'Esfirra + Cebola Empanada', description:'Uma dupla para começar o pedido com sabor.', price:24.99, image:'assets/entradas/esfirra-cebola.webp', accent:'#6a3828', rating:4.8, featured:false },
  { id:'batata-cheddar-bacon', category:'entradas', name:'Batata Frita 500g com Cheddar e Bacon', description:'500g de batata frita com cheddar e bacon.', price:24.99, image:'assets/entradas/batata-cheddar-bacon.webp', accent:'#5a321f', rating:4.9, featured:true },
  { id:'porcao-picanha', category:'entradas', name:'Porção de Picanha', description:'Porção de picanha para dividir ou chamar de sua.', price:79.99, image:'assets/entradas/porcao-picanha.webp', accent:'#692d26', rating:4.8, featured:false },
  { id:'bolinho-costela', category:'entradas', name:'Bolinho de Costela', description:'Bolinho crocante por fora, recheado com costela desfiada e temperada, acompanhado de molho especial.', price:19.99, image:'assets/entradas/costela.webp', accent:'#783b28', rating:4.8, featured:false },
  { id:'mini-pasteis', category:'entradas', name:'Mini Pastéis — 10 unidades', description:'Mini pastéis crocantes, servidos em uma porção com 10 unidades.', price:24.90, image:'assets/entradas/mini-pasteis.webp', accent:'#8a542d', rating:4.8, featured:false },
  { id:'triplo-burger', category:'burgers', name:'TRIPLO BURGER', description:'2 fatias de carne, 4 fatias de cheddar, 5 fatias de bacon, pão grelhado, alface e tomate.', price:38.9, image:'assets/burgers/triplo-burger.webp', accent:'#683122', rating:4.9, featured:true },
  { id:'interestelar', category:'burgers', name:'INTERESTELAR', description:'Picanha, bacon, cheddar triplo, barbecue, molho verde, batata palha, costela desossada e lombo suíno.', price:49.9, image:'assets/burgers/interestelar.webp', accent:'#8a3c20', rating:5.0, featured:true },
  { id:'booyah-burger', category:'burgers', name:'BOOYAH BURGER', description:'Pão grande, 2 carnes, cheddar, muçarela, 2 ovos fritos, bacon, calabresa, molho barbecue e presunto.', price:39.9, image:'assets/burgers/booyah.webp', accent:'#6c3b25', rating:4.9, featured:true },
  { id:'jl', category:'burgers', name:'JL', description:'Pão brioche selado na manteiga, molho verde, alface, duas carnes, cheddar, muçarela, presunto, bacon, pepperoni, dois anéis de cebola empanados, pickles e Last Sauce, o molho especial da casa.', price:42.9, image:'assets/burgers/jl.webp', accent:'#743326', rating:5.0, featured:true },
  { id:'potterhead', category:'burgers', name:'POTTERHEAD', description:'Hambúrguer artesanal, alface, tomate, salsicha, bacon crocante, batata e nosso molho mágico que derrete na boca.', price:55.9, originalPrice:62.9, image:'assets/burgers/potterhead.webp', accent:'#663321', rating:4.8, featured:false },
  { id:'quarteto-queijos', category:'burgers', name:'QUARTETO QUEIJOS', description:'Quatro queijos, cheddar, bacon, ovo, alface, tomate e duas carnes.', price:44.9, image:'assets/burgers/quarteto-queijos.webp', accent:'#72512b', rating:4.9, featured:true },
  { id:'monstro-camadas', category:'burgers', name:'MONSTRO DE CAMADAS', description:'Pão brioche gigante, mussarela, molho de tomate, carne bolonhesa, massa de lasanha, parmesão, molho branco, hambúrguer bovino, provolone e molho de tomate picante.', price:54.9, image:'assets/burgers/monstro-camadas.webp', accent:'#7c3529', rating:4.7, featured:false },
  { id:'combo-mini-brasa', category:'combos', name:'COMBO MINI BRASA', description:'Hambúrguer Mini Brasa: pão brioche, hambúrguer artesanal, queijo e molho especial. Acompanha batata frita, Magic Pop Cola, Pedaço do Céu e 1 brinquedo surpresa.', price:42.99, image:'assets/burgers/combo-mini-brasa.webp', accent:'#8a3a25', rating:4.9, featured:true },
  { id:'combo-kids-cheddar', category:'combos', name:'COMBO KIDS CHEDDAR', description:'Hambúrguer Kids Cheddar: pão brioche, hambúrguer artesanal, cheddar e molho especial. Acompanha batata frita, Magic Pop Cola, Pedaço do Céu e 1 brinquedo surpresa.', price:41.99, image:'assets/burgers/combo-kids-cheddar.webp', accent:'#9a5428', rating:4.8, featured:true },
  { id:'combo-mini-bacon', category:'combos', name:'COMBO MINI BACON', description:'Hambúrguer Mini Bacon: pão brioche, hambúrguer artesanal, queijo, bacon crocante e molho especial. Acompanha batata frita, Magic Pop Cola, Pedaço do Céu e 1 brinquedo surpresa.', price:41.99, image:'assets/burgers/combo-mini-bacon.webp', accent:'#713329', rating:4.9, featured:true },
  { id:'combo-chicken-kids', category:'combos', name:'COMBO CHICKEN KIDS', description:'Hambúrguer Chicken Kids: pão brioche, frango empanado, queijo e molho especial. Acompanha batata frita, Magic Pop Cola, Pedaço do Céu e 1 brinquedo surpresa.', price:41.99, image:'assets/burgers/combo-chicken-kids.webp', accent:'#a1692d', rating:4.8, featured:true },
  { id:'creme-morango', category:'cremes', name:'Creme de Morango', description:'Doçura envolvente, textura cremosa e um toque frutado que transforma cada colherada em um momento irresistível.', price:14.9, image:'assets/cremes/morango.webp', accent:'#884646', rating:4.8, featured:false },
  { id:'creme-cafe', category:'cremes', name:'Creme de Café', description:'Intenso na essência, cremoso na medida e marcante do primeiro ao último gole. Uma experiência para quem aprecia sabores com personalidade.', price:14.9, image:'assets/cremes/cafe.webp', accent:'#795743', rating:4.8, featured:false },
  { id:'creme-limao', category:'cremes', name:'Creme de Limão', description:'O equilíbrio perfeito entre cremosidade e frescor. Um toque cítrico, leve e surpreendente para despertar o paladar.', price:13.9, image:'assets/cremes/limao.webp', accent:'#697848', rating:4.7, featured:false },
  { id:'creme-chocolate', category:'cremes', name:'Creme de Chocolate', description:'Cremoso, intenso e cheio de personalidade. Uma explosão de sabor para quem acredita que chocolate nunca é demais.', price:15.9, image:'assets/cremes/chocolate.webp', accent:'#624942', rating:4.9, featured:true },
  { id:'creme-maracuja', category:'cremes', name:'Creme de Maracujá', description:'O contraste perfeito entre o azedinho tropical e a cremosidade irresistível. Um sabor envolvente que conquista a cada colherada.', price:14.9, image:'assets/cremes/maracuja.webp', accent:'#876f33', rating:4.8, featured:false },
  { id:'explosao-chocolate', category:'sobremesas', name:'EXPLOSÃO DE CHOCOLATE', description:'Brownie quente, brigadeiro, calda de chocolate e sorvete de creme.', price:14.9, image:'assets/sobremesas/explosao-chocolate.webp', accent:'#70423b', rating:4.9, featured:true },
  { id:'tentacao-morango', category:'sobremesas', name:'TENTAÇÃO DE MORANGO', description:'Creme de morango, morangos frescos, chocolate e chantilly.', price:15.9, image:'assets/sobremesas/tentacao-morango.webp', accent:'#8f4550', rating:4.8, featured:false },
  { id:'pedaco-ceu', category:'sobremesas', name:'PEDAÇO DO CÉU', description:'Bolo de chocolate, brigadeiro, morangos e sorvete de creme.', price:14.9, image:'assets/sobremesas/pedaco-ceu.webp', accent:'#79403d', rating:4.8, featured:false },
  { id:'doce-paixao', category:'sobremesas', name:'DOCE PAIXÃO', description:'Mousse de maracujá, chocolate branco e calda de maracujá.', price:13.9, image:'assets/sobremesas/doce-paixao.webp', accent:'#8b7134', rating:4.7, featured:false },
  { id:'bloom-love', category:'sobremesas', name:'BLOOM LOVE', description:'Milk shake de morango com baunilha, chocolate branco derretido, leite, calda de morango, farofa crocante de biscoito de morango, pedacinhos de morango e raspas de chocolate branco.', price:19.99, image:'assets/sobremesas/bloom-love.webp', accent:'#a8465a', rating:4.9, featured:true },
  { id:'choco-fire', category:'sobremesas', name:'CHOCO FIRE', description:'Milk-shake de chocolate, creme de avelã, calda de chocolate e pedaços de brownie.', price:18.99, image:'assets/sobremesas/choco-fire.webp', accent:'#713a35', rating:4.9, featured:true },
  { id:'magic-redberry', category:'refrigerantes', name:'Magic Pop Redberry', description:'Uma explosão de frutas vermelhas, vibrante e irresistível, para transformar cada gole em uma experiência cheia de sabor.', price:5.49, image:'assets/refrigerantes/redberry.webp', accent:'#e6392f', pop:'#d93044', rating:4.7, featured:false },
  { id:'magic-golden-fizz', category:'refrigerantes', name:'Magic Pop Golden Fizz', description:'Dourado na essência, refrescante na medida e cheio de personalidade para brilhar em cada momento.', price:5.49, image:'assets/refrigerantes/golden-fizz.webp', accent:'#d68a22', pop:'#c77a12', rating:4.7, featured:false },
  { id:'magic-lemon-crush', category:'refrigerantes', name:'Magic Pop Lemon Crush', description:'Cítrico, leve e revigorante. A combinação perfeita para despertar o paladar e refrescar o seu ritmo.', price:5.49, image:'assets/refrigerantes/lemon-crush.webp', accent:'#c9d42d', pop:'#9fae21', rating:4.6, featured:false },
  { id:'magic-cola', category:'refrigerantes', name:'Magic Pop Cola', description:'Um clássico que nunca perde a força. Sabor marcante, refrescância incomparável e personalidade em cada gole.', price:5.49, image:'assets/refrigerantes/cola.webp', accent:'#965438', pop:'#75422e', rating:4.7, featured:false },
  { id:'magic-lime-pop', category:'refrigerantes', name:'Magic Pop Lime Pop', description:'Refrescância cítrica com um toque vibrante. Uma explosão de frescor para quem gosta de sabores que surpreendem.', price:5.49, image:'assets/refrigerantes/lime-pop.webp', accent:'#59bb66', pop:'#339e59', rating:4.7, featured:false },
  { id:'magic-tropical-rush', category:'refrigerantes', name:'Magic Pop Tropical Rush', description:'Uma viagem tropical a cada gole. Intenso, refrescante e cheio de energia para deixar seus momentos ainda mais vibrantes.', price:5.49, image:'assets/refrigerantes/tropical-rush.webp', accent:'#e25467', pop:'#cb3a62', rating:4.8, featured:false },
  { id:'magic-orange-sparky', category:'refrigerantes', name:'Magic Pop Orange Sparky', description:'O sabor marcante da laranja com uma dose extra de vivacidade. Refrescante, alegre e impossível de passar despercebido.', price:5.49, image:'assets/refrigerantes/orange-sparky.webp', accent:'#f57c28', pop:'#e65f18', rating:4.7, featured:false },
  { id:'magic-tropy-pop', category:'refrigerantes', name:'Magic Pop Tropy Pop', description:'Uma mistura tropical cheia de personalidade, com sabor envolvente e refrescância para acompanhar qualquer momento.', price:5.49, image:'assets/refrigerantes/tropy-pop.webp', accent:'#2ba4b3', pop:'#168494', rating:4.7, featured:false },
  { id:'luz-amanhecer', category:'drinks', name:'Luz do Amanhecer', description:'Suco de maracujá, Sprite, Suco de laranja, Gelo.', price:12, image:'assets/drinks/luz-do-amanhecer.webp', accent:'#61bb83', rating:4.8, featured:true },
  { id:'jheny-moon', category:'drinks', name:'Jheny Moon', description:'Suco de uva, Sprite, Suco de laranja, Gelo.', price:12.9, image:'assets/drinks/jheny-moon.webp', accent:'#8c72c1', rating:4.7, featured:false },
  { id:'brasa-tropical', category:'drinks', name:'Brasa Tropical', description:'Suco de maracujá, morango, abacaxi, xarope de frutas vermelhas e gelo.', price:16.99, image:'assets/drinks/brasa-tropical.webp', accent:'#d45c48', rating:4.9, featured:true },
  { id:'brasa-77-energy', category:'energeticos', name:'ENERGY | ORIGINAL', description:'A essência da BRASA em uma lata: energia clássica, presença forte e atitude até o último gole.', volume:'473 ml', price:14.99, image:'assets/energetico/brasa-energy-original.webp', accent:'#e6392f', pop:'#b51f2d', rating:4.9, featured:true },
  { id:'brasa-77-energy-morango', category:'energeticos', name:'ENERGY | MORANGO', description:'Doce na medida, marcante na chegada e envolvente do primeiro gole ao fim da noite.', volume:'473 ml', price:14.99, image:'assets/energetico/brasa-energy-morango.webp', accent:'#d94d68', pop:'#c73555', rating:4.9, featured:false },
  { id:'brasa-77-energy-manga', category:'energeticos', name:'ENERGY | MANGA', description:'Um giro tropical, vibrante e refrescante para colocar mais cor no ritmo da BRASA.', volume:'473 ml', price:14.99, image:'assets/energetico/brasa-energy-manga.webp', accent:'#e69d2e', pop:'#ce7d20', rating:4.9, featured:false },
  { id:'brasa-77-energy-limao', category:'energeticos', name:'ENERGY | LIMÃO', description:'Cítrico, leve e intenso: um choque de sabor que acende o paladar sem pedir licença.', volume:'473 ml', price:14.99, image:'assets/energetico/brasa-energy-limao.webp', accent:'#b8cf3a', pop:'#91a62b', rating:4.9, featured:false },
  { id:'brasa-77-energy-uva', category:'energeticos', name:'ENERGY | UVA', description:'Frutado, cheio de presença e com personalidade para deixar sua noite com assinatura própria.', volume:'473 ml', price:14.99, image:'assets/energetico/brasa-energy-uva.webp', accent:'#8051a8', pop:'#613782', rating:4.9, featured:false },
  { id:'valhalla', category:'drinks', name:'VALHALLA', description:'Mel • Maçã • Limão • Canela • Gengibre • Laranja • Baunilha • 0,0% Álcool', price:14.90, image:'assets/drinks/hidromel.webp', accent:'#d5a43c', rating:4.9, featured:true },
  { id:'ragnarok', category:'burgers', name:'RAGNARÖK', description:'Blend Bovino 180g • Cheddar Maturado • Bacon Crocante • Cebola Caramelizada na Cerveja Escura • Repolho Roxo • Molho Fogo de Muspelheim • Brioche Artesanal', price:39.90, image:'assets/burgers/ragnarok.webp', accent:'#8a3c20', rating:4.9, featured:true },
  { id:'pink-brasa', category:'drinks', name:'Pink Brasa', description:'Drink refrescante de morango com limão e água com gás, servido com gelo e calda de morango escorrendo pela borda, finalizado com morango e limão.', price:12.99, image:'assets/drinks/pink-brasa.webp', accent:'#d84e65', rating:4.8, featured:false },
  { id:'purple-berry', category:'drinks', name:'Purple Berry', description:'Drink refrescante de uva e morango com gás, blueberries e gelo, com um toque de limão para equilibrar o sabor.', price:13.99, image:'assets/drinks/purple-berry.webp', accent:'#7653b2', rating:4.8, featured:false },
  { id:'jhen-peach', category:'drinks', name:'Jhen Peach', description:'Drink refrescante de pêssego, morango e limão com água de coco e gelo. Leve, frutado e bem tropical.', price:13.99, image:'assets/drinks/jhen-peach.webp', accent:'#e08b55', rating:4.8, featured:false },
  { id:'mar-profundo', category:'drinks', name:'Mar Profundo', description:'Drink sem álcool de blueberry ou amora com água com gás, limão e gelo, criando um degradê natural do transparente ao azul-escuro. Visual bonito e refrescante.', price:14.99, image:'assets/drinks/mar-profundo.webp', accent:'#315d9a', rating:4.8, featured:false },
  { id:'sunset-berry', category:'drinks', name:'Sunset Berry', description:'Drink refrescante de morango e uva, com pedaços de morango, toque de limão e um final frutado.', price:13.99, image:'assets/drinks/sunset-berry.webp', accent:'#bd4d6a', rating:4.8, featured:false },
];

const groups = {
  entradas:{title:'PARA COMEÇAR',subtitle:'Porque esperar pelo burger também dá fome.'},
  burgers:{title:'BURGERS',subtitle:'Aqui o básico não existe.'},
  combos:{title:'COMBOS',subtitle:'Burger, acompanhamento e bebida para fechar o pedido.'},
  cremes:{title:'CREMES DA BRASA',subtitle:'Cremosos, gelados e feitos para fechar o pedido do jeito certo.'},
  sobremesas:{title:'SOBREMESAS',subtitle:'Porque sempre cabe uma sobremesa.'},
  refrigerantes:{title:'MAGIC POP',subtitle:'O toque de cor que deixa o pedido ainda mais completo.'},
  energeticos:{title:'ENERGÉTICOS',subtitle:'A energia da BRASA em sabores que chegam com presença.'},
  drinks:{title:'DRINKS',subtitle:'Misturas refrescantes para acompanhar a sua brasa.'},
};

const money=value=>value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const getProduct=id=>catalog.find(p=>p.id===id);
const MAX_CART_QUANTITY=20;

function createElement(tag,className,text){
  const element=document.createElement(tag);
  if(className)element.className=className;
  if(text!==undefined)element.textContent=text;
  return element;
}

const boundImages=new WeakSet();
function bindImageState(image,{loadedClass='is-loaded',missingClass='is-missing'}={}){
  if(boundImages.has(image))return image;
  boundImages.add(image);
  const sync=()=>{
    if(!image.getAttribute('src'))return;
    const loaded=image.complete&&image.naturalWidth>0;
    image.classList.toggle(loadedClass,loaded);
    image.classList.toggle(missingClass,image.complete&&!loaded);
  };
  image.addEventListener('load',sync);
  image.addEventListener('error',sync);
  if(image.complete)sync();
  return image;
}

function createImageSlot(product,alt='',className=''){
  const media=createElement('div',`image-slot${className?` ${className}`:''}`);
  const image=bindImageState(createElement('img'));
  image.src=product.image;
  image.alt=alt;
  image.loading='lazy';
  image.decoding='async';
  image.style.objectPosition=product.imagePosition||'50% 50%';
  media.append(image);
  const placeholder=createElement('div','image-placeholder');
  placeholder.setAttribute('aria-hidden','true');
  placeholder.append(createElement('span',null,'BRASA'),createElement('strong',null,'77'));
  media.append(placeholder);
  return media;
}

function createPriceElement(product){
  if(product.originalPrice){
    const stack=createElement('span','price-stack');
    stack.append(createElement('s','price-old',money(product.originalPrice)),createElement('strong','price',money(product.price)));
    return stack;
  }
  return createElement('strong','price',money(product.price));
}

function createRatingElement(rating){
  const value=rating.toFixed(1).replace('.',',');
  const ratingElement=createElement('span','card-rating',`★ ${value}`);
  ratingElement.setAttribute('aria-label',`${value} de 5`);
  return ratingElement;
}

function productCard(product,isHighlight=false){
  const card=createElement('article',`product-card${isHighlight?' is-highlight':''}`);
  card.tabIndex=0;
  card.setAttribute('role','button');
  card.dataset.productId=product.id;
  card.style.setProperty('--accent-soft',product.accent);
  card.style.setProperty('--pop-color',product.pop||product.accent);

  const media=createImageSlot(product,product.name,'card-media');
  const mediaHover=createElement('div','media-hover');
  mediaHover.append(...media.childNodes);
  media.append(mediaHover);
  media.append(createElement('span','product-badge',isHighlight?'MAIS PEDIDO':groups[product.category].title));
  card.append(media);

  const content=createElement('div','card-content');
  const meta=createElement('div','card-meta');
  meta.append(createElement('span','card-tag',groups[product.category].title),createRatingElement(product.rating));
  const title=createElement('h3','motion-mask');
  title.append(createElement('span','motion-text',product.name));
  const description=createElement('p','card-description',product.description);
  const volume=product.volume?createElement('span','card-volume',product.volume):null;
  const footer=createElement('div','card-footer');
  const addButton=createElement('button','add-button');
  addButton.type='button';
  addButton.setAttribute('aria-label',`Adicionar ${product.name}`);
  addButton.append(createElement('span',null,'+'),document.createTextNode(' Adicionar'));
  const action=createElement('span','card-action');
  action.append(addButton);
  footer.append(createPriceElement(product),action);
  content.append(meta,title,description,...(volume?[volume]:[]),footer);
  card.append(content);
  const rule=createElement('span','card-rule');
  rule.setAttribute('aria-hidden','true');
  card.append(rule);
  return card;
}

function filteredProducts(){
  let products=state.filter==='todos'?[...catalog]:catalog.filter(p=>p.category===state.filter);
  const term=state.search.trim().toLowerCase();
  if(term) products=products.filter(p=>`${p.name} ${p.description} ${groups[p.category].title}`.toLowerCase().includes(term));
  const sorted=[...products];
  if(state.sort==='rating') sorted.sort((a,b)=>b.rating-a.rating || b.featured-a.featured);
  else if(state.sort==='price-asc') sorted.sort((a,b)=>a.price-b.price);
  else if(state.sort==='price-desc') sorted.sort((a,b)=>b.price-a.price);
  else if(state.sort==='name') sorted.sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
  else sorted.sort((a,b)=>Number(b.featured)-Number(a.featured));
  return sorted;
}

const menuCards=new Map();
const menuHeadings=new Map();
function renderMenu(){
  const node=document.querySelector('#menu-groups');
  const products=filteredProducts();
  const result=document.querySelector('#menu-result');
  result.textContent=products.length?`${products.length} ${products.length===1?'item encontrado':'itens encontrados'}`:'Nenhum item encontrado';
  node.dispatchEvent(new Event('brasa:menu-update'));
  node.replaceChildren();
  if(!products.length){
    const empty=createElement('div','empty-results');
    empty.append(createElement('span',null,'⌕'),createElement('h3',null,'Nada encontrado.'),createElement('p',null,'Tente outro termo ou remova alguns filtros.'));
    const clear=createElement('button','text-button','Limpar busca →');
    clear.type='button';
    clear.id='clear-search';
    empty.append(clear);
    node.append(empty);
    return;
  }
  const cats=state.filter==='todos'?Object.keys(groups):[state.filter];
  const fragment=document.createDocumentFragment();
  cats.forEach(category=>{
    const items=products.filter(p=>p.category===category);
    if(!items.length)return;
    const group=groups[category];
    const section=createElement('section','menu-group');
    section.dataset.category=category;
    if(!menuHeadings.has(category)){
      const heading=createElement('div','category-heading');
      const index=createElement('span','category-index',String(Object.keys(groups).indexOf(category)+1).padStart(2,'0'));
      index.setAttribute('aria-hidden','true');
      const rule=createElement('span','category-rule');rule.setAttribute('aria-hidden','true');
      heading.append(index,createElement('h3',null,group.title),createElement('p',null,group.subtitle),rule);
      menuHeadings.set(category,heading);
    }
    const heading=menuHeadings.get(category);
    const grid=createElement('div','product-grid');
    items.forEach(product=>{
      if(!menuCards.has(product.id))menuCards.set(product.id,productCard(product));
      menuCards.get(product.id).classList.toggle('is-editorial',items.length>1 && product===items[0] && ['burgers','combos'].includes(category));
      grid.append(menuCards.get(product.id));
    });
    section.append(heading,grid);
    fragment.append(section);
  });
  node.append(fragment);
}

function renderHighlights(){
  const ids=['interestelar','jl','booyah-burger','potterhead'];
  const grid=document.querySelector('#highlights-grid');
  grid.replaceChildren(...ids.map(id=>productCard(getProduct(id),true)));
}

function normalizeCart(rawCart){
  if(!Array.isArray(rawCart))return [];
  const quantities=new Map();
  rawCart.forEach(item=>{
    if(!item||typeof item.id!=='string'||!getProduct(item.id)||!Number.isInteger(item.quantity)||item.quantity<1||item.quantity>MAX_CART_QUANTITY)return;
    quantities.set(item.id,Math.min(MAX_CART_QUANTITY,(quantities.get(item.id)||0)+item.quantity));
  });
  return [...quantities].map(([id,quantity])=>({id,quantity}));
}

function readCart(){
  try{return normalizeCart(JSON.parse(sessionStorage.getItem('brasa-cart')||'[]'));}
  catch{return []}
}

const state={cart:readCart(),modalProduct:null,modalQuantity:1,filter:'todos',search:'',sort:'featured'};

function saveCart(){
  state.cart=normalizeCart(state.cart);
  try{sessionStorage.setItem('brasa-cart',JSON.stringify(state.cart));}catch{}
}
function cartCount(){return state.cart.reduce((total,item)=>total+item.quantity,0)}
function cartTotal(){return state.cart.reduce((total,item)=>{const product=getProduct(item.id);return product?total+product.price*item.quantity:total},0)}
function renderCart(){
  const items=document.querySelector('#cart-items'),empty=document.querySelector('#empty-cart'),summary=document.querySelector('#cart-summary');
  state.cart=normalizeCart(state.cart);
  const count=cartCount(),total=cartTotal();
  const badge=document.querySelector('#cart-count'); badge.textContent=count; badge.hidden=!count;
  document.querySelector('#cart-trigger').setAttribute('aria-label',count?`Abrir pedidos: ${count} ${count===1?'item':'itens'}`:'Abrir pedidos');
  document.querySelector('#cart-total').textContent=money(total);empty.hidden=Boolean(count);summary.hidden=!count;
  const fragment=document.createDocumentFragment();
  state.cart.forEach(item=>{
    const product=getProduct(item.id);
    if(!product)return;
    const article=createElement('article','cart-item');
    const thumb=createImageSlot(product,'','cart-thumb');
    thumb.querySelector('.image-placeholder').replaceChildren(createElement('span',null,'77'));
    const copy=createElement('div','cart-item-copy');
    const title=createElement('h3',null,product.name);
    const itemPrice=createElement('strong','price',money(product.price*item.quantity));
    const controls=createElement('div','cart-controls');
    const decrease=createElement('button',null,'−');
    decrease.type='button';
    decrease.dataset.cartAction='decrease';
    decrease.dataset.id=product.id;
    decrease.setAttribute('aria-label',`Diminuir ${product.name}`);
    const quantity=createElement('span',null,String(item.quantity));
    const increase=createElement('button',null,'+');
    increase.type='button';
    increase.dataset.cartAction='increase';
    increase.dataset.id=product.id;
    increase.setAttribute('aria-label',`Aumentar ${product.name}`);
    controls.append(decrease,quantity,increase);
    copy.append(title,itemPrice,controls);
    const remove=createElement('button','remove-item','×');
    remove.type='button';
    remove.dataset.cartAction='remove';
    remove.dataset.id=product.id;
    remove.setAttribute('aria-label',`Remover ${product.name}`);
    article.append(thumb,copy,remove);
    fragment.append(article);
  });
  items.replaceChildren(fragment);
  saveCart();
}
function addToCart(productId,quantity=1){
  const product=getProduct(productId);
  if(!product||!Number.isInteger(quantity)||quantity<1)return;
  const found=state.cart.find(item=>item.id===productId);
  if(found)found.quantity=Math.min(MAX_CART_QUANTITY,found.quantity+quantity);
  else state.cart.push({id:productId,quantity:Math.min(MAX_CART_QUANTITY,quantity)});
  renderCart();
  showToast(`${product.name} adicionado ao pedido`);
}
function changeQuantity(id,change){
  if(!getProduct(id)||!Number.isInteger(change)||Math.abs(change)>MAX_CART_QUANTITY)return;
  const item=state.cart.find(entry=>entry.id===id);
  if(!item)return;
  item.quantity+=change;
  if(item.quantity<=0)state.cart=state.cart.filter(entry=>entry.id!==id);
  else item.quantity=Math.min(MAX_CART_QUANTITY,item.quantity);
  renderCart();
}

function setBodyLock(locked){document.body.classList.toggle('is-locked',locked)}
let activeLayer=null;
let layerReturnFocus=null;
function openLayer(layer){
  if(!layer)return;
  setNavigation(false);
  if(!activeLayer)layerReturnFocus=document.activeElement;
  if(activeLayer&&activeLayer!==layer){activeLayer.classList.remove('is-open');activeLayer.setAttribute('aria-hidden','true');activeLayer.inert=true;}
  layer.inert=false;
  activeLayer=layer;
  layer.classList.add('is-open');
  layer.setAttribute('aria-hidden','false');
  document.querySelector('#overlay').classList.add('is-open');
  setBodyLock(true);
  document.querySelector('main').inert=true;
  document.querySelector('header').inert=true;
  document.querySelector('footer').inert=true;
  const focusFirst=()=>{if(activeLayer===layer)layer.querySelector('button,input,select,[tabindex]')?.focus({preventScroll:true})};
  requestAnimationFrame(focusFirst);
  clearTimeout(openLayer.focusTimer);
  openLayer.focusTimer=setTimeout(focusFirst,matchMedia('(prefers-reduced-motion: reduce)').matches?0:360);
}
function closeLayers(){
  if(activeLayer){activeLayer.classList.remove('is-open');activeLayer.setAttribute('aria-hidden','true');activeLayer.inert=true;activeLayer=null}
  document.querySelector('#overlay').classList.remove('is-open');
  setBodyLock(false);
  document.querySelector('main').inert=false;
  document.querySelector('header').inert=false;
  document.querySelector('footer').inert=false;
  clearTimeout(openLayer.focusTimer);
  layerReturnFocus?.focus({preventScroll:true});
}
function openCart(){openLayer(document.querySelector('#cart-panel'))}
function openModal(id){
  const product=getProduct(id);
  if(!product)return;
  state.modalProduct=product;
  state.modalQuantity=1;
  document.querySelector('#modal-title').textContent=product.name;
  document.querySelector('#modal-description').textContent=product.description;
  document.querySelector('#modal-price').replaceChildren(createPriceElement(product));
  document.querySelector('#modal-quantity').textContent='1';
  const category=document.querySelector('#modal-category');
  category.replaceChildren(createElement('span'),document.createTextNode(` ${groups[product.category].title}`));
  const image=document.querySelector('#modal-image');
  image.className='';
  image.alt=product.name;
  image.style.objectPosition=product.imagePosition||'50% 50%';
  image.src=product.image;
  openLayer(document.querySelector('#product-modal'));
  // decode() can resolve before the load event for a cached source.
  const expected=image.src;
  image.decode().then(()=>{
    if(image.src===expected){image.classList.remove('is-missing');image.classList.add('is-loaded');}
  }).catch(()=>{});
}
function showToast(message){const t=document.querySelector('#toast');t.textContent=message;t.classList.add('is-visible');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove('is-visible'),2600)}

function openCheckout(){
  state.cart=normalizeCart(state.cart);
  saveCart();
  if(!state.cart.length){showToast('Adicione pelo menos um item ao pedido.');return}
  document.querySelector('#checkout-total-value').textContent=money(cartTotal());
  const feedback=document.querySelector('#checkout-feedback');
  feedback.hidden=true;
  feedback.textContent='';
  openLayer(document.querySelector('#checkout-modal'));
}

let menuSearchTimer;
renderHighlights();renderMenu();renderCart();

document.addEventListener('click',event=>{
  const add=event.target.closest('.add-button');const card=event.target.closest('.product-card');
  if(add&&card){event.stopPropagation();addToCart(card.dataset.productId);return}
  if(card){openModal(card.dataset.productId);return}
  const filter=event.target.closest('.filter');if(filter){document.querySelectorAll('.filter').forEach(b=>b.classList.remove('is-active'));filter.classList.add('is-active');state.filter=filter.dataset.filter;renderMenu();return}
  const action=event.target.closest('[data-cart-action]');if(action){const {cartAction,id}=action.dataset;if(cartAction==='remove'){state.cart=state.cart.filter(i=>i.id!==id);renderCart();showToast('Item removido do pedido')}else changeQuantity(id,cartAction==='increase'?1:-1);return}
  if(event.target.closest('#clear-search')){state.search='';document.querySelector('#menu-search').value='';renderMenu();}
});

document.addEventListener('keydown',event=>{
  if((event.key==='Enter'||event.key===' ')&&event.target.classList.contains('product-card')){event.preventDefault();openModal(event.target.dataset.productId)}
  if((event.key==='k'&&(event.metaKey||event.ctrlKey))){event.preventDefault();document.querySelector('#menu-search').focus()}
  if(event.key==='Escape')closeLayers();
  if(event.key==='Tab'&&activeLayer){
    const nodes=[...activeLayer.querySelectorAll('button,a[href],input,select,textarea,[tabindex="0"]')].filter(el=>!el.disabled&&el.getClientRects().length);
    const first=nodes[0],last=nodes[nodes.length-1];
    if(!activeLayer.contains(document.activeElement)){event.preventDefault();first?.focus()}
    else if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
  }
});

document.querySelector('#cart-trigger').addEventListener('click',openCart);
document.querySelector('#hero-order').addEventListener('click',openCart);
document.querySelector('#overlay').addEventListener('click',closeLayers);
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',closeLayers));
document.querySelector('#browse-menu').addEventListener('click',()=>{closeLayers();document.querySelector('#cardapio').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})});
document.querySelector('#modal-increase').addEventListener('click',()=>{state.modalQuantity=Math.min(MAX_CART_QUANTITY,state.modalQuantity+1);document.querySelector('#modal-quantity').textContent=state.modalQuantity});
document.querySelector('#modal-decrease').addEventListener('click',()=>{state.modalQuantity=Math.max(1,state.modalQuantity-1);document.querySelector('#modal-quantity').textContent=state.modalQuantity});
document.querySelector('#modal-add').addEventListener('click',()=>{addToCart(state.modalProduct.id,state.modalQuantity);closeLayers()});
document.querySelector('#checkout').addEventListener('click',openCheckout);
document.querySelector('#promo-add').addEventListener('click',()=>addToCart('potterhead'));

document.querySelector('#menu-search').addEventListener('input',e=>{state.search=e.target.value;clearTimeout(menuSearchTimer);menuSearchTimer=setTimeout(renderMenu,120)});
document.querySelector('#menu-sort').addEventListener('change',e=>{state.sort=e.target.value;renderMenu()});

document.querySelector('#checkout-form').addEventListener('submit',e=>{e.preventDefault();const feedback=document.querySelector('#checkout-feedback');feedback.hidden=false;feedback.textContent='Pedido simulado com sucesso! Esta é uma demonstração acadêmica: nenhum dado é enviado, nenhuma cobrança é feita e nenhum pedido real é criado.';state.cart=[];renderCart();e.target.reset();setTimeout(closeLayers,1800)});

document.querySelector('#contact-form').addEventListener('submit',e=>{e.preventDefault();const feedback=document.querySelector('#contact-feedback');feedback.hidden=false;feedback.textContent='Mensagem simulada! Esta é uma demonstração acadêmica: nenhum dado foi enviado ou armazenado.';e.target.reset();});

const menuToggle=document.querySelector('.menu-toggle'),navLinks=document.querySelector('#nav-links');
const mobileNavigation=matchMedia('(max-width:1050px)');
function setNavigation(open,returnFocus=false){
  open=Boolean(open && mobileNavigation.matches);
  menuToggle.setAttribute('aria-expanded',String(open));
  menuToggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
  navLinks.classList.toggle('is-open',open);
  navLinks.inert=mobileNavigation.matches&&!open;
  document.body.classList.toggle('is-nav-open',open);
  if(!activeLayer){document.querySelector('main').inert=open;document.querySelector('footer').inert=open;}
  if(returnFocus)menuToggle.focus({preventScroll:true});
}
menuToggle.addEventListener('click',()=>setNavigation(menuToggle.getAttribute('aria-expanded')!=='true'));
mobileNavigation.addEventListener('change',()=>setNavigation(false));
setNavigation(false);
document.addEventListener('keydown',event=>{
  if(menuToggle.getAttribute('aria-expanded')!=='true')return;
  if(event.key==='Escape'){event.preventDefault();setNavigation(false,true);}
  if(event.key==='Tab'){
    const controls=[...document.querySelector('.nav').querySelectorAll('a,button')].filter(el=>!el.closest('[inert]')&&el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden');
    const first=controls[0],last=controls.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
});
const navigationLinks=[...document.querySelectorAll('.nav-link')];
function setActiveNavigation(id){navigationLinks.forEach(link=>{const active=link.getAttribute('href')===`#${id}`;link.classList.toggle('is-active',active);if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current')})}
navigationLinks.forEach(link=>link.addEventListener('click',()=>{setActiveNavigation(link.getAttribute('href').slice(1));setNavigation(false);const target=document.querySelector(link.getAttribute('href'));if(target && target.tagName!=='HEADER'){target.tabIndex=-1;target.focus({preventScroll:true});}}));
const header=document.querySelector('.site-header');
const backTop=document.querySelector('#back-top');
function updateHeaderState(){if(scrollY<100)setActiveNavigation('inicio');header.classList.toggle('scrolled',scrollY>15);backTop.classList.toggle('is-visible',scrollY>700)}
window.addEventListener('scroll',updateHeaderState,{passive:true});updateHeaderState();
const sectionIds=['promocao','cardapio','anatomia','avaliacoes','sobre','contato'];const sections=sectionIds.map(id=>document.getElementById(id)).filter(Boolean);
const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)setActiveNavigation(entry.target.id)}),{rootMargin:'-35% 0px -55% 0px',threshold:0});sections.forEach(s=>sectionObserver.observe(s));

// Burger Anatomy Showcase
document.querySelectorAll('img').forEach(image=>bindImageState(image));

// Reviews
const reviewForm=document.querySelector('#review-form'),ratingInput=document.querySelector('#review-rating'),reviewFeedback=document.querySelector('#review-feedback'),stars=[...document.querySelectorAll('.star-option')];
function setReviewRating(rating){ratingInput.value=String(rating);stars.forEach(star=>{const value=Number(star.dataset.rating);star.classList.toggle('is-selected',value<=rating);star.setAttribute('aria-checked',String(value===rating))})}
stars.forEach(star=>{star.addEventListener('click',()=>setReviewRating(Number(star.dataset.rating)));star.addEventListener('keydown',event=>{if(['ArrowRight','ArrowUp','ArrowLeft','ArrowDown'].includes(event.key)){event.preventDefault();const delta=(event.key==='ArrowRight'||event.key==='ArrowUp')?1:-1;const next=Math.min(5,Math.max(1,Number(ratingInput.value||0)+delta));setReviewRating(next);stars[next-1].focus()}})});
reviewForm.addEventListener('submit',event=>{event.preventDefault();if(!ratingInput.value){reviewFeedback.hidden=false;reviewFeedback.textContent='Escolha uma nota de 1 a 5 estrelas antes de enviar.';return}reviewFeedback.hidden=false;reviewFeedback.textContent='Feedback simulado! Esta é uma demonstração acadêmica: sua opinião não foi enviada nem armazenada.';reviewForm.reset();ratingInput.value='';stars.forEach(s=>{s.classList.remove('is-selected');s.setAttribute('aria-checked','false')})});

// Theme
const themeToggle=document.querySelector('#theme-toggle');
let savedTheme=null;
try{savedTheme=localStorage.getItem('brasa-theme')}catch{}
if(savedTheme==='light')document.body.classList.add('light-theme');
function updateThemeButton(){const light=document.body.classList.contains('light-theme');document.documentElement.dataset.theme=light?'light':'dark';themeToggle.setAttribute('aria-pressed',String(light));themeToggle.setAttribute('aria-label',light?'Ativar modo escuro':'Ativar modo claro');themeToggle.querySelector('span').textContent=light?'☾':'☼';const themeMeta=document.querySelector('meta[name=theme-color]');if(themeMeta)themeMeta.setAttribute('content',light?'#f6f1e8':'#0d0d0d')}
updateThemeButton();themeToggle.addEventListener('click',()=>{document.body.classList.toggle('light-theme');try{localStorage.setItem('brasa-theme',document.body.classList.contains('light-theme')?'light':'dark')}catch{};updateThemeButton()});

// Back to top
backTop.addEventListener('click',()=>scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));

// Auto-close mobile navigation when selecting outside.
document.addEventListener('click',event=>{if(window.innerWidth<=1050&&!event.target.closest('.nav')&&navLinks.classList.contains('is-open')){setNavigation(false)}});

// Explicit bridge: campaigns consume the original catalog and purchase functions.
window.Brasa={catalog,getProduct,money,addToCart};

// The header is fixed; its anchor alone cannot return the document to the top.
document.querySelectorAll('a[href="#inicio"]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();setNavigation(false);scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});setActiveNavigation('inicio')}));

