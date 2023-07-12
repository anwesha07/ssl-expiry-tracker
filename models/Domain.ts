import mongoose, { Document, Schema } from 'mongoose';

export interface IDomain extends Document {
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
});

const Domain =
  mongoose.models.Domain || mongoose.model<IDomain>('Domain', domainSchema);

export const saveDomain = async (domainDetails: IDomain) => {
  const result: mongoose.Model<IDomain> = await Domain.create(domainDetails);
  return result;
};

export const findDomainByName = async (
  name: string,
): Promise<mongoose.Model<IDomain>> => {
  const result = await Domain.findOne({ name });
  return result;
};

export const fetchDomains = (): Promise<IDomain[]> => {
  return Domain.find().lean();
};

export const deleteDomainById = (id: string): Promise<IDomain | null> =>
  Domain.findByIdAndDelete(id);
