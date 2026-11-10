const authKeys = [
  "access_token",
  "refresh_token",
  "user_role",
  "user_name",
  "user_id",
  "role_config",
  "manager_token",
  "manager_refresh",
  "manager_user",
  "impersonating",
  "impersonated_name",
  "impersonated_id",
];

export function getAuthStorage() {
  return sessionStorage.getItem("invitation_session") === "true" ? sessionStorage : localStorage;
}

export function clearAuth() {
  const storage = getAuthStorage();
  authKeys.forEach((key) => storage.removeItem(key));
}

export function beginInvitationSession() {
  sessionStorage.setItem("invitation_session", "true");
  clearAuth();
}
