export type Student = {
student_id: string;
name: string;
class: string; // e.g., "Grade 8", "Grade 9"
comprehension: number; // 0..100
attention: number; // 0..100
focus: number; // 0..100
retention: number; // 0..100
engagement_time: number; // minutes per day (0..120)
assessment_score: number;// 0..100
};