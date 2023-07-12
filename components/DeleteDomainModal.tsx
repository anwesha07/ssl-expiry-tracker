import React from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import Modal from './Modal';

type Domain = {
  _id: string;
  name: string;
  expiry: string;
  issueDate: string;
  daysToAlert: number;
};
const DeleteDomainModal: React.FC<{
  domain: Domain;
  handleDelete: (_id: string) => Promise<void>;
  handleCloseClick: () => void;
}> = ({ domain, handleDelete, handleCloseClick }) => {
  return (
    <Modal onClose={handleCloseClick}>
      <div className="flex flex-col h-[150px] justify-center">
        <div className="h-full">
          <CancelIcon />
          <span className="ml-2">{`Are you sure to delete "${domain.name}" ?`}</span>
        </div>
        <div className="flex w-full gap-2">
          <button
            className="bg-error text-white px-4 py-2 rounded-md w-full rounded font-medium text-xs flex justify-center items-center h-[40px]"
            onClick={() => {
              handleDelete(domain._id);
              handleCloseClick();
            }}
          >
            Delete
          </button>
          <button
            className="bg-buttonColor text-white px-4 py-2 rounded-md w-full rounded font-medium text-xs flex justify-center items-center h-[40px]"
            onClick={handleCloseClick}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteDomainModal;
