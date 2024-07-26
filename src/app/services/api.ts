export const APIURL = {
  login: '/Security/Login',
  menuLinks: '/Security/Menu',
  register: '/Security/RegisterCustomerUser',
  getAllCities: '/City/GetAllCities',

  Dashboard: {
    openTickets: '/Dashboard/OpenTickets',
    ticketStats: '/Dashboard/TicketStatistics',
    performance: '/Dashboard/Performance',
    export: '/Dashboard/ExportPerformance',
  },

  customerProfile: {
    customerTypeDropdown: '/CustomerType/GetCustomerTypeDropDown',
    getAllActivities: '/Activity/GetAllActivitiesFromDolphin',
    GetActivityDropDown: '/Activity/GetActivityDropDown',
    GetCustomerDetails: '/Customer/GetCustomerDetails',
    checkCustomerName: '/PreCustomer/CheckCustomerName',
    CheckCustomerContactEmail: '/Customer/CheckCustomerContactEmail',
    CheckCustomerContactPhone: '/Customer/CheckCustomerContactPhone',
    GetCityDetails: '/City/GetCityDetails',
    SubmitRequest: '/Customer/SubmitRequest',
    checkCommercialRecord: '/Customer/CheckCommercialRecord',
    CheckTaxiationNumber: '/Customer/CheckTaxiationNumber',
  },
  searchFilters: {
    getUserSearchFilters: '/SearchFilter/GetUserSearchFilters',
    pinFilter: '/SearchFilter/PinFilter',
    unPinFilter: '/SearchFilter/UnPinFilter',
    restoreFilters: '/SearchFilter/RestoreFilters',
  },
  forgotPassword: '/CustomerSecurity/ForgotPassword',
  Merchant: {
    Add: '/Merchant/SaveMerchant',
    GetOne: '/Merchant/GetMerchantById',
    Export: '/Merchant/ExportLeadGrid',
    GetGrid: '/Merchant/GetMerchantGrid',
    GetAllMerchantCategories: '/Merchant/GetAllMerchantCategories',
    Favorite: '/Merchant/AddFavorite',
    GetFavoriteMerchantGrid: '/Merchant/GetFavoriteMerchantGrid',
    ImportMerchants: '/Merchant/ImportMerchants',
    GetAllRegions: '/Merchant/GetAllRegions',
    GetAllCities: '/Merchant/GetAllCities',
    GetAllZones: '/Merchant/GetAllZones',
    Block: '/Merchant/Block',
  },

  Terminal: {
    Add: '/Terminal/SaveTerminal',
    GetOne: '/Terminal/GetTerminalById',
    Export: '/Terminal/ExportLeadGrid',
    GetGrid: '/Terminal/GetTerminalGrid',
    Favorite: '/Terminal/AddFavorite',
    Block: '/Terminal/Block',
    GetFavoriteTerminalGrid: '/Terminal/GetFavoriteTerminalGrid',
    ImportTerminals: '/Terminal/ImportTerminals',
    GetAllRegions: '/Terminal/GetAllRegions',
    GetAllRegionsFilter: '/Terminal/GetAllRegionsFilter',
    GetAllCities: '/Terminal/GetAllCities',
    GetAllCitiesFilter: '/Terminal/GetAllCitiesFilter',
    GetAllZones: '/Terminal/GetAllZones',
    GetAllErrandChannels: '/Terminal/GetAllErrandChannels',
    GetAllPOSTypes: '/Terminal/GetAllPOSTypes',
    GetAllMechantDropDown: '/Terminal/GetAllMechantDropDown',
    GetAllTerminalsByMerchantId: '/Terminal/GetAllTerminalByMerchantId/',
  },
  Ticket: {
    Save: '/Ticket/Save',
    GetOne: '/Ticket/GetById/',
    Export: '/Ticket/ExportGrid',
    GetGrid: '/Ticket/GetGrid',
    Block: '/Ticket/Block',
    ImportTickets: '/Ticket/ImportTickets',
    GetTicketCategory: '/Ticket/GetTicketCategory',
    GetTicketCategoryFilter: '/Ticket/GetTicketCategoryFilter/',
    GetCategoryErrandsTypes: '/Ticket/GetCategoryErrandTypes/',
    GetZoneAgents: '/Ticket/GetZoneAgents/',
    GetTerminalDetails: '/Ticket/GetTerminalDetails/',
    GetTicketByStatus: '/Ticket/GetTicketByStatus',
    GoToCustomer: '/Ticket/GoToCustomer',
    GetAllFeedbacks: '/Ticket/GetAllFeedbacks',
    GetAllTicketsStatuses: '/Ticket/GetAllTicketStatus',
    TicketStart: '/Ticket/Start',
    TicketResume: '/Ticket/Resume',
    TicketPostpone: '/Ticket/Postpone',
    TicketDeploymentStatus: '/Ticket/DeploymentStatus/',
    TicketStartInstall: '/Ticket/StartInstall',
  },
  Users: {
    GetAllUsersDropDown: '/User/GetAllUsersDropDown',
    getUsersGrid: '/User/GetAllUsersGrid',
    getAllManagerDropdown: '/User/GetAllManagerDropDown',
    getAllUsersTypeDropdown: '/User/GetAllUserTypeDropDown',
    getAllUsersTypeFilter: '/User/GetUserTypeFilterDropDown/',
    getUsersByUserType: '/User/GetUsersByTypeDropDown/',
    checkUsernameExistence: '/User/CheckExistenceUsername',
    geUserById: '/User/GetUser',
    deleteUser: '/User/Delete/',
    blockUser: '/User/Block',
    updateUser: '/User/UpdateUser',
    addUser: '/User/AddUser',
    exportUser: '/User/ExportUser',
    changePassword: '/User/ChangePassword',
  },

  Role: {
    getAll: '/Role/GetAllRolesGrid',
    addRole: '/Role/AddRole',
    updateRole: '/Role/UpdateRole',
    deleteRole: '/Role/Delete/',
    getRoleById: '/Role/GetRole',
    getRoleServiceDetails: '/Role/GetRoleServiceDetails',
    blockRole: '/Role/Block',
    getAllRolesDropdown: '/Role/GetAllRolesDropDown',
  },

  AdminActivities: {
    AddMCC: '/AdminActivities/SaveMerchantCategory',
    getMCC: '/AdminActivities/GetMerchantCategoryGrid',
    getOneMCC: '/AdminActivities/GetMerchantCategoryById',
    exportMCC: '/AdminActivities/ExportMerchantCategory',
    importMCC: '/AdminActivities/ImportMerchantCategory',
    blockMCC: '/AdminActivities/BlockMerchantCategory',
    getErrandsChannel: '/AdminActivities/GetErrandChannelGrid',
    AddErrandsChannel: '/AdminActivities/SaveErrandChannel',
    getOneErrandsChannel: '/AdminActivities/GetErrandChannelById',
    exportErrandsChannel: '/AdminActivities/ExportErrandChannel',
    importErrandsChannel: '/AdminActivities/ImportErrandChannel',
    blockErrandsChannel: '/AdminActivities/BlockErrandChannel',
    getPOSType: '/AdminActivities/GetPOSTypeGrid',
    AddPOSType: '/AdminActivities/SavePOSType',
    getOnePOSType: '/AdminActivities/GetPOSTypeById',
    exportPOSType: '/AdminActivities/ExportPOSType',
    importPOSType: '/AdminActivities/ImportPOSType',
    blockPOSType: '/AdminActivities/BlockPOSType',
  },

  ErrandsType: {
    getErrandsType: '/ErrandType/GetErrandTypeGrid',
    addErrandType: '/ErrandType/SaveErrandType',
    getOneErrandType: '/ErrandType/GetById',
    exportErrandType: '/ErrandType/ExportErrandType',
    importErrandType: '/ErrandType/ImportErrandType',
    blockErrandType: '/ErrandType/Block',
  },

  Region: {
    Add: '/Region/Add',
    Update: '/Region/Update',
    GetOne: '/Region/GetById',
    Export: '/Region/ExportGrid',
    Import: '/Region/Import',
    GetGrid: '/Region/GetGrid',
    Block: '/Region/Block',
  },
  City: {
    Add: '/City/Add',
    Update: '/City/Update',
    GetOne: '/City/GetById',
    Export: '/City/ExportGrid',
    GetGrid: '/City/GetGrid',
    Import: '/City/Import',
    Block: '/City/Block',
  },
  Zone: {
    Add: '/Zone/Add',
    Update: '/Zone/Update',
    GetOne: '/Zone/GetById',
    Export: '/Zone/ExportGrid',
    GetGrid: '/Zone/GetGrid',
    Import: '/Zone/Import',
    Block: '/Zone/Block',
  },
};
