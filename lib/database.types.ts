export type Category = {
  id: string;
  name: string;
  created_by: string | null;
  created_at: string;
};

export type Exercise = {
  id: string;
  name: string;
  description: string | null;
  video_url: string | null;
  category_id: string;
  created_by: string | null;
  created_at: string;
};

export type ExerciseWithCategory = Exercise & {
  categories: Pick<Category, "name"> | null;
};

export type Client = {
  id: string;
  email: string | null;
  name: string | null;
  subscription_status: string;
  created_at: string;
};

export type ClientInsert = {
  id?: string;
  email?: string | null;
  name?: string | null;
  subscription_status?: string;
};

export type Plan = {
  id: string;
  trainer_id: string | null;
  client_id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  template_id: string | null;
  share_code: string;
  created_at: string;
  updated_at: string;
};

export type PlanInsert = {
  id?: string;
  trainer_id?: string | null;
  client_id: string;
  name: string;
  start_date?: string | null;
  end_date?: string | null;
  template_id?: string | null;
  share_code?: string;
};

export type PlanExercise = {
  id: string;
  plan_id: string;
  exercise_id: string;
  day_of_week: number;
  order_in_day: number;
  sets: number;
  reps: number;
  weight: number | null;
  notes: string | null;
};

export type PlanExerciseInsert = {
  id?: string;
  plan_id: string;
  exercise_id: string;
  day_of_week: number;
  order_in_day: number;
  sets: number;
  reps: number;
  weight?: number | null;
  notes?: string | null;
};
