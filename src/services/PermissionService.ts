export default class PermissionService {
  private static KEY = "user-permissions";

  public static save(permissions: string[]) {
    const grantedPermissions = permissions.join("~");
    localStorage.setItem(this.KEY, grantedPermissions);
  }

  public static hasPermission(permission: string): boolean {
    const localSaved = localStorage.getItem(this.KEY);
    if (!localSaved) return false;

    const items = localSaved.split("~");
    const found = items.find((x) => x == permission);
    if (!found) return false;

    return true;
  }
}
