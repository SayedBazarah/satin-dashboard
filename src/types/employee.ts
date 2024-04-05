
import { CustomFile } from 'src/components/upload';

export type IEmployeeTableFilterValue = string | string[];

export type IEmployeeTableFilters = {
  name: string;
  role: string[];
  status: string;
};

export type IRoleTableFilters = {
  label: string;
};

// ----------------------------------------------------------------------

export type IEmployeeSocialLink = {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
};

export type IEmployeeProfileCover = {
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
};

export type IEmployeeProfile = {
  id: string;
  role: string;
  quote: string;
  email: string;
  school: string;
  country: string;
  company: string;
  totalFollowers: number;
  totalFollowing: number;
  socialLinks: IEmployeeSocialLink;
};

export type IEmployeeProfileFollower = {
  id: string;
  name: string;
  country: string;
  avatarUrl: string;
};

export type IEmployeeProfileGallery = {
  id: string;
  title: string;
  imageUrl: string;
  postedAt: Date;
};

export type IEmployeeProfileFriend = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type IEmployeeProfilePost = {
  id: string;
  media: string;
  message: string;
  createdAt: Date;
  personLikes: {
    name: string;
    avatarUrl: string;
  }[];
  comments: {
    id: string;
    message: string;
    createdAt: Date;
    author: {
      id: string;
      name: string;
      avatarUrl: string;
    };
  }[];
};

export type IEmployeeCard = {
  id: string;
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
  status: boolean;
};

export type IEmployeeItem = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isOnline?: boolean;
  profileImage?: string;
  state?: string;
  area?: string;
  branch?: string;
  role: IRole;
};
export type QuickUpdateEmployeeItem = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: IRole;
};

export type IBranch = {
  code: string;
  label: string;
  phone: string;
};

export type IRole = {
  _id: string;
  employees?: number;
  label: string;
  permissions: string[];
};

export type IEmployeeAccount = {
  email: string;
  isPublic: boolean;
  displayName: string;
  city: string | null;
  state: string | null;
  about: string | null;
  country: string | null;
  address: string | null;
  zipCode: string | null;
  phoneNumber: string | null;
  photoURL: CustomFile | string | null;
};

export type IEmployeeAccountBillingHistory = {
  id: string;
  price: number;
  createdAt: Date;
  invoiceNumber: string;
};

export type IEmployeeAccountChangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type IEmployeeFilterValue = string | string[] | number | number[];
