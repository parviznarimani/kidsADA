const photo = document.querySelector('#photo');
const skeleton = document.querySelector('.skeleton');
const appBase = new URL('.', document.baseURI);
const tokenPattern = /^pid[a-zA-Z0-9]+_key[a-zA-Z0-9]+$/;

function parseCSV(text) {
  const rows = []; let row = [], field = '', quoted = false;
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') { field += '"'; i++; }
      else if (quoted || field === '') quoted = !quoted;
      else throw new Error('Invalid CSV quoting');
    } else if (c === ',' && !quoted) { row.push(field); field = ''; }
    else if ((c === '\n' || c === '\r') && !quoted) {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); if (row.some(v => v.trim())) rows.push(row);
      row = []; field = '';
    } else field += c;
  }
  if (quoted) throw new Error('Unclosed CSV field');
  row.push(field); if (row.some(v => v.trim())) rows.push(row);
  const headers = rows.shift()?.map(v => v.trim());
  const required = ['kidscard_url', 'kidsname', 'kids_identity_number', 'father_phone', 'mother_phone'];
  if (!headers || new Set(headers).size !== headers.length || required.some(h => !headers.includes(h))) throw new Error('Missing CSV columns');
  return rows.map(values => {
    if (values.length !== headers.length) throw new Error('Invalid CSV row');
    return Object.fromEntries(headers.map((h, i) => [h, values[i].trim()]));
  });
}

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
  // Identifiers already contain the img prefix. Never prepend it twice.
  const id = record.kids_identity_number;
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) return;
  const extensions = ['jpg', 'jpeg', 'png', 'webp'];
  let index = 0;
  photo.onload = () => { photo.hidden = false; skeleton.hidden = true; };
  photo.onerror = () => {
    if (++index < extensions.length) loadPhoto();
    else { photo.hidden = true; skeleton.hidden = false; }
  };
  function loadPhoto() { photo.src = new URL(`kidsADA-data/faceimages/${id}.${extensions[index]}`, appBase).href; }
  photo.alt = `تصویر ${record.kidsname}`;
  loadPhoto();
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
    const response = await fetch(new URL('kidsADA-data/kids-identity.csv', appBase), { cache: 'no-store' });
    if (!response.ok) throw new Error('CSV unavailable');
    const records = parseCSV(await response.text());
    const matches = records.filter(row => row.kidscard_url.replace(/^\/+|\/+$/g, '') === token);
    if (matches.length === 0) { setMessage('کارت پیدا نشد', 'لینک این کارت در اطلاعات موجود نیست.'); return; }
    if (matches.length !== 1 || !matches[0].kidsname) throw new Error('Ambiguous or incomplete card');
    renderCard(matches[0]);
  } catch (error) {
    setMessage('اطلاعات دریافت نشد', 'لطفاً اتصال اینترنت را بررسی کرده و صفحه را دوباره باز کنید.');
    console.error('Card loading failed:', error.message);
  }
}
initialize();
