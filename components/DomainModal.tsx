import React, { ReactNode } from 'react';
import Modal from './Modal';

type Domain = {
  _id: string;
  name: string;
  expiry: string;
  issueDate: string;
  daysToAlert: number;
};
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
  return formattedDate;
};

const DomainModal: React.FC<{
  domain: Domain;
  getStatus: (
    alertPeriod: number,
    expiry: string,
    issueDate: string,
  ) => ReactNode;
  handleCloseClick: () => void;
}> = ({ domain, getStatus, handleCloseClick }) => {
  return (
    <Modal onClose={handleCloseClick}>
      <div className="flex flex-col h-[300px]">
        <div className="h-full">
          <div
            className="mb-4 relative flex items-center justify-start
              after:content-[''] after:w-full after:h-[1px] after:bg-metal after:absolute after:-bottom-2"
          >
            <img
              src={`https://s2.googleusercontent.com/s2/favicons?domain=${domain.name}`}
              alt="My Image"
              width={24}
              height={24}
              className="rounded-[50%] bg-progressbar mr-2"
            />
            <a
              target="_blank"
              href={`https://${domain.name}`}
              className="grow w-full"
            >
              <h1 className="text-2xl cursor-pointer ">
                {capitalize(domain.name.split('.')[0])}
              </h1>
            </a>
            <div className="w-[80px]">
              {getStatus(domain.daysToAlert, domain.expiry, domain.issueDate)}
            </div>
          </div>
          <div className="h-[30px] flex items-center justify-start text-sm">
            <b className="mr-2">Domain name:</b>
            <a
              target="_blank"
              href={`https://${domain.name}`}
              className="hover:text-buttonColor text-sm text-tableHeaderText"
            >
              {`https://${domain.name}`}
            </a>
          </div>
          <div className="h-[30px] flex items-center justify-start ">
            <b className="mr-2 text-sm ">Issue date:</b>
            <span className="text-sm text-tableHeaderText">
              {formatDate(domain.issueDate)}
            </span>
          </div>
          <div className="h-[30px] flex items-center justify-start">
            <b className="mr-2 text-sm">Expiry date:</b>
            <span className="text-sm text-tableHeaderText">
              {formatDate(domain.expiry)}
            </span>
          </div>
          <div className="h-[30px] flex items-center justify-start">
            <b className="mr-2 text-sm">Alert before:</b>
            <span className="text-sm text-tableHeaderText">
              {domain.daysToAlert} days
            </span>
          </div>
        </div>
        <button
          className="bg-buttonColor text-white px-4 py-2 rounded-md w-full rounded font-medium text-xs flex justify-center items-center"
          onClick={handleCloseClick}
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default DomainModal;
