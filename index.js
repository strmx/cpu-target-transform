const _ = require('lodash');
const cpuTargetSources = require('./data');

// [{target, cpu, src}, ...]
const sources = Object.keys(cpuTargetSources)
  .reduce((acc, cpuKey) => {
    const cpu = cpuTargetSources[cpuKey];
    Object.keys(cpu)
      .forEach(target => (
        cpu[target].sources.forEach(src => acc.push({target, cpu: cpuKey, src}))
      ));
    return acc;
  }, []);
const targetSourcesList = Object.values(_.groupBy(sources, 'target'));
const targetResultSources = targetSourcesList.map(targetSources => {
  const cpuGroups = Object.values(_.groupBy(targetSources, 'cpu'));
  const commonSources = _.intersectionBy.apply(null, [...cpuGroups, 'src']);
  const cpuOnlySources = cpuGroups
    .map(groupSources => _.differenceBy(groupSources, commonSources, 'src'))
    .filter(groupSources => groupSources.length);
  return {
    target: targetSources[0].target,
    commonSources,
    cpuOnlySources,
  };
});

// out
targetResultSources.forEach(({target, commonSources, cpuOnlySources}) => {
  console.log(`if target == ${target}:`);
  commonSources.forEach(s => console.log(`  ${s.src}`));
  cpuOnlySources.forEach(list => {
    console.log(`  if cpu == ${list[0].cpu}:`);
    list.forEach(s => console.log(`    ${s.src}`));
  });
});

/*
#RESULT

if target == target0:
  S0
  if cpu == cpu0:
    S1
    S2
  if cpu == cpu1:
    S3
    S4
    S7
if target == target1:
  if cpu == cpu0:
    S1
    S2
  if cpu == cpu1:
    S0
    S4
if target == target2:
  S3
  S5
*/