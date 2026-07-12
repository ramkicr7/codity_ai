import { useState, useMemo, useCallback, memo } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
    LayoutDashboard,
    FolderKanban,
    ListOrdered,
    Briefcase,
    Cpu,
    BarChart3,
    Settings,
    User,
    LogOut,
    Menu,
    X,
    Search,
    Bell,
    ChevronDown,
    Sparkles
} from "lucide-react";

import { useAuth } from "../components/auth/AuthContext";


const NAV_ITEMS = [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, end: true },
    { label: "Projects", to: "/projects", icon: FolderKanban },
    { label: "Queues", to: "/queues", icon: ListOrdered },
    { label: "Jobs", to: "/jobs", icon: Briefcase },
    { label: "Workers", to: "/workers", icon: Cpu },
    { label: "Analytics", to: "/analytics", icon: BarChart3 },
    { label: "Settings", to: "/settings", icon: Settings }
];
const SIDEBAR_WIDTH_EXPANDED = 280;
const SIDEBAR_WIDTH_COLLAPSED = 84;


const usePageTitle = () => {
    const location = useLocation();

    return useMemo(() => {
        const activeItem = NAV_ITEMS.find((item) =>
            item.end
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to)
        );

        return activeItem?.label ?? "Dashboard";
    }, [location.pathname]);
};


const SidebarLink = memo(function SidebarLink({ item, collapsed, onNavigate }) {
    const Icon = item.icon;

    return (
        <NavLink
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
                `
                group relative flex items-center gap-3 rounded-2xl px-3.5 py-2.5
                text-sm font-medium transition-all duration-200
                outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60
                ${
                    isActive
                        ? "bg-white/10 text-white shadow-[0_0_24px_rgba(124,58,237,0.25)]"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                }
                `
            }
        >
            {({ isActive }) => (
                <>
                    {isActive && (
                        <motion.span
                            layoutId="sidebar-active-indicator"
                            className="absolute left-0 h-5 w-1 rounded-full bg-gradient-to-b from-violet-500 to-blue-500"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                    )}

                    <Icon
                        size={19}
                        className={`shrink-0 transition-transform duration-200 ${
                            isActive ? "text-violet-400" : "group-hover:scale-110"
                        }`}
                    />

                    {!collapsed && <span className="truncate">{item.label}</span>}
                </>
            )}
        </NavLink>
    );
});


function SidebarContent({ collapsed, onNavigate, onLogout }) {
    return (
        <div className="flex h-full flex-col">
            {/* Brand */}
            <div
                className={`flex items-center gap-2.5 px-5 py-6 ${
                    collapsed ? "justify-center px-0" : ""
                }`}
            >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-[0_0_20px_rgba(124,58,237,0.45)]">
                    <Sparkles size={18} className="text-white" />
                </div>

                {!collapsed && (
                    <span className="text-lg font-bold tracking-tight text-white">
                        Codity AI
                    </span>
                )}
            </div>

            {/* Navigation */}
            <nav
                aria-label="Primary"
                className="flex-1 space-y-1 overflow-y-auto px-3 py-2"
            >
                {NAV_ITEMS.map((item) => (
                    <SidebarLink
                        key={item.to}
                        item={item}
                        collapsed={collapsed}
                        onNavigate={onNavigate}
                    />
                ))}
            </nav>

            {/* Footer actions */}
            <div className="space-y-1 border-t border-white/10 px-3 py-4">
                <NavLink
                    to="/profile"
                    onClick={onNavigate}
                    className={({ isActive }) =>
                        `flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-violet-500/60 ${
                            isActive
                                ? "bg-white/10 text-white"
                                : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                        }`
                    }
                >
                    <User size={19} className="shrink-0" />
                    {!collapsed && <span>Profile</span>}
                </NavLink>

                <button
                    type="button"
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-red-400 outline-none transition-all duration-200 hover:bg-red-500/10 focus-visible:ring-2 focus-visible:ring-red-500/60"
                >
                    <LogOut size={19} className="shrink-0" />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
}

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const pageTitle = usePageTitle();

    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const closeMobileDrawer = useCallback(() => setIsMobileDrawerOpen(false), []);
    const toggleMobileDrawer = useCallback(
        () => setIsMobileDrawerOpen((prev) => !prev),
        []
    );
    const toggleCollapsed = useCallback(
        () => setIsCollapsed((prev) => !prev),
        []
    );
    const toggleProfileMenu = useCallback(
        () => setIsProfileMenuOpen((prev) => !prev),
        []
    );

    const handleLogout = useCallback(async () => {
        setIsProfileMenuOpen(false);
        setIsMobileDrawerOpen(false);
        await logout();
    }, [logout]);

    const displayName = useMemo(() => {
        if (!user) return "";
        return user.first_name
            ? `${user.first_name} ${user.last_name ?? ""}`.trim()
            : user.username ?? user.email;
    }, [user]);

    const initials = useMemo(() => {
        if (!displayName) return "?";
        return displayName
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0].toUpperCase())
            .join("");
    }, [displayName]);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#030712] text-slate-100">
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isCollapsed
                        ? SIDEBAR_WIDTH_COLLAPSED
                        : SIDEBAR_WIDTH_EXPANDED
                }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="relative hidden shrink-0 border-r border-white/10 bg-white/5 backdrop-blur-xl lg:block"
            >
                <SidebarContent
                    collapsed={isCollapsed}
                    onNavigate={() => {}}
                    onLogout={handleLogout}
                />

                <button
                    type="button"
                    onClick={toggleCollapsed}
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    className="absolute -right-3 top-8 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#0b0f1a] text-slate-400 outline-none transition-all duration-200 hover:text-white focus-visible:ring-2 focus-visible:ring-violet-500/60"
                >
                    <ChevronDown
                        size={14}
                        className={`transition-transform duration-300 ${
                            isCollapsed ? "-rotate-90" : "rotate-90"
                        }`}
                    />
                </button>
            </motion.aside>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileDrawerOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={closeMobileDrawer}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                            aria-hidden="true"
                        />

                        <motion.aside
                            initial={{ x: -SIDEBAR_WIDTH_EXPANDED }}
                            animate={{ x: 0 }}
                            exit={{ x: -SIDEBAR_WIDTH_EXPANDED }}
                            transition={{ type: "spring", stiffness: 320, damping: 34 }}
                            className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-white/10 bg-[#050914]/95 backdrop-blur-xl lg:hidden"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Sidebar navigation"
                        >
                            <button
                                type="button"
                                onClick={closeMobileDrawer}
                                aria-label="Close sidebar"
                                className="absolute right-3 top-6 flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-violet-500/60"
                            >
                                <X size={18} />
                            </button>

                            <SidebarContent
                                collapsed={false}
                                onNavigate={closeMobileDrawer}
                                onLogout={handleLogout}
                            />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main column */}
            <div className="flex min-w-0 flex-1 flex-col">
                {/* Top Navbar */}
                <motion.header
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="sticky top-0 z-30 flex items-center gap-4 border-b border-white/10 bg-[#030712]/80 px-4 py-3.5 backdrop-blur-xl sm:px-6"
                >
                    <button
                        type="button"
                        onClick={toggleMobileDrawer}
                        aria-label="Open sidebar"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-violet-500/60 lg:hidden"
                    >
                        <Menu size={18} />
                    </button>

                    <h1 className="hidden shrink-0 text-lg font-semibold tracking-tight text-white sm:block">
                        {pageTitle}
                    </h1>

                    {/* Search */}
                    <div className="relative ml-0 hidden flex-1 max-w-md sm:block lg:ml-4">
                        <Search
                            size={16}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                        />
                        <input
                            type="search"
                            placeholder="Search jobs, workers, queues..."
                            aria-label="Search"
                            className="w-full rounded-2xl border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-violet-500/60 focus:bg-white/10"
                        />
                    </div>

                    <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
                        <button
                            type="button"
                            aria-label="Notifications"
                            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-violet-500/60"
                        >
                            <Bell size={17} />
                            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-500" />
                        </button>

                        {/* Profile menu */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={toggleProfileMenu}
                                aria-haspopup="menu"
                                aria-expanded={isProfileMenuOpen}
                                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-2.5 outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-violet-500/60"
                            >
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 text-xs font-semibold text-white">
                                    {initials}
                                </span>

                                <span className="hidden max-w-[120px] truncate text-sm font-medium text-slate-200 md:block">
                                    {displayName}
                                </span>

                                <ChevronDown
                                    size={14}
                                    className={`hidden text-slate-500 transition-transform duration-200 md:block ${
                                        isProfileMenuOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            <AnimatePresence>
                                {isProfileMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-30"
                                            onClick={() => setIsProfileMenuOpen(false)}
                                            aria-hidden="true"
                                        />

                                        <motion.div
                                            initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                            transition={{ duration: 0.15 }}
                                            role="menu"
                                            className="absolute right-0 z-40 mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f1a]/95 py-1.5 shadow-2xl backdrop-blur-xl"
                                        >
                                            <div className="border-b border-white/10 px-3.5 py-2.5">
                                                <p className="truncate text-sm font-medium text-white">
                                                    {displayName}
                                                </p>
                                                <p className="truncate text-xs text-slate-500">
                                                    {user?.email}
                                                </p>
                                            </div>

                                            <NavLink
                                                to="/dashboard/profile"
                                                role="menuitem"
                                                onClick={() => setIsProfileMenuOpen(false)}
                                                className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-slate-300 outline-none transition-colors hover:bg-white/5 hover:text-white focus-visible:bg-white/5"
                                            >
                                                <User size={16} />
                                                Profile
                                            </NavLink>

                                            <NavLink
                                                to="/settings"
                                                role="menuitem"
                                                onClick={() => setIsProfileMenuOpen(false)}
                                                className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-slate-300 outline-none transition-colors hover:bg-white/5 hover:text-white focus-visible:bg-white/5"
                                            >
                                                <Settings size={16} />
                                                Settings
                                            </NavLink>

                                            <button
                                                type="button"
                                                role="menuitem"
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-400 outline-none transition-colors hover:bg-red-500/10 focus-visible:bg-red-500/10"
                                            >
                                                <LogOut size={16} />
                                                Logout
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
                    <Outlet />
                </main>

                {/* Footer */}
                <footer className="border-t border-white/10 px-4 py-3 text-center text-xs text-slate-500 sm:px-6">
                    Codity AI &middot; v1.0.0 &middot; &copy; 2026 Codity AI. All rights reserved.
                </footer>
            </div>
        </div>
    );
}