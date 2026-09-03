
window.Atlas = {
  NAV: [
    {t:'Overview', h:'index.html'},
    {t:'Market Landscape', h:'market-landscape.html', id:'market-landscape'},
    {t:'Fund Mechanics', h:'fund-mechanics.html', id:'fund-mechanics'},
    {g:'Transaction Types', items:[
      {t:'GP-Leds', h:'gp-leds.html', id:'gp-leds'},
      {t:'LP-Leds', h:'lp-leds.html', id:'lp-leds'},
      {t:'Tenders & Strip Sales', h:'tender-strips.html', id:'tender-strips'},
      {t:'Co-Investments', h:'coinvest.html', id:'coinvest'}
    ]},
    {g:'Recruiting', items:[
      {t:'Process & Interviews', h:'recruiting.html', id:'recruiting'},
      {t:'Job Dashboard', h:'recruiting.html#jobs'}
    ]},
    {g:'Practice', items:[
      {t:'Drills', h:'drills.html', id:'drills'},
      {t:'Glossary', h:'glossary.html', id:'glossary'}
    ]},
    {g:'Foundations', items:[
      {t:'The Buyside Map', h:'map.html', id:'map'},
      {t:'LBO Mechanics', h:'lbo.html', id:'lbo'},
      {t:'Accounting & Valuation', h:'valuation.html', id:'valuation'},
      {t:'PE Strategy Playbook', h:'playbook.html', id:'playbook'},
      {t:'Hedge Funds', h:'hedge-funds.html', id:'hedge-funds'}
    ]}
  ],
  key: function(id){ return 'atlas_done_' + id; },
  isDone: function(id){ try{ return localStorage.getItem(this.key(id)) === '1'; }catch(e){ return false; } },
  cur: function(){
    var p = location.pathname.split('/').pop() || 'index.html';
    return p;
  },
  link: function(it){
    var cur = this.cur();
    var a = document.createElement('a');
    a.className = 'nl' + ((it.h.split('#')[0] === cur && it.h.indexOf('#') === -1) ? ' active' : '');
    a.href = it.h;
    a.innerHTML = '<span>' + it.t + '</span>' + (it.id && this.isDone(it.id) ? '<span class="dot">✓</span>' : '');
    return a;
  },
  renderNav: function(){
    var el = document.getElementById('sidenav'); if(!el) return;
    var brand = document.createElement('div'); brand.className = 'brand';
    brand.innerHTML = '<span class="kk">Private Markets Reference</span><a href="index.html">Secondaries Atlas</a>';
    el.appendChild(brand);
    var cur = this.cur(), self = this;
    this.NAV.forEach(function(n){
      if(n.g){
        var d = document.createElement('details');
        var hasActive = n.items.some(function(it){ return it.h.split('#')[0] === cur; });
        var wide = window.matchMedia('(min-width: 1061px)').matches;
        if(hasActive || wide) d.open = true;
        var s = document.createElement('summary'); s.textContent = n.g; d.appendChild(s);
        n.items.forEach(function(it){ d.appendChild(self.link(it)); });
        el.appendChild(d);
      } else {
        el.appendChild(self.link(n));
      }
    });
  },
  initPage: function(id){
    this.renderNav();
    var b = document.getElementById('markDone'); if(!b) return; var self = this;
    function paint(){ var d = self.isDone(id); b.textContent = d ? '✓ COMPLETED — CLICK TO UNMARK' : 'MARK SECTION COMPLETE'; b.classList.toggle('is-done', d); }
    b.onclick = function(){ try{ localStorage.setItem(self.key(id), self.isDone(id) ? '0' : '1'); }catch(e){} paint(); };
    paint();
  },
  initHub: function(){
    this.renderNav();
    var self = this;
    document.querySelectorAll('[data-mod]').forEach(function(c){
      var el = c.querySelector('.prog'); if(!el) return;
      var d = self.isDone(c.getAttribute('data-mod'));
      el.textContent = d ? '✓ Completed' : '○ Not started';
      el.classList.toggle('on', d);
    });
    var s = null; try{ s = localStorage.getItem('atlas_drill_All'); }catch(e){}
    var el = document.getElementById('drillBest'); if(el && s !== null) el.textContent = 'Best full-drill score: ' + s + '%';
  }
};

Atlas.sectionQuiz = function(mountId, QS, storeKey){
  var mount = document.getElementById(mountId); if(!mount) return;
  var pool = [], idx = 0, score = 0;
  function shuffle(a){ for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
  function best(){ try{ return localStorage.getItem('atlas_quiz_'+storeKey); }catch(e){ return null; } }
  function saveBest(p){ try{ var b=+(best()||0); if(p>b) localStorage.setItem('atlas_quiz_'+storeKey, String(p)); }catch(e){} }
  function start(){ pool = shuffle(QS.slice()); idx = 0; score = 0; render(); }
  function render(){
    if(idx >= pool.length){
      var pct = pool.length ? Math.round(100*score/pool.length) : 0;
      saveBest(pct);
      var msg = pct>=85 ? 'Interview-ready on this section.' : pct>=60 ? 'Solid - reread the explanations you missed and rerun.' : 'Worth another pass through the section above first.';
      mount.innerHTML = '<div class="qz-card '+(pct>=85?'qz-ace':'')+'"><div class="qz-done"><div class="qz-prog">QUIZ COMPLETE</div><div class="big">'+score+' / '+pool.length+'</div><p>'+msg+'</p><p class="qz-best">Best score: '+(best()||pct)+'%</p><button class="qz-next show" id="qzr_'+mountId+'">RETAKE QUIZ</button></div></div>';
      document.getElementById('qzr_'+mountId).onclick = start;
      return;
    }
    var q = pool[idx];
    var order = shuffle(q.o.map(function(_,i){ return i; }));
    var html = '<div class="qz-card"><div class="qz-prog">QUESTION '+(idx+1)+' OF '+pool.length+' | SCORE '+score+'</div><div class="qz-bar2"><i style="width:'+Math.round(100*idx/pool.length)+'%"></i></div><div class="qz-q">'+q.q+'</div>';
    order.forEach(function(oi){ html += '<button class="qz-opt" data-i="'+oi+'">'+q.o[oi]+'</button>'; });
    html += '<div class="qz-exp" id="qze_'+mountId+'"></div><button class="qz-next" id="qzn_'+mountId+'">NEXT</button></div>';
    mount.innerHTML = html;
    mount.querySelectorAll('.qz-opt').forEach(function(btn){
      btn.onclick = function(){
        var pick = +btn.getAttribute('data-i');
        mount.querySelectorAll('.qz-opt').forEach(function(b){ b.disabled = true; if(+b.getAttribute('data-i') === q.a) b.classList.add('right'); });
        if(pick === q.a) score++; else btn.classList.add('wrong');
        idx++;
        var exp = document.getElementById('qze_'+mountId); exp.textContent = q.e; exp.classList.add('show');
        var nx = document.getElementById('qzn_'+mountId); nx.classList.add('show'); nx.onclick = render;
      };
    });
  }
  start();
};

Atlas.quizBest = function(id){ try{ return localStorage.getItem('atlas_quiz_'+id); }catch(e){ return null; } };
Atlas.initFX = function(){
  var d = document;
  // scroll progress
  if(!d.getElementById('scrollbar')){
    var sb = d.createElement('div'); sb.id = 'scrollbar'; d.body.appendChild(sb);
    var onscroll = function(){
      var h = d.documentElement, max = h.scrollHeight - h.clientHeight;
      sb.style.transform = 'scaleX(' + (max > 0 ? h.scrollTop / max : 0) + ')';
    };
    window.addEventListener('scroll', onscroll, {passive:true}); onscroll();
  }
  // back to top
  if(!d.getElementById('toTop')){
    var bt = d.createElement('button'); bt.id = 'toTop'; bt.type = 'button'; bt.innerHTML = '\u2191'; bt.title = 'Back to top';
    bt.onclick = function(){ window.scrollTo({top:0, behavior:'smooth'}); };
    d.body.appendChild(bt);
    window.addEventListener('scroll', function(){ bt.classList.toggle('show', (d.documentElement.scrollTop||0) > 600); }, {passive:true});
  }
  // reveal-on-scroll + animated counters + chart grow
  var targets = d.querySelectorAll('main h3, main .tool, main table, main .chips, main .tiles, main .callout, main .mod-card, main .minichart');
  var animNum = function(el){
    var raw = el.textContent, m = raw.match(/^([^0-9]*)([0-9][0-9,\.]*)(.*)$/);
    if(!m) return;
    var target = parseFloat(m[2].replace(/,/g,'')); if(!isFinite(target)) return;
    var dec = (m[2].split('.')[1]||'').length, t0 = null, DUR = 900;
    var step = function(ts){
      if(!t0) t0 = ts;
      var p = Math.min((ts-t0)/DUR, 1), eased = 1-Math.pow(1-p,3);
      var v = (target*eased).toFixed(dec);
      if(dec===0 && target>=1000) v = Number(v).toLocaleString('en-US');
      el.textContent = m[1]+v+m[3];
      if(p<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if('IntersectionObserver' in window){
    var seen = new WeakSet();
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting || seen.has(en.target)) return;
        seen.add(en.target); en.target.classList.add('in');
        en.target.querySelectorAll('.tile b, .chip b').forEach(animNum);
        io.unobserve(en.target);
      });
    }, {threshold: 0.15});
    targets.forEach(function(el){ el.classList.add('rv'); io.observe(el); });
  }
  // sidebar: search box + quiz score badges
  var nav = d.getElementById('sidenav');
  if(nav && !d.getElementById('navq')){
    var q = d.createElement('input'); q.id = 'navq'; q.type = 'search'; q.placeholder = 'Search sections\u2026';
    var brand = nav.querySelector('.brand'); if(brand) brand.after(q); else nav.prepend(q);
    q.addEventListener('input', function(){
      var v = q.value.trim().toLowerCase();
      nav.querySelectorAll('a.nl').forEach(function(a){ a.classList.toggle('hid', !!v && a.textContent.toLowerCase().indexOf(v) === -1); });
      nav.querySelectorAll('details').forEach(function(dt){ if(v) dt.open = true; });
    });
    nav.querySelectorAll('a.nl').forEach(function(a){
      var href = a.getAttribute('href') || '', id = href.replace('.html','').split('#')[0];
      var best = Atlas.quizBest(id);
      if(best !== null && !a.querySelector('.pct')){
        var s = d.createElement('span'); s.className = 'pct'; s.textContent = best + '%'; a.appendChild(s);
      }
    });
  }
  // news pulse ticker (index)
  var pulse = d.getElementById('pulse');
  if(pulse && window.fetch){
    fetch('data/news.json', {cache:'no-store'}).then(function(r){ if(!r.ok) throw 0; return r.json(); }).then(function(dd){
      if(!dd.items || !dd.items.length){ pulse.style.display = 'none'; return; }
      var mk = function(){ return dd.items.slice(0,12).map(function(it){
        return '<a href="'+it.link+'" target="_blank" rel="noopener"><span class="src">'+(it.source||'')+'</span>'+it.title+'</a>';
      }).join(''); };
      pulse.innerHTML = '<span class="lbl">THE TAPE</span><div class="track">'+mk()+mk()+'</div>';
    }).catch(function(){ pulse.style.display = 'none'; });
  }
};
(function(){
  var run = function(){ try{ Atlas.initFX(); }catch(e){} };
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
