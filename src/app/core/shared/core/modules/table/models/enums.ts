export enum HTTPMethods {
  deleteReq = 'deleteReq',
  putReq = 'putReq',
  postReq = 'postReq',
  getHeaderReq = 'getHeaderReq',
  getReq = 'getReq',
  postReqWithUrlHeader = 'postReqWithUrlHeader',
  postReqWithHeaderpostReq = 'postReqWithHeaderpostReq',
  postDolphine = 'postDolphine',
  postReqWithHeader = 'postReqWithHeader',
}

export enum SearchInputTypes {
  text = 'TEXT',
  choice = 'CHOICE',
  select = 'SELECT',
  date = 'DATE',
  range = 'RANGE',
  number = 'NUMBER',
  selectValue = 'SELECTVALUE',
}
export enum ModulesReferencesEnum {
  customers = 146,
  quotations = 133,
  simcards = 117,
  transfersimcard = 156,
  deviceconfiguration = 165,
  devices = 121,
  simcardscontracts = 118,
  warehousesetting = 157,
  devicefirmware = 159,
  shipment = 158,
  transfermodeltype = 162,
}

export enum TicketStatusEnum {
  Assigned = 1,
  AgentOnWay = 2,
  InProgress = 3,
  Blocked = 4,
  Postponed = 5,
  Completed = 6,
}

export enum ServiceCategoryEnum {
  Deployment = 1,
  Visit = 2,
  Cancellation = 3,
  AfterSales = 4,
}

export enum UserTypeEnum {
  SystemAdmin = 1,
  SysytemUser = 2,
  ServiceAgent = 3,
  SalesAgent,
}
