export interface SubPaymentsDto {
  id: number;
  is_promote: boolean;
  is_special_advisor: boolean | null;
  title: string;
  status: Status;
  description: null;
  price: number;
  duration: number;
  created_at: Date;
  type: string;
  ref_id: string;
}

export interface Status {
  id: number;
  title: string;
  hex: string;
}
