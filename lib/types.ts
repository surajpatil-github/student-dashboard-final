// lib/types.ts

export type Student = {
  student_id: string;
  name: string;
  class: string;            // e.g., "Grade 8", "Grade 9"
  comprehension: number;    // 0..100
  attention: number;        // 0..100
  focus: number;            // 0..100
  retention: number;        // 0..100
  engagement_time: number;  // minutes per day (0..120)
  assessment_score: number; // 0..100
};

export type Summary = {
  gpa: number;
  attendance: number;
  credits: number;
  rank: number;
};

export type SkillScore = { skill: string; score: number };

export type AttentionPoint = {
  study_hours: number;
  score: number;
  focus: number;
};

export type RadarTrait = { trait: string; value: number };
