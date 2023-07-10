import React, { ReactElement } from 'react';
import Image from 'next/image';
import { Sd } from '@mui/icons-material';
import { edgeServerAppPaths } from 'next/dist/build/webpack/plugins/pages-manifest-plugin';

type Domain = {
  _id: string;
  name: string;
  expiry: string;
  issueDate: string;
  daysToAlert: number;
};

const ShowDomains: React.FC<{ domains: Domain[] }> = ({ domains }) => {
  // console.log(domains);

  const getTotalNumberOfDays = (expiry, issueDate) => {
    // Calculate the time difference in milliseconds
    const totalTimeDifference =
      new Date(expiry).getTime() - new Date(issueDate).getTime();
    // Convert the time difference to days
    const totalNumberOfDays = Math.ceil(
      totalTimeDifference / (1000 * 60 * 60 * 24),
    );
    return totalNumberOfDays;
  };
  const getExpiredDays = (issueDate) => {
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
        <div className="bg-errorbg text-error w-[60px] flex justify-center items-center rounded-[100px] px-0.5">
          expired
        </div>
      );
    else if (daysRemaining <= alertPeriod)
      return (
        <div className="bg-warningbg text-warning w-[60px] flex justify-center items-center rounded-[100px] px-0.5">
          alert
        </div>
      );
    else
      return (
        <div className="bg-safebg w-[60px] flex justify-center items-center text-safe rounded-[100px] px-0.5">
          safe
        </div>
      );
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
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
    const covered = (totalNumberOfExpiredDays * 100) / totalNumberOfDays;
    console.log({ totalNumberOfExpiredDays });
    return (
      <div className="w-[60%] h-[10px] bg-progressbar rounded-lg">
        <div className={`w-[${covered}%] h-[100%] bg-buttonColor rounded-lg`} />
      </div>
    );
  };

  return (
    <div className="w-full max-w-[900px] bg-white border border-metal m-auto rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.16)] flex flex-col">
      <div className="rounded-lg text-tableHeaderText text-xs font-[600] flex flex-row w-[100%] bg-tableHeader h-[45px]">
        <div className=" py-2 px-4 w-[30%] flex justify-start items-center">
          Domain
        </div>
        <div className=" py-2 px-4 w-[15%] flex justify-start items-center">
          Status
        </div>
        <div className=" py-2 px-4 w-[15%] flex justify-start items-center">
          Issue date
        </div>
        <div className=" py-2 px-4 w-[15%] flex justify-start items-center">
          Expiry
        </div>
        <div className=" py-2 px-4 w-[25%] flex justify-start items-center">
          Days left
        </div>
      </div>
      {domains.map((d) => {
        return (
          <div
            key={d.name}
            className="border border-metal-800 hover:shadow-md hover:bg-highlight font-medium text-sm
            flex w-[100%] h-[60px]"
          >
            <div className=" py-2 px-4 w-[30%] flex justify-start items-center">
              <Image
                src="/images/defaultimage.png" // Path to the image file relative to the "public" directory
                alt="My Image"
                width={30}
                height={30}
                className="rounded-[50%] border border-metal-800 bg-progressbar mr-2"
              />
              <div className="w-[300px] flex justify-start">{d.name}</div>
            </div>
            <div className=" py-2 px-4 w-[15%] flex justify-start items-center">
              {getStatus(d.daysToAlert, d.expiry, d.issueDate)}
            </div>
            <div className=" py-2 px-4 w-[15%] flex justify-start items-center">
              {formatDate(d.issueDate)}
            </div>
            <div className=" py-2 px-4 w-[15%] flex justify-start items-center">
              {formatDate(d.expiry)}
            </div>
            <div className="py-2 px-4 w-[25%] flex justify-start items-center">
              {showProgress(d.expiry, d.issueDate)}
              <Image
                src="/images/delete.svg"
                alt="Delete"
                width={20}
                height={20}
                className="ml-4 cursor-pointer text-tableHeader"
              />
              <Image
                src="/images/edit.svg"
                alt="Edit"
                width={20}
                height={20}
                className="ml-2 cursor-pointer text-tableHeader"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShowDomains;
