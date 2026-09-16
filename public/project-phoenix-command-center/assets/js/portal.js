
(function(){
  document.querySelectorAll('img[data-official-logo]').forEach(el=>{ const test=new Image(); test.onload=()=>{el.src=el.dataset.officialLogo}; test.src=el.dataset.officialLogo; });
  const toggle=document.querySelector('[data-mobile-toggle]'); const sb=document.querySelector('.sidebar');
  if(toggle&&sb) toggle.addEventListener('click',()=>sb.classList.toggle('open'));
  document.querySelectorAll('[data-filter-table]').forEach(wrap=>{
    const table=document.querySelector(wrap.dataset.filterTable); if(!table)return;
    const input=wrap.querySelector('input[type="search"]'); const select=wrap.querySelector('select');
    const run=()=>{const q=(input?.value||'').toLowerCase(); const s=(select?.value||'').toLowerCase(); table.querySelectorAll('tbody tr').forEach(tr=>{const txt=tr.innerText.toLowerCase(); const st=(tr.dataset.status||'').toLowerCase(); tr.style.display=(!q||txt.includes(q))&&(!s||st===s)?'':'none';});};
    input?.addEventListener('input',run); select?.addEventListener('change',run);
  });
  document.querySelectorAll('[data-scenario-tabs]').forEach(group=>{
    group.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{
      group.querySelectorAll('button').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
      const target=btn.dataset.target; document.querySelectorAll('.scenario').forEach(s=>s.classList.toggle('active',s.id===target));
    }));
  });
  document.querySelectorAll('[data-now-year]').forEach(x=>x.textContent=new Date().getFullYear());
})();
