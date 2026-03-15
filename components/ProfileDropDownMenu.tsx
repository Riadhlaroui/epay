"use client";

import {
	LogOut,
	Settings,
	User as UserIcon,
	User2,
	MoreVertical,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logOut } from "@/app/services/userService";

export function ProfileDropDownMenu({ isCollapsed }: { isCollapsed: boolean }) {
	const router = useRouter();

	const [showLogoutDialog, setShowLogoutDialog] = useState(false);

	const [user, setUser] = useState({
		FullName: "",
		email: "",
	});

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const data = await getCurrentUser();
				setUser({
					FullName: data.FullName || "",
					email: data.email || "",
				});
			} catch (err) {
				console.error("Failed to fetch user info:", err);
			}
		};

		fetchUser();
	}, []);

	const handleLogout = () => {
		logOut();
		router.push("/");
		setShowLogoutDialog(false);
	};

	// Helper to get initials
	const initials = user.FullName.split(" ")
		.map((n) => n.charAt(0))
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className={`transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
							isCollapsed
								? "h-9 w-9 p-0 rounded-full flex items-center justify-center"
								: "w-full h-auto p-2 flex items-center shadow-sm gap-3 justify-start border"
						}`}
					>
						{/* Avatar */}
						<div
							className={`relative flex shrink-0 overflow-hidden rounded-full items-center justify-center bg-primary/10 text-primary font-semibold ${
								isCollapsed
									? "h-8 w-8 text-sm"
									: "h-8 w-8 text-sm border border-border"
							}`}
						>
							{initials || <User2 className="h-4 w-4" />}
						</div>

						{!isCollapsed && (
							<div className="flex flex-col min-w-35 items-start text-sm leading-tight">
								<span className="font-semibold truncate w-full">
									{user.FullName}
								</span>
								<span className="text-xs text-muted-foreground truncate w-full">
									{user.email}
								</span>
							</div>
						)}

						{!isCollapsed && (
							<MoreVertical className="ms-auto h-4 w-4 text-muted-foreground/50" />
						)}
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent
					className="min-w-60! rounded-lg"
					side={isCollapsed ? "right" : "bottom"}
					align={isCollapsed ? "end" : "start"}
					sideOffset={8}
				>
					<div className="flex items-center gap-2 p-2">
						<div className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full items-center justify-center bg-muted border border-border">
							<span className="font-medium text-xs">
								{initials || <User2 className="h-4 w-4" />}
							</span>
						</div>
						<div className="flex flex-col space-y-0.5 leading-none">
							<p className="font-semibold text-sm">{user.FullName}</p>
							<p className="text-xs text-muted-foreground truncate w-40">
								{user.email}
							</p>
						</div>
					</div>

					<DropdownMenuSeparator />

					<DropdownMenuGroup>
						<DropdownMenuItem
							onClick={() => router.push("/profile")}
							className="gap-2 cursor-pointer"
						>
							<UserIcon className="size-4 text-muted-foreground" />
							<span>Profile</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => router.push("/settings")}
							className="gap-2 cursor-pointer"
						>
							<Settings className="size-4 text-muted-foreground" />
							<span>Settings</span>
						</DropdownMenuItem>
					</DropdownMenuGroup>

					<DropdownMenuSeparator />

					<DropdownMenuItem
						className="gap-2 cursor-pointer text-destructive focus:text-destructive"
						onClick={() => setShowLogoutDialog(true)}
					>
						<LogOut className="size-4" />
						<span>Logout</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{showLogoutDialog && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 transition-all">
					{/* Added dark:bg-zinc-900 and dark:border-zinc-800 */}
					<div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 max-w-sm w-full space-y-4 text-center border border-zinc-100 dark:border-zinc-800">
						{/* Added dark:text-zinc-100 */}
						<h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
							Confirm Logout
						</h2>

						{/* Added dark:text-zinc-400 */}
						<p className="text-sm text-zinc-600 dark:text-zinc-400">
							Are you sure you want to log out? You will need to log in again to
							access your account.
						</p>

						<div className="flex justify-center gap-4 pt-4">
							<Button
								className="hover:cursor-pointer flex-1 h-10 text-sm dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
								variant="outline"
								onClick={() => setShowLogoutDialog(false)}
							>
								Cancel
							</Button>

							<Button
								className="hover:cursor-pointer flex-1 h-10 text-sm bg-red-600 hover:bg-red-700 text-white"
								variant="destructive"
								onClick={handleLogout}
							>
								Log Out
							</Button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
