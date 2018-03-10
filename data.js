module.exports = {
  cpu0: {
    target0: {
      sources: ['S0', 'S1', 'S2'],
    },
    target1: {
      sources: ['S1', 'S2'],
    },
    target2: {
      sources: ['S3', 'S5'],
    },
  },
  cpu1: {
    target0: {
      sources: ['S0', 'S3', 'S4', 'S7'],
    },
    target1: {
      sources: ['S0', 'S4'],
    },
    target2: {
      sources: ['S3', 'S5'],
    },
  },
};
