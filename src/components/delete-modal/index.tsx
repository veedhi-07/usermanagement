import React from "react";
import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Portal from "../../portal";
import type { DeleteModalProps } from "../../types/index";
const DeleteModal = ({ show, onClose, onConfirm }: DeleteModalProps) => {
  if (!show) return null;
  return (
    <Portal>
      <Modal show={show} size="md" onClose={onClose} popup>
        <div className=" dark:bg-white!">
          <ModalHeader />
          <ModalBody>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-black! dark:text-gray-400">
                Are you sure you want to delete?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="red" onClick={onConfirm}>
                  Yes, I'm sure
                </Button>
                <Button color="alternative" onClick={onClose}>
                  No, cancel
                </Button>
              </div>
            </div>
          </ModalBody>
        </div>
      </Modal>
    </Portal>
  );
};
export default React.memo(DeleteModal);
