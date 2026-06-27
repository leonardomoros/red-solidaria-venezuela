var e=[];function t(e){return String(e||``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function n(e){return(e||``).toLowerCase().normalize(`NFD`).replace(/[̀-ͯ]/g,``).trim()}function r(e){return`h_`+e.toLowerCase().normalize(`NFD`).replace(/[̀-ͯ]/g,``).replace(/[^a-z0-9]+/g,`_`).replace(/^_+|_+$/g,``)}function i(){let r=n(document.getElementById(`cruce-nombre`).value),i=document.getElementById(`cruce-cedula`).value.trim().replace(/[^0-9]/g,``),a=document.getElementById(`cruce-results`);if(a.style.display=`block`,!r&&!i){a.innerHTML=`<p class="cruce-none">Ingresa un nombre o cédula para buscar.</p>`;return}if(!e.length){a.innerHTML=`<p class="cruce-none">Datos cargando, espera un momento...</p>`;return}let o=[];for(let t of e){let e=!1,a=!1;if(r){let i=r.split(` `).filter(e=>e.length>2);i.length&&(e=i.filter(e=>n(t.nm).includes(e)).length>=Math.min(2,i.length))}i&&t.c&&(a=t.c.replace(/[^0-9]/g,``)===i),(e||a)&&o.push({...t,mN:e,mC:a})}if(!o.length){a.innerHTML=`<div class="cruce-none">Sin coincidencias en listas actuales. Llama al hospital o <a href="https://desaparecidosterremotovenezuela.com/" target="_blank" style="color:var(--red);font-weight:700">repórtalo aquí →</a></div>`;return}let s=o.map(e=>`<li><strong>`+t(e.nm)+`</strong>`+(e.mC?`<span class="cruce-match-badge match-cedula">Cédula</span>`:``)+(e.mN&&!e.mC?`<span class="cruce-match-badge match-nombre">Nombre</span>`:``)+`  `+t(e.h)+(e.e?` · `+t(e.e)+` años`:``)+`</li>`).join(``);a.innerHTML=`<div class="cruce-alert"><h5>`+o.length+` coincidencia`+(o.length>1?`s`:``)+` encontrada`+(o.length>1?`s`:``)+`</h5><ul>`+s+`</ul><p style="font-size:12px;color:var(--muted);margin-top:8px">Verifica llamando al hospital.</p></div>`}document.getElementById(`cruce-nombre`).addEventListener(`keydown`,e=>{e.key===`Enter`&&i()}),document.getElementById(`cruce-cedula`).addEventListener(`keydown`,e=>{e.key===`Enter`&&i()});function a(e){let i={};for(let t of e)i[t.h]||(i[t.h]=[]),i[t.h].push(t);let a=document.getElementById(`hosp-accordion`),o=Object.entries(i);if(!o.length){a.innerHTML=`<div class="no-res">No hay datos disponibles. Revisa la configuración de Google Sheets.</div>`;return}a.innerHTML=o.map(([e,i])=>{let a=r(e),o=/acopio|refugio|golf|campo/i.test(e),s=o?`border-color:#F59E0B`:``,c=o?`background:#FEF8EE`:``,l=o?`🏕️`:`🏥`,u=o?`personas`:`pacientes`,d=o?`background:#FEF3CD;color:#92400E`:``,f=o?`border-top:1px solid #F59E0B`:``,p=o?`background:#FFFBEB`:``,m=o?`<div style="background:#FFFBEB;padding:10px 16px;font-size:12px;color:#92400E;border-bottom:1px solid #F59E0B">⚠️ Estas personas <strong>no están hospitalizadas</strong> — se encuentran en un centro de acopio.</div>`:``,h=i.map(e=>{let r=n(e.nm),i=(e.c||``).replace(/[^0-9]/g,``);return`<li class="patient-row" data-nm="${t(r)}" data-ced="${t(i)}">
        <div>
          <div class="patient-nm">${t(e.nm)}</div>
          ${e.d?`<div class="patient-detail">${t(e.d)}</div>`:``}
        </div>
        <div class="patient-tags">
          ${o?`<span class="ptag" style="background:#FEF3CD;color:#92400E">Refugio</span>`:``}
          ${e.e?`<span class="ptag ptag-age">${t(e.e)}</span>`:``}
          ${e.c&&!o?`<span class="ptag ptag-ced">${t(e.c)}</span>`:``}
        </div>
      </li>`}).join(``);return`<div class="hosp-panel" style="${s}">
      <div class="hosp-header" onclick="toggleHosp(this,'${a}')" style="${c}">
        <div class="hosp-header-left">
          <span class="hosp-name">${l} ${t(e)}</span>
          <span class="hosp-badge" style="${d}">${i.length} ${u}</span>
        </div>
        <span class="hosp-chevron">▼</span>
      </div>
      <div class="hosp-body" id="${a}" style="${f}">
        <div class="hosp-search-row" style="${p}">
          <input class="hosp-search" type="search"
            placeholder="Buscar en este ${o?`refugio`:`hospital`}..."
            oninput="filterHosp(this,'${a}')"
            autocomplete="off" autocorrect="off" spellcheck="false"/>
        </div>
        ${m}
        <ul class="patient-list" id="list_${a}">${h}</ul>
        <div class="hosp-show-more" id="more_${a}" style="display:none">
          <button onclick="showAll('${a}')">Ver los ${i.length} ${u} ↓</button>
        </div>
      </div>
    </div>`}).join(``)}async function o(){try{let t=await fetch(`/api/pacientes`);if(!t.ok)throw Error(`HTTP `+t.status);e=await t.json(),a(e);let n=document.getElementById(`pacientes-stats`);n&&(n.textContent=`${e.length} registros · ${new Set(e.map(e=>e.h)).size} centros · Actualizado ${new Date().toLocaleDateString(`es-VE`,{day:`numeric`,month:`short`,year:`numeric`})}`)}catch(e){console.error(`[Buscador]`,e),document.getElementById(`hosp-accordion`).innerHTML=`<div class="no-res">Error al cargar datos. <button onclick="loadPatients()" style="color:var(--blue);font-weight:700;background:none;border:none;cursor:pointer">Reintentar →</button></div>`}}document.querySelectorAll(`section[id]`).forEach(e=>new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&document.querySelectorAll(`#main-nav a`).forEach(t=>t.classList.toggle(`active`,t.getAttribute(`href`)===`#`+e.target.id))})},{threshold:.25}).observe(e)),document.querySelectorAll(`a[href^="#"]`).forEach(e=>{e.addEventListener(`click`,t=>{let n=document.querySelector(e.getAttribute(`href`));n&&(t.preventDefault(),n.scrollIntoView({behavior:`smooth`,block:`start`}))})}),o();