const SEED = `
CREATE TABLE Customers (CustomerID INTEGER PRIMARY KEY, Name TEXT NOT NULL, City TEXT, Age INTEGER, Email TEXT);
INSERT INTO Customers VALUES
(1,'Juan dela Cruz','Baguio',34,'juan.dc@gmail.com'),
(2,'Maria Santos','Manila',28,'maria.santos@yahoo.com'),
(3,'Jose Reyes','Cebu',45,'jreyes@gmail.com'),
(4,'Ana Bautista','Baguio',22,NULL),
(5,'Pedro Garcia','Davao',39,'pedro.g@outlook.com'),
(6,'Liza Mendoza','Iloilo',31,'liza.m@gmail.com'),
(7,'Carlo Aquino','Manila',26,NULL),
(8,'Rosa Villanueva','Cebu',52,'rosa.v@yahoo.com'),
(9,'Mark Ramos','Baguio',29,'markramos@gmail.com'),
(10,'Grace Torres','Davao',41,'grace.t@gmail.com');
CREATE TABLE Products (ProductID INTEGER PRIMARY KEY, ProductName TEXT NOT NULL, Category TEXT, Price REAL, Stock INTEGER);
INSERT INTO Products VALUES
(1,'Barako Coffee','Drinks',250,40),
(2,'Tablea Chocolate','Drinks',180,25),
(3,'Strawberry Jam','Food',220,30),
(4,'Ube Halaya','Food',200,15),
(5,'Peanut Brittle','Food',150,50),
(6,'Tambo Broom','Household',120,60),
(7,'Banig Mat','Household',450,10),
(8,'Calamansi Juice','Drinks',90,80),
(9,'Dried Mangoes','Food',160,70),
(10,'Abaca Bag','Household',650,8);
CREATE TABLE Orders (OrderID INTEGER PRIMARY KEY, CustomerID INTEGER REFERENCES Customers(CustomerID), ProductID INTEGER REFERENCES Products(ProductID), Quantity INTEGER, OrderDate TEXT);
INSERT INTO Orders VALUES
(1,1,1,2,'2026-01-05'),(2,2,3,1,'2026-01-07'),(3,1,9,3,'2026-01-12'),(4,3,7,1,'2026-01-15'),
(5,5,2,4,'2026-01-20'),(6,6,4,2,'2026-02-02'),(7,2,1,1,'2026-02-06'),(8,8,10,1,'2026-02-11'),
(9,9,5,5,'2026-02-14'),(10,3,8,6,'2026-02-20'),(11,5,6,2,'2026-03-01'),(12,9,1,2,'2026-03-03');
`;

/* ---------- helpers ---------- */
const $ = (s, r=document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const store = {
  get(k, d){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
};
const ICON = {
  play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L8.5 4.64A1 1 0 0 0 7 5.5z"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  undo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/></svg>',
  db:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v13c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-13"/><path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3"/></svg>'
};

/* ---------- database ---------- */
let SQL = null, db = null;
const listeners = new Set();
function resetDb(){
  if(db) db.close();
  db = new SQL.Database();
  db.run(SEED);
  listeners.forEach(f => f());
}
const ready = initSqlJs().then(S => { SQL = S; resetDb(); document.body.classList.add('db-ready'); });

function stripComments(s){ return s.replace(/--[^\n]*/g,'').trim(); }
function execSql(sql){
  const clean = stripComments(sql);
  if(!clean) return {blank:true};
  try{
    const res = db.exec(sql);
    const mod = db.getRowsModified();
    listeners.forEach(f => f());
    return {res, mod, clean};
  }catch(e){ return {error: e.message}; }
}
function friendly(msg){
  let m;
  if((m = msg.match(/no such table: (\S+)/))) return `There is no table named "${m[1]}". Check the spelling. Available tables: ${tableNames().join(', ')}.`;
  if((m = msg.match(/no such column: (\S+)/))) return `There is no column named "${m[1]}". Check the spelling and make sure you are using the right table.`;
  if((m = msg.match(/near "(.+?)": syntax error/))) return `Something is written incorrectly near "${m[1]}". Check your commas, quotes (' '), parentheses, and keyword spelling.`;
  if(/incomplete input/.test(msg)) return 'The query is incomplete. You may have forgotten to close a quote or parenthesis.';
  if((m = msg.match(/NOT NULL constraint failed: (\S+)/))) return `"${m[1]}" needs a value because it is NOT NULL.`;
  if((m = msg.match(/UNIQUE constraint failed: (\S+)/))) return `That value already exists in "${m[1]}". Duplicates are not allowed because it is UNIQUE.`;
  if(/CHECK constraint failed/.test(msg)) return 'The value did not pass the CHECK condition.';
  if((m = msg.match(/table (\S+) already exists/))) return `A table named "${m[1]}" already exists. Use a different name, or reset the data.`;
  if((m = msg.match(/(\d+) values for (\d+) columns/))) return `You gave ${m[1]} values for ${m[2]} columns. The counts must match.`;
  if(/misuse of aggregate/.test(msg)) return 'Aggregate functions (COUNT, SUM, AVG…) cannot be used in WHERE. Use HAVING after GROUP BY.';
  if(/duplicate column name/.test(msg)) return 'A column with this name already exists.';
  return 'The query could not run. See the message below for details.';
}
function tableNames(){
  try{ const r = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY rowid"); return r.length ? r[0].values.map(v=>v[0]) : []; }catch(e){ return []; }
}

/* ---------- syntax highlight ---------- */
const KW = new Set('SELECT FROM WHERE AND OR NOT ORDER BY ASC DESC LIMIT OFFSET INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE ALTER DROP ADD COLUMN RENAME TO JOIN INNER LEFT RIGHT FULL OUTER CROSS ON AS GROUP HAVING DISTINCT IN BETWEEN LIKE IS NULL PRIMARY KEY FOREIGN REFERENCES UNIQUE DEFAULT CHECK IF EXISTS INTEGER TEXT REAL DATE CASE WHEN THEN ELSE END UNION ALL TOP INDEX VIEW PRAGMA'.split(' '));
const FN = new Set('COUNT SUM AVG MIN MAX COALESCE IFNULL ROUND UPPER LOWER LENGTH SUBSTR TRIM'.split(' '));
function hl(code){
  let out = '';
  const re = /(--[^\n]*)|('(?:[^']|'')*'?)|("(?:[^"])*"?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|([\s\S])/g;
  let m;
  while((m = re.exec(code))){
    if(m[1]) out += `<span class="tk-com">${esc(m[1])}</span>`;
    else if(m[2]||m[3]) out += `<span class="tk-str">${esc(m[2]||m[3])}</span>`;
    else if(m[4]) out += `<span class="tk-num">${m[4]}</span>`;
    else if(m[5]){ const u = m[5].toUpperCase(); out += KW.has(u) ? `<span class="tk-kw">${m[5]}</span>` : FN.has(u) ? `<span class="tk-fn">${m[5]}</span>` : esc(m[5]); }
    else out += esc(m[6]);
  }
  return out;
}

/* ---------- editor ---------- */
function makeEditor(code){
  const wrap = document.createElement('div');
  wrap.className = 'ed';
  wrap.innerHTML = '<pre aria-hidden="true"></pre><textarea spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="SQL editor"></textarea>';
  const pre = wrap.firstChild, ta = wrap.lastChild;
  const api = { el: wrap, ta, onRun: null,
    get value(){ return ta.value; },
    set value(v){ ta.value = v; sync(); } };
  function sync(){
    pre.innerHTML = hl(ta.value) + '\n';
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
    pre.scrollLeft = ta.scrollLeft;
  }
  ta.value = code;
  ta.addEventListener('input', sync);
  ta.addEventListener('scroll', () => { pre.scrollLeft = ta.scrollLeft; pre.scrollTop = ta.scrollTop; });
  ta.addEventListener('keydown', e => {
    if((e.ctrlKey || e.metaKey) && e.key === 'Enter'){ e.preventDefault(); api.onRun && api.onRun(); }
    else if(e.key === 'Tab' && !e.shiftKey){
      e.preventDefault();
      const s = ta.selectionStart, en = ta.selectionEnd;
      ta.value = ta.value.slice(0,s) + '  ' + ta.value.slice(en);
      ta.selectionStart = ta.selectionEnd = s + 2; sync();
    }
  });
  requestAnimationFrame(sync);
  new ResizeObserver(() => sync()).observe(wrap);
  return api;
}

/* ---------- results ---------- */
function renderResult(box, out){
  if(out.blank){ box.innerHTML = '<div class="r-empty">Nothing to run. Write some SQL in the editor first.</div>'; return; }
  if(out.error){
    box.innerHTML = `<div class="r-err" role="alert"><strong>There is a problem with the query.</strong><p>${esc(friendly(out.error))}</p><code>${esc(out.error)}</code></div>`;
    return;
  }
  const {res, mod, clean} = out;
  if(res.length){
    const r = res[res.length-1];
    const n = r.values.length;
    let h = `<div class="r-meta">${n} ${n===1?'row':'rows'}</div><div class="r-scroll"><table><thead><tr>${r.columns.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>`;
    for(const row of r.values){
      h += '<tr>' + row.map(v => v === null ? '<td class="null">NULL</td>' : typeof v === 'number' ? `<td class="n">${fmtNum(v)}</td>` : `<td>${esc(v)}</td>`).join('') + '</tr>';
    }
    box.innerHTML = h + '</tbody></table></div>';
    return;
  }
  const last = clean.split(';').map(s=>s.trim()).filter(Boolean).pop() || '';
  if(/^(select|with)\b/i.test(last)){ box.innerHTML = '<div class="r-empty">No rows matched your query. Try loosening the WHERE condition.</div>'; return; }
  let msg = 'Command executed.';
  if(/^insert\b/i.test(last)) msg = `Inserted ${mod} ${mod===1?'row':'rows'}.`;
  else if(/^update\b/i.test(last)) msg = `Updated ${mod} ${mod===1?'row':'rows'}.`;
  else if(/^delete\b/i.test(last)) msg = `Deleted ${mod} ${mod===1?'row':'rows'}.`;
  else if(/^create\s+table\b/i.test(last)) msg = 'Table created.';
  else if(/^drop\s+table\b/i.test(last)) msg = 'Table dropped.';
  else if(/^alter\s+table\b/i.test(last)) msg = 'Table altered.';
  box.innerHTML = `<div class="r-ok"><span class="icon-inline" style="width:18px;height:18px;display:inline-block">${ICON.check}</span>${msg}</div>`;
}
function fmtNum(v){ return Number.isInteger(v) ? v : Math.round(v*100)/100; }

/* ---------- runner ---------- */
function buildRunner(sql, {label='Try it', showReset=true, autorun=false} = {}){
  const box = document.createElement('div');
  box.className = 'runner-box';
  box.innerHTML = `<div class="rb-head"><span class="lbl">${esc(label)}</span>
    <button class="btn btn-ghost" data-a="restore" title="Restore the original code" aria-label="Restore code">${ICON.undo}<span class="bt">Restore code</span></button>
    ${showReset ? `<button class="btn btn-ghost" data-a="reset" title="Restore the original database" aria-label="Reset data">${ICON.db}<span class="bt">Reset data</span></button>` : ''}
    <button class="btn btn-primary" data-a="run">${ICON.play}Run</button></div>`;
  const ed = makeEditor(sql);
  box.appendChild(ed.el);
  const result = document.createElement('div');
  result.className = 'result';
  result.setAttribute('aria-live','polite');
  box.appendChild(result);
  const run = async () => {
    if(!db){ result.innerHTML = '<div class="loading">Preparing the database…</div>'; await ready; }
    renderResult(result, execSql(ed.value));
  };
  ed.onRun = run;
  box.addEventListener('click', e => {
    const b = e.target.closest('button'); if(!b) return;
    if(b.dataset.a === 'run') run();
    if(b.dataset.a === 'restore'){ ed.value = sql; ed.ta.focus(); }
    if(b.dataset.a === 'reset'){ ready.then(() => { resetDb(); result.innerHTML = `<div class="r-ok">${ICON.db.replace('<svg','<svg width="18" height="18"')}The database has been restored to its original data.</div>`; }); }
  });
  if(autorun) ready.then(run);
  box._ed = ed; box._run = run; box._result = result;
  return box;
}

/* ---------- exercise ---------- */
function rowsOf(res){ return res && res.length ? res[res.length-1].values : []; }
function buildExercise(ex){
  const wrap = document.createElement('section');
  wrap.className = 'task';
  wrap.innerHTML = `<h2>Exercise</h2><p>${ex.task}</p>`;
  const r = buildRunner('-- Write your query here\n', {label:'Your answer'});
  wrap.appendChild(r);
  const bar = document.createElement('div');
  bar.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;margin-top:12px';
  bar.innerHTML = `<button class="btn btn-primary">${ICON.check}Check answer</button><button class="btn btn-ghost">Hint</button><button class="btn btn-ghost">Show answer</button>`;
  wrap.appendChild(bar);
  const hint = document.createElement('div'); hint.className = 'hint'; wrap.appendChild(hint);
  const fb = document.createElement('div'); fb.className = 'feedback'; fb.setAttribute('aria-live','polite'); wrap.appendChild(fb);
  const [bCheck, bHint, bShow] = bar.querySelectorAll('button');
  bCheck.onclick = async () => {
    await ready;
    const user = execSql(r._ed.value);
    renderResult(r._result, user);
    if(user.blank){ fb.className='feedback bad'; fb.textContent = 'Write a query before checking.'; return; }
    if(user.error){ fb.className='feedback bad'; fb.textContent = 'Your query has an error. Read the message above and try again.'; return; }
    let ans; try{ ans = db.exec(ex.answer); }catch(e){ ans = []; }
    const a = rowsOf(user.res), b = rowsOf(ans);
    const norm = rows => rows.map(r => JSON.stringify(r.map(v => typeof v === 'number' ? Math.round(v*1000)/1000 : v)));
    let A = norm(a), B = norm(b);
    if(!ex.ordered){ A.sort(); B.sort(); }
    const colsOk = !a.length || !b.length || a[0].length === b[0].length;
    const ok = colsOk && A.length === B.length && A.every((x,i) => x === B[i]);
    if(ok){ fb.className='feedback good'; fb.innerHTML = '<strong>Correct!</strong> Your result matches the expected answer.'; }
    else {
      fb.className='feedback bad';
      let why = "Your result doesn't match yet.";
      if(!colsOk) why += ` Expected ${b[0].length} columns, but your query returned ${a[0].length}.`;
      else if(A.length !== B.length) why += ` Expected ${B.length} rows, but your query returned ${A.length}.`;
      else if(ex.ordered) why += ' Also check the sort order (ORDER BY).';
      fb.textContent = why + ' Try again, or press Hint.';
    }
  };
  bHint.onclick = () => { hint.textContent = 'Hint: ' + ex.hint; };
  bShow.onclick = () => { r._ed.value = ex.answer; fb.className='feedback'; fb.textContent=''; };
  return wrap;
}

/* ---------- quiz ---------- */
function buildQuiz(qz){
  const wrap = document.createElement('section');
  wrap.className = 'quiz';
  wrap.innerHTML = `<h2>Quiz</h2><p class="q">${esc(qz.q)}</p><div class="opts">${qz.opts.map((o,i)=>`<button class="opt" data-i="${i}"><span class="l">${'ABCD'[i]}</span><span>${esc(o)}</span></button>`).join('')}</div><div class="feedback" aria-live="polite"></div>`;
  const fb = $('.feedback', wrap);
  wrap.querySelectorAll('.opt').forEach(b => b.onclick = () => {
    const i = +b.dataset.i;
    wrap.querySelectorAll('.opt').forEach(x => { x.disabled = true; if(+x.dataset.i === qz.a) x.classList.add('right'); });
    if(i === qz.a){ fb.className='feedback good'; fb.innerHTML = `<strong>Correct!</strong> ${esc(qz.exp)}`; }
    else { b.classList.add('wrong'); fb.className='feedback bad'; fb.innerHTML = `<strong>Not quite.</strong> ${esc(qz.exp)} <button class="btn btn-ghost" style="margin-left:6px;padding:4px 10px;font-size:.85rem">Try again</button>`;
      $('button', fb).onclick = () => { wrap.querySelectorAll('.opt').forEach(x => { x.disabled=false; x.classList.remove('right','wrong'); }); fb.className='feedback'; fb.innerHTML=''; };
    }
  });
  return wrap;
}

/* ---------- progress ---------- */
let done = new Set(store.get('sqlaro-done', []));
function setDone(id, v){ v ? done.add(id) : done.delete(id); store.set('sqlaro-done', [...done]); updateProgress(); }
function updateProgress(){
  const n = LESSONS.filter(l => done.has(l.id)).length;
  $('#prog-txt').textContent = `${n}/${LESSONS.length}`;
  $('#prog-bar').style.width = (n / LESSONS.length * 100) + '%';
  document.querySelectorAll('[data-lesson]').forEach(a => a.classList.toggle('done', done.has(a.dataset.lesson)));
}

/* ---------- views ---------- */
const app = $('#app');
const lessonIndex = id => LESSONS.findIndex(l => l.id === id);

function enhance(root){
  root.querySelectorAll('pre.syntax').forEach(p => p.innerHTML = hl(p.textContent));
  root.querySelectorAll('div.runner').forEach(d => { const sql = d.textContent.replace(/^\n+|\s+$/g,''); d.replaceWith(buildRunner(sql)); });
}

function viewHome(){
  document.body.dataset.view = 'home';
  const next = LESSONS.find(l => !done.has(l.id)) || LESSONS[0];
  app.innerHTML = `
  <section class="hero">
    <div class="hero-demo" id="hero-demo"><p class="hero-note">Try it now: change 'Baguio' to 'Cebu', then press Run.</p></div>
    <div class="ctas">
      <a class="btn btn-primary btn-lg" href="#/lesson/${next.id}">${done.size ? 'Continue: ' + esc(next.short) : 'Start the first lesson'}</a>
      <a class="btn btn-ghost btn-lg" href="#/playground">Open the Playground</a>
    </div>
  </section>
  <section class="band">
    <ol class="steps">
      <li><span class="n">1</span><b>Read</b><p>Short explanations with everyday examples.</p></li>
      <li><span class="n">2</span><b>Try</b><p>Edit and run every example. You can't break the data; it can always be reset.</p></li>
      <li><span class="n">3</span><b>Practice</b><p>Each lesson ends with an exercise and a quiz to check what you learned.</p></li>
    </ol>
  </section>
  <section class="band">
    <h2 class="sec-title">Lessons</h2>
    <p class="sec-sub">${LESSONS.length} lessons, from the simplest SELECT to building your own tables. Follow them in order.</p>
    <div class="map">${SECTIONS.map(s => `<div><h3>${esc(s.title)}</h3><ol>${LESSONS.filter(l=>l.sec===s.id).map(l => `<li><a href="#/lesson/${l.id}" data-lesson="${l.id}"><span class="num">${lessonIndex(l.id)+1}</span>${esc(l.short)}<span class="chk">${ICON.check}</span></a></li>`).join('')}</ol></div>`).join('')}</div>
  </section>
  <section class="band">
    <h2 class="sec-title">The database you'll use</h2>
    <p class="sec-sub">A small souvenir shop. Three related tables, so you can practice everything from SELECT to JOIN.</p>
    <div class="dbtables">
      <div class="dbt"><h3>Customers</h3><p>10 shoppers from different cities</p><div class="cols"><span>CustomerID</span><span>Name</span><span>City</span><span>Age</span><span>Email</span></div></div>
      <div class="dbt"><h3>Products</h3><p>10 products: drinks, food, household items</p><div class="cols"><span>ProductID</span><span>ProductName</span><span>Category</span><span>Price</span><span>Stock</span></div></div>
      <div class="dbt"><h3>Orders</h3><p>12 orders linking customers and products</p><div class="cols"><span>OrderID</span><span>CustomerID</span><span>ProductID</span><span>Quantity</span><span>OrderDate</span></div></div>
    </div>
  </section>
  <footer class="foot">SQDhell. Free SQL lessons. Your progress is saved in this browser.</footer>`;
  const demo = buildRunner("SELECT Name, City, Age\nFROM Customers\nWHERE City = 'Baguio';", {label:'Real query, real results', showReset:false, autorun:true});
  $('#hero-demo').prepend(demo);
  updateProgress();
}

function sidebar(currentId){
  return `<aside class="side" id="side">
    <input class="search" type="search" placeholder="Search lessons…" aria-label="Search lessons" id="side-q">
    <div id="side-list">${SECTIONS.map(s => `<div class="sgrp"><h4>${esc(s.title)}</h4>${LESSONS.filter(l=>l.sec===s.id).map(l => `<a href="#/lesson/${l.id}" data-lesson="${l.id}" data-q="${esc((l.short+' '+l.title).toLowerCase())}" class="${l.id===currentId?'on':''}"><span class="dot"></span>${esc(l.short)}</a>`).join('')}</div>`).join('')}<p class="empty" hidden>No matching lessons.</p></div>
  </aside><div class="backdrop" id="backdrop"></div>`;
}
function bindSidebar(){
  const q = $('#side-q');
  q.addEventListener('input', () => {
    const v = q.value.trim().toLowerCase(); let any = false;
    document.querySelectorAll('#side-list .sgrp').forEach(g => {
      let vis = 0;
      g.querySelectorAll('a').forEach(a => { const show = !v || a.dataset.q.includes(v); a.hidden = !show; if(show) vis++; });
      g.hidden = !vis; if(vis) any = true;
    });
    $('#side-list .empty').hidden = any;
  });
  $('#backdrop').onclick = () => document.body.classList.remove('menu-open');
  $('#side').addEventListener('click', e => { if(e.target.closest('a')) document.body.classList.remove('menu-open'); });
  const on = $('#side a.on'); if(on) on.scrollIntoView({block:'center'});
}

function viewLesson(id){
  const i = lessonIndex(id);
  if(i < 0) return viewHome();
  document.body.dataset.view = 'lesson';
  const L = LESSONS[i], prev = LESSONS[i-1], next = LESSONS[i+1];
  const sec = SECTIONS.find(s => s.id === L.sec);
  app.innerHTML = `<div class="shell">${sidebar(id)}
    <main class="content"><article class="article">
      <p class="crumb">Lesson ${i+1} of ${LESSONS.length}, ${esc(sec.title.toLowerCase())}</p>
      <h1>${esc(L.title)}</h1>
      <div id="lesson-body">${L.body}</div>
      <div id="lesson-extra"></div>
      <div class="done-row"><button class="btn btn-primary" id="mark"></button><span class="msg" id="mark-msg"></span></div>
      <nav class="lesson-foot" aria-label="Lesson navigation">
        ${prev ? `<a class="nx" href="#/lesson/${prev.id}"><small>Previous</small>${esc(prev.short)}</a>` : ''}
        ${next ? `<a class="nx r" href="#/lesson/${next.id}"><small>Next</small>${esc(next.short)}</a>` : `<a class="nx r" href="#/playground"><small>Next</small>Playground</a>`}
      </nav>
    </article></main></div>`;
  enhance($('#lesson-body'));
  const extra = $('#lesson-extra');
  if(L.ex) extra.appendChild(buildExercise(L.ex));
  if(L.quiz) extra.appendChild(buildQuiz(L.quiz));
  const mark = $('#mark');
  const paint = () => { const d = done.has(id); mark.innerHTML = d ? 'Completed ✓ (undo)' : `${ICON.check}Mark as complete`; mark.className = d ? 'btn btn-ghost' : 'btn btn-primary'; $('#mark-msg').textContent = d && next ? 'Nice work! On to the next lesson.' : ''; };
  mark.onclick = () => { setDone(id, !done.has(id)); paint(); };
  paint();
  bindSidebar();
  updateProgress();
  document.title = `${L.short} | SQDhell`;
}

function viewPlay(){
  document.body.dataset.view = 'play';
  app.innerHTML = `<div class="play">
    <aside class="schema" aria-label="Database tables"><h3>Tables</h3><div id="schema"></div></aside>
    <main>
      <h1>Playground</h1>
      <p class="intro">Write any query you like here. Click a table name on the left to see its columns.</p>
      <div class="examples" id="examples"></div>
      <div id="play-ed"></div>
    </main></div>`;
  const saved = store.get('sqlaro-play', "SELECT c.Name, p.ProductName, o.Quantity, o.OrderDate\nFROM Orders o\nJOIN Customers c ON o.CustomerID = c.CustomerID\nJOIN Products p ON o.ProductID = p.ProductID\nORDER BY o.OrderDate;");
  const r = buildRunner(saved, {label:'SQL editor'});
  $('#play-ed').appendChild(r);
  r._ed.ta.addEventListener('input', () => store.set('sqlaro-play', r._ed.value));
  const ex = [
    ['All customers','SELECT * FROM Customers;'],
    ['Top 3 most expensive','SELECT ProductName, Price FROM Products\nORDER BY Price DESC LIMIT 3;'],
    ['Customers per city','SELECT City, COUNT(*) AS Total\nFROM Customers GROUP BY City;'],
    ['Sales per product','SELECT p.ProductName, SUM(o.Quantity) AS Sold\nFROM Orders o JOIN Products p ON o.ProductID = p.ProductID\nGROUP BY p.ProductName ORDER BY Sold DESC;'],
    ['Customers with no orders','SELECT c.Name FROM Customers c\nLEFT JOIN Orders o ON c.CustomerID = o.CustomerID\nWHERE o.OrderID IS NULL;']
  ];
  $('#examples').innerHTML = ex.map((e,i) => `<button class="chip" data-i="${i}">${esc(e[0])}</button>`).join('');
  $('#examples').onclick = e => { const b = e.target.closest('.chip'); if(!b) return; r._ed.value = ex[+b.dataset.i][1]; store.set('sqlaro-play', r._ed.value); r._run(); };
  const renderSchema = () => {
    const box = $('#schema'); if(!box || !db) return;
    const open = new Set([...box.querySelectorAll('details[open]')].map(d => d.dataset.t));
    box.innerHTML = tableNames().map(t => {
      const cols = db.exec(`PRAGMA table_info("${t.replace(/"/g,'""')}")`)[0]?.values || [];
      const cnt = db.exec(`SELECT COUNT(*) FROM "${t.replace(/"/g,'""')}"`)[0].values[0][0];
      return `<details data-t="${esc(t)}" ${open.has(t)?'open':''}><summary>${esc(t)}<span class="cnt">${cnt} rows</span></summary><ul>${cols.map(c=>`<li>${esc(c[1])}<i>${esc(c[2]||'')}</i></li>`).join('')}</ul><button class="btn btn-ghost view" data-t="${esc(t)}">View data</button></details>`;
    }).join('') || '<p class="empty">No tables. Press Reset data.</p>';
  };
  $('#schema').onclick = e => { const b = e.target.closest('.view'); if(!b) return; r._ed.value = `SELECT * FROM ${b.dataset.t};`; r._run(); };
  listeners.clear(); listeners.add(renderSchema);
  ready.then(renderSchema);
  document.title = 'Playground | SQDhell';
}

function viewCheat(){
  document.body.dataset.view = 'cheat';
  app.innerHTML = `<div class="cheat"><h1>Quick reference</h1><p class="sec-sub">Every essential SQL command on one page. Click a command to open its full lesson.</p>
  ${CHEAT.map(g => `<h2>${esc(g.title)}</h2><div class="tbl-scroll"><table class="info"><tr><th>Command</th><th>Example</th><th>What it does</th></tr>${g.rows.map(r => `<tr><td><a href="#/lesson/${r[3]}">${esc(r[0])}</a></td><td>${hl(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('')}</table></div>`).join('')}
  <h2>Order of a SELECT statement</h2><pre class="syntax">SELECT columns
FROM table
JOIN ... ON ...
WHERE condition
GROUP BY column
HAVING condition
ORDER BY column
LIMIT number;</pre></div>`;
  enhance(app);
  document.title = 'Quick reference | SQDhell';
}

function route(){
  const parts = location.hash.replace(/^#\/?/,'').split('/').filter(Boolean);
  if(parts[0] !== 'playground') listeners.clear();
  document.body.classList.remove('menu-open');
  if(parts[0] === 'lesson') viewLesson(parts[1]);
  else if(parts[0] === 'playground') viewPlay();
  else if(parts[0] === 'reference') viewCheat();
  else { viewHome(); document.title = 'SQDhell | Learn SQL'; }
  const key = parts[0] || 'home';
  document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('on', a.dataset.nav === key));
  $('#menu-btn').hidden = key !== 'lesson';
  window.scrollTo(0,0);
}

/* ---------- theme: always dark ---------- */
document.documentElement.dataset.theme = 'dark';
$('#menu-btn').onclick = () => document.body.classList.toggle('menu-open');

window.addEventListener('hashchange', route);
route();
