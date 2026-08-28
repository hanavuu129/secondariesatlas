
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
