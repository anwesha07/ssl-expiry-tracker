import mongoose, { Document, Schema } from 'mongoose';

export interface IDomain extends Document {
  userId: string;
  name: string;
  expiry: Date;
  issueDate: Date;
  daysToAlert: number;
}

const domainSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
  issueDate: {
    type: Date,
    required: true,
  },
  daysToAlert: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

const Domain =
  mongoose.models.Domain || mongoose.model<IDomain>('Domain', domainSchema);

export const saveDomain = async (domainDetails: IDomain) => {
  const result: mongoose.Model<IDomain> = await Domain.create(domainDetails);
  return result;
};

export const findDomainByNameAndUserId = async (
  name: string,
  userId: string,
): Promise<mongoose.Model<IDomain>> => {
  const result = await Domain.findOne({ name, userId });
  return result;
};

export const fetchDomainsByUserId = (id: string): Promise<IDomain[] | null> => {
  return Domain.find({ userId: id }).lean();
};

export const getDomainById = (id: string): Promise<IDomain | null> =>
  Domain.findById(id);
export const deleteDomainById = (id: string): Promise<IDomain | null> =>
  Domain.findByIdAndDelete(id);
