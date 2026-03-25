import { VALID_RANGE_OPTIONS_CONFIG } from '../constants/constants';

/**
 * Generates an array of numbers with a specified step.
 * @param length The number of elements to generate (including zero, which will be filtered out).
 * @param range_step The progression step size.
 */

export const VALID_RANGE_OPTIONS = Array.from({
  length: VALID_RANGE_OPTIONS_CONFIG.range_items_count,
})
  .map((_, index) => index * VALID_RANGE_OPTIONS_CONFIG.range_step)
  .filter(val => val !== 0);
