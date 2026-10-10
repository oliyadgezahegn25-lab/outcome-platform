// Cinematic company presentation
(function(){
 const slides=[...document.querySelectorAll('.presentation-slide')],dots=[...document.querySelectorAll('#slideProgress button')],count=document.getElementById('slideCount'),prev=document.getElementById('slidePrev'),next=document.getElementById('slideNext');
 if(!slides.length)return; let index=0,timer;
 function show(n){index=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.classList.toggle('active',i===index));dots.forEach((d,i)=>d.classList.toggle('active',i===index));if(count)count.textContent=String(index+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');}
 function restart(){clearInterval(timer);timer=setInterval(()=>show(index+1),7000)}
 prev&&prev.addEventListener('click',()=>{show(index-1);restart()});next&&next.addEventListener('click',()=>{show(index+1);restart()});dots.forEach(d=>d.addEventListener('click',()=>{show(Number(d.dataset.goto));restart()}));
 const stage=document.querySelector('.presentation-stage');stage&&stage.addEventListener('mouseenter',()=>clearInterval(timer));stage&&stage.addEventListener('mouseleave',restart);show(0);restart();
})();

const SUPABASE_URL="https://bpqtmqlnohwqrxdcaiwc.supabase.co";
const SUPABASE_KEY="sb_publishable__KsZBL-4weWb-a8ZdWGjGA_XHHMG9wH";
const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const categoryFilter=document.getElementById("categoryFilter"),categoryGrid=document.getElementById("categoryGrid"),productCategoryNav=document.getElementById("productCategoryNav"),productGrid=document.getElementById("productGrid"),serviceGrid=document.getElementById("serviceGrid"),modal=document.getElementById("productModal"),modalContent=document.getElementById("modalContent");
const icons=["🧪","🔬","⚗️","⚕️","💻","⚡","⚙️"];
const productImages={
"Laboratory Incubator":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Laboratory_Incubator%3B_from_a_medical_laboratory_in_Abuja%2C_Nigeria.png",
"Laminar Flow Cabinet":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Laminar_Flow_Cabinet_for_Tissue_Culture.jpg",
"Biological Safety Cabinet":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Biological_Safety_Cabinet_%28Class_II%2C_Type_A2%29_Front_view.jpg",
"PCR Tube":"https://commons.wikimedia.org/wiki/Special:Redirect/file/PCR_Tubes.jpg",
"Autoclave":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Laboratory_autoclave.jpg",
"Beakers and Laboratory Glassware":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Laboratory_beaker.jpg",
"Rotary Evaporator":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Rotary_evaporator2.jpg",
"Binocular Microscope":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Microscopio_optico_imagem_sem_fundo.png",
"Petri Dishes":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Petri_dishes.jpg",
"Acetic Acid":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Acetic_acid.jpg",
"Sodium Hydroxide":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Sodium_hydroxide.jpg",
"Sodium Chloride":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Sodium_chloride.JPG",
"Potassium Hydroxide":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Potassium_hydroxide.jpg",
"Calcium Hydroxide":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Calcium_hydroxide.jpg",
"Ethanol":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Sample_of_Absolute_Ethanol.jpg",
"Sulphuric Acid":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Sulfuric_Acid.jpg",
"Hydrochloric Acid":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Hydrochloric_Acid.jpg",
"Sucrose":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Crystals_of_sucrose.jpg"
};
const categoryImages={
"Laboratory Equipment":"header one.jpg",
"Laboratory Chemicals & Reagents":"alex-yS3XM9qx3hQ-unsplash.jpg",
"Research & Scientific Equipment":"https://images.pexels.com/photos/8442022/pexels-photo-8442022.jpeg?auto=compress&cs=tinysrgb&w=1600",
"Medical Equipment":"https://images.pexels.com/photos/31188648/pexels-photo-31188648.jpeg?auto=compress&cs=tinysrgb&w=1600"
}
const esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
function card(p){const image=p.image_url||productImages[p.name]||categoryImages[p.category?.name];return `<article class="product-card"><div class="product-visual">${image?`<img class="product-photo" src="${esc(image)}" alt="${esc(p.name)}" loading="lazy" decoding="async">`:`<span class="product-symbol">${icons[(p.sort_order||0)%icons.length]}</span>`}</div><div class="product-body"><span class="tag">${esc(p.category?.name||"Product")}</span><h3>${esc(p.name)}</h3><p>${esc(p.short_description||"Professional equipment and solutions available from Labaid Trading PLC.")}</p><button class="product-link" data-product="${p.id}">View product →</button></div></article>`}
async function loadProducts(){
 const queries=[
  db.from("product_categories").select("*").eq("published",true).order("sort_order"),
  db.from("products").select("*,category:product_categories(name)").eq("published",true).order("featured",{ascending:false}).order("sort_order"),
  db.from("services").select("*").eq("published",true).order("sort_order")
 ];
 const [{data:cats,error:ce},{data:products,error:pe},{data:services,error:se}]=await Promise.all(queries);
 if(ce||pe){console.error(ce||pe);if(productGrid)productGrid.innerHTML='<div class="empty">Products are temporarily unavailable. Please contact Labaid directly.</div>';return}
 if(categoryGrid){
  const wanted=["Laboratory Equipment","Laboratory Chemicals & Reagents","Research & Scientific Equipment","Medical Equipment"];
  const available=wanted.map((name,i)=>name==="All Products"?{name,description:"Browse the complete Labaid product range."}:{...(cats||[]).find(c=>c.name===name),name});
  categoryGrid.innerHTML=available.map((c,i)=>{const live= c.name==="Laboratory Equipment" ? (cats||[]).find(x=>x.name==="Laboratory Equipment & Instruments") : (cats||[]).find(x=>x.name===c.name); const count=(products||[]).filter(p=>p.category?.name===c.name || (c.name==="Laboratory Equipment"&&p.category?.name==="Laboratory Equipment & Instruments")).length; const displayCount=count?count+" listed":"Explore area"; return `<a class="category-card" href="${c.name==="All Products"?"products.html":"products.html?category="+encodeURIComponent(c.name)}"><div class="category-image">${categoryImages[c.name]?`<img src="${categoryImages[c.name]}" alt="${esc(c.name)}" loading="lazy" decoding="async">`:`<div class="category-no-image">CHEMICALS<br><span>Products & Reagents</span></div>`}</div><div class="category-content"><span>0${i+1} · ${count?"LIVE CATALOGUE":"PRODUCT AREA"}</span><h3>${esc(c.name)}</h3><p>${esc(c.description||"Explore products in this category.")}</p><strong><span>${esc(displayCount)}</span><b>→</b></strong></div></a>`}).join("");
 }
 if(categoryFilter){categoryFilter.style.display="none";categoryFilter.innerHTML='<button class="active" data-cat="all">All Products</button>'+(cats||[]).map(c=>`<button data-cat="${c.id}">${esc(c.name)}</button>`).join("");categoryFilter.querySelectorAll("button").forEach(b=>b.onclick=()=>{categoryFilter.querySelectorAll("button").forEach(x=>x.classList.remove("active"));b.classList.add("active");render(b.dataset.cat==="all"?products:products.filter(p=>p.category_id===b.dataset.cat))})}
 render(products||[]);
 if(serviceGrid)serviceGrid.innerHTML=se?( '<div class="empty">Services are temporarily unavailable.</div>'):(services||[]).map(s=>`<article class="service-card"><span class="service-icon">${s.icon||"✦"}</span><h3>${esc(s.name)}</h3><p>${esc(s.description||"")}</p></article>`).join("");
}
function render(list){if(!productGrid)return;productGrid.innerHTML=list.length?list.map(card).join(""):'<div class="empty"><strong>Products are being added.</strong><br>Contact Labaid for a specific product requirement.</div>';productGrid.querySelectorAll("[data-product]").forEach(b=>b.onclick=()=>openProduct(b.dataset.product))}
async function openProduct(id){
 const {data:p}=await db.from("products").select("*,category:product_categories(name)").eq("id",id).single();if(!p||!modalContent)return;
 const image=p.image_url||productImages[p.name]||categoryImages[p.category?.name];
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
 if(!productGrid||!location.pathname.endsWith("products.html"))return;
 const cats=["Laboratory Devices & Instruments","Laboratory Chemicals & Reagents"];
 const params=new URLSearchParams(location.search);
 const wanted=params.get("category")||"All Products";
 const searchInput=document.getElementById("productSearch");
 const resultCount=document.getElementById("resultCount");
 const summary=document.getElementById("catalogueSummary");

 const deviceTerms=[
  "centrifuge","microscope","autoclave","incubator","water bath","dry oven","muffle furnace",
  "laminar flow","biological safety","biosafety","multimeter","pH meter","ph meter","turbidity",
  "balance","thermometer","thermohygrometer","barometer","hydrometer","haemometer","heating mantle",
  "rotary evapor","refrigerator","freezer","water distill","distiller","colony counter","sieve shaker",
  "ec/tds","tds tester","conductivity","galvano","oscillator","oscilloscope","projector",
  "electric milk separator","soldering iron","digital display","body fat analyzer","blood pressure",
  "simulator","water proof ec","meter"
 ];
 const isDevice=p=>{
  const n=(p.name||"").toLowerCase();
  return (p.category?.name==="Laboratory Equipment & Instruments" &&
    deviceTerms.some(term=>n.includes(term)) &&
    !/tube|tip|paper|bottle|flask|beaker|pipette|pippet|glove|gown|mask|bag|syringe|lancet|chart|model|antibiotic|amoxic|ampicillin|cef|doxy|erythromycin|kanamycin|nalidixic|norfloxacin|piperacillin|tetracycline|trimethoprim|vancomycin|injection|saline|lido caine|buffer|reagent|electrode|probe|accessory|cable/.test(n));
 };
 const normalize=n=>(n||"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
 if(productCategoryNav){
  productCategoryNav.innerHTML=[["All Products",""],...cats.map(x=>[x,x])].map(([x,v],i)=>`<a class="mini-category ${wanted===x?"active":""}" href="products.html${v?"?category="+encodeURIComponent(v):""}"><span class="mini-category-symbol">${i===0?"◈":i===1?"⚙":"🧪"}</span><span>${esc(x)}</span><b>→</b></a>`).join("");
 }
 const {data:items,error}=await db.from("products").select("id,name,brand,model,category:product_categories(name),image_url,catalog_url,short_description,description,sort_order").eq("published",true).order("featured",{ascending:false}).order("sort_order");
 if(error){console.error(error);productGrid.innerHTML='<div class="empty"><strong>Catalogue temporarily unavailable.</strong><br>Please contact Labaid directly.</div>';return}

 const seen=new Set();
 const consumableTerms=/\\b(tube|tips?|pipettes?|pippettes?|petri dishes?|gloves?|masks?|gowns?|syringes?|needles?|lancets?|test strips?|filter paper|blotting paper|weighing paper|labels?|slides?|cover slips?|cuvettes?|bottles?|sample containers?|centrifuge tubes?|microtubes?|swabs?|gauze|bandages?|cotton wool|disposable|single use|consumable|reagent strips?)\\b/i;
 const products=(items||[]).filter(p=>{
  const cat=p.category?.name||"";
  if(cat==="Laboratory Chemicals & Reagents")return !consumableTerms.test(p.name||"");
  if(!isDevice(p))return false;
  const key=normalize(p.name);
  if(!key||seen.has(key))return false;
  seen.add(key);
  return true;
 });

 const apply=()=>{
  const q=(searchInput?.value||"").trim().toLowerCase();
  let filtered=products.filter(p=>{
   const cat=p.category?.name||"";
   return wanted==="All Products"||(wanted==="Laboratory Devices & Instruments"&&cat==="Laboratory Equipment & Instruments")||(wanted===cat);
  });
  if(q)filtered=filtered.filter(p=>[p.name,p.brand,p.model,p.short_description,p.description,p.category?.name].filter(Boolean).join(" ").toLowerCase().includes(q));
  if(resultCount)resultCount.textContent=`${filtered.length} product${filtered.length===1?"":"s"} shown`;
  if(summary)summary.textContent=`${products.length} selected catalogue items — laboratory devices and instruments plus the current chemical range. Supplies and consumables are kept out of this product list.`;
  productGrid.innerHTML=filtered.length?filtered.map(p=>{
    const cat=p.category?.name==="Laboratory Equipment & Instruments"?"Laboratory Devices & Instruments":(p.category?.name||"Product");
    const image=p.image_url||productImages[p.name]||categoryImages[p.category?.name||cat];
    const meta=[p.brand,p.model].filter(Boolean).join(" · ");
    return `<article class="product-card"><div class="product-visual">${image?`<img class="product-photo" src="${esc(image)}" alt="${esc(p.name)}" loading="lazy" decoding="async">`:`<div class="catalogue-visual"><span>${esc(cat==="Laboratory Chemicals & Reagents"?"CHEMICAL":"LABAID")}</span><b>◈</b></div>`}</div><div class="product-body"><span class="tag">${esc(cat)}</span><h3>${esc(p.name)}</h3>${meta?`<div class="product-meta">${esc(meta)}</div>`:""}<p>${esc(p.short_description||p.description||"Available from Labaid Trading PLC for institutional requirements.")}</p>${p.catalog_url?`<a class="product-link" href="${esc(p.catalog_url)}" target="_blank" rel="noopener">View catalogue →</a>`:""} <a class="product-link" href="contact.html?product=${encodeURIComponent(p.name)}">Request quotation →</a></div></article>`;
  }).join(""):'<div class="empty"><strong>No matching products.</strong><br>Try another search or send the specification to Labaid.</div>';
 };
 searchInput?.addEventListener("input",apply);
 document.getElementById("clearSearch")?.addEventListener("click",()=>{if(searchInput)searchInput.value="";apply();});
 apply();
}
if(location.pathname.endsWith("products.html")){loadInventoryProducts();}else{loadProducts();}
/* Hero showcase rotation */
(function(){
 const n=document.getElementById('heroShowcaseNumber'),t=document.getElementById('heroShowcaseTitle'),sub=document.getElementById('heroShowcaseSub'),bars=[...document.querySelectorAll('.showcase-progress i')];
 if(!n)return;
 const items=[['01','LABORATORY','EQUIPMENT & SUPPLIES'],['02','SCIENTIFIC','RESEARCH & EQUIPMENT'],['03','MEDICAL','EQUIPMENT & SUPPORT'],['04','IT & ELECTRICAL','IT · POWER · ELECTRICAL']];
 let i=0; setInterval(()=>{i=(i+1)%items.length; n.textContent=items[i][0];t.textContent=items[i][1];sub.textContent=items[i][2];bars.forEach((b,j)=>b.classList.toggle('active',j===i));},3600);
})();

// Partners page interactions
(function(){
 const cards=[...document.querySelectorAll('.partner-card')];
 cards.forEach((card,i)=>{card.style.setProperty('--partner-delay', (i*90)+'ms');});
})();


/* === Section image slideshows === */
(function(){
  function cycle(selector,delay){
    document.querySelectorAll(selector).forEach((wrap,i)=>{
      const slides=[...wrap.querySelectorAll('img')];
      if(slides.length<2)return;
      let n=0;
      setTimeout(()=>{
        setInterval(()=>{
          slides[n].classList.remove('active');
          slides[n].setAttribute('aria-hidden','true');
          n=(n+1)%slides.length;
          slides[n].classList.add('active');
          slides[n].setAttribute('aria-hidden','false');
        },delay);
      },i*700);
    });
  }
  cycle('[data-category-slideshow]',4200);
  cycle('[data-world-slideshow]',5200);
})();

/* === Site motion layer === */
(function(){
 const progress=document.querySelector('.site-progress span');
 const updateProgress=()=>{const doc=document.documentElement;const max=doc.scrollHeight-doc.clientHeight;const pct=max>0?(window.scrollY/max)*100:0;if(progress)progress.style.width=pct+'%';};
 window.addEventListener('scroll',updateProgress,{passive:true});updateProgress();
 const root=document.documentElement;
 window.addEventListener('pointermove',e=>{root.style.setProperty('--mx',e.clientX+'px');root.style.setProperty('--my',e.clientY+'px');},{passive:true});
 const reveal=[...document.querySelectorAll('.wow-bridge,.presentation,.home-categories,.world-showcase,.lab-film,.pathway-wow,.cta-strip,.faq-section,.audience-wow,.partner-home')];
 reveal.forEach(el=>el.classList.add('reveal-ready'));
 if('IntersectionObserver' in window){
  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target)}}),{threshold:.12});
  reveal.forEach(el=>io.observe(el));
 }else reveal.forEach(el=>el.classList.add('is-visible'));
})();


/* === Full experience interactions === */
(function(){
 const navMenu=document.querySelector('.nav-menu');
 navMenu&&navMenu.addEventListener('click',()=>{const open=document.body.classList.toggle('mobile-nav-open');navMenu.setAttribute('aria-expanded',String(open));});
 document.querySelectorAll('.nav-mega-trigger').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();const wrap=btn.closest('.nav-products-wrap');const open=wrap.classList.toggle('is-open');btn.setAttribute('aria-expanded',String(open));}));
 document.addEventListener('click',e=>{if(!e.target.closest('.nav-products-wrap'))document.querySelectorAll('.nav-products-wrap.is-open').forEach(w=>w.classList.remove('is-open'));});
 const intro=document.getElementById('entranceExperience');
 if(intro){
   const seen=sessionStorage.getItem('labaid_intro_seen');
   if(seen)intro.classList.add('is-done');
   else setTimeout(()=>{intro.classList.add('is-done');sessionStorage.setItem('labaid_intro_seen','1');},1750);
 }
})();
(function(){
 const searchParams=new URLSearchParams(location.search);
 const type=searchParams.get('type'); const subject=document.getElementById('subject'); const message=document.getElementById('message');
 if(subject&&type&&!subject.value) subject.value=type+' requirement';
 if(subject&&searchParams.get('product')&&!subject.value) subject.value=searchParams.get('product');
 if(message&&type&&!message.value) message.value='Requirement type: '+type+'\n\nPlease add the specification, quantity, delivery requirement or other details you have.';
 const quoteChoices=[...document.querySelectorAll('.quote-choice-grid a')];
 quoteChoices.forEach(a=>a.addEventListener('click',()=>{try{localStorage.setItem('labaid_quote_type',a.dataset.type||'')}catch(e){}}));
})();

```javascript
(function () {
  const form = document.getElementById('quoteForm');
  if (!form) return;

  const hidden = document.getElementById('requirementType');
  const buttons = [
    ...document.querySelectorAll('.requirement-types button')
  ];

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (hidden) hidden.value = btn.dataset.type || '';
    });
  });

  let savedType = '';
  try {
    savedType = localStorage.getItem('labaid_quote_type') || '';
  } catch (err) {}

  const typeFromUrl = new URLSearchParams(location.search).get('type');
  const initial = typeFromUrl || savedType;

  if (initial) {
    const selectedButton = buttons.find(
      btn => btn.dataset.type === initial
    );

    if (selectedButton) selectedButton.click();
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const status = document.getElementById('formStatus');
    const submitButton = form.querySelector('[type="submit"]');

    if (!status) return;

    if (!form.reportValidity()) return;

    const name = document.getElementById('name').value.trim();
    const organization =
      document.getElementById('organization').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const baseSubject =
      document.getElementById('subject').value.trim() ||
      'General requirement';
    const quantity =
      document.getElementById('quantity').value.trim();
    const message =
      document.getElementById('message').value.trim();
    const selected = hidden?.value || 'General';

    const subject = '[' + selected + '] ' + baseSubject;
    const detail = quantity
      ? 'Quantity: ' + quantity + '\n\n' + message
      : message;

    const payload = {
      name,
      organization: organization || null,
      email,
      phone: phone || null,
      subject,
      message: detail
    };

    const emailPayload = {
      ...payload,
      organization: organization || '',
      phone: phone || '',
      quantity,
      requirementType: selected,
      _subject: 'New website enquiry: ' + subject
    };

    status.textContent = 'Sending your request…';

    if (submitButton) submitButton.disabled = true;

    try {
      const results = await Promise.allSettled([
        fetch('https://formspree.io/f/xjygrypp', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailPayload)
        }).then(async response => {
          if (!response.ok) {
            throw new Error('Email submission failed');
          }
          return true;
        }),

        db.from('inquiries').insert(payload).then(({ error }) => {
          if (error) throw error;
          return true;
        })
      ]);

      const emailSent = results[0].status === 'fulfilled';
      const savedToDatabase = results[1].status === 'fulfilled';

      if (!emailSent) {
        console.error('Formspree submission failed:', results[0].reason);
      }

      if (!savedToDatabase) {
        console.error('Supabase submission failed:', results[1].reason);
      }

      if (emailSent) {
        form.reset();
        buttons.forEach(btn => btn.classList.remove('active'));
        if (hidden) hidden.value = '';

        try {
          localStorage.removeItem('labaid_quote_type');
        } catch (err) {}

        status.textContent = savedToDatabase
          ? 'Your request was sent successfully. Labaid will review it and respond.'
          : 'Your request was emailed successfully, but could not be saved to the inquiry database.';
      } else if (savedToDatabase) {
        status.textContent =
          'Your request was saved, but the email could not be sent. Please try again or contact labaidtrading@gmail.com.';
      } else {
        status.textContent =
          'We could not send your request. Please try again or contact labaidtrading@gmail.com.';
      }
    } catch (error) {
      console.error('Contact form error:', error);
      status.textContent =
        'Something went wrong. Please try again or contact labaidtrading@gmail.com.';
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
})();
```
