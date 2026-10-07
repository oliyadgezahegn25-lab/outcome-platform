(function(){
const root=document.getElementById("labaidChat");if(!root)return;
const toggle=document.getElementById("chatToggle"),close=document.getElementById("chatClose"),panel=document.getElementById("chatPanel"),form=document.getElementById("chatForm"),input=document.getElementById("chatInput"),messages=document.getElementById("chatMessages");
function open(){root.classList.add("open");toggle.setAttribute("aria-expanded","true");setTimeout(()=>input.focus(),80)}
function shut(){root.classList.remove("open");toggle.setAttribute("aria-expanded","false")}
function add(text,type){const d=document.createElement("div");d.className="chat-message "+type;d.textContent=text;messages.appendChild(d);messages.scrollTop=messages.scrollHeight}
function reply(q){
 const x=q.toLowerCase();
 if(/quote|quotation|price|buy|purchase/.test(x))return"Absolutely. Send the product name, specification and quantity you need. You can also use the Request a Quote button on the site.";
 if(/chemical|reagent/.test(x))return"We supply laboratory chemicals and reagents listed in our catalogue. Tell me the chemical name, CAS number or specification and I can help narrow the requirement.";
 if(/equipment|instrument|device|microscope|centrifuge|incubator|multimeter/.test(x))return"We supply laboratory equipment and instruments, including items such as microscopes, centrifuges, incubators, water baths and meters. Tell me what you need and I can guide you.";
 if(/contact|phone|email/.test(x))return"You can reach Labaid Trading PLC in Addis Ababa at +251 922 42 84 00 or labaidtrading@gmail.com.";
 return"I can help with Labaid products, chemicals, equipment and quotation requests. Try asking about a laboratory device, a chemical, or a quotation.";
}
function send(q){q=(q||"").trim();if(!q)return;add(q,"user");input.value="";const t=document.createElement("div");t.className="chat-message bot chat-typing";t.textContent="Thinking…";messages.appendChild(t);messages.scrollTop=messages.scrollHeight;setTimeout(()=>{t.remove();add(reply(q),"bot")},450)}
toggle.addEventListener("click",()=>root.classList.contains("open")?shut():open());close.addEventListener("click",shut);
form.addEventListener("submit",e=>{e.preventDefault();send(input.value)});
root.querySelectorAll("[data-chat]").forEach(b=>b.addEventListener("click",()=>send(b.dataset.chat)));
})();