import { validateSync } from 'class-validator';
import { log } from '../utils/log';
import { BarRequest } from './hoc1';
// import { BarRequest } from './hoc2';
// import { BarRequest } from './hoc3';

export function showcaseHoc() {
  const req = new BarRequest();
  req.sortByFields = ['id'];
  log('ok', validateSync(req));

  (req.sortByFields as any) = ['name'];
  log('error', validateSync(req));

  // Should not compile!
  // req.sortByFields = ['name'];
  // req.sortByFields = ['else'];
}
