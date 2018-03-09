const _ = require('lodash');
const cpuTargetSources = require('./data');

// helpers
const sortByLength = (a, b) => {
  if (a.length > b.length) return -1;
  if (b.length > a.length) return 1;
  return 0;
};
// [{target, cpu, src}, ...]
const flattenSources = (data) => (
  Object.keys(data)
    .reduce((sources, cpuKey) => {
      const cpu = data[cpuKey];

      Object.keys(cpu)
        .forEach(targetKey => {
          cpu[targetKey].sources
            .forEach(src => sources.push({
              targetCpu: `${targetKey}-${cpuKey}`,
              target: targetKey,
              cpu: cpuKey,
              src,
            }));
        });

      return sources;
    }, [])
);

const sources = flattenSources(cpuTargetSources);
const targetCpuSources = sources.reduce((map, entry) => (
  _.set(map, `${entry.target}.${entry.cpu}.${entry.src}`, entry)
), {});
const resultLines = Object.keys(targetCpuSources)
  .reduce((resultLines, targetKey) => {
    const target = targetCpuSources[targetKey];    
    const cpuGroups = _.groupBy(
      _.flatten(
        Object.values(target)
          .map(cpu => Object.values(cpu))
      ),
      'cpu'
    );
    const sortedCpuGroups = Object.values(cpuGroups).sort(sortByLength);
    const usedSourceMap = {};

    // generate output
    resultLines.push(`#target:${targetKey}`);
    sortedCpuGroups.forEach((group, index) => {
      let sources = group.map(({src}) => src);

      if (index === 0) {
        // flag default sources as used
        sources.forEach(src => usedSourceMap[src] = true);
      } else {
        // "if cpu" line
        const cpu = group[0].cpu;
        resultLines.push(`if (${cpu})`);
        // skip default
        sources = sources.filter(src => !usedSourceMap[src]);
      }
      
      resultLines = resultLines.concat(sources);
    });

    return resultLines;
  }, []);

console.log(resultLines.join('\n'));