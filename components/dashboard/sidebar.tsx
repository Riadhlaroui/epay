"use client";

import { cn } from "@/lib/utils";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	ChevronDown,
	LayoutDashboard,
	QrCode,
	Plus,
	User,
	HelpCircle,
	Settings,
} from "lucide-react";
import { ProfileDropDownMenu } from "../ProfileDropDownMenu";

interface DashboardSidebarProps {
	activePage: string;
	setActivePage: (page: string) => void;
}

const navItems = [
	{
		title: "Dashboard",
		icon: LayoutDashboard,
		iconColor: "text-primary",
		key: "dashboard",
	},
	{
		title: "Transactions",
		icon: QrCode,
		iconColor: "text-cyan-500",
		key: "transactions",
	},
	{
		title: "New Transaction",
		icon: Plus,
		iconColor: "text-green-500",
		key: "new-transaction",
	},
	{ title: "Profile", icon: User, iconColor: "text-blue-500", key: "profile" },
	{
		title: "Help & Center",
		icon: HelpCircle,
		iconColor: "text-sky-500",
		key: "help",
	},
	{
		title: "Settings",
		icon: Settings,
		iconColor: "text-muted-foreground",
		key: "settings",
	},
];

export function DashboardSidebar({
	activePage,
	setActivePage,
}: DashboardSidebarProps) {
	return (
		<Sidebar collapsible="offcanvas" className="!border-r-0">
			<SidebarHeader className="px-3 py-4">
				<div className="flex items-center justify-between w-full">
					<DropdownMenu>
						<span className="font-semibold text-sidebar-foreground truncate">
							Epay
						</span>
					</DropdownMenu>
				</div>
			</SidebarHeader>

			<SidebarContent className="px-2">
				<SidebarGroup className="p-0">
					<SidebarGroupContent>
						<SidebarMenu>
							{navItems.map((item) => (
								<SidebarMenuItem key={item.key}>
									<SidebarMenuButton
										asChild
										isActive={activePage === item.key}
										className="h-9"
									>
										<button
											onClick={() => setActivePage(item.key)}
											className="flex items-center w-full gap-2"
										>
											<item.icon
												className={cn("size-4 shrink-0", item.iconColor)}
											/>
											<span className="text-sm">{item.title}</span>
										</button>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="px-2 pb-3 minh-15 group-data-[collapsible=icon]:hidden">
				<ProfileDropDownMenu isCollapsed={false} />
			</SidebarFooter>
		</Sidebar>
	);
}
