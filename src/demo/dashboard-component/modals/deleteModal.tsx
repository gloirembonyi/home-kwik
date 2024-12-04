// components/modals/deleteModal.tsx
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/base/alert-dialog";
import { useRecoilState } from "recoil";
import { userToDeleteState, isDeleteModalOpen } from "@/atoms";

const DeleteUserModal = () => {
  const [userToDelete, setUserToDelete] = useRecoilState(userToDeleteState);
  const [isOpen, setIsOpen] = useRecoilState(isDeleteModalOpen);

  const handleDelete = () => {
    // Implement delete logic here
    console.log(`Deleting user: ${userToDelete?.names}`);
    setIsOpen(false);
    setUserToDelete(null);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-semibold">{userToDelete?.names}'s</span> account
            and remove their data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserModal;