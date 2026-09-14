export interface VTTechTicket {
  TicketID: number;
  TicketName: string;
  Phone: string;
  SourceName: string;
  SourceDetailName?: string;
  StatusName: string;
  StatusDetailColor?: string;
  StatusColor?: string;
  StatusID?: number;
  CustID?: number;
  CustCode?: string;
  Content?: string;
  ContentLast?: string;
  ExecutedDate?: string;
  StatusCall?: number;
  IsBook?: number;
  AppBranch?: string;
  AppDateFrom?: string;
  TypeStatusScheduleID?: number;
  Area?: string;
  TimeSlot?: string;
  Symbol?: string;
  Campaign?: string;
  IsExecuted?: number;
  Gclid?: string;
  Gender_ID?: number;
  CityName?: string;
  DistrictName?: string;
  Created: string;
  CreatedBy?: number;
  devideDate?: string;
  devideBy?: number;
  TypeName?: string | null;
  ServiceCare?: string;
}

export interface VTTechConfig {
  baseUrl: string;
  cookie: string;
  webToken: string;
  secretKey: string;
  xsrfToken: string;
  antiforgeryCookie?: string;
  sessionCookie?: string;
  userID: number;
  autoSyncIntervalMinutes?: number;
  lastSyncTime?: string;
}

export interface VTTechSyncResponse {
  success: boolean;
  total: number;
  cachedAt: string;
  data: VTTechTicket[];
  error?: string;
}
