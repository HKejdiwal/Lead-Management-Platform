export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Sales';
}

export interface AuthResponse {
  user: UserDto;
  token: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdAt: string;
}

export interface LeadsResponse {
  data: Lead[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
