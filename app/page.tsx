"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { SidebarProvider } from "@/components/ui/sidebar";

import { DashboardContent } from "@/components/dashboard/content";
import TransactionsPage from "@/components/transactions/page";
import NewTransactionPage from "@/components/new-transaction/page";
import ProfilePage from "@/components/profile/page";

export default function DashboardPage() {
	const [activePage, setActivePage] = useState("dashboard");

	const renderContent = () => {
		switch (activePage) {
			case "dashboard":
				return <DashboardContent />;
			case "transactions":
				return <TransactionsPage />;
			case "new-transaction":
				return <NewTransactionPage />;
			case "profile":
				return <ProfilePage />;
			default:
				return <DashboardContent />;
		}
	};

	return (
		<SidebarProvider className="bg-sidebar">
			<DashboardSidebar activePage={activePage} setActivePage={setActivePage} />
			<div className="h-svh overflow-hidden lg:p-2 w-full">
				<div className="lg:border lg:rounded-md overflow-hidden flex flex-col h-full w-full bg-background">
					<DashboardHeader />
					<main className="w-full flex-1 overflow-auto">{renderContent()}</main>
				</div>
			</div>
		</SidebarProvider>
	);
}
