import React from "react";
import Dialog from "../ui/Dialog";
import { useRecoilState } from "recoil";
import { isDeleteModalOpen, userToDeleteState } from "@/atoms";
import { Button } from "../ui/base/button";

const DeleteUserModal = () => {
  const [open, setOpen] = useRecoilState(isDeleteModalOpen);
  const [userToDelete, setUserToDelete] = useRecoilState(userToDeleteState);
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        setUserToDelete(null);
      }}
      trigger={<></>}
      title={"Delete User"}
    >
      <p>Are you sure you want to delete "{userToDelete?.names}"?</p>
      <div className="flex justify-end gap-2">
        <Button
          className="btn btn-primary"
          onClick={() => {
            setOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button
          className="btn btn-danger bg-red-600 hover:bg-red-400"
          onClick={() => {
            setOpen(false);
          }}
        >
          Delete
        </Button>
      </div>
    </Dialog>
  );
};

export default DeleteUserModal;
