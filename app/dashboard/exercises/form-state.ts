export type CreateExerciseState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialState: CreateExerciseState = {
  status: "idle",
  message: "",
};
