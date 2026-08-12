export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  packageSlug?: string;
  message: string;
  source?: string;
  createdAt: string;
};
