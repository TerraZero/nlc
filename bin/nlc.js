#!/usr/bin/env node

const NLC = require('../index');

try {
  const manager = NLC.get();

  manager.execute(process.argv);
} catch (e) {
  if (!(e instanceof NLC.errors.CommandError)) throw e;

  process.exit(e.getCode());
}
