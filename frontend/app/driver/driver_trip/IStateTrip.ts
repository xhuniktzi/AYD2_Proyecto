
export interface ICancelTripRes {
    msg: string;
  }
  
  export interface IReportIssueReq {
    
    description: string;
  }
  
  export interface IReportIssueRes {
    msg: string;
    report_id: number;
    created_at: string;
  }