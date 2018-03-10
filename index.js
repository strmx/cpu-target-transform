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
  // cpuGroups.forEach(g => console.log(commonSources, g, _.differenceBy(g, commonSources, 'src')));
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
