export const isAdmin = (profile) => profile.role === 'admin'

export const isManager = (profile) => profile.role === 'manager'

export const isUser = (profile) => profile.role === 'user'

export const canManageUsers = (profile) => isAdmin(profile) || isManager(profile)
