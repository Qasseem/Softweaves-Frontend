export interface ActionsInterface {
  name?: string;
  icon?: string;
  permission?: string;
  customPermission?: (row?: {}) => boolean;
  isDelete?: boolean;
  isBlock?: boolean;
  isEdit?: boolean;
  isDetails?: boolean;
  call?: (row?: {}) => any;
  actionName?: string;
  showAction?: boolean;
  type?: ActionsTypeEnum;
  uploadFileData?: UploadFileInterface;
}

export interface ViewCustomPermission {
  customPermission?: (row?: {}) => boolean;
}

export interface ActionListInterface extends Array<ActionsInterface> {}
export interface ViewCustomPermission {}

export enum ActionsTypeEnum {
  File = 'file',
  Link = 'link',
  Button = 'button',
}

export interface UploadFileInterface {
  header: string;
  templateName: string;
  url: string;
}
