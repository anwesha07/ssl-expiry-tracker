import cron from 'node-cron';
import moment from 'moment';
import { IDomain, fetchDomains } from './models/Domain';

const getTotalNumberOfDays = (expiry: Date, issueDate: Date) => {
  // Calculate the time difference in milliseconds
  const totalTimeDifference =
    new Date(expiry).getTime() - new Date(issueDate).getTime();
  // Convert the time difference to days
  const totalNumberOfDays = Math.ceil(
    totalTimeDifference / (1000 * 60 * 60 * 24),
  );
  return totalNumberOfDays;
};

const getExpiredDays = (issueDate: Date) => {
  const currentDate = new Date();
  // Calculate the time difference in milliseconds
  const expiredTimeDiff = currentDate.getTime() - new Date(issueDate).getTime();
  // Convert the time difference to days
  return Math.ceil(expiredTimeDiff / (1000 * 60 * 60 * 24));
};

const checkIsAlert = (domain: IDomain): boolean => {
  const totalNumberOfDays = getTotalNumberOfDays(
    domain.expiry,
    domain.issueDate,
  );
  const totalNumberOfExpiredDays = getExpiredDays(domain.issueDate);
  const daysRemaining = totalNumberOfDays - totalNumberOfExpiredDays;
  return daysRemaining <= domain.daysToAlert;
};

const checkAlertDomains = async () => {
  try {
    const domains = await fetchDomains();

    const alertDomains = domains.filter((domain: IDomain) =>
      checkIsAlert(domain),
    );

    console.log('Alert Domains:');
    alertDomains.forEach((domain: IDomain) => {
      console.log(`Domain Name: ${domain.name}`);
      console.log(
        `Days to Expiry: ${moment(domain.expiry).diff(moment(), 'days')}`,
      );
      console.log('------------');
    });
  } catch (error) {
    console.error('Error occurred while checking alert domains:', error);
  }
};

cron.schedule('0 0 * * *', checkAlertDomains); // Run the cron job daily at midnight

export default checkAlertDomains;
