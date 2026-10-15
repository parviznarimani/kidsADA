const photo = document.querySelector('#photo');
const skeleton = document.querySelector('.skeleton');
const appBase = new URL('.', document.baseURI);
const tokenPattern = /^pid[a-zA-Z0-9]+_key[a-zA-Z0-9]+$/;

const API_BASE = 'https://kidsada-admin.parviznarimani91.workers.dev';

function normalizePhone(value) {
  let number = value.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace(/[\s()-]/g, '');
  // Iranian mobile numbers exported as numeric cells may lose their initial zero.
  if (/^9\d{9}$/.test(number)) number = '0' + number;
  if (/^989\d{9}$/.test(number)) number = '+' + number;
  return /^\+?\d{7,15}$/.test(number) ? number : null;
}

function setMessage(title, message) {
  document.querySelector('#name').textContent = title;
  document.querySelector('.intro').textContent = message;
  document.querySelector('.contacts').hidden = true;
  document.querySelector('.note').hidden = true;
  document.querySelector('#status').textContent = '';
}

function renderCard(record) {
  document.querySelector('#name').textContent = record.kidsname;
  document.title = `${record.kidsname} — کیدزآدا`;
  document.querySelector('.intro').textContent = 'برای ارتباط با خانواده، یکی از شماره‌ها را لمس کنید.';
  document.querySelector('.contacts').hidden = false;
  document.querySelector('.note').hidden = false;
  for (const role of ['father', 'mother']) {
    const link = document.getElementById(role);
    const number = normalizePhone(record[`${role}_phone`]);
    link.removeAttribute('href'); link.setAttribute('aria-disabled', 'true');
    link.querySelector('.number').textContent = 'ثبت نشده';
    if (number) {
      link.href = 'tel:' + number; link.removeAttribute('aria-disabled');
      link.querySelector('.number').textContent = number.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
    }
  }
  photo.onload = () => { photo.hidden = false; skeleton.hidden = true; };
  photo.onerror = () => { photo.hidden = true; skeleton.hidden = false; };
  photo.alt = `تصویر ${record.kidsname}`;
  photo.src = record.photoURL;

}

async function initialize() {
  const query = new URLSearchParams(location.search);
  const lastPart = location.pathname.split('/').filter(Boolean).pop() || '';
  const token = query.has('card') ? query.get('card') : tokenPattern.test(lastPart) ? lastPart : null;
  if (!token) {
    setMessage('کارت کیدزآدا', 'برای مشاهده اطلاعات، کد روی کارت را اسکن کنید یا لینک کارت را باز کنید.');
    return;
  }
  if (!tokenPattern.test(token)) { setMessage('لینک نامعتبر', 'لطفاً لینک کارت را بررسی کنید.'); return; }
  // Freeze the asset base before restoring the clean path after the Pages redirect.
  let base = document.querySelector('base');
  if (!base) { base = document.createElement('base'); document.head.append(base); }
  base.href = appBase.href;
  if (query.has('card')) history.replaceState(null, '', new URL(token + '/', appBase));
  setMessage('در حال دریافت اطلاعات…', 'لطفاً کمی صبر کنید.');
  try {
    const endpoint = `${API_BASE}/api/card/${encodeURIComponent(token)}`;
    const response = await fetch(endpoint, { cache: 'no-store', credentials: 'omit' });
    if (response.status === 404) { setMessage('کارت پیدا نشد', 'لینک این کارت در اطلاعات موجود نیست.'); return; }
    if (!response.ok) throw new Error('Card API unavailable');
    const record = await response.json();
    if (!record.kidsname || typeof record.father_phone !== 'string' || typeof record.mother_phone !== 'string') throw new Error('Invalid card response');
    renderCard({...record, photoURL: endpoint + '/photo'});
  } catch (error) {
    setMessage('اطلاعات دریافت نشد', 'لطفاً اتصال اینترنت را بررسی کرده و صفحه را دوباره باز کنید.');
    console.error('Card loading failed:', error.message);
  }
}
initialize();
