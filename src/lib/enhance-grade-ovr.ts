/**
 * Cộng dồn OVR khi tăng cấp thẻ so với mốc +1 (grade 1).
 * +1 → +2..+3: +1 / cấp; +4..+6: +2; +7: +3; +8: +4; +9..+11: +2; +12..+13: +3
 */
export function ovrStepFromPreviousGrade(grade: number): number {
  if (grade <= 1) return 0;
  if (grade <= 3) return 1;
  if (grade <= 6) return 2;
  if (grade === 7) return 3;
  if (grade === 8) return 4;
  if (grade <= 11) return 2;
  return 3; // 12, 13
}

/** Tổng OVR cộng thêm so với grade 1 khi đang ở `grade` (1…13). */
export function cumulativeOvrBonusFromGrade1(grade: number): number {
  const g = Math.min(13, Math.max(1, Math.floor(grade)));
  let sum = 0;
  for (let step = 2; step <= g; step++) {
    sum += ovrStepFromPreviousGrade(step);
  }
  return sum;
}

/** OVR mốc +1 từ OVR hiện tại và cấp thẻ đang lưu trên API. */
export function baseOvrAtGrade1(currentOvr: number, storedEnhanceLevel: number | undefined | null): number {
  const level = Math.min(13, Math.max(1, storedEnhanceLevel ?? 1));
  const bonusAtStored = cumulativeOvrBonusFromGrade1(level);
  return Math.max(0, currentOvr - bonusAtStored);
}
