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
