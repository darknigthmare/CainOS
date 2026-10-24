/**
 * Update the established Encore tracker with the primary spreadsheet runtime.
 * Copy this executable to a temporary directory whose node_modules points to
 * CODEX_PRIMARY_RUNTIME_NODE_MODULES, then run CODEX_PRIMARY_RUNTIME_NODE with
 * --repo-root. The repository builder selects this path when that runtime exists.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const args=process.argv.slice(2);
const flag=(name,fallback)=>{const i=args.indexOf(name);return i<0?fallback:args[i+1];};
const root=path.resolve(flag('--repo-root',process.cwd()));
const out=path.resolve(flag('--output-dir',path.join(root,'docs')));
const input=path.resolve(flag('--input-workbook',path.join(root,'docs/DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx')));
const evidenceFile=path.resolve(flag('--qa-evidence',path.join(root,'audit-combat/ci/evidence-0.7.0.json')));
const previewDir=path.resolve(flag('--preview-dir',path.join(root,'audit-combat/workbook-0.7.0')));
const {TRACKER_SHEETS,QA_STATUSES,sha256,prepareCurrentTracker}=await import(pathToFileURL(path.join(root,'scripts/combat-workbook-current-data.mjs')));
const {publishWorkbookArtifacts}=await import(pathToFileURL(path.join(root,'scripts/workbook-publication.mjs')));
const json=async file=>JSON.parse(await fs.readFile(file,'utf8'));
const sourceDataFile=path.join(root,'docs/combat-tracker-data.json');
const baselineData=await json(sourceDataFile),evidence=await json(evidenceFile);
const workbook=await SpreadsheetFile.importXlsx(await FileBlob.load(input));
const names=['Synthèse',...Object.keys(TRACKER_SHEETS),'Références'];
const sheets=Object.fromEntries(names.map(name=>[name,workbook.worksheets.getItem(name)]));
const column=n=>{let s='';while(n){n--;s=String.fromCharCode(65+n%26)+s;n=Math.floor(n/26);}return s;};
const hasValue=v=>v!==null&&v!==undefined&&v!=='';
const literal=v=>typeof v==='string'&&v.startsWith('=')?`'${v}`:v;
const normalized=rows=>rows.map(row=>row.map(value=>value??''));
const before={},notes=new Map(),priorData=structuredClone(baselineData);
for(const [name,key]of Object.entries(TRACKER_SHEETS)){
  const sheet=sheets[name],table=sheet.tables.items[0];
  assert.equal(sheet.tables.items.length,1,'Expected one native table in '+name);
  const headers=table.getHeaderRowRange().values[0],rows=table.getDataRows();
  assert.equal(headers.at(-1),'Notes utilisateur');
  const ids=rows.map(row=>String(row[0]));assert(ids.every(Boolean));assert.equal(new Set(ids).size,ids.length,'Duplicate workbook ID: '+name);
  assert.deepEqual([...ids].sort(),baselineData[key].map(row=>String(row[0])).sort(),'Workbook/JSON identity mismatch: '+name);
  const formulas=sheet.getRange(`A6:${column(headers.length)}${rows.length+5}`).formulasR1C1;
  before[name]={headers,rows:structuredClone(rows),formulas,name:table.name,style:table.style,filter:table.showFilterButton};
  notes.set(name,new Map(rows.flatMap((row,i)=>{
    const formula=formulas[i]?.at(-1),value=row.at(-1);
    return hasValue(formula)||hasValue(value)?[[String(row[0]),{value,formula:hasValue(formula)?formula:null}]]:[];
  })));
  priorData[key]=normalized(rows);
}
const referenceSourceRows=sheets['Références'].tables.items[0].getDataRows();
assert.deepEqual(referenceSourceRows.map(row=>row[0]).sort(),baselineData.sources.map(source=>source.id).sort(),'Reference identities differ from tracker data');
assert.equal(new Set(referenceSourceRows.map(row=>row[0])).size,referenceSourceRows.length,'Duplicate reference ID');
priorData.sources=referenceSourceRows.map(([id,title,kind,url,scope])=>({id,title,kind,url,scope}));
const {data,totals,fileDigest,offline}=await prepareCurrentTracker({root,priorData,evidence});
const nativeBefore=names.flatMap(name=>sheets[name].tables.items.map(table=>({sheet:name,name:table.name,style:table.style,filter:table.showFilterButton})));
const summary=sheets['Synthèse'];
await fs.mkdir(out,{recursive:true});await fs.mkdir(previewDir,{recursive:true});
const render=async(name,range,label)=>{const blob=await workbook.render({sheetName:name,range,scale:1,format:'png'});await fs.writeFile(path.join(previewDir,label+'.png'),new Uint8Array(await blob.arrayBuffer()));};
await render('Synthèse','A1:H34','before-summary');

const changed=[];
const statusColumns={'Fonctionnalités':4,'Production':5,'QA':4};
const colors={good:'#E4F1E9',warning:'#FCEED8',pending:'#EAE7F1',amber:'#FFF1C9',bad:'#FBE0E0'};
const statusRules=range=>{
  for(const [text,fill,color]of [['Implémenté',colors.good,'#23513D'],['Partiel',colors.warning,'#79501D'],['Prévu',colors.pending,'#56496D'],['À vérifier',colors.amber,'#805B00'],['Réussi',colors.good,'#23513D'],['Échec',colors.bad,'#A12A2A'],['Non exécuté',colors.pending,'#56496D']])range.conditionalFormats.add('containsText',{text,format:{fill,font:{color}}});
};
for(const [name,key]of Object.entries(TRACKER_SHEETS)){
  const sheet=sheets[name],table=sheet.tables.items[0],source=before[name],rows=data[key],oldCount=source.rows.length,width=source.headers.length;
  // Existing rows retain their positions, including a user's sorting order.
  assert.deepEqual(rows.slice(0,oldCount).map(r=>r[0]),source.rows.map(r=>r[0]),'Existing row order changed: '+name);
  if(rows.length>oldCount){
    const added=rows.slice(oldCount);
    table.rows.add(null,added.map(row=>row.map(literal)));
    for(let i=oldCount;i<rows.length;i++){
      const range=sheet.getRange(`A${i+6}:${column(width)}${i+6}`);
      range.copyFrom(sheet.getRange(`A6:${column(width)}6`),'all');
      range.values=[rows[i].map(literal)];
      range.format.fill=i%2===0?'#F4F0F8':'#FFFFFF';
      range.format.rowHeight=name==='QA'?126:name==='Production'?168:90;
      sheet.getRange(`${column(width)}${i+6}`).format.fill=colors.amber;
    }
    const statusColumn=statusColumns[name];
    if(statusColumn){const range=sheet.getRange(`${column(statusColumn)}${oldCount+6}:${column(statusColumn)}${rows.length+5}`);range.dataValidation={rule:{type:'list',values:name==='QA'?QA_STATUSES:['Implémenté','Partiel','Prévu','À vérifier','Hors périmètre']}};statusRules(range);}
  }
  for(let i=0;i<oldCount;i++){
    for(let c=0;c<width-1;c++)if((source.rows[i][c]??'')!==(rows[i][c]??'')){
      assert(!hasValue(source.formulas[i]?.[c]),`Refusing to overwrite a user formula in ${name}/${rows[i][0]}/${c+1}`);
      sheet.getRange(`${column(c+1)}${i+6}`).values=[[literal(rows[i][c])]];
      changed.push({sheet:name,id:rows[i][0],column:c+1});
    }
  }
}
// Three empty lines separate the reference table from its established legend.
// Table row insertion is responsible for moving the legend if future additions need it.
const references=sheets['Références'],refTable=references.tables.items[0],refRows=refTable.getDataRows();
references.getRange('A3').values=[[`Dates et état du contenu : ${data.asOf}. Les sources de fiction ne valident pas les statistiques du jeu.`]];
sheets.QA.getRange('A3').values=[['Historique conservé, objectifs de revue et cas CI07 de cette passe. Les essais matériels restent identifiés séparément.']];
const sources=data.sources.map(s=>[s.id,s.title,s.kind,s.url,s.scope]);
const sourceIds=new Set(refRows.map(row=>row[0]));
const addedSources=sources.filter(row=>!sourceIds.has(row[0]));
if(addedSources.length){
  refTable.rows.add(null,addedSources);
  for(let i=0;i<addedSources.length;i++){
    const row=refRows.length+6+i,range=references.getRange(`A${row}:E${row}`);
    range.copyFrom(references.getRange('A6:E6'),'all');range.values=[addedSources[i]];range.format.rowHeight=76;
  }
}
for(const [index,row]of refTable.getDataRows().entries()){
  const current=sources.find(item=>item[0]===row[0]);assert(current,'Unknown reference ID');
  if(JSON.stringify(current)!==JSON.stringify(row))references.getRange(`A${index+6}:E${index+6}`).values=[current];
}
const set=(cell,value)=>{summary.getRange(cell).values=[[value]];};
set('H2',`Version ${data.version} · ${data.asOf}`);
set('H13',`${totals.nodeTests} tests Node · ${totals.nodeSuites} suites · 0.7`);
set('H14',`${totals.browserChecks} contrôles Chromium · 0.7`);
set('H15',`${data.historicalQaRows} lignes historiques / revues`);
set('H16','Cas courants identifiés par CI07.');
set('A22','Historique et essais 0.7');
const expected=new Map();
const formula=(cell,expression,value)=>{summary.getRange(cell).formulas=[['='+expression]];expected.set(cell,value);};
for(const [cell,key,sheet]of [['B7','fighters','Combattants'],['B8','moves','Techniques'],['B9','stages','Arènes'],['B10','atlas','Atlas']])formula(cell,`COUNTA('${sheet}'!A6:A${data[TRACKER_SHEETS[sheet]].length+5})`,data.counts[key]);
formula('B11',`COUNTIFS('Atlas'!C6:C${data.atlas.length+5},"Variante visuelle")`,data.counts.variants);
const statuses=['Implémenté','Partiel','Prévu','À vérifier'];
for(const [r,sheet,key,col]of [[15,'Fonctionnalités','features',4],[16,'Production','production',5],[17,'Scénarios','scenarios',8],[18,'Atlas','atlas',5]]){
  const end=data[key].length+5,c=column(col);
  for(let i=0;i<statuses.length;i++)formula(`${column(i+2)}${r}`,`COUNTIFS('${sheet}'!${c}$6:${c}$${end},${column(i+2)}$14)`,data[key].filter(row=>row[col-1]===statuses[i]).length);
  formula(`F${r}`,`COUNTA('${sheet}'!A6:A${end})`,data[key].length);
}
for(let i=0;i<QA_STATUSES.length;i++)formula(`${column(i+2)}22`,`COUNTIFS('QA'!D6:D${data.qa.length+5},${column(i+2)}21)`,data.qaSummary[QA_STATUSES[i]]);
formula('F22',`COUNTA('QA'!A6:A${data.qa.length+5})`,data.qa.length);
const end=data.production.length+5,pb=`'Production'!B6:B${end}`,pd=`'Production'!D6:D${end}`,pe=`'Production'!E6:E${end}`;
const count=domain=>data.production.filter(row=>row[1]===domain).length;
formula('H19',`COUNTIFS('Scénarios'!B6:B${data.scenarios.length+5},"Route individuelle")&" routes et "&COUNTIFS(${pb},"Tableau d’histoire")&" tableaux"`,`${data.scenarios.filter(row=>row[1]==='Route individuelle').length} routes et ${count('Tableau d’histoire')} tableaux`);
formula('H20',`COUNTIFS(${pb},"Briefing illustré")&" briefings de rencontre"`,`${count('Briefing illustré')} briefings de rencontre`);
formula('H21',`COUNTIFS(${pb},"Arène",${pd},"Musique de l’arène")&" thèmes musicaux d’arènes"`,`${data.production.filter(row=>row[1]==='Arène'&&row[3]==='Musique de l’arène').length} thèmes musicaux d’arènes`);
for(const [cell,domain,suffix]of [['H22','Motif sonore',' motifs sonores synthétiques'],['H23','Présentation individuelle',' séquences de présentation'],['H24','Animation d’arène',' ambiances visuelles animées'],['H25','Costume',' costumes redessinés'],['H31','Finition visuelle',' présentations de KO']])formula(cell,`COUNTIFS(${pb},"${domain}")&"${suffix}"`,count(domain)+suffix);
formula('H32',`COUNTIFS(${pb},"Arène",${pd},"Ambiance sonore",${pe},"Implémenté")&" ambiances sonores originales"`,`${data.counts.audioAmbiences} ambiances sonores originales`);
for(const cell of ['H31','H32']){const f=summary.getRange(cell).formulas;summary.getRange(cell).copyFrom(summary.getRange('H25'),'all');summary.getRange(cell).formulas=f;}
workbook.recalculate();
for(const [cell,value]of expected)assert.equal(summary.getRange(cell).values[0][0],value,'Calculated summary mismatch: '+cell);

// A status change must change the dependent total, then return to its original value.
const statusCell=sheets['Fonctionnalités'].getRange('D6'),oldStatus=statusCell.values[0][0],oldTotal=summary.getRange('B15').values[0][0];
statusCell.values=[[oldStatus==='Implémenté'?'Prévu':'Implémenté']];workbook.recalculate();
assert.equal(summary.getRange('B15').values[0][0],oldTotal+(oldStatus==='Implémenté'?-1:1));
statusCell.values=[[oldStatus]];workbook.recalculate();
assert.equal(summary.getRange('B15').values[0][0],oldTotal);
const errorPattern=/^#(?:REF!|DIV\/0!|VALUE!|NAME\?|N\/A|NUM!|NULL!|SPILL!|CALC!)/;
let formulaCount=0;
for(const name of names){const range=sheets[name].getUsedRange(),formulas=range.formulas,values=range.values;for(let r=0;r<formulas.length;r++)for(let c=0;c<formulas[r].length;c++)if(hasValue(formulas[r][c])){formulaCount++;assert(!errorPattern.test(String(values[r]?.[c]??'')),`Formula error: ${name} ${r+1}/${c+1}`);}}
console.log((await workbook.inspect({kind:'table',range:'Synthèse!A6:H22',include:'values,formulas',tableMaxRows:17,tableMaxCols:8,maxChars:5500})).ndjson);
console.log((await workbook.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:50},summary:'Formula error scan'})).ndjson);
for(const [name,key]of Object.entries(TRACKER_SHEETS)){
  const source=before[name],rows=sheets[name].tables.items[0].getDataRows(),formulas=sheets[name].getRange(`A6:${column(source.headers.length)}${rows.length+5}`).formulasR1C1;
  assert.deepEqual(normalized(rows.map(row=>row.slice(0,-1))),normalized(data[key].map(row=>row.slice(0,-1))),'Workbook/data mismatch: '+name);
  for(let i=0;i<source.rows.length;i++)for(let c=0;c<source.headers.length;c++)if(hasValue(source.formulas[i]?.[c]))assert.equal(formulas[i]?.[c],source.formulas[i][c],'Existing formula changed');
  for(const [id,note]of notes.get(name)){const i=rows.findIndex(row=>String(row[0])===id);assert(i>=0);if(note.formula)assert.equal(formulas[i].at(-1),note.formula);else assert.equal(rows[i].at(-1),note.value);}
  data[key]=normalized(rows);
}
const firstFinaleRow=data.production.findIndex(row=>row[1]==='Finition visuelle')+6;
const currentQaIds=new Set(data.currentQa.rowIds),firstCurrentQaRow=data.qa.findIndex(row=>currentQaIds.has(row[0]))+6;
assert(firstFinaleRow>=6&&firstCurrentQaRow>=6,'Missing current rows for preview');
const renders=[['Synthèse','A1:H34','summary'],['Fonctionnalités','A98:I108','features'],['Production',`A${firstFinaleRow}:J${Math.min(data.production.length+5,firstFinaleRow+3)}`,'finales'],['QA',`A${firstCurrentQaRow}:I${Math.min(data.qa.length+5,firstCurrentQaRow+3)}`,'current-qa'],['Références','A63:E79','references']];
for(const [name,range,label]of renders)await render(name,range,label);
const sourceDigests={...evidence.runtimeSourceHashes};
for(const report of [...evidence.nodeReports,...evidence.browserReports])sourceDigests[report.file]=report.sourceSha256;
for(const file of ['scripts/build-combat-workbook-current.mjs','scripts/combat-workbook-current-data.mjs','scripts/combat-ci-suites.mjs','scripts/build-combat-workbook.mjs','scripts/workbook-publication.mjs','docs/combat-qa-evidence.json'])sourceDigests[file]=await fileDigest(file);
for(const source of offline.ART_FILES){const relative=path.relative(root,path.resolve(root,'combat',source));sourceDigests[relative]=await fileDigest(relative);}
const evidenceBytes=await fs.readFile(evidenceFile);sourceDigests['docs/combat-qa-evidence-0.7.0.json']=sha256(evidenceBytes);
const pending=await fs.mkdtemp(path.join(previewDir,'.tracker-'));
try{
  const xlsx=path.join(pending,'DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx');await(await SpreadsheetFile.exportXlsx(workbook)).save(xlsx);
  const reopened=await SpreadsheetFile.importXlsx(await FileBlob.load(xlsx));
  const nativeTables=names.flatMap(name=>reopened.worksheets.getItem(name).tables.items.map(table=>({sheet:name,name:table.name,style:table.style,filter:table.showFilterButton,rows:table.getDataRows().length})));
  assert.deepEqual(nativeTables.map(({rows,...rest})=>rest),nativeBefore,'Native table metadata changed');
  for(const [name,key]of Object.entries(TRACKER_SHEETS)){
    const sheet=reopened.worksheets.getItem(name),table=sheet.tables.items[0],rows=table.getDataRows();
    assert.deepEqual(normalized(rows),data[key],'Round-trip rows differ: '+name);
    for(const [id,note]of notes.get(name)){
      const i=rows.findIndex(row=>String(row[0])===id),cell=sheet.getRange(`${column(rows[i].length)}${i+6}`);
      if(note.formula)assert.equal(cell.formulasR1C1[0][0],note.formula,'Round-trip formula differs');else assert.equal(cell.values[0][0],note.value,'Round-trip note differs');
    }
  }
  const trackerDataBytes=JSON.stringify(data,null,2)+'\n';
  const verification={schema:'encore-workbook-artifact/v1',gameVersion:data.version,createdAt:new Date().toISOString(),sourceCommit:evidence.sourceCommit,counts:data.counts,qaSummary:data.qaSummary,qaSummaryScope:data.qaSummaryScope,currentQa:data.currentQa,historicalQaRows:data.historicalQaRows,
    baseline:{gameVersion:baselineData.version,workbookSHA256:sha256(await fs.readFile(input)),trackerDataSHA256:sha256(await fs.readFile(sourceDataFile))},
    workbookSHA256:sha256(await fs.readFile(xlsx)),trackerDataSHA256:sha256(trackerDataBytes),nativeTables,sourceDigests,formulaErrors:0,
    formulas:{count:formulaCount,generalRecalculation:true,summaryValuesChecked:expected.size,desktopExcelOpened:false},
    notesPreservation:{preserved:[...notes.values()].reduce((n,m)=>n+m.size,0),formulas:[...notes.values()].reduce((n,m)=>n+[...m.values()].filter(x=>x.formula).length,0),identityPreserved:true,exportRoundTripPassed:true},
    statusMutationRecalculated:true,renderedSheets:renders.map(([name])=>name),modifiedCells:changed.length,
    publication:'Four staged outputs with backups and rollback. Group replacement is not simultaneously atomic.',
    limitations:['No desktop Excel session or physical device validation.','Historical evidence stays separate from current executions.','Procedural finales and audio are implemented; dedicated drawings, canonical 1:1 review and physical sound mix remain open.']};
  await fs.writeFile(path.join(pending,'combat-tracker-data.json'),trackerDataBytes);
  await fs.writeFile(path.join(pending,'combat-workbook-verification.json'),JSON.stringify(verification,null,2)+'\n');
  await fs.writeFile(path.join(pending,'combat-qa-evidence-0.7.0.json'),evidenceBytes);
  await publishWorkbookArtifacts({outputDirectory:out,files:['DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx','combat-tracker-data.json','combat-workbook-verification.json','combat-qa-evidence-0.7.0.json'].map(name=>({name,source:path.join(pending,name)}))});
  console.log('ENCORE_WORKBOOK '+JSON.stringify({file:path.join(out,'DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx'),counts:data.counts,currentQA:totals,verification}));
}finally{await fs.rm(pending,{recursive:true,force:true});}
