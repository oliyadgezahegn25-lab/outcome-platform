const SUPABASE_URL="https://bpqtmqlnohwqrxdcaiwc.supabase.co";
const SUPABASE_KEY="sb_publishable__KsZBL-4weWb-a8ZdWGjGA_XHHMG9wH";
const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const categoryFilter=document.getElementById("categoryFilter"),productGrid=document.getElementById("productGrid"),serviceGrid=document.getElementById("serviceGrid"),modal=document.getElementById("productModal"),modalContent=document.getElementById("modalContent");
const icons=["🧪","🔬","⚗️","⚕️","💻","⚡","⚙️"];
const esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
function card(p){return `<article class="product-card"><div class="product-visual"><span class="product-symbol">${icons[(p.sort_order||0)%icons.length]}</span></div><div class="product-body"><span class="tag">${esc(p.category?.name||"Product")}</span><h3>${esc(p.name)}</h3><p>${esc(p.short_description||"Professional equipment and solutions available from Labaid Trading PLC.")}</p><button class="product-link" data-product="${p.id}">View product →</button></div></article>`}
async function loadProducts(){
 const [{data:cats,error:ce},{data:products,error:pe},{data:services,error:se}]=await Promise.all([
  db.from("product_categories").select("*").eq("published",true).order("sort_order"),
  db.from("products").select("*,category:product_categories(name)").eq("published",true).order("featured",{ascending:false}).order("sort_order"),
  db.from("services").select("*").eq("published",true).order("sort_order")
 ]);
 if(ce||pe||se){console.error(ce||pe||se);productGrid.innerHTML='<div class="empty">Products are temporarily unavailable. Please contact Labaid directly.</div>';return}
 categoryFilter.innerHTML='<button class="active" data-cat="all">All Products</button>'+cats.map(c=>`<button data-cat="${c.id}">${esc(c.name)}</button>`).join("");
 render(products||[]);
 categoryFilter.querySelectorAll("button").forEach(b=>b.onclick=()=>{categoryFilter.querySelectorAll("button").forEach(x=>x.classList.remove("active"));b.classList.add("active");render(b.dataset.cat==="all"?products:products.filter(p=>p.category_id===b.dataset.cat))});
 serviceGrid.innerHTML=(services||[]).map(s=>`<article class="service-card"><span class="service-icon">${s.icon||"✦"}</span><h3>${esc(s.name)}</h3><p>${esc(s.description||"")}</p></article>`).join("");
}
function render(list){productGrid.innerHTML=list.length?list.map(card).join(""):'<div class="empty"><strong>Products are being added.</strong><br>Contact Labaid for a specific product requirement.</div>';productGrid.querySelectorAll("[data-product]").forEach(b=>b.onclick=()=>openProduct(b.dataset.product))}
async function openProduct(id){
 const {data:p}=await db.from("products").select("*,category:product_categories(name)").eq("id",id).single();if(!p)return;
 modalContent.innerHTML=`<span class="modal-meta">${esc(p.category?.name||"Product")}</span><h2>${esc(p.name)}</h2>${p.brand?`<p><strong>Brand:</strong> ${esc(p.brand)}${p.model?` &nbsp; <strong>Model:</strong> ${esc(p.model)}`:''}</p>`:''}<p>${esc(p.description||p.short_description||"Contact Labaid for product information and availability.")}</p><a class="primary" href="#contact" onclick="closeModal()">Request a quote <span>→</span></a>`;
 modal.classList.add("open");
}
function closeModal(){modal.classList.remove("open")}
document.getElementById("modalClose").onclick=closeModal;modal.onclick=e=>{if(e.target===modal)closeModal()};
document.getElementById("quoteForm").addEventListener("submit",async e=>{
 e.preventDefault();const status=document.getElementById("formStatus");status.textContent="Sending your request…";
 const payload={name:document.getElementById("name").value.trim(),organization:document.getElementById("organization").value.trim()||null,email:document.getElementById("email").value.trim(),phone:document.getElementById("phone").value.trim()||null,subject:document.getElementById("subject").value.trim()||null,message:document.getElementById("message").value.trim()};
 const {error}=await db.from("inquiries").insert(payload);
 if(error){console.error(error);status.textContent="We couldn't send the request. Please try again.";return}
 e.target.reset();status.textContent="Thank you — your request has been received.";
});
loadProducts();