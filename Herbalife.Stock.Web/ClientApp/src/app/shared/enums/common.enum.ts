export enum enumYesNo {
  Yes = 1,
  No = 2

}
export enum enumYesNoUnknown {
  Yes = 1,
  No = 2,
  Unknown = 3
}
export enum enumYesNoUnknownBlank {
  Yes = 1,
  No = 2,
  Unknown = 3,
  Blank = 4
}
export enum enumYesNoUnknownBlankTBC {
  Yes = 1,
  No = 2,
  Unknown = 3,
  Blank = 4,
  TBC = 5
}
export enum enumYesNoUnknownTBC {
  Yes = 1,
  No = 2,
  Unknown = 3,
  TBC = 4
}

export enum enumYesNoTBC {
  Yes = 1,
  No = 0,
  // TBC = 3
}

export enum policyType {
  EL = 1,
  TP = 2,
  RMP = 3
}
export enum lineOfBusiness {
  EL = 1,
  TP = 2,
  ME = 3
}
export enum regionCode {
  a = 1,
  b = 2
}
export enum fscsProtected {
  Yes = 1,
  No = 2,
  Part = 3
}
export enum lookupType {
  ClaimType = 1,
  HandlingOrganisation = 2,
  ClaimStatus = 3,
  CreditorStatus = 4,
  RiskType = 5,
  AbuserType = 6,
  AllegationTypes = 7,
  CapeProducts = 8,
  LitigationCauses = 9,
  PaymentTypes = 10
}
export enum creditorStatus {
  Sover = 1,
  Sound = 2,
  Snon = 3,
  SPRT = 4
}


export enum claimType {
  Abuse = 1,
  Asbestosis = 2,
  CummulativeBack = 3,
  LungCancer = 4,
  Mesothelioma = 5,
  NIHL = 6,
  Other = 14,
  PleuralPlaques = 7,
  PleuralThickening = 8,
  RSI = 9,
  Silicosos = 10,
  SocialCareFailureToRemove = 11,
  SocialCareOther = 12,
  VWF = 13,
}

export enum enumAgregatedClaim {
  Yes = 1,
  No = 0
  // TBC = 3
}

export enum enumAggregationLevel {
  Location = 406,
  Perpetrator = 407
}

export enum enumDeceased {
  Yes = 791,
  No = 792
}


export enum enumHandlingOrganization {
  MMI = 1,
  Zurich = 2
}

export enum enumHandlingStatus {
  Allocated = 953,
  Accepted = 954,
  Rejected = 955
}

export enum enumChargingStatus {
  NA = 956,
  Hourlyrate = 404,
  FixedFee = 405
}

export enum enumPaymentRecovery {
  Payment = 973,
  Recovery = 974
}

export enum enumPaymentMethod {
  BACS = 989,
  Cheque = 990
}

export enum enumPaymentType {
  SchemePaymentByCreditor = 975,
  SchemePaymentByMMI = 976,
  AdjustmentEntry = 977,
  ExcessPaymentByCreditor = 978

}

export enum enumPaymentStatus {
  Requested = 991,
  ApprovedStage1 = 992,
  Verified = 993,
  Approved = 994,
  Rejected = 995,
}

export enum enumRecoveryType {
  cancelledCheque = 983
}

export enum enumReportsType {
  newClaims = 1092,
  settledClaims = 1091,
  openClaims = 1090,
}

export enum enumLitigatedType {
  Yes = 1,
  No = 2,
  All = 3,
}

export enum enumPermissions {
  NoAccess = 0,
  Read = 1,
  Add = 2,
  Edit = 3,
  Delete = 4
}
export enum enumAccessOnPage {
  Policy = 1135,
  OutwardPolicy = 1136,
  ClaimDetails = 1140,
  ReserveLoss = 1142,
  ClosingDetails = 1143,
  IncurredHistory = 1144,
  ClaimNotes = 1145,
  AddPolicy = 1148,
  CommutationReport = 1153,
  CrystallisationReport = 1154,
  CedantUltimateReserveReport = 1155,
  ClaimsMovementReport = 1156,
  TriangulationReport = 1157,
  TechnicalLedgers = 1158,
  CashMaintenance = 1159,
  DataSetup = 1160,
  ManageUser = 1161,
  RateOfExchange = 1162,
  IBNR = 1165,
  CatCodes = 1166,
  TVM = 1167,
  NotUsed = 1147,
  Promotion=1168
}
export enum enumApportionmentViewOptions {
  UserDefined = 1,
  FullView = 2,
  SummaryView = 3
}

export enum enumUserRole {
  ClaimsAndFinance = 1048,
  Claims = 1049,
  Finance = 1050,
  OutwardRI = 1051,
  Guest = 1052
}

export enum enumWorkflowPriorityCode {
  P1 = 1471,
  P2 = 1472,
  P3 = 1473,
  P4 = 1474,
  P5 = 1475,
  P3NewClaim = 1476,
  P6 = 1497,
  P7 = 1498

}

export enum enumWorkflowStatus {
  Outstanding = 1478,
  Completed = 1479,
  CompletedStage1 = 1480
}

export enum enumSLAStatus {
  ToBeCompletedToday = 1,
  OutsideSLA = 2,
  InsideSLA = 3,
  Completed = 4
}

export enum enumWorkFlowCategory {
  NewClaim = 1463,
  ExistingClaim = 1477,
  ChaseForLLA = 1481,
  ConfirmDAStatus = 1488,
  ReviewNonDAReferral = 1489,
  ConfirmLitigationStatus = 1494
}

export enum enumDelegatedAuthority {
  Yes = 786,
  No = 787
}

export enum enumUnderQuery {
  Yes = 1,
  No = 0
}

export enum enumBasis {
  LAD = 1363,
  RAD = 1364
}

export enum LedgerType {
  BrokerLedger = 1376,
  CommutationLedger = 1377,
  ReserveLedger = 1378,
  LocLedger = 1379,
  ReinsuranceLedger = 1380
}

export enum ClaimsClosingEntryType {
  Claims = 1387,
  ClaimsRefund = 1388,
  LOC = 1389,
  LOCRefund = 1390,
  Commutation = 1398,
  CommutationRefund = 1399
}


export enum PolicyClaimsDirection {
  Inward = 1347,
  Outward = 1348
}

export enum enumClaimStatus {
  closed = 1169,
  commuted = 1435,
  open=1168,
  declined=1170,
  reopened=1171,
  reclosed=1172
}

export enum enumCashStatus {
  All = 1,
  NotPosted = 2,
  Posted = 3
}
export enum enumOutwardsClosingEntryType {
  FACRecovery = 1410,
  FACRefund = 1411,
  TreatyRecovery = 1412,
  TreatyRefund = 1413,
  XLRecovery = 1414,
  XLRefund = 1415,
  CommutationRecovery = 1416,
  CommutationRefund = 1417,
  QuotaShareRecovery = 1432,
  QuotaShareRefund=1433
}

export enum enumBalanceType {
  Inwards = 1393,
  Outwards = 1394
}

export enum enumOutwardPolicyType {
  FAC = 1395,
  VQS = 1396,
  XLAG = 1397,
  FACXLA = 1400,
  FACXLP = 1401,
  QST = 1402,
  XLST = 1403,
}


export enum enumLedgerItemType {
  CashItem = 1,
  TechnicalItem = 2
}

export enum enumLedgerOpenCloseStatus {
  All = 1,
  Open = 2,
  Closed = 3
}

export enum enumSectionStatus {
  Active = 307,
  Inactive = 308,
  Commuted = 309
}
export enum enumFeedbackType {
  TypeId = 3,
  DepartmentId = 4,
  PriorityId = 5
}






