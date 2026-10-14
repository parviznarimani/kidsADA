
// Only fictional presentation data is included. Connect the private API in a later step.
const sampleCard = {name:'آرین نمونه', photo:null, father:'+12025550101', mother:'+12025550102'};
const pathToken = location.pathname.split('/').filter(Boolean).pop() || '';
const token = /^pid[a-zA-Z0-9]+_key[a-zA-Z0-9]+$/.test(pathToken) ? pathToken : null;
const photo = document.querySelector('#photo');
const skeleton = document.querySelector('.skeleton');
function renderCard(card) {
 document.querySelector('#name').textContent = card.name;
 photo.hidden = true; skeleton.hidden = false;
 photo.onload = () => {photo.hidden = false; skeleton.hidden = true;};
 photo.onerror = () => {photo.hidden = true; skeleton.hidden = false;};
 if(card.photo) photo.src = card.photo; else photo.removeAttribute('src');
 for (const role of ['father','mother']) {
  const link = document.getElementById(role);
  const number = card[role];
  link.removeAttribute('href'); link.setAttribute('aria-disabled','true');
  link.querySelector('.number').textContent = '۰۹۱۲ ——— ————';
  if(number && /^\+?[0-9]{7,15}$/.test(number)) {
   link.href = 'tel:' + number; link.removeAttribute('aria-disabled');
   link.querySelector('.number').textContent = number.replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
  }
 }
}
renderCard(sampleCard);
