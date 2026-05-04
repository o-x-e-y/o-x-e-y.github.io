function lh(num: number, nr_of_cols: number): boolean {
  return num < nr_of_cols / 2;
}

function is_alt(lh1: boolean, lh2: boolean, lh3: boolean): boolean {
  return lh1 !== lh2 && lh2 !== lh3;
}

function is_roll(lh1: boolean, lh2: boolean, lh3: boolean, c1: number, c2: number, c3: number): boolean {
  const r = Number(lh1) + Number(lh2) + Number(lh3);
  return !is_alt(lh1, lh2, lh3) && (r === 1 || r === 2) && c1 !== c2 && c2 !== c3;
}

function get_roll(lh1: boolean, lh2: boolean, lh3: boolean, c1: number, c2: number, c3: number): number {
  if (lh1 && lh2 && !lh3) return c2 > c1 ? 3 : 2;
  if (!lh1 && lh2 && lh3) return c3 > c2 ? 3 : 2;
  if (!lh1 && !lh2 && lh3) return c1 > c2 ? 3 : 2;
  if (lh1 && !lh2 && !lh3) return c2 > c3 ? 3 : 2;
  return 7;
}

function on_one_hand(lh1: boolean, lh2: boolean, lh3: boolean): boolean {
  return lh1 === lh2 && lh2 === lh3;
}

function is_bad_redir(c1: number, c2: number, c3: number): boolean {
  const check = [1, 1, 1, 0, 0, 0, 0, 1, 1, 1];
  return check[c1] + check[c2] + check[c3] === 3;
}

function get_one_hand(c1: number, c2: number, c3: number): number {
  if ((c1 < c2 && c2 > c3) || (c1 > c2 && c2 < c3)) {
    return is_bad_redir(c1, c2, c3) ? 6 : 5;
  }
  if ((c1 > c2 && c2 > c3) || (c1 < c2 && c2 < c3)) return 4;
  return 7;
}

function get_trigram_pattern(c1: number, c2: number, c3: number, nr_of_cols: number): number {
  const lh1 = lh(c1, nr_of_cols);
  const lh2 = lh(c2, nr_of_cols);
  const lh3 = lh(c3, nr_of_cols);
  if (is_alt(lh1, lh2, lh3)) return c1 === c3 ? 1 : 0;
  if (on_one_hand(lh1, lh2, lh3)) return get_one_hand(c1, c2, c3);
  if (is_roll(lh1, lh2, lh3, c1, c2, c3)) return get_roll(lh1, lh2, lh3, c1, c2, c3);
  return 7;
}

function get_trigram_combinations(nr_of_cols: number): Int32Array {
  const size = Math.floor(Math.log2(nr_of_cols)) + 1;
  const maxIndex = ((nr_of_cols - 1) << (size * 2)) | ((nr_of_cols - 1) << size) | (nr_of_cols - 1);
  const combinations = new Int32Array(maxIndex + 1).fill(-1);
  for (let c3 = 0; c3 < nr_of_cols; c3++) {
    for (let c2 = 0; c2 < nr_of_cols; c2++) {
      for (let c1 = 0; c1 < nr_of_cols; c1++) {
        const index = (c3 << (size * 2)) | (c2 << size) | c1;
        combinations[index] = get_trigram_pattern(c1, c2, c3, nr_of_cols);
      }
    }
  }
  return combinations;
}

const TRIGRAM_COMBINATIONS = get_trigram_combinations(10);
export default TRIGRAM_COMBINATIONS;
