
window.Atlas = {
  key: function(id){ return 'atlas_done_' + id; },
  isDone: function(id){ try{ return localStorage.getItem(this.key(id)) === '1'; }catch(e){ return false; } },
  initPage: function(id){
    var b = document.getElementById('markDone'); if(!b) return; var self = this;
    function paint(){ var d = self.isDone(id); b.textContent = d ? '✓ COMPLETED — CLICK TO UNMARK' : 'MARK MODULE COMPLETE'; b.classList.toggle('is-done', d); }
    b.onclick = function(){ try{ localStorage.setItem(self.key(id), self.isDone(id) ? '0' : '1'); }catch(e){} paint(); };
    paint();
  },
  initHub: function(ids){
    var self = this, n = 0;
    ids.forEach(function(id){
      var el = document.querySelector('[data-mod="' + id + '"] .prog');
      var d = self.isDone(id);
      if(el){ el.textContent = d ? '✓ Completed' : '○ Not started'; el.classList.toggle('on', d); }
      if(d) n++;
    });
    var c = document.getElementById('hubProg'); if(c) c.textContent = n + ' / ' + ids.length + ' completed';
    var s = null; try{ s = localStorage.getItem('atlas_drill_All'); }catch(e){}
    var el = document.getElementById('drillBest'); if(el && s !== null) el.textContent = 'Best full-drill score: ' + s + '%';
  }
};
