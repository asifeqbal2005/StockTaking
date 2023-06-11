

export class EntityPermission {
  entityPermissionId: number;
  entityName: string;
  permission: string;
  isCreate: boolean;
  isRead: boolean;
  isUpdate: boolean;
  isDeleted: boolean;
  isDelete: boolean;
}
export class EntityPermissionFilter {

  entityNameFilter: string;
  permissionFilter: string;
  isCreateFilter: boolean;
  isReadFilter: boolean;
  isUpdateFilter: boolean;
  isDeletedFilter: boolean;
  fromFilter: Date;
  toFilter: Date;
}
