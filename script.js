// Inisialisasi Supabase
const supabaseUrl = 'https://epeuumquuxnjxrwkwxux.supabase.co/rest/v1/'; // Ganti dengan URL Supabase Anda
const supabaseKey = 'sb_publishable_M_PW1owtZFP0Y2lOqGIPMA_peDE848r'; // Ganti dengan anon key Anda
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

(function(){
'use strict';
var PRICE=7000,PTSL=50,DP=2450,DO=24.5,DTX=6;
function gs(k,d){try{var v=localStorage.getItem('jl_'+k);return v!==null?JSON.parse(v):d}catch(e){return d}}
function ss(k,v){try{localStorage.setItem('jl_'+k,JSON.stringify(v))}catch(e){}}
var S={points:gs('points',DP),totalOil:gs('totalOil',DO),txCount:gs('txCount',DTX),
transactions:gs('transactions',[
{id:'JLT-001',liters:5.5,price:38500,points:275,status:'success',date:'2026-10-01',time:'10.00 – 12.00',method:'Dijemput Petugas',addr:'Jl. Kenanga No. 12',reason:''},
{id:'JLT-002',liters:3,price:21000,points:150,status:'success',date:'2026-09-25',time:'08.00 – 10.00',method:'Dijemput Petugas',addr:'Jl. Kenanga No. 12',reason:''},
{id:'JLT-003',liters:4,price:0,points:0,status:'rejected',date:'2026-09-20',time:'13.00 – 15.00',method:'Dijemput Petugas',addr:'Jl. Kenanga No. 12',reason:'Terlalu banyak air/kotoran'},
{id:'JLT-004',liters:6,price:42000,points:300,status:'success',date:'2026-09-15',time:'10.00 – 12.00',method:'Dijemput Petugas',addr:'Jl. Kenanga No. 12',reason:''},
{id:'JLT-005',liters:3,price:21000,points:150,status:'success',date:'2026-09-10',time:'15.00 – 17.00',method:'Antar ke Pusat',addr:'-',reason:''},
{id:'JLT-006',liters:3,price:21000,points:150,status:'success',date:'2026-09-05',time:'08.00 – 10.00',method:'Dijemput Petugas',addr:'Jl. Kenanga No. 12',reason:''}
]),
rewards:gs('rewards',[]),
pickup:gs('pickup',{date:'2026-10-12',time:'10.00 – 12.00',status:'scheduled'}),
nextId:gs('nextId',7)};
function save(){ss('points',S.points);ss('totalOil',S.totalOil);ss('txCount',S.txCount);ss('transactions',S.transactions);ss('rewards',S.rewards);ss('pickup',S.pickup);ss('nextId',S.nextId)}
var RW=[
{id:1,name:'Eco Bottle',desc:'Botol minum ramah lingkungan dari bahan daur ulang.',points:1200,icon:'🧴',cat:'eco'},
{id:2,name:'Reusable Bag',desc:'Tas belanja yang bisa dipakai berulang kali.',points:800,icon:'👜',cat:'eco'},
{id:3,name:'Sabun dari Jelantah',desc:'Sabun organik dari minyak jelantah daur ulang.',points:1000,icon:'🧼',cat:'rumah'},
{id:4,name:'Voucher Belanja',desc:'Voucher Rp50.000 di merchant mitra Jelantara.',points:1500,icon:'🎫',cat:'voucher'},
{id:5,name:'Tote Bag Jelantara',desc:'Tote bag eksklusif desain Jelantara.',points:900,icon:'🛍️',cat:'eco'},
{id:6,name:'Voucher Pulsa',desc:'Voucher pulsa Rp25.000 semua operator.',points:750,icon:'📱',cat:'voucher'}
];
var cL=5,cM='pickup',cT='10.00 – 12.00',cS=1;
var fmt=function(n){return'Rp'+n.toLocaleString('id-ID')};
var fmtN=function(n){return n.toLocaleString('id-ID')};
var fmtP=function(n){return fmtN(n)+' poin'};
function q(s){return document.querySelector(s)}
function qa(s){return document.querySelectorAll(s)}
function navigate(sec){
qa('.ps').forEach(function(s){s.classList.remove('active')});
var el=q('#sec-'+sec);if(el){el.classList.add('active')}
qa('.dn button').forEach(function(b){b.classList.remove('active')});
qa('.bn button').forEach(function(b){b.classList.remove('active')});
var dn=qa('.dn button'),bn=qa('.bn button');
var secs=['beranda','setor','riwayat','reward','profil'];
var idx=secs.indexOf(sec);
if(idx>=0){if(dn[idx])dn[idx].classList.add('active');if(bn[idx])bn[idx].classList.add('active')}
window.scrollTo({top:0,behavior:'smooth'});
if(sec==='riwayat')renderHistory('all');
if(sec==='reward')renderRewards('all');
if(sec==='beranda'){renderDashTx();animateCounters()}
if(sec==='profil')renderProfile()
}
window.navigate=navigate;
function showToast(msg,isErr){var t=q('#toast');t.textContent=msg;t.className='toast'+(isErr?' err':'');t.classList.remove('hide');setTimeout(function(){t.classList.add('hide')},3000)}
window.showToast=showToast;
function renderDashTx(){
var el=q('#dash-tx-list');var txs=S.transactions.slice(0,3);
if(!txs.length){el.innerHTML='<div class="es"><div class="ei-icon">📭</div><h4>Belum ada transaksi</h4><p>Yuk, setor jelantah pertamamu!</p></div>';return}
el.innerHTML=txs.map(function(tx){
var ic=tx.status==='success'?'ok':tx.status==='rejected'?'rj':'pd';
var ico=tx.status==='success'?'✅':tx.status==='rejected'?'❌':'⏳';
return'<div class="ti" onclick="showTxDetail(\''+tx.id+'\')"><div class="ico '+ic+'">'+ico+'</div><div class="inf"><div class="tid">'+tx.id+'</div><div class="tvl">'+tx.liters+' L</div></div><div class="tr"><div class="tam">'+(tx.status==='success'?fmt(tx.price):'-')+'</div><div class="tpn">'+(tx.status==='success'?'+'+tx.points+' poin':'')+'</div></div></div>'}).join('');
var pk=S.pickup;if(pk&&pk.date){var d=new Date(pk.date);var days=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];var mo=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];q('#dash-pickup').innerHTML='<h4>🚚 Pickup Berikutnya</h4><div class="pi"><span>📅 '+days[d.getDay()]+', '+d.getDate()+' '+mo[d.getMonth()]+' '+d.getFullYear()+'</span><span>🕐 '+pk.time+'</span><span class="badge bg-s">✓ Dijadwalkan</span></div>'}
}
function updateStats(){var o=S.totalOil.toLocaleString('id-ID',{minimumFractionDigits:1})+' L';q('#stat-oil').textContent=o;q('#stat-tx').textContent=S.txCount;q('#stat-pts').textContent=fmtP(S.points);q('#stat-impact').textContent=o;q('#dash-points').textContent=fmtP(S.points);q('#impact-liters').textContent=o}
function renderProfile(){q('#prof-tx').textContent=S.txCount;q('#prof-oil').textContent=S.totalOil.toLocaleString('id-ID',{minimumFractionDigits:1})+' L';q('#prof-pts').textContent=fmtP(S.points)}
function animateCounters(){qa('.iv[data-count]').forEach(function(el){var tgt=parseFloat(el.getAttribute('data-count'));var fl=tgt%1!==0;var dur=1200,st=null;function step(ts){if(!st)st=ts;var p=Math.min((ts-st)/dur,1);var e=1-Math.pow(1-p,3);el.textContent=fl?(tgt*e).toFixed(1).replace('.',','):Math.round(tgt*e).toLocaleString('id-ID');if(p<1)requestAnimationFrame(step)}requestAnimationFrame(step)})}
function initReveal(){if(!('IntersectionObserver'in window)){qa('.reveal').forEach(function(el){el.classList.add('visible')});return}var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:0.15});qa('.reveal').forEach(function(el){observer.observe(el)})}
function updateLiter(v){cL=parseFloat(v)||0;if(cL<0.5)cL=0.5;q('#liter-display').textContent=cL;q('#liter-range').value=cL;q('#liter-input').value=cL;q('#est-pay').textContent=fmt(Math.round(cL*PRICE));q('#est-pts').textContent=fmtP(Math.round(cL*PTSL))}
window.updateLiter=updateLiter;
function goStep(n){cS=n;for(var i=1;i<=4;i++){var el=q('#step-'+i);if(el)el.classList.toggle('hidden',i!==n);var pill=q('#pill-'+i);if(pill){pill.classList.remove('active','done');if(i===n)pill.classList.add('active');else if(i<n)pill.classList.add('done')}}
if(n===3){var dt=q('#date-input');if(!dt.value){var tm=new Date();tm.setDate(tm.getDate()+1);dt.value=tm.toISOString().split('T')[0]}}
if(n===4){var pay=Math.round(cL*PRICE);var pts=Math.round(cL*PTSL);q('#cf-liter').textContent=cL+' L';q('#cf-pay').textContent=fmt(pay);q('#cf-pts').textContent=fmtP(pts);q('#cf-method').textContent=cM==='pickup'?'Dijemput Petugas':'Antar ke Pusat';q('#cf-addr').textContent=cM==='pickup'?(q('#addr-input').value||'Jl. Kenanga No. 12'):'-';var dv=q('#date-input').value;if(dv){var d=new Date(dv);var days=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];var mo=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];q('#cf-date').textContent=days[d.getDay()]+', '+d.getDate()+' '+mo[d.getMonth()]+' '+d.getFullYear()}else q('#cf-date').textContent='-';q('#cf-time').textContent=cT}
window.scrollTo({top:0,behavior:'smooth'})}
window.goStep=goStep;
function selectMethod(el,m){cM=m;qa('.mi').forEach(function(c){c.classList.remove('sel')});el.classList.add('sel');q('#addr-field').style.display=m==='pickup'?'block':'none'}
window.selectMethod=selectMethod;
function selectTime(el){cT=el.textContent;qa('.tsl').forEach(function(c){c.classList.remove('sel')});el.classList.add('sel')}
window.selectTime=selectTime;
function confirmPickup(){var pay=Math.round(cL*PRICE);var pts=Math.round(cL*PTSL);var id='JLT-'+String(S.nextId).padStart(3,'0');S.nextId++;var tx={id:id,liters:cL,price:pay,points:pts,status:'pending',date:q('#date-input').value||new Date().toISOString().split('T')[0],time:cT,method:cM==='pickup'?'Dijemput Petugas':'Antar ke Pusat',addr:cM==='pickup'?(q('#addr-input').value||'Jl. Kenanga No. 12'):'-',reason:''};S.transactions.unshift(tx);S.txCount++;S.pickup={date:tx.date,time:tx.time,status:'scheduled'};save();showModal('🎉','Pickup berhasil dijadwalkan!','Petugas akan datang sesuai jadwal.',id,[{label:'Lihat Riwayat',cls:'btn bs',action:function(){closeModal();navigate('riwayat')}},{label:'Kembali ke Beranda',cls:'btn bp',action:function(){closeModal();navigate('beranda')}}]);cS=1;goStep(1)}
window.confirmPickup=confirmPickup;
function showModal(icon,title,desc,code,buttons){var root=q('#modal-root');var bh=buttons.map(function(b,i){return'<button class="btn '+b.cls+' bsm" id="mdbtn-'+i+'">'+b.label+'</button>'}).join('');root.innerHTML='<div class="md-overlay" onclick="if(event.target===this)closeModal()"><div class="mc-inner"><div class="mi-icon">'+icon+'</div><h3>'+title+'</h3><p>'+desc+'</p>'+(code?'<div class="tx-code">'+code+'</div>':'')+'<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">'+bh+'</div></div></div>';document.body.classList.add('modal-open');buttons.forEach(function(b,i){var btn=document.getElementById('mdbtn-'+i);if(btn)btn.onclick=b.action})}
window.closeModal=function(){q('#modal-root').innerHTML='';document.body.classList.remove('modal-open')};
function showTxDetail(txId){var tx=S.transactions.find(function(t){return t.id===txId});if(!tx)return;var bd=tx.status==='success'?'<span class="badge bg-s">Berhasil</span>':tx.status==='rejected'?'<span class="badge bg-d">Ditolak</span>':'<span class="badge bg-w">Diproses</span>';var upl=tx.status==='success'?fmt(Math.round(tx.price/tx.liters)):'-';var upt=tx.status==='success'?fmt(tx.price):'-';var upo=tx.status==='success'?'+'+tx.points+' poin':'-';var html='<div class="tdm" onclick="if(event.target===this)closeTxDetail()"><div class="sheet"><div class="handle"></div><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><h3 style="font-size:1.1rem;font-weight:700">'+tx.id+'</h3>'+bd+'</div><div class="dr"><span class="dl">Tanggal</span><span class="dv">'+tx.date+'</span></div><div class="dr"><span class="dl">Volume</span><span class="dv">'+tx.liters+' L</span></div><div class="dr"><span class="dl">Harga/Liter</span><span class="dv">'+upl+'</span></div><div class="dr"><span class="dl">Total Pembayaran</span><span class="dv">'+upt+'</span></div><div class="dr"><span class="dl">Poin</span><span class="dv">'+upo+'</span></div><div class="dr"><span class="dl">Metode</span><span class="dv">'+tx.method+'</span></div><div class="dr"><span class="dl">Waktu</span><span class="dv">'+tx.time+'</span></div>'+((tx.reason)?'<div class="rr">⚠️ '+tx.reason+'</div>':'')+'<div style="margin-top:20px"><button class="btn bp bsm bbw" onclick="closeTxDetail()">Tutup</button></div></div></div>';q('#modal-root').innerHTML=html;document.body.classList.add('modal-open')}
window.showTxDetail=showTxDetail;window.closeTxDetail=function(){q('#modal-root').innerHTML='';document.body.classList.remove('modal-open')};
function renderHistory(filter){var el=q('#history-list');var txs=S.transactions;if(filter!=='all')txs=txs.filter(function(t){return t.status===filter});if(!txs.length){el.innerHTML='<div class="es"><div class="ei-icon">📋</div><h4>Tidak ada transaksi</h4><p>Tidak ditemukan transaksi dengan filter ini.</p></div>';return}
el.innerHTML=txs.map(function(tx){var ic=tx.status==='success'?'ok':tx.status==='rejected'?'rj':'pd';var ico=tx.status==='success'?'✅':tx.status==='rejected'?'❌':'⏳';var badge=tx.status==='success'?'<span class="badge bg-s">Berhasil</span>':tx.status==='rejected'?'<span class="badge bg-d">Ditolak</span>':'<span class="badge bg-w">Diproses</span>';return'<div class="ti" onclick="showTxDetail(\''+tx.id+'\')"><div class="ico '+ic+'">'+ico+'</div><div class="inf"><div class="tid">'+tx.id+'</div><div class="tvl">'+tx.liters+' L</div></div><div class="tr"><div class="tam">'+(tx.status==='success'?fmt(tx.price):'-')+'</div><div class="tpn">'+(tx.status==='success'?'+'+tx.points+' poin':'')+'</div></div></div>'}).join('')}
function filterTx(el,status){qa('.ftab').forEach(function(f){f.classList.remove('active')});el.classList.add('active');renderHistory(status)}
window.filterTx=filterTx;
function renderRewards(filter){var rw=RW;if(filter!=='all')rw=RW.filter(function(r){return r.cat===filter});q('#reward-pts').textContent=fmtP(S.points);q('#reward-grid').innerHTML=rw.map(function(r){var enough=S.points>=r.points;return'<div class="rcard"><div class="rimg">'+r.icon+'</div><div class="rbody"><h4>'+r.name+'</h4><div class="desc">'+r.desc+'</div><div class="pts">'+fmtP(r.points)+'</div><button class="btn '+(enough?'ba':'bo')+' bsm" '+(enough?'onclick="redeemReward('+r.id+')"':'disabled style="opacity:.6"')+'>'+(enough?'Tukar':'Poin Kurang')+'</button></div></div>'}).join('')}
function filterReward(el,cat){qa('.rcat').forEach(function(f){f.classList.remove('active')});el.classList.add('active');renderRewards(cat)}
window.filterReward=filterReward;
function redeemReward(id){var rw=RW.find(function(r){return r.id===id});if(!rw)return;if(S.points<rw.points){showToast('Poin kamu belum cukup.',true);return}
showModal('🎁','Konfirmasi Penukaran','Gunakan '+fmtP(rw.points)+' untuk '+rw.name+'?',null,[{label:'Batal',cls:'btn bo',action:closeModal},{label:'Tukar Sekarang',cls:'btn ba',action:function(){S.points-=rw.points;S.rewards.push({id:rw.id,name:rw.name,date:new Date().toISOString().split('T')[0]});save();closeModal();showToast('Reward berhasil ditukarkan! 🎉');updateStats();renderRewards('all')}}])}
window.redeemReward=redeemReward;
function showAbout(){showModal('🧺','Tentang Jelantara','"Dari Jelantah, Jadi Manfaat.\n\nJelantara adalah platform digital pengelolaan minyak jelantah yang menghubungkan masyarakat dengan sistem pengumpulan dan pemanfaatan berkelanjutan.\n\nPrototype / Demo Project',null,[{label:'Tutup',cls:'btn bp bsm',action:closeModal}])}
window.showAbout=showAbout;
function init(){updateStats();renderDashTx();renderProfile();initReveal();setTimeout(animateCounters,300)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
