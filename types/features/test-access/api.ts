export type TestAccessRole = "TEAM_LEAD" | "QA";

export type TestAccessMember = {
  id: number;
  mobile_number: string;
  role: TestAccessRole;
  is_active: boolean;
  created_by_mobile?: string | null;
  revoked_by_mobile?: string | null;
  revoked_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type TestAccessMe = {
  enabled: boolean;
  is_team_lead: boolean;
};

export type CreateTestAccessMember = {
  mobile_number: string;
};

export type UpdateTestAccessMember = {
  id: number;
  is_active: boolean;
};
