import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import './export-fixtures.mjs';
const {settlements}=await import('../tmp/settlements.mjs');
const {query,sum}=await import('../tmp/affiliate.mjs');
for(const s of settlements){const total=sum(query(s.from,s.to));assert.equal(total.ngr,s.ngr);assert.equal(total.qualified,s.qualified);assert.equal(total.commission,s.due);const net=s.revshare+s.cpa+s.carryIn+s.adjustment;assert.equal(Math.max(0,net),s.due);assert.equal(Math.min(0,net),s.carryOut);}
console.log('PASS 5 extratos reconciliados com métricas e composição financeira demonstrativa.');
