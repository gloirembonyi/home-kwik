import { IUserToDelete } from './../@types/index';
import { atom } from "recoil";

export const isDeleteModalOpen = atom<boolean>({
  key: "isDeleteModalOpen",
  default: false,
});

export const userToDeleteState = atom<IUserToDelete | null>({
  key: "userToDeleteState",
  default: null,
});

export {};
