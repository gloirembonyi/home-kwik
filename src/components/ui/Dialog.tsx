import * as BaseDialog from "@/components/ui/base/dialog";
import React from "react";

interface DialogProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  trigger: React.ReactNode;
  open?: boolean;
  onClose?: (newState: boolean) => void;
}

const Dialog = (props: DialogProps) => {
  return (
    <BaseDialog.Dialog open={props.open} onOpenChange={props.onClose}>
      <BaseDialog.DialogTrigger asChild>
        {props.trigger}
      </BaseDialog.DialogTrigger>
      <BaseDialog.DialogContent className="sm:max-w-lg sm:w-[95%]">
        {props.title && (
          <BaseDialog.DialogHeader>
            <BaseDialog.DialogTitle>{props.title}</BaseDialog.DialogTitle>
          </BaseDialog.DialogHeader>
        )}
        {props.children}
        {props.footer && (
          <BaseDialog.DialogFooter>{props.footer}</BaseDialog.DialogFooter>
        )}
      </BaseDialog.DialogContent>
    </BaseDialog.Dialog>
  );
};

export default Dialog;
