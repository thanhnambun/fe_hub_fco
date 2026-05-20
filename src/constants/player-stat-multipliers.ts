/**
 * Stat multipliers used to derive 30 sub-stats from 6 core stats.
 * These values are tuned to approximate FC Online's internal stat distribution.
 * Keeping them here prevents no-magic-numbers lint warnings in component files.
 */

// ----- Column 1: Strength / Speed / Dribbling / Passing / Shooting -----
export const M_STRENGTH = 1.02;
export const M_ACCELERATION = 1.05;
export const M_SPRINT_SPEED = 0.95;
export const M_DRIBBLING_STAT = 1.03;
export const M_BALL_CONTROL = 0.98;
export const M_SHORT_PASSING = 1.04;
export const M_FINISHING = 1.06;
export const M_SHOT_POWER = 1.02;
export const M_HEADING_DEF = 0.88;
export const M_HEADING_PHY = 0.12;

// ----- Column 2: Shooting variants / Passing variants -----
export const M_LONG_SHOTS = 0.98;
export const M_VOLLEYS = 0.92;
export const M_POSITIONING = 1.03;
export const M_REACTIONS_DRI = 0.95;
export const M_REACTIONS_PAS = 0.05;
export const M_PENALTIES = 0.94;
export const M_VISION = 0.99;
export const M_CROSSING = 0.92;
export const M_LONG_PASSING = 0.96;
export const M_FREE_KICK = 0.88;

// ----- Column 3: Dribbling variants / Defending -----
export const M_CURVE = 0.95;
export const M_AGILITY = 1.02;
export const M_BALANCE = 0.97;
export const M_MARKING = 0.96;
export const M_STANDING_TACKLE = 1.02;
export const M_INTERCEPTIONS = 0.98;
export const M_SLIDING_TACKLE = 0.94;
export const M_STAMINA = 1.01;
export const M_AGGRESSION = 0.88;

// ----- Column 4: Physicality / GK -----
export const M_JUMPING = 0.95;
export const M_COMPOSURE_DRI = 0.98;
export const M_COMPOSURE_PAS = 0.02;
export const M_GK_DIVING = 1.04;
export const M_GK_HANDLING = 0.98;
export const M_GK_KICKING = 0.96;
export const M_GK_REFLEXES = 1.05;
export const M_GK_POSITIONING = 0.99;

// ----- Position-specific boosts (ST/CF) -----
export const M_POS_ST_FINISHING = 1.05;
export const M_POS_ST_POSITIONING = 1.04;
export const M_POS_ST_SHOT_POWER = 1.02;

// ----- Position-specific boosts (CAM/CM) -----
export const M_POS_CAM_SHORT_PASS = 1.04;
export const M_POS_CAM_VISION = 1.03;
export const M_POS_CAM_BALL_CONTROL = 1.02;

// ----- Position-specific boosts (CB) -----
export const M_POS_CB_MARKING = 1.04;
export const M_POS_CB_STANDING_TACKLE = 1.03;
export const M_POS_CB_HEADING = 1.03;
export const M_POS_CB_STRENGTH = 1.02;

// ----- Position-specific boosts (Wingers / FBs) -----
export const M_POS_WG_ACCELERATION = 1.04;
export const M_POS_WG_AGILITY = 1.03;
export const M_POS_WG_CROSSING = 1.05;
