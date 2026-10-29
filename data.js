const $ = id => document.getElementById(id);

/* ===== Kurslar ro'yxati — shu yerdan o'zgartiring ===== */
const courses = [
  { t: "Python asoslari",        c: "Dasturlash", who: "Jasur Rahimov",   n: 42, p: 290000, col: "#6b4dff", ic: "Py" },
  { t: "Web sayt yaratish",      c: "Dasturlash", who: "Madina Aliyeva",  n: 56, p: 340000, col: "#1fa8e8", ic: "</>" },
  { t: "Ingliz tili A1–B1",      c: "Tillar",     who: "Sarvar Karimov",  n: 64, p: 250000, col: "#e8631f", ic: "En" },
  { t: "IELTS 6.5 tayyorlov",    c: "Tillar",     who: "Nilufar Tosheva", n: 48, p: 450000, col: "#d93a8a", ic: "IE" },
  { t: "UI/UX dizayn",           c: "Dizayn",     who: "Dilnoza Yusupova",n: 38, p: 320000, col: "#12a874", ic: "UX" },
  { t: "Grafik dizayn",          c: "Dizayn",     who: "Akmal Soliyev",   n: 30, p: 280000, col: "#8a4dff", ic: "Gd" },
  { t: "Matematika: DTM tayyorlov", c: "Fanlar",  who: "Bobur Ergashev",  n: 70, p: 300000, col: "#e8a91f", ic: "Σ" },
  { t: "Fizika asoslari",        c: "Fanlar",     who: "Hulkar Nazarova", n: 36, p: 240000, col: "#1f6fe8", ic: "Fz" },
  { t: "Rus tili: noldan",       c: "Tillar",     who: "Elena Petrova",   n: 40, p: 230000, col: "#c23a3a", ic: "Ru" }
];

let cat = "all";
const fmt = n => n.toLocaleString('ru-RU') + " so'm";

function render() {
  const q = $('q').value.trim().toLowerCase();
  const list = courses.filter(x =>
    (cat === "all" || x.c === cat) &&
    (!q || (x.t + " " + x.who + " " + x.c).toLowerCase().includes(q)));
  $('grid').innerHTML = list.map(x => `
    <article class="course">
      <div class="thumb" style="background:${x.col}">${x.ic}</div>
      <div class="body">
        <span class="tag">${x.c}</span>
        <h3>${x.t}</h3>
        <span class="meta">${x.who} · ${x.n} ta dars</span>
        <div class="foot"><span class="price">${fmt(x.p)}</span><a class="join" href="#royxat">Yozilish</a></div>
      </div>
    </article>`).join('');
  $('empty').style.display = list.length ? 'none' : 'block';
}

$('filters').addEventListener('click', e => {
  const b = e.target.closest('.chip'); if (!b) return;
  cat = b.dataset.cat;
  document.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
  render();
});
$('q').addEventListener('input', render);
$('qBtn').addEventListener('click', () => { render(); $('kurslar').scrollIntoView(); });
$('q').addEventListener('keydown', e => { if (e.key === 'Enter') { render(); $('kurslar').scrollIntoView(); } });
render();

/* ===== Menyu va yil ===== */
$('burger').addEventListener('click', () => {
  const o = $('menu').classList.toggle('open');
  $('burger').setAttribute('aria-expanded', o);
});
$('menu').querySelectorAll('a').forEach(a => a.addEventListener('click', () => $('menu').classList.remove('open')));
$('year').textContent = new Date().getFullYear();

/* ===== Ro'yxatdan o'tgandan kelgan foydalanuvchi ===== */
function greet(email) {
  $('navBtn').textContent = "Salom, " + email.split('@')[0];
  $('navBtn').removeAttribute('href');
}
try {
  const saved = sessionStorage.getItem('edunova_user');
  if (saved) greet(saved);
} catch (e) {}

/* ===== Forma ===== */
const email = $('email'), phone = $('phone'), pass = $('pass'), pass2 = $('pass2');

phone.addEventListener('input', () => {
  let d = phone.value.replace(/\D/g, '');
  if (!d.startsWith('998')) d = '998' + d;
  d = d.slice(0, 12);
  phone.value = '+' + [d.slice(0,3), d.slice(3,5), d.slice(5,8), d.slice(8,10), d.slice(10,12)].filter(Boolean).join(' ');
});

$('toggle').addEventListener('click', () => {
  const show = pass.type === 'password';
  pass.type = pass2.type = show ? 'text' : 'password';
  $('toggle').textContent = show ? 'YASHIR' : "KO'RSAT";
});

pass.addEventListener('input', () => {
  const v = pass.value; let s = 0;
  if (v.length >= 8) s++;
  if (/[A-Za-z]/.test(v) && /\d/.test(v)) s++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v) || v.length >= 12) s++;
  const bar = $('strength');
  bar.style.width = (s * 25) + '%';
  bar.style.background = s <= 1 ? '#ff5c7a' : s <= 2 ? '#ffc24d' : '#4dffb0';
});

function mark(input, errId, msg) {
  $(errId).textContent = msg;
  input.classList.toggle('bad', !!msg);
  input.classList.toggle('good', !msg);
  return !msg;
}

$('form').addEventListener('submit', e => {
  e.preventDefault();
  $('status').textContent = '';
  const a = mark(email, 'e-email', /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()) ? '' : "Email noto'g'ri yozilgan.");
  const b = mark(phone, 'e-phone', /^\+998 \d{2} \d{3} \d{2} \d{2}$/.test(phone.value) ? '' : "Raqamni to'liq kiriting: +998 XX XXX XX XX");
  const c = mark(pass, 'e-pass', pass.value.length >= 8 && /[A-Za-z]/.test(pass.value) && /\d/.test(pass.value) ? '' : "Kamida 8 ta belgi, harf va raqam bo'lsin.");
  const d = mark(pass2, 'e-pass2', pass2.value && pass2.value === pass.value ? '' : "Parollar bir xil emas.");
  if (!(a && b && c && d)) return;

  // Shu yerda ma'lumotni o'z serveringizga yuborasiz (parolni serverda hash qiling):
  // fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email: email.value.trim(), phone: phone.value, password: pass.value }) });

  try { sessionStorage.setItem('edunova_user', email.value.trim()); } catch (err) {}
  greet(email.value.trim());
  $('status').textContent = "HISOB YARATILDI";
  e.target.reset();
  document.querySelectorAll('input.f').forEach(i => i.classList.remove('good', 'bad'));
  $('strength').style.width = '0';
  $('kurslar').scrollIntoView();
});