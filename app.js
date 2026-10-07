
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
"Laboratory Equipment":"https://www.faithful.cc/uploadfile/2026/0925/20260925112019_1807.jpg",
"Laboratory Chemicals & Reagents":"https://images.pexels.com/photos/8325711/pexels-photo-8325711.jpeg?auto=compress&cs=tinysrgb&w=1800",
"Research & Scientific Equipment":"https://www.drawell.com.cn/uploadfile/2025/0108/20250108144738_9268.jpg",
"Medical Equipment":"https://www.drawell.com.cn/uploadfile/2024/0724/20240724101825_9468.jpg"
}
