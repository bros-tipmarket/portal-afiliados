import ts from 'typescript';
import { writeFileSync,readFileSync } from 'node:fs';
for(const name of ['affiliate','settlements']){
 const source=readFileSync('lib/'+name+'.ts','utf8').replace("'./affiliate'","'./affiliate.mjs'");
 writeFileSync('tmp/'+name+'.mjs',ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText);
}
const {settlements,statusLabels}=await import('../tmp/settlements.mjs');
writeFileSync('tmp/settlements.json',JSON.stringify({settlements,statusLabels}));
