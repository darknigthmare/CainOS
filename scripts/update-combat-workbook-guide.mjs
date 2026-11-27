/**
 * Associate the general fighting-game guide with the established Encore tracker.
 * Copy this builder into a private temporary directory with node_modules linked
 * to CODEX_PRIMARY_RUNTIME_NODE_MODULES and run CODEX_PRIMARY_RUNTIME_NODE.
 * --inspect renders the baseline without editing it. --build writes a review
 * copy; --publish requires the native comparison to pass before replacing files.
 * --publish-staged reuses the verified bytes and updates their canonical report
 * without importing or rewriting the workbook. Publication uses the shared
 * staging/backup/rollback helper; the four canonical files are one group.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const args=process.argv.slice(2);
const flag=(key,fallback)=>{const i=args.indexOf(key);return i<0?fallback:args[i+1];};
const root=path.resolve(flag('--repo-root',process.cwd()));
const outputDir=path.resolve(flag('--output-dir',path.join(root,'..','outputs','encore-guide')));
const input=path.resolve(flag('--input-workbook',path.join(root,'docs/DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx')));
const sourceData=path.join(root,'docs/combat-tracker-data.json');
const designFile=path.join(root,'docs/bible/guide-design.json');
const output=path.join(outputDir,'DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx');
const json=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const sha=b=>createHash('sha256').update(b).digest('hex');
const writeJson=async (p,data)=>fs.writeFile(p,JSON.stringify(data,null,2)+'\n');
const col=n=>{let s='';while(n){n--;s=String.fromCharCode(65+n%26)+s;n=Math.floor(n/26);}return s;};
await fs.mkdir(outputDir,{recursive:true});
assert.notEqual(input,output,'Always stage the review copy separately');
if(args.includes('--publish-staged')){
  await publishReviewedStaging(true);
  process.exit(0);
}
const beforeBytes=await fs.readFile(input), dataBytes=await fs.readFile(sourceData);
const wb=await SpreadsheetFile.importXlsx(await FileBlob.load(input));
const render=async (sheetName,range,label)=>{
  const blob=await wb.render({sheetName,range,scale:1,format:'png'});
  await fs.writeFile(path.join(outputDir,label+'.png'),new Uint8Array(await blob.arrayBuffer()));
};
if(args.includes('--inspect')){
  console.log((await wb.inspect({kind:'sheet,table',maxChars:4500,tableMaxRows:1,tableMaxCols:3})).ndjson);
  await render('Fonctionnalités','A1:F9','baseline-features');
  await render('Synthèse','A1:H13','baseline-summary');
  console.log('GUIDE_WORKBOOK_BASELINE '+JSON.stringify({sha256:sha(beforeBytes),rendered:['baseline-features.png','baseline-summary.png']}));
  process.exit(0);
}
assert(args.includes('--build'),'Use --inspect or --build');
const design=await json(designFile), data=JSON.parse(dataBytes);
assert.equal(design.sections.length,30);
assert.equal(design.sections.flatMap(s=>s.requirements).length,100);
const baselineNames=['Synthèse','Fonctionnalités','Combattants','Techniques','Arènes','Atlas','Production','Scénarios','Extension PNJ','QA','Références'];
const beforeTables=baselineNames.flatMap(name=>wb.worksheets.getItem(name).tables.items.map(t=>({sheet:name,name:t.name,style:t.style,filter:t.showFilterButton,rows:t.getDataRows().length})));
const summary=wb.worksheets.getItem('Synthèse');
const beforeFormulas=summary.getUsedRange().formulas;
const beforeSummary=summary.getUsedRange().values;
const allowedChanges=[];
if(args.includes('--correct-stage-counts')){
  assert.equal(summary.getRange('H9').values[0][0],'36 arènes : 27 partagées et 9 crossovers');
  const corrected='27 arènes : 18 partagées et 9 crossovers';
  allowedChanges.push({sheet:'Synthèse',row:9,column:8,before:beforeSummary[8][7],after:corrected});
  summary.getRange('H9').values=[[corrected]];
  beforeSummary[8][7]=corrected;
  const index=data.features.findIndex(row=>row[0]==='PRD-11');
  assert(index>=0);
  const previous=data.features[index][6];
  assert(previous.includes('36 arènes (27 partagées et neuf crossovers)'));
  const next=previous.replace('36 arènes (27 partagées et neuf crossovers)','27 arènes (18 partagées et neuf crossovers)');
  allowedChanges.push({sheet:'Fonctionnalités',row:index+6,column:7,before:previous,after:next});
  wb.worksheets.getItem('Fonctionnalités').getRange(`G${index+6}`).values=[[next]];
  data.features[index][6]=next;
}
const sheet=wb.worksheets.add('Guide combat');
sheet.showGridLines=false;
sheet.tabColor='#6A3884';
const headers=['ID','Rubrique du guide','Priorité','Décision Encore','État actuel','Exigences','Application à Encore','Critère de validation','Documents associés','Notes utilisateur'];
sheet.getRange('A1:J35').format.font={name:'Arial',size:11,color:'#17233A'};
sheet.getRange('A2').values=[['Guide de conception — Digital Circus Encore']];
sheet.getRange('A2').format.font={name:'Arial',size:16,bold:true,color:'#302048'};
sheet.getRange('A2:J2').format.rowHeight=28;
sheet.getRange('A3').values=[['30 rubriques reliées à la bible. Les états décrivent la situation actuelle ; une conception documentée ne vaut pas intégration dans le jeu.']];
sheet.getRange('A3:J3').format.rowHeight=23;
sheet.getRange('A4').values=[['Source : Combat_Games_Guide_General_v1.0.txt. Exigences détaillées : docs/bible/COMBAT_GAMES_GUIDE_INTEGRATION.md. Phase active : bases statiques.']];
sheet.getRange('A4:J4').format.rowHeight=23;
sheet.getRange('A5:J5').values=[headers];
const rows=design.sections.map(s=>[s.id,s.section+' — '+s.title,s.priority,s.decision,s.runtimeStatus,s.requirements.length,s.adaptation,s.verification,s.links.join('\n'),null]);
sheet.getRange('A6:J35').values=rows;
const table=sheet.tables.add('A5:J35',true,'GuideCombatTable');
table.style='TableStyleLight1';
table.showFilterButton=true;
sheet.getRange('A5:J5').format={fill:'#47315E',font:{name:'Arial',size:11,bold:true,color:'#FFFFFF'},wrapText:true,horizontalAlignment:'center',verticalAlignment:'center',rowHeight:34};
sheet.getRange('A6:J35').format.verticalAlignment='top';
sheet.getRange('A6:J35').format.wrapText=true;
sheet.getRange('F6:F35').setNumberFormat('#,##0');
sheet.getRange('C6:D35').format.horizontalAlignment='center';
sheet.getRange('F6:F35').format.horizontalAlignment='right';
sheet.getRange('J6:J35').format.fill='#FFF2CC';
sheet.getRange('D6:D35').conditionalFormats.add('containsText',{text:'différé',format:{fill:'#FFF2CC',font:{color:'#815300'}}});
sheet.getRange('E6:E35').conditionalFormats.add('containsText',{text:'non intégré',format:{fill:'#FCE4D6',font:{color:'#9C3B10'}}});
const widths=[15,37,12,22,36,13,70,60,64,40];
widths.forEach((width,i)=>{sheet.getRange(`${col(i+1)}1`).format.columnWidth=width;});
for(let i=0;i<rows.length;i++){
  if(i%2===0)sheet.getRange(`A${i+6}:I${i+6}`).format.fill='#F3F0F8';
  const lines=Math.max(...rows[i].map((v,j)=>String(v).split('\n').reduce((n,line)=>n+Math.max(1,Math.ceil(line.length/(widths[j]-2))),0)));
  sheet.getRange(`A${i+6}`).format.rowHeight=Math.max(80,lines*15+12);
}
sheet.freezePanes.freezeRows(5);
sheet.freezePanes.freezeColumns(2);
wb.recalculate();
assert.deepEqual(summary.getUsedRange().formulas,beforeFormulas,'Existing formulas changed');
assert.deepEqual(summary.getUsedRange().values,beforeSummary,'Existing summary values changed');
assert.equal(sheet.getRange('F6:F35').values.reduce((n,r)=>n+r[0],0),100);
const errors=await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:20},maxChars:2000});
await fs.writeFile(path.join(outputDir,'formula-scan.ndjson'),errors.ndjson);
assert(errors.ndjson.includes('Cell search matched 0 entries.'),'Formula error scan found entries requiring review');
console.log((await wb.inspect({kind:'table',range:"'Guide combat'!A5:F9",include:'values,formulas',tableMaxRows:5,tableMaxCols:6,maxChars:5000})).ndjson);
await render('Guide combat','A1:F10','guide-overview');
await render('Guide combat','G5:J10','guide-associations');
await (await SpreadsheetFile.exportXlsx(wb)).save(output);
const reopened=await SpreadsheetFile.importXlsx(await FileBlob.load(output));
assert.deepEqual(reopened.worksheets.getItem('Guide combat').tables.items[0].getDataRows(),rows);
assert.deepEqual(baselineNames.flatMap(name=>reopened.worksheets.getItem(name).tables.items.map(t=>({sheet:name,name:t.name,style:t.style,filter:t.showFilterButton,rows:t.getDataRows().length}))),beforeTables);
assert.deepEqual(reopened.worksheets.getItem('Synthèse').getUsedRange().formulas,beforeFormulas);
const inspector=path.join(root,'scripts/inspect-combat-workbook-native.py');
const python=process.env.CODEX_PRIMARY_RUNTIME_PYTHON||'python3';
execFileSync(python,[inspector,'extract',input,path.join(outputDir,'native-before')],{stdio:'ignore'});
execFileSync(python,[inspector,'extract',output,path.join(outputDir,'native-after')],{stdio:'ignore'});
const native=await compareNative();
assert.equal(native.differences.length,0,'Native preservation failed: '+JSON.stringify(native.differences.slice(0,5)));
data.guideIntegration={schema:'encore-general-guide-tracker/v1',asOf:design.asOf,sourceCommit:design.baselineCommit,sourceGuide:design.sourceGuide,sections:30,requirements:100,characterAssociations:64,plannedGlobalChapters:12,plannedGlobalScenes:36,plannedStageLinks:6,bossContracts:4,sheet:'Guide combat',design:'docs/bible/guide-design.json',integration:'docs/bible/guide-integration.json',scope:'Documentation et associations. Les éléments conçus ne sont pas comptés comme intégrés dans le jeu.',phase:design.project.phase,rows:design.sections.map(s=>({id:s.id,priority:s.priority,decision:s.decision,runtimeStatus:s.runtimeStatus,requirementIds:s.requirements.map(r=>r.id),links:s.links})),verification:'docs/combat-guide-workbook-verification.json'};
if(args.includes('--correct-stage-counts')){
  data.counts.sharedStages=18;data.counts.crossoverStages=9;data.counts.totalStages=27;
  data.guideIntegration.stageCountCorrection={previous:{sharedStages:27,crossoverStages:9,totalStages:36},current:{sharedStages:18,crossoverStages:9,totalStages:27},basis:'STAGES contient déjà les neuf CROSSOVER_STAGES ; les 64 arrangements dédiés sont comptés séparément.'};
}
const dataOut=JSON.stringify(data,null,2)+'\n';
await fs.writeFile(path.join(outputDir,'combat-tracker-data.json'),dataOut);
const evidenceDir='docs/verification/guide-workbook-20261125';
const report={schema:'encore-guide-workbook-verification/v1',asOf:design.asOf,sourceCommit:design.baselineCommit,scope:'Ajout de la correspondance guide/bible au suivi existant. Aucun résultat QA du jeu réexécuté.',inputWorkbookSHA256:sha(beforeBytes),inputTrackerSHA256:sha(dataBytes),workbookSHA256:sha(await fs.readFile(output)),trackerDataSHA256:sha(dataOut),guideDesignSHA256:sha(await fs.readFile(designFile)),newSheet:{name:'Guide combat',sections:30,requirements:100,notesColumn:'J',table:'GuideCombatTable'},nativePreservation:native,allowedExistingChanges:allowedChanges,formulas:{existingCount:42,unchanged:true,recalculated:true,summaryResultsUnchanged:true,exportReimportChecked:true,errorScan:`${evidenceDir}/formula-scan.ndjson`,errorScanMatches:0,desktopExcelOpened:false},renders:['guide-overview.png','guide-associations.png'].map(name=>`${evidenceDir}/${name}`),priorVerification:'docs/combat-workbook-verification.json décrit le classeur antérieur et sa QA historique ; le présent rapport porte les empreintes du classeur enrichi.',limitations:['Les résultats QA historiques sont conservés. Ils ne sont pas des tests réexécutés pour cette mise à jour documentaire.','Aucune session Excel bureau ni test du jeu réalisé dans cette vérification.']};
await writeJson(path.join(outputDir,'combat-guide-workbook-verification.json'),report);
if(args.includes('--publish')){
  assert.equal(sha(await fs.readFile(input)),sha(beforeBytes),'Concurrent workbook change');
  assert.equal(sha(await fs.readFile(sourceData)),sha(dataBytes),'Concurrent tracker JSON change');
}
await publishReviewedStaging(args.includes('--publish'));
console.log('GUIDE_WORKBOOK '+JSON.stringify({output,published:args.includes('--publish'),preservedCells:native.cellsChecked,preservedSheets:baselineNames.length,sections:30,requirements:100,hash:report.workbookSHA256}));

async function publishReviewedStaging(publish){
  const evidenceDirectory='docs/verification/guide-workbook-20261125';
  const historyPath=`${evidenceDirectory}/previous-workbook-verification.json`;
  const reviewName='combat-guide-workbook-verification.json';
  const review=await json(path.join(outputDir,reviewName));
  const stagedXlsx=await fs.readFile(output);
  const stagedData=await fs.readFile(path.join(outputDir,'combat-tracker-data.json'));
  const installedReportBytes=await fs.readFile(path.join(root,'docs/combat-workbook-verification.json'));
  const installedReport=JSON.parse(installedReportBytes);
  assert.equal(review.nativePreservation.status,'passed');
  assert.equal(review.nativePreservation.differences.length,0);
  assert.equal(sha(stagedXlsx),review.workbookSHA256,'Staged workbook differs from its review');
  assert.equal(sha(stagedData),review.trackerDataSHA256,'Staged data differs from its review');
  assert.equal(sha(await fs.readFile(designFile)),review.guideDesignSHA256,'Design changed after workbook review');
  assert([review.inputWorkbookSHA256,review.workbookSHA256].includes(sha(await fs.readFile(input))),'Installed workbook changed concurrently');
  assert([review.inputTrackerSHA256,review.trackerDataSHA256].includes(sha(await fs.readFile(sourceData))),'Installed tracker changed concurrently');
  const previousBytes=installedReport.schema==='encore-guide-workbook-canonical/v1'
    ?await fs.readFile(path.join(root,historyPath)):installedReportBytes;
  const previous=JSON.parse(previousBytes);
  assert.equal(previous.workbookSHA256,review.inputWorkbookSHA256,'Historical report is not the reviewed baseline workbook');
  assert.equal(previous.trackerDataSHA256,review.inputTrackerSHA256,'Historical report is not the reviewed baseline tracker');
  try{
    const archived=await fs.readFile(path.join(root,historyPath));
    assert.equal(sha(archived),sha(previousBytes),'Historical report must remain byte-identical');
  }catch(error){if(error.code!=='ENOENT')throw error;}
  await fs.writeFile(path.join(outputDir,'previous-workbook-verification.json'),previousBytes);
  review.priorVerification={path:historyPath,sha256:sha(previousBytes),scope:'Rapport antérieur intégral conservé sans réécriture. Les tests du jeu qu’il décrit restent historiques.'};
  review.publication={method:'scripts/workbook-publication.mjs',canonicalFiles:['DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx','combat-tracker-data.json','combat-workbook-verification.json',reviewName],guarantee:'Staging, sauvegardes et restauration sur erreur interceptée. Renommages individuels atomiques ; groupe non atomique.'};
  await writeJson(path.join(outputDir,reviewName),review);
  const guideReviewBytes=await fs.readFile(path.join(outputDir,reviewName));
  const sourceDigests={
    'docs/bible/guide-design.json':review.guideDesignSHA256,
    [`docs/${reviewName}`]:sha(guideReviewBytes),
    [historyPath]:sha(previousBytes),
    'scripts/update-combat-workbook-guide.mjs':sha(await fs.readFile(path.join(root,'scripts/update-combat-workbook-guide.mjs'))),
  };
  for(const name of ['guide-overview.png','guide-associations.png','formula-scan.ndjson'])sourceDigests[`${evidenceDirectory}/${name}`]=sha(await fs.readFile(path.join(outputDir,name)));
  const canonical={
    schema:'encore-guide-workbook-canonical/v1',createdAt:new Date().toISOString(),gameVersion:'0.7.0',sourceCommit:review.sourceCommit,
    scope:'Édition documentaire du classeur : associations guide/bible et correction du total d’arènes.',
    workbookSHA256:review.workbookSHA256,trackerDataSHA256:review.trackerDataSHA256,
    counts:JSON.parse(stagedData).counts,sourceDigests,
    workbookReview:{path:`docs/${reviewName}`,sha256:sha(guideReviewBytes),status:'passed',preservedCells:review.nativePreservation.cellsChecked,existingSheetsPreserved:11,addedSheets:1,formulasRecalculated:42,formulaErrors:0},
    historicalEvidence:{path:historyPath,sha256:sha(previousBytes),originalCreatedAt:previous.createdAt,scope:'Preuves antérieures inchangées, distinctes des contrôles de la présente passe.'},
    currentQa:{gameVersion:'0.7.0',campaign:'guide-bible-documentation-2026-11-25',complete:false,gameTestsExecuted:false,evidence:null,scope:'Les contrôles de cette passe portent sur le classeur. Aucune campagne QA du jeu n’a été réexécutée par cette mise à jour.'},
    releaseReviewed:false,fullCiExecutedByWorkbookUpdate:false,canonicalVisualApproval:false,
    packaging:{eligible:false,reason:'Une campagne QA du jeu complète et ses preuves versionnées restent requises. Cette revue de documentation ne satisfait pas le gate de packaging.'},
    limitations:['Le rapport historique conserve les résultats de jeu antérieurs sans les transformer en tests actuels.','Aucune session Excel bureau ni validation des périphériques physiques dans cette passe.'],
  };
  await writeJson(path.join(outputDir,'combat-workbook-verification.json'),canonical);
  if(publish){
    const {publishWorkbookArtifacts}=await import(pathToFileURL(path.join(root,'scripts/workbook-publication.mjs')));
    await fs.mkdir(path.join(root,evidenceDirectory),{recursive:true});
    await publishWorkbookArtifacts({outputDirectory:path.join(root,evidenceDirectory),files:['previous-workbook-verification.json','guide-overview.png','guide-associations.png','formula-scan.ndjson'].map(name=>({name,source:path.join(outputDir,name)}))});
    assert.equal(sha(await fs.readFile(path.join(root,'docs/combat-workbook-verification.json'))),sha(installedReportBytes),'Canonical report changed concurrently');
    await publishWorkbookArtifacts({outputDirectory:path.join(root,'docs'),files:review.publication.canonicalFiles.map(name=>({name,source:path.join(outputDir,name)}))});
  }
  console.log('GUIDE_WORKBOOK_CANONICAL '+JSON.stringify({published:publish,gameVersion:canonical.gameVersion,workbookSHA256:canonical.workbookSHA256,trackerDataSHA256:canonical.trackerDataSHA256,historySHA256:sha(previousBytes),releaseReviewed:canonical.releaseReviewed,gameTestsExecuted:false}));
}

async function compareNative(){
  const b=await json(path.join(outputDir,'native-before/manifest.json')),a=await json(path.join(outputDir,'native-after/manifest.json'));
  const differences=[];let cellsChecked=0;
  const equal=(x,y,at)=>{if(JSON.stringify(x)!==JSON.stringify(y)&&differences.length<30)differences.push({at,expected:x,actual:y});};
  equal(a.sheets.map(s=>s.name),[...baselineNames,'Guide combat'],'sheet order');
  equal(b.theme,a.theme,'theme');
  for(let i=0;i<b.sheets.length;i++){
    const old=await json(path.join(outputDir,'native-before',b.sheets[i].file)),now=await json(path.join(outputDir,'native-after',a.sheets[i].file));
    for(const key of ['widths','heights','gridLines','freeze','tabColor','tables','validations','rules','margins'])equal(old[key],now[key],old.name+'/'+key);
    equal(old.cells.map(c=>c.slice(0,2)),now.cells.map(c=>c.slice(0,2)),old.name+'/cell addresses');
    const current=new Map(now.cells.map(c=>[c[0]+':'+c[1],c]));
    for(const cell of old.cells){const other=current.get(cell[0]+':'+cell[1]);if(!other)continue;cellsChecked++;const change=allowedChanges.find(c=>c.sheet===old.name&&c.row===cell[0]&&c.column===cell[1]);if(change){assert.equal(cell[3],change.before);cell[3]=change.after;}equal(cell.slice(2,5),other.slice(2,5),old.name+'/'+cell.slice(0,2)+'/value-type-formula');equal(b.styles[cell[5]],a.styles[other[5]],old.name+'/'+cell.slice(0,2)+'/style');}
  }
  return {status:differences.length?'failed':'passed',cellsChecked,sheetsChecked:11,tablesChecked:10,checked:['cell addresses, types, values, formulas','effective styles, dimensions, gridlines, panes, tab colors','table identities, ranges, filters, styles','validation, conditional formatting, margins, theme'],differences};
}
