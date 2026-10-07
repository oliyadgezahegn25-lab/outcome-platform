const SUPABASE_URL="https://bpqtmqlnohwqrxdcaiwc.supabase.co";
const SUPABASE_KEY="sb_publishable__KsZBL-4weWb-a8ZdWGjGA_XHHMG9wH";
const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const categoryFilter=document.getElementById("categoryFilter"),categoryGrid=document.getElementById("categoryGrid"),productCategoryNav=document.getElementById("productCategoryNav"),productGrid=document.getElementById("productGrid"),serviceGrid=document.getElementById("serviceGrid"),modal=document.getElementById("productModal"),modalContent=document.getElementById("modalContent");
const icons=["🧪","🔬","⚗️","⚕️","💻","⚡","⚙️"];
const categoryImages={"Laboratory Equipment":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Microscopio_optico_imagem_sem_fundo.png","Laboratory Chemicals & Reagents":null,"Research & Scientific Equipment":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Keithley%20DMM7510%207.5%20Digit%20Bench%20Multimeter%20%2816462850573%29.jpg","Medical Equipment":"https://commons.wikimedia.org/wiki/Special:Redirect/file/PatientMonitor-1.jpg"};
const esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
function card(p){const image=categoryImages[p.category?.name];return `<article class="product-card"><div class="product-visual">${image?`<img class="product-photo" src="${esc(image)}" alt="${esc(p.name)}">`:`<span class="product-symbol">${icons[(p.sort_order||0)%icons.length]}</span>`}</div><div class="product-body"><span class="tag">${esc(p.category?.name||"Product")}</span><h3>${esc(p.name)}</h3><p>${esc(p.short_description||"Professional equipment and solutions available from Labaid Trading PLC.")}</p><button class="product-link" data-product="${p.id}">View product →</button></div></article>`}
async function loadProducts(){
 const queries=[
  db.from("product_categories").select("*").eq("published",true).order("sort_order"),
  db.from("products").select("*,category:product_categories(name)").eq("published",true).order("featured",{ascending:false}).order("sort_order"),
  db.from("services").select("*").eq("published",true).order("sort_order")
 ];
 const [{data:cats,error:ce},{data:products,error:pe},{data:services,error:se}]=await Promise.all(queries);
 if(ce||pe){console.error(ce||pe);if(productGrid)productGrid.innerHTML='<div class="empty">Products are temporarily unavailable. Please contact Labaid directly.</div>';return}
 if(categoryGrid){
  const wanted=["All Products","Laboratory Equipment","Laboratory Chemicals & Reagents","Research & Scientific Equipment","Medical Equipment"];
  const available=wanted.map((name,i)=>name==="All Products"?{name,description:"Browse the complete Labaid product range."}:{...(cats||[]).find(c=>c.name===name),name});
  categoryGrid.innerHTML=available.map((c,i)=>`<a class="category-card" href="${c.name==="All Products"?"products.html":"products.html?category="+encodeURIComponent(c.name)}"><div class="category-image">${categoryImages[c.name]?`<img src="${categoryImages[c.name]}" alt="${esc(c.name)}">`:`<div class="category-no-image">CHEMICALS<br><span>Products & Reagents</span></div>`}</div><div class="category-content"><span>0${i+1}</span><h3>${esc(c.name)}</h3><p>${esc(c.description||"Explore products in this category.")}</p><strong>Explore products <b>→</b></strong></div></a>`).join("");
 }
 if(categoryFilter){categoryFilter.style.display="none";categoryFilter.innerHTML='<button class="active" data-cat="all">All Products</button>'+(cats||[]).map(c=>`<button data-cat="${c.id}">${esc(c.name)}</button>`).join("");categoryFilter.querySelectorAll("button").forEach(b=>b.onclick=()=>{categoryFilter.querySelectorAll("button").forEach(x=>x.classList.remove("active"));b.classList.add("active");render(b.dataset.cat==="all"?products:products.filter(p=>p.category_id===b.dataset.cat))})}
 render(products||[]);
 if(serviceGrid)serviceGrid.innerHTML=se?( '<div class="empty">Services are temporarily unavailable.</div>'):(services||[]).map(s=>`<article class="service-card"><span class="service-icon">${s.icon||"✦"}</span><h3>${esc(s.name)}</h3><p>${esc(s.description||"")}</p></article>`).join("");
}
function render(list){if(!productGrid)return;productGrid.innerHTML=list.length?list.map(card).join(""):'<div class="empty"><strong>Products are being added.</strong><br>Contact Labaid for a specific product requirement.</div>';productGrid.querySelectorAll("[data-product]").forEach(b=>b.onclick=()=>openProduct(b.dataset.product))}
async function openProduct(id){
 const {data:p}=await db.from("products").select("*,category:product_categories(name)").eq("id",id).single();if(!p||!modalContent)return;
 const image=categoryImages[p.category?.name];
 modalContent.innerHTML=`${image?`<img class="modal-product-photo" src="${esc(image)}" alt="${esc(p.name)}">`:''}<span class="modal-meta">${esc(p.category?.name||"Product")}</span><h2>${esc(p.name)}</h2>${p.brand?`<p><strong>Brand:</strong> ${esc(p.brand)}${p.model?` &nbsp; <strong>Model:</strong> ${esc(p.model)}`:''}</p>`:''}<p>${esc(p.description||p.short_description||"Contact Labaid for product information and availability.")}</p><a class="primary" href="contact.html" onclick="closeModal()">Request a quote <span>→</span></a>`;
 modal.classList.add("open");
}
function closeModal(){if(modal)modal.classList.remove("open")}
if(document.getElementById("modalClose"))document.getElementById("modalClose").onclick=closeModal;
if(modal)modal.onclick=e=>{if(e.target===modal)closeModal()};
const quoteForm=document.getElementById("quoteForm");
if(quoteForm)quoteForm.addEventListener("submit",async e=>{
 e.preventDefault();const status=document.getElementById("formStatus");status.textContent="Sending your request…";
 const payload={name:document.getElementById("name").value.trim(),organization:document.getElementById("organization").value.trim()||null,email:document.getElementById("email").value.trim(),phone:document.getElementById("phone").value.trim()||null,subject:document.getElementById("subject").value.trim()||null,message:document.getElementById("message").value.trim()};
 const {error}=await db.from("inquiries").insert(payload);
 if(error){console.error(error);status.textContent="We couldn't send the request. Please try again.";return}
 e.target.reset();status.textContent="Thank you — your request has been received.";
});
async function loadInventoryProducts(){
 if(productCategoryNav){
  const cats=["All Products","Laboratory Equipment","Laboratory Chemicals & Reagents","Research & Scientific Equipment","Medical Equipment"];
  productCategoryNav.innerHTML=cats.map((x,i)=>{const active=(new URLSearchParams(location.search).get("category")||"All Products")===x;const image=categoryImages[x];return `<a class="mini-category ${active?"active":""}" href="products.html${x==="All Products"?"":"?category="+encodeURIComponent(x)}">${image?`<img src="${image}" alt="${esc(x)}">`:`<span class="mini-category-symbol">🧪</span>`}<span>${esc(x)}</span><b>→</b></a>`}).join("");
 }
 if(!productGrid||!location.pathname.endsWith("products.html"))return;
 const wanted=new URLSearchParams(location.search).get("category")||"All Products";
 const featured=[
  {id:"featured-microscope",name:"Light Optical Microscope",category:"Laboratory Equipment",description:"Optical microscopy equipment for teaching, routine laboratory work and scientific observation.",image:categoryImages["Laboratory Equipment"]},
  {id:"featured-centrifuge",name:"Benchtop Centrifuge",category:"Laboratory Equipment",description:"Compact laboratory centrifuge for routine sample separation.",image:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Laboratory_Centrifuge.jpg"},
  {id:"featured-balance",name:"Analytical Balance",category:"Laboratory Equipment",description:"Precision weighing equipment for laboratory measurement and analytical work.",image:"https://img1.17img.cn/17img/images/201911/pic/fe99d0dd-14fe-4461-b592-8a2c12d9a39b.jpg"},
  {id:"featured-multimeter",name:"Bench-top Digital Multimeter",category:"Research & Scientific Equipment",description:"Precision electrical measurement instrument for laboratory and technical applications.",image:categoryImages["Research & Scientific Equipment"]},
  {id:"featured-monitor",name:"Patient Monitor",category:"Medical Equipment",description:"Medical monitoring equipment for institutional and clinical environments.",image:categoryImages["Medical Equipment"]}
 ];
 const {data:items,error}=await db.from("products").select("id,name,brand,model,category:product_categories(name),image_url,short_description,description,sort_order").eq("published",true).order("featured",{ascending:false}).order("sort_order").limit(50);
 let products=error||!items?.length?featured:items.map(p=>({...p,category:p.category?.name||p.category}));
 products=products.filter(p=>wanted==="All Products"||(p.category?.name||p.category)===wanted);
 productGrid.innerHTML=products.length?products.map(p=>{const image=(p.category==="Laboratory Chemicals & Reagents")?null:(categoryImages[p.category]);return `<article class="product-card"><div class="product-visual">${image?`<img class="product-photo" src="${esc(image)}" alt="${esc(p.name)}">`:`<span class="product-symbol">${icons[(p.sort_order||0)%icons.length]}</span>`}</div><div class="product-body"><span class="tag">${esc(p.category?.name||p.category||"Product")}</span><h3>${esc(p.name)}</h3><p>${esc(p.short_description||p.description||"Professional equipment supplied by Labaid Trading PLC.")}</p><a class="product-link" href="contact.html?product=${encodeURIComponent(p.name)}">Request this product →</a></div></article>`}).join(""):`<div class="empty"><strong>No ${esc(wanted)} products are currently listed.</strong><br>More products will be added as the Labaid catalogue is prepared.</div>`;
}
loadProducts();loadInventoryProducts();