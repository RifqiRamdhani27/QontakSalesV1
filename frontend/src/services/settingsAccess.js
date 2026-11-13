let settingsAccess = { modules: {}, features: {} };

export function setSettingsAccess(access) {
  settingsAccess = access || { modules: {}, features: {} };
}

export function canAccessSettings(module, action = "view") {
  return settingsAccess.modules?.[module]?.[action] === true;
}

export function canAccessSettingsFeature(feature, action = "view") {
  return settingsAccess.features?.[feature]?.[action] === true;
}

export function isSettingsOwner() {
  return settingsAccess.is_owner === true;
}

export function canAccessSettingsTemplate(key, action = "view") {
  return settingsAccess.templates?.[key]?.[action] === true;
}
