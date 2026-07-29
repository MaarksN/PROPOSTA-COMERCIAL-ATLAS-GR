const brl = n => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(n||0);

const faixas = {
  objeto:        [[100,23.50],[250,21.39],[400,19.46],[500,15.90],[1000,14.87],[1500,13.90],[Infinity,13.00]],
  integrada:     [[100,34.50],[250,31.40],[400,28.57],[500,28.00],[1000,27.50],[1500,27.20],[Infinity,27.00]],
  erro:          [[100,6.50],[250,5.92],[400,5.38],[500,4.41],[1000,4.02],[1500,3.66],[Infinity,3.33]],
  faceObjeto:    [[100,30.50],[250,28.40],[400,26.44],[500,24.61],[1000,22.91],[1500,21.33],[Infinity,19.86]],
  faceIntegrada: [[100,41.50],[250,38.80],[400,36.28],[500,33.92],[1000,32.57],[1500,31.99],[Infinity,31.10]],
  cnh:           [[100,9.90],[250,9.26],[400,8.65],[500,8.09],[1000,7.57],[1500,7.07],[Infinity,6.61]],
  background:    [[100,9.20],[250,8.60],[400,8.04],[500,7.52],[1000,7.03],[1500,6.57],[Infinity,6.15]],
  vitimologia:   [[100,69.90],[250,63.90],[400,60.90],[500,57.90],[1000,54.90],[1500,51.90],[Infinity,49.90]]
};

function precoFaixa(tipo,q){
  const tabela = faixas[tipo];
  for (const [limite,preco] of tabela){ if (q <= limite) return preco; }
  return tabela[tabela.length-1][1];
}

const categorias = [
  { id:'gr', container:'cat-gr', titulo:'Planos e valores', planos:{
      'Standard': [
        {item:'Por veículo/mês', detalhe:'Monitoramento com abertura de SM e macros padrão Atlas.', preco:90.00, qtd:1},
        {item:'Por viagem', detalhe:'Valor por viagem.', preco:35.00, qtd:1},
      ],
      'Pro': [
        {item:'Por veículo/mês', detalhe:'Monitoramento contínuo da frota e macros personalizadas.', preco:120.00, qtd:1},
        {item:'Por viagem', detalhe:'Valor por viagem.', preco:35.00, qtd:1},
      ],
      'Premium': [
        {item:'Por veículo/mês', detalhe:'Treinamentos adicionais, ECVC e Atlas Analytics personalizado.', preco:150.00, qtd:1},
        {item:'Por viagem', detalhe:'Valor por viagem.', preco:35.00, qtd:1},
      ],
      'Monitoramento 24x7': [
        {item:'Por veículo/mês', detalhe:'Monitoramento de veículos e gestão de riscos, 24h por dia, 7 dias por semana; pacote mínimo conforme contratação.', preco:120.00, qtd:1},
        {item:'Por viagem', detalhe:'Valor por viagem.', preco:40.00, qtd:1},
      ],
      'Operação de Terceiros': [
        {item:'Checklist', detalhe:'Teste dos sensores e atuadores do rastreador principal; por demanda.', preco:5.90, qtd:1},
        {item:'Envio de rotograma', detalhe:'Envio de rotograma ao motorista; por veículo.', preco:3.90, qtd:1},
      ],
      'Integração New Connect': [
        {item:'Licença Plataforma Atlas New Connect', detalhe:'Integrador de tecnologia do sistema para estruturação interna; por veículo/mês.', preco:29.90, qtd:1},
      ],
  }},
  { id:'combos', container:'cat-extra', titulo:'Combos e Controle de Jornada', planosOcultos:['Combo GR + Logística'], planos:{
      'Combo GR + Logística': [
        {item:'GR + Torre de Controle Logística', detalhe:'Combo especial para contratação conjunta do GR + Logística; por veículo/mês.', preco:135.90, qtd:1},
      ],
      'Controle de Jornada': [
        {item:'Controle de Jornada (A52)', detalhe:'Controle de jornada dos motoristas; por CPF.', preco:34.90, qtd:1},
      ],
      'Implantação': [
        {item:'Implantação inicial', detalhe:'Valor para implementação.', preco:1200.00, qtd:1},
      ],
  }},
  { id:'apoio', container:'cat-extra', titulo:'Ponto de Apoio — Terceiros', planos:{
      'Analista de Risco': [
        {item:'Interior diurno', detalhe:'Ponto de apoio terceiros.', preco:6500.00, qtd:1},
        {item:'Interior noturno', detalhe:'Ponto de apoio terceiros.', preco:7000.00, qtd:1},
        {item:'Capital diurno', detalhe:'Ponto de apoio terceiros.', preco:7500.00, qtd:1},
        {item:'Capital noturno', detalhe:'Ponto de apoio terceiros.', preco:8000.00, qtd:1},
      ],
      'Analista de Logística': [
        {item:'Interior', detalhe:'Ponto de apoio terceiros.', preco:8000.00, qtd:1},
        {item:'Capital', detalhe:'Ponto de apoio terceiros.', preco:8500.00, qtd:1},
      ],
      'Supervisor': [
        {item:'Interior', detalhe:'Ponto de apoio terceiros.', preco:10000.00, qtd:1},
        {item:'Capital', detalhe:'Ponto de apoio terceiros.', preco:10500.00, qtd:1},
      ],
  }},
  { id:'adicionais', container:'cat-extra', titulo:'Serviços Adicionais', planos:{
      'Adicional Autotrac': [
        {item:'Integração mensal/veículo', detalhe:'Requer subconta de acesso para a Atlas.', preco:14.45, qtd:1},
      ],
      'Pronta-Resposta': [
        {item:'Acionamento (até 3h)', detalhe:'Valor unitário para período máximo de 3 horas.', preco:1300.00, qtd:1},
        {item:'Hora excedente', detalhe:'Por hora após o período máximo de 3 horas.', preco:180.00, qtd:1},
      ],
      'Desenvolvimento': [
        {item:'Desenvolvimento adicional (por hora)', detalhe:'Custo por hora trabalhada.', preco:250.00, qtd:1},
      ],
  }},
  { id:'profile', container:'cat-profile', titulo:'Planos e valores (por faixa de consultas/mês)', planos:{
      'Pesquisa': [
        {item:'Pesquisa por Objeto', detalhe:'CNH, individual. Valor ajustado por faixa de consultas/mês.', range:'objeto', qtd:100},
        {item:'Pesquisa Integrada (até 3 placas)', detalhe:'Valor ajustado por faixa de consultas/mês.', range:'integrada', qtd:100},
        {item:'Consulta e erro de parâmetro', detalhe:'Valor ajustado por faixa de consultas/mês.', range:'erro', qtd:100},
      ],
      'Face ID': [
        {item:'Face ID Objeto', detalhe:'Valor ajustado por faixa de consultas/mês.', range:'faceObjeto', qtd:100},
        {item:'Face ID Integrada', detalhe:'Valor ajustado por faixa de consultas/mês.', range:'faceIntegrada', qtd:100},
      ],
      'Consultas Financeiras e RH': [
        {item:'CNH Financeira', detalhe:'Valor ajustado por faixa de consultas/mês.', range:'cnh', qtd:100},
        {item:'Background Check RH', detalhe:'Valor ajustado por faixa de consultas/mês.', range:'background', qtd:100},
        {item:'Vitimologia', detalhe:'Valor ajustado por faixa de consultas/mês.', range:'vitimologia', qtd:100},
      ],
  }},
  { id:'connect', container:'cat-connect', titulo:'Planos e valores', planos:{
      'Licença Atlas New Connect': [
        {item:'Por veículo/mês', detalhe:'Software completo com módulos de Gestão à Vista, Gestão de Alvos, Transit Time e ETA.', preco:34.90, qtd:1},
        {item:'Por viagem', detalhe:'Valor por viagem.', preco:8.90, qtd:1},
      ],
      'Planejador de Carga': [
        {item:'Por veículo/mês', detalhe:'Módulo de planejamento de carga com controle de espaço e roteirização.', preco:29.90, qtd:1},
        {item:'Por viagem', detalhe:'Valor por viagem.', preco:4.50, qtd:1},
      ],
  }},
  { id:'analytics', container:'cat-analytics', titulo:'Planos e valores', planos:{
      "Atlas Analytics (BI's)": [
        {item:'Por usuário/mês', detalhe:'Power BI completo (Transit Time, Alertas, Gestão de Alvos).', preco:14.90, qtd:1},
        {item:'Por veículo/mês', detalhe:'Power BI completo (Transit Time, Alertas, Gestão de Alvos).', preco:4.90, qtd:1},
        {item:'Por viagem', detalhe:'Power BI completo (Transit Time, Alertas, Gestão de Alvos).', preco:0.90, qtd:1},
      ],
  }},
  { id:'safety', container:'cat-safety', titulo:'Planos e valores', planos:{}},
];

function montarCategorias(){
  const containersUsados = new Set(categorias.map(cat=>cat.container));
  containersUsados.forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.innerHTML = '';
  });
  categorias.forEach(cat=>{
    const container = document.getElementById(cat.container);
    if(!container) return;
    const ocultos = cat.planosOcultos || [];
    const linhasCatalogo = [];
    Object.keys(cat.planos).forEach(plano=>{
      if(ocultos.includes(plano)) return;
      cat.planos[plano].forEach((it,i)=>{
        const precoInicial = it.range ? precoFaixa(it.range, it.qtd) : it.preco;
        linhasCatalogo.push(`
          <tr>
            <td><span class="badge-plano">${plano}</span></td>
            <td><b>${it.item}</b></td>
            <td class="detalhe">${it.detalhe}</td>
            <td class="valor-unit">${brl(precoInicial)}</td>
            <td><input type="number" class="qtd-catalogo" min="0" step="1" value="${it.qtd}"></td>
            <td><button type="button" class="catalogo-add" data-plano="${plano}" data-idx="${i}">Adicionar</button></td>
          </tr>`);
      });
    });

    const bloco = document.createElement('div');
    bloco.className = 'categoria';
    bloco.innerHTML = `
      <div class="categoria-titulo">${cat.titulo}</div>
      ${linhasCatalogo.length ? `
      <div class="tablewrap">
        <table>
          <colgroup><col class="col-plano"><col class="col-item"><col><col class="col-valor"><col class="col-qtd"><col class="col-add"></colgroup>
          <thead><tr><th>Plano</th><th>Item</th><th>Detalhamento</th><th>Valor unitário</th><th>Quantidade</th><th></th></tr></thead>
          <tbody>${linhasCatalogo.join('')}</tbody>
        </table>
      </div>` : ''}
      <button type="button" class="btn-custom" id="custom-${cat.id}">+ Item personalizado</button>
      <div class="tablewrap" id="wrap-${cat.id}" style="display:none">
        <table>
          <colgroup><col class="col-plano"><col class="col-item"><col><col class="col-valor"><col class="col-qtd"><col class="col-total"><col class="col-del"></colgroup>
          <thead><tr><th>Plano</th><th>Item</th><th>Detalhamento</th><th>Valor unitário</th><th>Quantidade</th><th>Valor total</th><th></th></tr></thead>
          <tbody id="corpo-${cat.id}"></tbody>
        </table>
      </div>
      <div class="vazio-msg" id="vazio-${cat.id}">Nenhum item adicionado nesta categoria ainda.</div>
    `;
    container.appendChild(bloco);

    bloco.querySelectorAll('.catalogo-add').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const plano = btn.dataset.plano;
        const idx = Number(btn.dataset.idx);
        const item = cat.planos[plano][idx];
        const qtdInput = btn.closest('tr').querySelector('.qtd-catalogo');
        const qtd = Number(qtdInput.value) || 0;
        if(qtd <= 0) return;
        adicionarLinhaCatalogo(cat.id, plano, {...item, qtd});
      });
    });

    bloco.querySelector(`#custom-${cat.id}`).addEventListener('click', ()=>{
      adicionarLinhaPersonalizada(cat.id);
    });
  });
}

function atualizarVisibilidade(catId){
  const corpo = document.getElementById(`corpo-${catId}`);
  const wrap = document.getElementById(`wrap-${catId}`);
  const vazio = document.getElementById(`vazio-${catId}`);
  const temLinhas = corpo.children.length > 0;
  wrap.style.display = temLinhas ? '' : 'none';
  vazio.style.display = temLinhas ? 'none' : '';
}

function adicionarLinhaCatalogo(catId, plano, item){
  const corpo = document.getElementById(`corpo-${catId}`);
  const tr = document.createElement('tr');
  if(item.range) tr.dataset.range = item.range;
  else tr.dataset.preco = item.preco;
  const precoInicial = item.range ? precoFaixa(item.range, item.qtd) : item.preco;
  tr.innerHTML = `
    <td><span class="badge-plano">${plano}</span></td>
    <td><b>${item.item}</b></td>
    <td class="detalhe">${item.detalhe}</td>
    <td class="valor-unit">${brl(precoInicial)}</td>
    <td><input type="number" class="qtd-input" min="0" step="1" value="${item.qtd}"></td>
    <td class="valor-total">R$ 0,00</td>
    <td class="col-del"><button type="button" class="btn-del" title="Remover">×</button></td>`;
  tr.querySelector('.btn-del').addEventListener('click', ()=>{
    tr.remove();
    atualizarVisibilidade(catId);
    calcular();
  });
  corpo.appendChild(tr);
  atualizarVisibilidade(catId);
  calcular();
}

function adicionarLinhaPersonalizada(catId){
  const corpo = document.getElementById(`corpo-${catId}`);
  const tr = document.createElement('tr');
  tr.dataset.custom = 'true';
  tr.innerHTML = `
    <td><input class="custom-input" placeholder="Plano"></td>
    <td><input class="custom-input" placeholder="Item"></td>
    <td><input class="custom-input" placeholder="Detalhamento"></td>
    <td><input class="custom-input custom-preco" type="number" min="0" step="0.01" value="0" style="text-align:right"></td>
    <td><input type="number" class="qtd-input" min="0" step="1" value="1"></td>
    <td class="valor-total">R$ 0,00</td>
    <td class="col-del"><button type="button" class="btn-del" title="Remover">×</button></td>`;
  tr.querySelector('.btn-del').addEventListener('click', ()=>{
    tr.remove();
    atualizarVisibilidade(catId);
    calcular();
  });
  corpo.appendChild(tr);
  atualizarVisibilidade(catId);
  calcular();
}

function calcular(){
  let total = 0;
  categorias.forEach(cat=>{
    const corpo = document.getElementById(`corpo-${cat.id}`);
    if(!corpo) return;
    Array.from(corpo.children).forEach(tr=>{
      const qtdInput = tr.querySelector('.qtd-input');
      const valorTotalCell = tr.querySelector('.valor-total');
      if(!qtdInput || !valorTotalCell) return;
      const q = Number(qtdInput.value) || 0;
      let preco;
      if(tr.dataset.range){
        preco = precoFaixa(tr.dataset.range, q);
        tr.querySelector('.valor-unit').textContent = brl(preco);
      } else if(tr.dataset.preco !== undefined){
        preco = Number(tr.dataset.preco) || 0;
      } else {
        const campoPreco = tr.querySelector('.custom-preco');
        preco = campoPreco ? (Number(campoPreco.value) || 0) : 0;
      }
      const sub = preco * q;
      valorTotalCell.textContent = brl(sub);
      total += sub;
    });
  });
  document.getElementById('total').textContent = brl(total);

  const fatminInput = document.getElementById('fatmin-input');
  const custom = Number(fatminInput.value);
  const fatMin = custom > 0 ? custom : total * 0.4;
  document.getElementById('fatmin-valor').textContent = brl(fatMin);

  montarChecklist();
}

function obterRotuloLinha(tr){
  if(tr.dataset.custom){
    const inputs = tr.querySelectorAll('.custom-input');
    return { plano: inputs[0].value || 'Personalizado', item: inputs[1].value || 'Item personalizado' };
  }
  return {
    plano: tr.querySelector('.badge-plano')?.textContent || '',
    item: tr.querySelector('td:nth-child(2)')?.textContent.trim() || ''
  };
}

function montarChecklist(){
  const container = document.getElementById('checklist');
  const vazio = document.getElementById('checklist-vazio');
  container.innerHTML = '';
  let total = 0;
  categorias.forEach(cat=>{
    const corpo = document.getElementById(`corpo-${cat.id}`);
    if(!corpo) return;
    Array.from(corpo.children).forEach(tr=>{
      const valorTotalCell = tr.querySelector('.valor-total');
      if(!valorTotalCell) return;
      const {plano, item} = obterRotuloLinha(tr);
      const linha = document.createElement('div');
      linha.className = 'checklist-item';
      linha.innerHTML = `<span class="check">✓</span><span class="checklist-label"><b>${plano}</b> — ${item}</span><span class="checklist-valor">${valorTotalCell.textContent}</span>`;
      container.appendChild(linha);
      total++;
    });
  });
  container.style.display = total ? '' : 'none';
  vazio.style.display = total ? 'none' : '';
}

document.addEventListener('input', e=>{ if(e.target.matches('.qtd-input, .custom-preco, #fatmin-input')) calcular(); });

function mascaraCNPJ(e){
  let v = e.target.value.replace(/\D/g,'').slice(0,14);
  v = v.replace(/(\d{2})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1/$2').replace(/(\d{4})(\d{1,2})$/,'$1-$2');
  e.target.value = v;
}
document.getElementById('cnpj').addEventListener('input', mascaraCNPJ);
document.getElementById('cnpj').addEventListener('input', e=>{
  document.getElementById('assinatura-cnpj').textContent = e.target.value || '—';
});

document.getElementById('combo-gr-connect').addEventListener('change', e=>{
  const NOME_PLANO = 'Combo GR + Logística';
  if(e.target.checked){
    const combosCat = categorias.find(c=>c.id==='combos');
    const item = combosCat.planos[NOME_PLANO][0];
    adicionarLinhaCatalogo('combos', NOME_PLANO, item);
  } else {
    const corpo = document.getElementById('corpo-combos');
    const tr = Array.from(corpo.children).find(tr=>tr.querySelector('.badge-plano')?.textContent === NOME_PLANO);
    if(tr){ tr.remove(); atualizarVisibilidade('combos'); calcular(); }
  }
});

document.getElementById('logo-cliente').addEventListener('change', e=>{
  const file = e.target.files[0];
  const preview = document.getElementById('logo-cliente-preview');
  const sep = document.getElementById('logos-sep');
  if(!file){
    preview.style.display = 'none';
    preview.removeAttribute('src');
    sep.style.display = 'none';
    return;
  }
  const reader = new FileReader();
  reader.onload = ev=>{
    preview.src = ev.target.result;
    preview.style.display = 'block';
    sep.style.display = 'inline';
  };
  reader.readAsDataURL(file);
});

const hoje = new Date();
document.getElementById('data').value = hoje.toISOString().slice(0,10);
const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
document.getElementById('assinatura-data').value = `Ribeirão Preto, ${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}.`;

function salvarProposta(){
  calcular();
  const clone = document.documentElement.cloneNode(true);
  const originaisInputs = document.querySelectorAll('input, select');
  clone.querySelectorAll('input, select').forEach((el,i)=>{
    const original = originaisInputs[i];
    if(!original) return;
    if(original.tagName === 'SELECT'){
      Array.from(el.options).forEach(o=>{ o.selected = (o.value === original.value); });
    } else if(original.type === 'checkbox'){
      if(original.checked) el.setAttribute('checked','checked');
      else el.removeAttribute('checked');
    } else {
      el.setAttribute('value', original.value);
    }
  });
  const nomeEmpresa = (document.getElementById('empresa').value || 'proposta-atlas').trim().replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'') || 'proposta-atlas';
  const blob = new Blob(['<!DOCTYPE html>\n' + clone.outerHTML], {type:'text/html;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nomeEmpresa + '.html';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
}

montarCategorias();

function limparPlaceholdersParaImpressao(){
  document.querySelectorAll('input[placeholder]').forEach(el=>{
    el.dataset.placeholderOriginal = el.getAttribute('placeholder');
    el.removeAttribute('placeholder');
  });
}
function restaurarPlaceholders(){
  document.querySelectorAll('input[data-placeholder-original]').forEach(el=>{
    el.setAttribute('placeholder', el.dataset.placeholderOriginal);
    delete el.dataset.placeholderOriginal;
  });
}
window.addEventListener('beforeprint', limparPlaceholdersParaImpressao);
window.addEventListener('afterprint', restaurarPlaceholders);
