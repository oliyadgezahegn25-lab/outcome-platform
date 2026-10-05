const outcomes=[
  {slug:"wedding",icon:"💍",name:"Wedding",desc:"Plan a wedding from vision to execution."},
  {slug:"travel",icon:"✈️",name:"Travel",desc:"Turn a destination into a complete plan."},
  {slug:"study-abroad",icon:"🎓",name:"Study Abroad",desc:"Plan applications, funding and relocation."},
  {slug:"find-a-job",icon:"💼",name:"Find a Job",desc:"Move from career goal to opportunity."},
  {slug:"move-home",icon:"🏠",name:"Move Home",desc:"Organize a move from one place to another."},
  {slug:"buy-a-car",icon:"🚗",name:"Buy a Car",desc:"Define, compare and plan the purchase."},
  {slug:"start-a-business",icon:"🏢",name:"Start a Business",desc:"Turn an idea into a launch plan."},
  {slug:"plan-an-event",icon:"🎉",name:"Plan an Event",desc:"Coordinate people, resources and timing."},
  {slug:"learn-something",icon:"📚",name:"Learn Something",desc:"Create a personalized learning path."},
  {slug:"organize-healthcare",icon:"🏥",name:"Organize Healthcare",desc:"Organize appointments and logistics."},
  {slug:"move-ship-something",icon:"📦",name:"Move / Ship Something",desc:"Plan logistics for moving or shipping."},
  {slug:"something-else",icon:"➕",name:"Something Else",desc:"Start with any outcome you have in mind."}
];

const grid=document.getElementById("outcomeGrid");
grid.innerHTML=outcomes.map(o=>`<button class="outcome-card" data-slug="${o.slug}"><span class="outcome-icon">${o.icon}</span><span class="outcome-arrow">↗</span><h3>${o.name}</h3><p>${o.desc}</p></button>`).join("");

const modal=document.getElementById("modal"), content=document.getElementById("modalContent");
function openStart(){
  content.innerHTML=`<span class="eyebrow small">Choose where to begin</span><h2>What do you want to make happen?</h2><p>Pick an outcome. We’ll guide you through the important details and turn it into a plan.</p><div class="choice-grid">${outcomes.map(o=>`<button class="choice" data-choice="${o.slug}">${o.icon} &nbsp; ${o.name}</button>`).join("")}</div>`;
  modal.classList.add("open");
  document.querySelectorAll("[data-choice]").forEach(b=>b.addEventListener("click",()=>openBuilder(b.dataset.choice)));
}
function openBuilder(slug){
  const o=outcomes.find(x=>x.slug===slug);
  content.innerHTML=`<span class="eyebrow small">${o.icon} ${o.name}</span><h2>Let's define your outcome.</h2><p>You don't need to know the steps. Just tell us what you want the result to look like.</p><input class="modal-input" id="outcomeTitle" placeholder="For example: Plan my wedding in Addis Ababa" autofocus><button class="primary-button" style="margin-top:16px;width:100%" id="continueBtn">Continue <span>→</span></button>`;
  document.getElementById("continueBtn").onclick=()=>openDetails(o);
}
function openDetails(o){
  const title=document.getElementById("outcomeTitle").value.trim() || `My ${o.name.toLowerCase()} outcome`;
  content.innerHTML=`<span class="eyebrow small">Step 2 of 3</span><h2>Tell us the important bits.</h2><p>We’ll use these to build the first version of your plan.</p><input class="modal-input" id="location" placeholder="Where? (optional)"><input class="modal-input" id="budget" placeholder="Budget? (optional)" type="text"><input class="modal-input" id="deadline" placeholder="When do you want it done? (optional)" type="text"><button class="primary-button" style="margin-top:16px;width:100%" id="buildBtn">Build my plan <span>✦</span></button>`;
  document.getElementById("buildBtn").onclick=()=>showPlan(o,title);
}
function showPlan(o,title){
  content.innerHTML=`<span class="eyebrow small">Your first outcome</span><h2>${title}</h2><p>Your outcome is defined. The next layer will turn this into tasks, research, decisions and actions.</p><div style="background:#f1f5f2;border-radius:16px;padding:18px;margin:20px 0"><strong>✦ Outcome engine ready</strong><p style="margin:7px 0 0;font-size:13px">We’ll break this outcome into a plan with clear next steps.</p></div><button class="primary-button" style="width:100%" onclick="document.getElementById('modal').classList.remove('open')">Back to outcomes <span>→</span></button>`;
}
document.getElementById("startTop").onclick=openStart;
document.getElementById("startHero").onclick=openStart;
document.getElementById("startBottom").onclick=openStart;
document.getElementById("closeModal").onclick=()=>modal.classList.remove("open");
modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("open")});
document.querySelectorAll(".outcome-card").forEach(b=>b.addEventListener("click",()=>openBuilder(b.dataset.slug)));