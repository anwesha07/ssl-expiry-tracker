import React, { ReactElement } from 'react';
import Image from 'next/image';
import EditIcon from '@mui/icons-material/Edit';

type Domain = {
  _id: string;
  name: string;
  expiry: string;
  issueDate: string;
  daysToAlert: number;
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const ShowDomains: React.FC<{ domains: Domain[] }> = ({ domains }) => {
  const getTotalNumberOfDays = (expiry: string, issueDate: string) => {
    // Calculate the time difference in milliseconds
    const totalTimeDifference =
      new Date(expiry).getTime() - new Date(issueDate).getTime();
    // Convert the time difference to days
    const totalNumberOfDays = Math.ceil(
      totalTimeDifference / (1000 * 60 * 60 * 24),
    );
    return totalNumberOfDays;
  };
  const getExpiredDays = (issueDate: string) => {
    const currentDate = new Date();
    // Calculate the time difference in milliseconds
    const expiredTimeDiff =
      currentDate.getTime() - new Date(issueDate).getTime();
    // Convert the time difference to days
    return Math.ceil(expiredTimeDiff / (1000 * 60 * 60 * 24));
  };

  const getStatus = (
    alertPeriod: number,
    expiry: string,
    issueDate: string,
  ): ReactElement => {
    const totalNumberOfDays = getTotalNumberOfDays(expiry, issueDate);
    const totalNumberOfExpiredDays = getExpiredDays(issueDate);
    const daysRemaining = totalNumberOfDays - totalNumberOfExpiredDays;
    if (daysRemaining <= 0)
      return (
        <div className="bg-errorbg text-error w-full max-w-[60px] h-[20px] flex justify-center items-center rounded-full px-0.5 font-[500] text-xs">
          expired
        </div>
      );
    else if (daysRemaining <= alertPeriod)
      return (
        <div className="bg-warningbg text-warning w-full max-w-[60px] h-[20px] flex justify-center items-center rounded-full px-0.5 font-[500] text-xs">
          alert
        </div>
      );
    else
      return (
        <div className="bg-safebg w-full max-w-[60px] h-[20px] flex justify-center items-center text-safe rounded-full px-0.5 font-[500] text-xs">
          safe
        </div>
      );
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return formattedDate;
  };

  const showProgress = (expiry: string, issueDate: string) => {
    /*
    0->Sd
    200px->ed
    diff = ed - sd
    diff->x
    1-> x / diff
    exd -> cd-sd
    exp -> (x / diff) * exp
    */
    const totalNumberOfDays = getTotalNumberOfDays(expiry, issueDate);
    const totalNumberOfExpiredDays = getExpiredDays(issueDate);
    const covered = Math.ceil(
      (totalNumberOfExpiredDays * 100) / totalNumberOfDays,
    );
    return (
      <div className="w-[60%] h-[8px] bg-progressbar rounded-lg">
        <div
          style={{ width: `${covered}%` }}
          className={`h-[100%] bg-buttonColor rounded-lg`}
        />
      </div>
    );
  };

  return (
    <div className="w-full max-w-[900px] bg-white border border-metal m-auto rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.16)] flex flex-col">
      <div className="rounded-lg text-tableHeaderText text-xs font-[600] flex flex-row w-[100%] bg-tableHeader h-[45px]">
        <div className=" py-2 px-4 w-[25%] flex justify-start items-center cursor-pointer">
          Domain
        </div>
        <div className=" py-2 px-4 w-[12%] flex justify-start items-center cursor-pointer">
          Status
        </div>
        <div className=" py-2 px-4 w-[18%] flex justify-start items-center cursor-pointer">
          Issue Date
        </div>
        <div className=" py-2 px-4 w-[20%] flex justify-start items-center cursor-pointer">
          Expiry Date
        </div>
        <div className=" py-2 px-4 w-[25%] flex justify-start items-center cursor-pointer">
          Days to expiry
        </div>
      </div>
      {domains.map((d) => {
        return (
          <div
            key={d.name}
            className="border border-metal-800 hover:shadow-md hover:bg-highlight font-[400] text-sm
            flex w-[100%] min-h-[60px]"
          >
            <div className=" py-2 px-4 w-[25%] flex justify-start items-center">
              <Image
                src="/images/defaultimage.png" // Path to the image file relative to the "public" directory
                alt="My Image"
                width={30}
                height={30}
                className="rounded-[50%] border border-metal-800 bg-progressbar mr-4"
              />
              <div className="flex flex-col font-[500]">
                <div>{capitalize(d.name.split('.')[0])}</div>
                <div className="text-xs text-tableHeaderText">{d.name}</div>
              </div>
            </div>
            <div className=" py-2 px-4 w-[12%] flex justify-start items-center">
              {getStatus(d.daysToAlert, d.expiry, d.issueDate)}
            </div>
            <div className=" py-2 px-4 w-[18%] flex justify-start items-center text-xs font-[500]">
              {formatDate(d.issueDate)}
            </div>
            <div className=" py-2 px-4 w-[20%] flex flex-col justify-center font-[500]">
              <div>{formatDate(d.expiry)}</div>
              <div className="text-xs text-tableHeaderText">
                <b>
                  {`${getTotalNumberOfDays(
                    d.expiry,
                    new Date().toISOString(),
                  )} `}
                </b>
                days to expire
              </div>
            </div>
            <div className="py-2 px-4 w-[25%] flex justify-start items-center">
              {showProgress(d.expiry, d.issueDate)}
              <Image
                src="/images/delete.svg"
                alt="Delete"
                width={20}
                height={20}
                className="ml-4 cursor-pointer"
              />
              <EditIcon fontSize="small" className="ml-3 cursor-pointer" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShowDomains;
