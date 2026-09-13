/* Dr. Laura Kļava. Koncepcija. Bez bibliotēkām: viss teksts un pogas redzamas arī bez JS. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  var PHONE = '+37120043567';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Kas vajadzīgs jūsu mīlulim? ---------- */
  var SIT = {
    vakc: {
      title: 'Vakcinācija, čips vai pase',
      list: ['Vakcinācija', 'Dzīvnieku identifikācija (mikročipēšana)', 'Eiropas Savienības mājdzīvnieka pases noformēšana', 'Klīniskā izmeklēšana'],
      note: 'Vizīte notiek pie jums mājās. Laiku saskaņosim pa tālruni vai īsziņā.',
      sms: 'Vajadzīga vakcinācija, čips vai ES pase'
    },
    slimo: {
      title: 'Mīlulis slimo',
      list: ['Klīniskā izmeklēšana', 'Asins paraugu noņemšana un analīzes', 'Ārstēšanas plāna sastādīšana', 'Medikamentu ievadīšana (IV, IM, SC)', 'Veterinārās konsultācijas'],
      note: 'Vizīte notiek pie jums mājās. Laiku saskaņosim pa tālruni vai īsziņā.',
      sms: 'Mīlulis slimo, vajadzīga apskate mājās'
    },
    analizes: {
      title: 'Analīzes mājās',
      list: ['Asins paraugu noņemšana', 'Hematoloģiskās analīzes', 'Bioķīmiskās analīzes', 'Elektrolītu un asins gāzu analīzes'],
      note: 'Paraugus noņemam pie jums mājās. Laiku saskaņosim pa tālruni vai īsziņā.',
      sms: 'Vajadzīgas analīzes mājās'
    },
    vecs: {
      title: 'Vecs vai smagi slims dzīvnieks',
      list: ['Veterinārās konsultācijas', 'Ārstēšanas plāna sastādīšana', 'Medikamentu ievadīšana (IV, IM, SC)', 'Pēcoperācijas un paliatīvā aprūpe'],
      note: 'Par paliatīvo aprūpi un grūtiem lēmumiem: <a href="#aprupe">lasiet zemāk</a>. Laiku saskaņosim pa tālruni.',
      sms: 'Vecs vai smagi slims dzīvnieks, vajadzīga aprūpe mājās'
    }
  };
  var PET = { suns: 'suns', kakis: 'kaķis', cits: 'cits dzīvnieks' };
  var VIETA = { riga: 'Rīgā', pieriga: 'Pierīgā', zemgale: 'Zemgalē' };

  var picker = document.getElementById('picker');
  var result = document.getElementById('result');
  var smsLink = document.getElementById('sms-link');
  var heroSms = document.getElementById('hero-sms');

  var smsHref = function (body) { return 'sms:' + PHONE + '?&body=' + encodeURIComponent(body); };
  var genericBody = 'Sveiki! Vēlos vienoties par veterinārārstes vizīti mājās. Dzīvnieks: [suns / kaķis / cits]. Atrodamies: [vieta]. [Vārds]';
  if (heroSms) heroSms.href = smsHref(genericBody);
  if (smsLink) smsLink.href = smsHref(genericBody);

  if (picker && result) {
    var val = function (name) { var el = picker.querySelector('input[name="' + name + '"]:checked'); return el ? el.value : ''; };
    var esc = function (s) { return s.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); };
    var first = true;

    /* Teksts nāk tikai no šī faila konstantēm, ne no lietotāja ievades. */
    var apply = function () {
      var sit = SIT[val('sit')], pet = val('pet'), vieta = val('vieta');
      var body = (sit ? sit.sms : 'Vēlos vienoties par veterinārārstes vizīti mājās') +
        '. Dzīvnieks: ' + (PET[pet] || '[suns / kaķis / cits]') +
        '. Atrodamies: ' + (VIETA[vieta] || '[vieta]') +
        '. Kad varētu vienoties par vizīti? [Vārds]';
      smsLink.href = smsHref('Sveiki! ' + body);
      if (!sit) return;
      document.getElementById('result-title').textContent = sit.title;
      document.getElementById('result-list').innerHTML = sit.list.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('');
      document.getElementById('result-note').innerHTML = sit.note;
      result.classList.remove('pop');
      void result.offsetWidth;
      result.classList.add('pop');
    };

    picker.addEventListener('change', function (e) {
      var isSit = e.target && e.target.name === 'sit';
      if (isSit && !reduce && typeof document.startViewTransition === 'function') {
        document.startViewTransition(apply);
      } else {
        apply();
      }
      if (isSit && first && window.innerWidth < 900) {
        first = false;
        var r = result.getBoundingClientRect();
        if (r.bottom > window.innerHeight) result.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
      }
    });
  }

  /* ---------- 2. Atklāšana slinkšot: bez IntersectionObserver, ar apdrošinājumu ---------- */
  var rv = Array.prototype.slice.call(document.querySelectorAll('.rv'));
  var check = function () {
    var vh = window.innerHeight;
    for (var i = 0; i < rv.length; i++) {
      var el = rv[i];
      if (!el.classList.contains('in') && el.getBoundingClientRect().top < vh) el.classList.add('in');
    }
  };
  window.addEventListener('scroll', check, { passive: true });
  window.addEventListener('resize', check);
  window.addEventListener('load', check);
  check();
  setTimeout(check, 1200);

  /* ---------- 3. Citāts iedegas pa vārdiem, aktīvais solis tumšs ---------- */
  var statement = document.getElementById('statement');
  var words = [];
  if (statement && !reduce) {
    var parts = statement.textContent.split(' ');
    statement.textContent = '';
    parts.forEach(function (w, i) {
      var s = document.createElement('span');
      s.textContent = w;
      statement.appendChild(s);
      if (i < parts.length - 1) statement.appendChild(document.createTextNode(' '));
      words.push(s);
    });
  }
  var stepsAll = Array.prototype.slice.call(document.querySelectorAll('.step'));
  var focusTick = function () {
    var vh = window.innerHeight;
    if (words.length) {
      var r = statement.getBoundingClientRect();
      var p = (vh * 0.85 - r.top) / (r.height + vh * 0.35);
      p = p < 0 ? 0 : p > 1 ? 1 : p;
      var n = Math.round(p * words.length);
      for (var i = 0; i < words.length; i++) words[i].classList.toggle('lit', i < n);
    }
    if (stepsAll.length && !reduce) {
      var best = -1, bestD = Infinity, mid = vh * 0.45;
      for (var k = 0; k < stepsAll.length; k++) {
        var sr = stepsAll[k].getBoundingClientRect();
        var d = Math.abs((sr.top + sr.bottom) / 2 - mid);
        if (d < bestD) { bestD = d; best = k; }
      }
      for (var m = 0; m < stepsAll.length; m++) stepsAll[m].classList.toggle('active', m === best && bestD < vh * 0.5);
    }
  };
  if (reduce) {
    stepsAll.forEach(function (s) { s.classList.add('active'); });
  } else {
    window.addEventListener('scroll', focusTick, { passive: true });
    window.addEventListener('resize', focusTick);
    window.addEventListener('load', focusTick);
    focusTick();
  }
})();
