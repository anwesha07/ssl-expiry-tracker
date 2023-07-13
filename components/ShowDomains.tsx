import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import SearchIcon from '@mui/icons-material/Search';
import DomainModal from './DomainModal';
import DeleteDomainModal from './DeleteDomainModal';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

type Domain = {
  _id: string;
  name: string;
  expiry: string;
  issueDate: string;
  daysToAlert: number;
};

const colorVariants = {
  safe: 'bg-safebg text-safe',
  warn: 'bg-warningbg text-warning',
  error: 'bg-errorbg text-error',
  errorBar: 'bg-error',
  warnBar: 'bg-warning',
  safeBar: 'bg-safe',
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
  return formattedDate;
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const ShowDomains: React.FC<{
  domains: Domain[];
  handleDelete: (id: string) => Promise<void>;
}> = ({ domains, handleDelete }) => {
  const [domainView, setDomainView] = useState(domains);
  const [searchInput, setSearchInput] = useState('');
  const [domainModal, setDomainModal] = useState<Domain | null>(null);
  const [deleteDomainModal, setdeleteDomainModal] = useState<Domain | null>(
    null,
  );
  const [sortDomains, setSortDomains] = useState<string | ''>('');

  useEffect(() => {
    setDomainView(domains);
  }, [domains]);

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
  const { safeCount, alertCount, expiredCount } = useMemo(() => {
    let expire = 0,
      safe = 0,
      warn = 0;
    domains.forEach((domain) => {
      const totalNumberOfDays = getTotalNumberOfDays(
        domain.expiry,
        domain.issueDate,
      );
      const totalNumberOfExpiredDays = getExpiredDays(domain.issueDate);
      const daysRemaining = totalNumberOfDays - totalNumberOfExpiredDays;

      daysRemaining <= 0
        ? expire++
        : daysRemaining <= domain.daysToAlert
        ? warn++
        : safe++;
    });
    return { safeCount: safe, alertCount: warn, expiredCount: expire };
  }, [domains]);

  const getStatus = (
    alertPeriod: number,
    expiry: string,
    issueDate: string,
  ): ReactElement => {
    const totalNumberOfDays = getTotalNumberOfDays(expiry, issueDate);
    const totalNumberOfExpiredDays = getExpiredDays(issueDate);
    const daysRemaining = totalNumberOfDays - totalNumberOfExpiredDays;

    if (daysRemaining <= 0) {
      return (
        <div
          className={`${colorVariants['error']} w-full max-w-[60px] h-[20px] flex justify-center items-center rounded-full px-0.5 font-[500] text-xs`}
        >
          expired
        </div>
      );
    } else if (daysRemaining <= alertPeriod) {
      return (
        <div
          className={`${colorVariants['warn']} w-full max-w-[60px] h-[20px] flex justify-center items-center rounded-full px-0.5 font-[500] text-xs`}
        >
          alert
        </div>
      );
    } else {
      return (
        <div
          className={`${colorVariants['safe']} w-full max-w-[60px] h-[20px] flex justify-center items-center rounded-full px-0.5 font-[500] text-xs`}
        >
          safe
        </div>
      );
    }
  };

  const showProgress = (
    expiry: string,
    issueDate: string,
    alertPeriod: number,
  ) => {
    const totalNumberOfDays = getTotalNumberOfDays(expiry, issueDate);
    const totalNumberOfExpiredDays = getExpiredDays(issueDate);
    const covered = Math.min(
      100,
      Math.ceil((totalNumberOfExpiredDays * 100) / totalNumberOfDays),
    );

    const daysRemaining = totalNumberOfDays - totalNumberOfExpiredDays;
    const pillDecoration =
      daysRemaining <= 0
        ? colorVariants['errorBar']
        : daysRemaining <= alertPeriod
        ? colorVariants['warnBar']
        : colorVariants['safeBar'];

    return (
      <div className="flex-grow h-[8px] bg-progressbar rounded-lg">
        <div
          style={{ width: `${covered}%` }}
          className={`h-[100%] ${pillDecoration} rounded-lg`}
        />
      </div>
    );
  };

  const onSearchDomain = (event: React.FormEvent<HTMLInputElement>) => {
    setSearchInput(event.currentTarget.value);
  };

  return (
    <>
      {domainModal && (
        <DomainModal
          domain={domainModal}
          getStatus={getStatus}
          handleCloseClick={() => {
            setDomainModal(null);
          }}
        />
      )}
      {deleteDomainModal && (
        <DeleteDomainModal
          handleCloseClick={() => setdeleteDomainModal(null)}
          handleDelete={handleDelete}
          domain={deleteDomainModal}
        />
      )}
      <div className="w-full max-w-[900px] mx-auto grow">
        <div className="flex gap-2 md:gap-4 mb-6 px-4">
          <div className="h-[100px] w-full border border-metal-800 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.1)] px-4 py-2">
            <div className="text-tableHeaderText font-[600] text-[0.75rem] mt-2 flex justify-start">
              Safe
            </div>
            <div className="font-[400] text-[1.5rem] mt-2 flex justify-start">
              {safeCount}
            </div>
          </div>
          <div className="h-[100px] w-full border border-tableHeaderText-800 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.1)] px-4 py-2">
            <div className="text-tableHeaderText font-[600] text-[0.75rem] mt-2 flex justify-start">
              Alert
            </div>
            <div className="font-[400] text-[1.5rem] mt-2 flex justify-start">
              {alertCount}
            </div>
          </div>
          <div className="h-[100px] w-full border border-metal-800 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.1)] px-4 py-2">
            <div className="text-tableHeaderText font-[600] text-[0.75rem] mt-2 flex justify-start">
              Expired
            </div>
            <div className="font-[400] text-[1.5rem] mt-2 flex justify-start">
              {expiredCount}
            </div>
          </div>
        </div>
        <div className="px-4 flex justify-start items-center gap-2 md:gap-4 mb-6 w-full">
          <div className="w-full relative">
            <input
              type="text"
              placeholder="Search"
              className="border border-metal-800 rounded-md h-[40px] w-full text-sm pl-8 p-2"
              onChange={onSearchDomain}
              value={searchInput}
            />
            <SearchIcon
              fontSize="small"
              className="absolute left-2 top-1/2 -translate-y-1/2 text-tableHeaderText"
            />
          </div>
          <div className="w-full hidden md:block"></div>
          <div className="w-full hidden md:block"></div>
        </div>
        <div className="bg-white rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.16)] flex flex-col mb-4">
          <div className="rounded-t-lg text-tableHeaderText flex flex-row w-[100%] border border-metal-800 bg-tableHeader h-[45px]">
            <div
              className={`py-2 px-4 w-[25%] flex justify-start items-center cursor-pointer font-[600] text-[0.75rem]`}
              key={'Domain'}
            >
              Domain
            </div>
            <div
              className={`py-2 px-4 w-[12%] flex justify-start items-center cursor-pointer font-[600] text-[0.75rem]`}
              key={'Status'}
            >
              Status
            </div>
            <div
              className={`py-2 px-4 w-[18%] flex justify-start items-center cursor-pointer font-[600] text-[0.75rem]`}
              key={'Issue Date'}
            >
              Issue Date
            </div>
            <div
              className={`py-2 px-4 w-[20%] flex justify-start items-center cursor-pointer font-[600] text-[0.75rem]`}
              key={'Expiry Date'}
              onClick={() =>
                setSortDomains((status) => {
                  const newStatus =
                    status === '' || status === 'desc' ? 'asc' : 'desc';
                  setDomainView(
                    newStatus === 'desc'
                      ? [...domains].sort(
                          (a, b) =>
                            new Date(a.expiry).getTime() -
                            new Date(b.expiry).getTime(),
                        )
                      : [...domains].sort(
                          (a, b) =>
                            new Date(b.expiry).getTime() -
                            new Date(a.expiry).getTime(),
                        ),
                  );
                  return newStatus;
                })
              }
            >
              Expiry Date
              {sortDomains ? (
                sortDomains === 'asc' ? (
                  <ArrowDownwardIcon className="ml-1" fontSize="small" />
                ) : (
                  <ArrowUpwardIcon className="ml-1" fontSize="small" />
                )
              ) : null}
            </div>
            <div
              className={`py-2 px-4 w-[25%] flex justify-start items-center cursor-pointer font-[600] text-[0.75rem]`}
              key={'Days to expiry'}
            >
              Days to expiry
            </div>
          </div>
          {domainView.map((d) => {
            if (d.name.includes(searchInput)) {
              return (
                <div
                  key={d.name}
                  className="border border-metal-800 hover:shadow-md hover:bg-highlight font-[400] text-sm
                    flex w-[100%] min-h-[64px]"
                  onClick={(e) => {
                    e.preventDefault();
                    setDomainModal(d);
                  }}
                >
                  <div className=" py-2 px-4 w-[25%] flex justify-start items-center">
                    <div className="h-[24px] w-[24px] rounded-full border border-metal-800 bg-progressbar flex justify-center items-center mr-2 md:mr-4">
                      <img
                        src={`https://s2.googleusercontent.com/s2/favicons?domain=${d.name}`}
                        alt="My Image"
                        width={16}
                        height={16}
                        className="rounded-[50%] bg-progressbar"
                      />
                    </div>
                    <div className="flex flex-col font-[500]">
                      <div>{capitalize(d.name.split('.')[0])}</div>
                      <div className="text-xs text-tableHeaderText">
                        {d.name}
                      </div>
                    </div>
                  </div>
                  <div className=" py-2 px-4 w-[12%] flex justify-start items-center">
                    {getStatus(d.daysToAlert, d.expiry, d.issueDate)}
                  </div>
                  <div className=" py-2 px-4 w-[18%] flex justify-start items-center">
                    {formatDate(d.issueDate)}
                  </div>
                  <div className=" py-2 px-4 w-[20%] flex flex-col justify-center font-[500]">
                    {getTotalNumberOfDays(d.expiry, new Date().toISOString()) >
                    0 ? (
                      <div>
                        <b>
                          {`${getTotalNumberOfDays(
                            d.expiry,
                            new Date().toISOString(),
                          )} `}
                        </b>
                        days to expire
                      </div>
                    ) : (
                      <div>Already expired</div>
                    )}
                    <div className="text-xs text-tableHeaderText">
                      {formatDate(d.expiry)}
                    </div>
                  </div>
                  <div className="py-2 px-4 w-[25%] flex justify-center items-center">
                    {showProgress(d.expiry, d.issueDate, d.daysToAlert)}
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setdeleteDomainModal(d);
                      }}
                    >
                      <Image
                        src="/images/delete.svg"
                        alt="Delete"
                        width={20}
                        height={20}
                        className="ml-4 cursor-pointer"
                      />
                    </button>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </>
  );
};

export default ShowDomains;
