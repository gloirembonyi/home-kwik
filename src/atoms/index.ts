// atoms/index.ts
import { atom } from "recoil";
import { IUserToDelete } from "@/types/@types";

export const userToDeleteState = atom<IUserToDelete | null>({
  key: "userToDeleteState",
  default: null,
});

export const isDeleteModalOpen = atom<boolean>({
  key: "isDeleteModalOpen",
  default: false,
});

export const dashboardViewState = atom<"table" | "grid">({
  key: "dashboardViewState",
  default: "table",
});