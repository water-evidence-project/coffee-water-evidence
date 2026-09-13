(function(){
  const D = window.RESEARCH_DATA;
  const M = window.MODELS;

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const fmtVND = (value) => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(Math.round(value)) + ' đ';
  const fmtMillion = (value) => new Intl.NumberFormat('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);
  const fmtPct = (value, digits=1) => `${value > 0 ? '+' : ''}${new Intl.NumberFormat('vi-VN',{minimumFractionDigits:digits,maximumFractionDigits:digits}).format(value)}%`;

  function populateScale(select, labels, selected){
    select.innerHTML = '';
    Object.entries(labels).forEach(([value,label])=>{
      const option = document.createElement('option');
      option.value = value;
      option.textContent = `${value} — ${label}`;
      if(Number(value)===selected) option.selected = true;
      select.appendChild(option);
    });
  }

  function setupNavigation(){
    const toggle = $('.menu-toggle');
    const nav = $('#main-nav');
    toggle?.addEventListener('click', ()=>{
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    $$('#main-nav a').forEach(a=>a.addEventListener('click', ()=>{
      nav.classList.remove('open');
      toggle?.setAttribute('aria-expanded','false');
    }));
    document.addEventListener('keydown', (event)=>{
      if(event.key === 'Escape' && nav.classList.contains('open')){
        nav.classList.remove('open');
        toggle?.setAttribute('aria-expanded','false');
        toggle?.focus();
      }
    });
    $$('a[href="#top"]').forEach(link=>link.addEventListener('click',(event)=>{
      event.preventDefault();
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({top:0,left:0,behavior:reduced?'auto':'smooth'});
    }));
  }

  function setupCost(){
    const shortage = $('#cost-shortage');
    const decline = $('#cost-decline');
    populateScale(shortage, D.labels.shortage, 2);
    populateScale(decline, D.labels.decline, 3);

    const controls = ['#cost-area','#cost-production','#cost-irrigation','#cost-source','#cost-shortage','#cost-decline'].map(sel => $(sel));
    function update(){
      const input = {
        area: $('#cost-area').value,
        production: $('#cost-production').value,
        irrigation: $('#cost-irrigation').value,
        source: $('#cost-source').value,
        shortage: $('#cost-shortage').value,
        decline: $('#cost-decline').value
      };
      const areaRaw = Number(input.area);
      const productionRaw = Number(input.production);
      const inRange = areaRaw >= D.cost.range.area.min && areaRaw <= D.cost.range.area.max && productionRaw >= D.cost.range.production.min && productionRaw <= D.cost.range.production.max;
      const warning = $('#cost-range-warning');
      warning.hidden = inRange;
      if(!inRange){
        $('#cost-result').textContent = 'Ngoài miền mẫu';
        $('#cost-context').textContent = 'Website không ngoại suy mức chi phí ngoài khoảng giá trị đã quan sát trong mẫu nghiên cứu.';
        return;
      }
      const r = M.predictCost(input);
      $('#cost-result').textContent = fmtMillion(r.costMillion);
      $('#cost-context').textContent = `Cấu hình: ${r.area} sào · ${new Intl.NumberFormat('vi-VN').format(r.production)} kg · ${input.irrigation.toLowerCase()} · nguồn ${input.source.toLowerCase()} · thiếu nước mức ${r.shortage}/5.`;
    }
    controls.forEach(el=>el.addEventListener('input',update));
    update();
  }

  function renderWtpChart(){
    const chart = $('#wtp-chart');
    chart.innerHTML = '';
    D.wtp.bids.forEach(b=>{
      const col = document.createElement('div');
      col.className='bar-col';
      col.innerHTML = `<div class="bar-value">${(b.rate*100).toFixed(1).replace('.',',')}%</div><div class="bar" style="height:${Math.max(10,b.rate*190)}px"></div><div class="bar-label">${new Intl.NumberFormat('vi-VN').format(b.amount)} đ<br><span>n=${b.n}</span></div>`;
      chart.appendChild(col);
    });
  }

  function setupWtp(){
    const holder = $('#bid-buttons');
    let active = D.wtp.bids[1].amount;
    D.wtp.bids.forEach(b=>{
      const btn = document.createElement('button');
      btn.type='button';
      btn.className='bid-button';
      btn.dataset.amount=String(b.amount);
      btn.setAttribute('aria-pressed','false');
      btn.innerHTML=`<strong>${new Intl.NumberFormat('vi-VN').format(b.amount)} đ</strong><small>Đồng ý: ${(b.rate*100).toFixed(1).replace('.',',')}%</small>`;
      btn.addEventListener('click',()=>{ active=b.amount; syncButtons(); update(); });
      holder.appendChild(btn);
    });
    function syncButtons(){
      $$('.bid-button',holder).forEach(btn=>{
        const selected = Number(btn.dataset.amount)===active;
        btn.classList.toggle('active',selected);
        btn.setAttribute('aria-pressed',String(selected));
      });
    }
    function update(){
      const householdsInput=$('#wtp-households');
      const requested=Math.round(Number(householdsInput.value)||1);
      const safe=M.clamp(requested,1,100000);
      if(householdsInput.value==='' || requested!==safe) householdsInput.value=String(safe);
      const r=M.wtpScenario(safe,active);
      $('#wtp-rate').textContent=`${(r.rate*100).toFixed(1).replace('.',',')}%`;
      $('#wtp-participants').textContent=`≈ ${new Intl.NumberFormat('vi-VN',{maximumFractionDigits:1}).format(r.expectedParticipants)} hộ`;
      $('#wtp-funds').textContent=fmtVND(r.annualFunds);
      $('#wtp-ci').textContent=`Khoảng tin cậy 95% của tỷ lệ đồng ý trong nhóm giá này: ${(r.ci[0]*100).toFixed(1).replace('.',',')}%–${(r.ci[1]*100).toFixed(1).replace('.',',')}%. Phép nhân số hộ chỉ là kịch bản minh họa, không phải dự báo tham gia.`;
    }
    $('#wtp-households').addEventListener('input',update);
    syncButtons(); renderWtpChart(); update();
  }

  function renderStability(){
    const list=$('#stability-list');
    list.innerHTML='';
    [1,2,4,5].forEach(level=>{
      const d=D.land.stability.levels[level];
      const pct=M.pctFromLogBeta(d.beta);
      const width=Math.min(100,Math.abs(pct));
      const row=document.createElement('div');
      row.className='effect-row';
      row.innerHTML=`<div><strong>Mức ${level}</strong><small>${D.labels.stability[level]} · n=${d.n}</small></div><div class="effect-bar-track"><div class="effect-bar" style="width:${width}%"></div></div><strong>${fmtPct(pct)} · p=${String(d.p).replace('.',',')}</strong>`;
      list.appendChild(row);
    });
  }

  function setupLand(){
    populateScale($('#land-from'),D.labels.shortage,2);
    populateScale($('#land-to'),D.labels.shortage,3);
    function update(){
      const r=M.landShortageComparison($('#land-from').value,$('#land-to').value);
      const el=$('#land-result');
      el.textContent=fmtPct(r.relativePct);
      el.classList.toggle('negative',r.relativePct<0);
      el.classList.toggle('positive',r.relativePct>0);
      const direction=r.delta===0?'không thay đổi mức thiếu nước':`${Math.abs(r.delta)} bậc ${r.delta>0?'cao hơn':'thấp hơn'}`;
      const multiStep = Math.abs(r.delta)>1 ? ' So sánh nhiều bậc đồng nghĩa với việc lũy tích giả định tuyến tính của biến mức thiếu nước trong đặc tả hiện tại.' : '';
      $('#land-context').textContent=`So sánh từ mức ${r.from} (${D.labels.shortage[r.from].toLowerCase()}) sang mức ${r.to} (${D.labels.shortage[r.to].toLowerCase()}): ${direction}. Đây là liên hệ tương đối suy ra từ hệ số mức thiếu nước của mô hình, không phải tác động nhân quả.${multiStep}`;
    }
    $('#land-from').addEventListener('input',update);
    $('#land-to').addEventListener('input',update);
    renderStability(); update();
  }

  function renderSignals(){
    const board=$('#signal-board');
    board.innerHTML='';
    D.integrated.forEach(s=>{
      const clear=s.p<.05;
      const row=document.createElement('div');
      row.className=`signal-row ${clear?'clear':''}`;
      const pLabel=s.p<.001?'p < 0,001':`p = ${s.p.toFixed(3).replace('.',',')}`;
      const arrow=s.beta>0?'↑':'↓';
      const direction=s.beta>0?'Hướng dương':'Hướng âm';
      row.innerHTML=`<div class="signal-label"><strong>${s.label}</strong><small>${s.note}</small></div><div class="signal-direction"><span>${arrow}</span><strong>${direction}</strong></div><div class="signal-beta">β ${s.beta>0?'+':''}${s.beta.toFixed(3).replace('.',',')}<br>${pLabel}</div><div class="signal-status ${clear?'clear':'unclear'}">${s.status}</div>`;
      board.appendChild(row);
    });
  }

  function init(){
    setupNavigation();
    setupCost();
    setupWtp();
    setupLand();
    renderSignals();
    $('#validation-copy').textContent=D.meta.validation;
  }

  document.addEventListener('DOMContentLoaded',init);
})();
