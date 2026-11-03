/** Unit 2 Day 6 — independent Apps Script endpoint, no shared secret.
 * 1. Enter SHEET_ID. 2. Deploy as Web App (Execute as me / Anyone).
 * 3. Paste deployment /exec URL into index.html CLOUD_URL.
 * Uses ONLY the DAY6_STATES_2026_11_04 tab; never touches other tabs.
 * WARNING: A publicly accessible endpoint WITHOUT a secret is not an authentication system.
 * Use pseudonymous student aliases only; no private or sensitive information.
 */
const SHEET_ID = 'PASTE_EXISTING_SPREADSHEET_ID_HERE';
const TAB = 'DAY6_STATES_2026_11_04';
const HEADERS = ['alias','serverRevision','updatedAt','payload','checksum'];
const MAX_PAYLOAD = 90000;

function output_(v, callback) {
  const s = JSON.stringify(v);
  if (callback && /^[a-zA-Z_$][\w$]{0,80}$/.test(callback)) {
    return ContentService.createTextOutput(callback+'('+s+');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(s).setMimeType(ContentService.MimeType.JSON);
}
function alias_(v) {
  const a = String(v||'').trim().toUpperCase();
  if (!/^(?=(?:.*[A-Z]){2})(?=(?:.*[0-9]){2})[A-Z0-9]{4,20}$/.test(a)) throw Error('Alias must contain at least two letters and two digits (4–20 characters).');
  return a;
}
function tab_() {
  if (SHEET_ID === 'PASTE_EXISTING_SPREADSHEET_ID_HERE') throw Error('Set SHEET_ID in Code.gs first.');
  const book=SpreadsheetApp.openById(SHEET_ID);
  let sheet=book.getSheetByName(TAB);
  if(!sheet) {sheet=book.insertSheet(TAB); sheet.appendRow(HEADERS); sheet.setFrozenRows(1);}
  return sheet;
}
function find_(s,a) {
  const n=s.getLastRow(); if(n<2)return {row:0,rev:0};
  // This tab is independent; first column is alias, one row per alias.
  const vals=s.getRange(2,1,n-1,2).getValues();
  for(let i=0;i<vals.length;i++) if(String(vals[i][0]).toUpperCase()===a) return {row:i+2,rev:Number(vals[i][1])||0};
  return {row:0,rev:0};
}
function doGet(e) {
  const p=e&&e.parameter||{};
  try {
    if(p.action!=='load') throw Error('Unknown action');
    const a=alias_(p.alias); const s=tab_();const f=find_(s,a);
    if(!f.row)return output_({ok:true,found:false,serverRevision:0},p.callback);
    const v=s.getRange(f.row,1,1,5).getValues()[0];
    return output_({ok:true,found:true,alias:a,serverRevision:Number(v[1]),updatedAt:String(v[2]),payload:JSON.parse(v[3]),checksum:String(v[4])},p.callback);
  }catch(err){return output_({ok:false,error:String(err.message||err)},p.callback);}
}
function doPost(e) {
  const lock=LockService.getScriptLock();
  try {
    const raw=e&&e.postData&&e.postData.contents||'';
    if(raw.length>MAX_PAYLOAD) throw Error('Submission too large');
    const p=JSON.parse(raw);if(p.action!=='save')throw Error('Unknown action');
    const a=alias_(p.alias);if(!p.payload||p.payload.lesson!=='gilded_day6_2026_11_04')throw Error('Wrong lesson namespace');
    if(!p.checksum||!/^\d{1,12}$/.test(String(p.checksum)))throw Error('Missing checksum');
    if(!lock.tryLock(15000))throw Error('Server busy');
    try{
      const s=tab_(), f=find_(s,a);const base=Number(p.baseRevision);
      // Idempotent repeat allowed; old revisions are rejected, not overwritten.
      if(f.row){const prev=s.getRange(f.row,1,1,5).getValues()[0];
        if(String(prev[4])===String(p.checksum))return output_({ok:true,serverRevision:f.rev,duplicate:true});
      }
      if(base!==f.rev)return output_({ok:false,conflict:true,serverRevision:f.rev,error:'A newer cloud version exists. Local work not overwritten.'});
      const next=f.rev+1, row=[a,next,new Date().toISOString(),JSON.stringify(p.payload),String(p.checksum)];
      if(f.row)s.getRange(f.row,1,1,5).setValues([row]);else s.appendRow(row);
      SpreadsheetApp.flush();
      return output_({ok:true,serverRevision:next});
    }finally{lock.releaseLock();}
  }catch(err){return output_({ok:false,error:String(err.message||err)});}
}