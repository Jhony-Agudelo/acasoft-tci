import { User, UserRole, UserStatus } from './db-schema';

/**
 * Validates if a user is allowed to initiate or maintain a session.
 * Crucial Requirement: Strict rejection of INACTIVE users.
 */
export function validateUserStatus(user: User): { eligible: boolean; error?: string } {
  if (!user) {
    return { eligible: false, error: 'Usuario no encontrado.' };
  }

  if (user.status === UserStatus.INACTIVE) {
    return {
      eligible: false,
      error: 'Acceso Denegado: Su cuenta está INACTIVA. Comuníquese con la Dirección.',
    };
  }

  if (user.status !== UserStatus.ACTIVE) {
    return { eligible: false, error: 'Acceso Denegado: Estado de cuenta inválido.' };
  }

  return { eligible: true };
}

/**
 * Authorizes access based on user role and permitted roles list.
 */
export function authorizeRole(user: User, allowedRoles: UserRole[]): boolean {
  if (!user || user.status !== UserStatus.ACTIVE) return false;
  return allowedRoles.includes(user.role);
}

/**
 * Simulated Middleware function for Route Protection.
 * It maps paths/features to required roles and evaluates permissions.
 */
export function getRequiredRolesForPath(path: string): UserRole[] {
  // Define strict target-role matrices
  if (path.startsWith('/director') || path.includes('budget') || path.includes('settings/global')) {
    return [UserRole.DIRECTOR];
  }
  
  if (path.startsWith('/admin') || path.includes('enroll/toggle') || path.includes('db/write')) {
    return [UserRole.DIRECTOR, UserRole.ADMIN];
  }

  if (path.startsWith('/teacher') || path.includes('grades') || path.includes('attendance')) {
    return [UserRole.DIRECTOR, UserRole.ADMIN, UserRole.TEACHER];
  }

  // Fallback to all roles for general authenticated space
  return [UserRole.DIRECTOR, UserRole.ADMIN, UserRole.TEACHER];
}

/**
 * Evaluates route security middleware check.
 */
export function simulateMiddlewareCheck(
  user: User | null,
  path: string
): { authorized: boolean; reason: string } {
  if (!user) {
    return { authorized: false, reason: 'No Autenticado: Sesión no encontrada.' };
  }

  // 1. Double check status safety in middleware
  const statusCheck = validateUserStatus(user);
  if (!statusCheck.eligible) {
    return { authorized: false, reason: statusCheck.error || 'Usuario Inactivo.' };
  }

  // 2. Identify required roles for this route
  const requiredRoles = getRequiredRolesForPath(path);
  const hasAccess = authorizeRole(user, requiredRoles);

  if (!hasAccess) {
    return {
      authorized: false,
      reason: `No Autorizado: Acceso denegado a '${path}'. Requiere rol de: [${requiredRoles.join(', ')}]. Su rol actual es [${user.role}].`,
    };
  }

  return { authorized: true, reason: 'Autorizado' };
}
