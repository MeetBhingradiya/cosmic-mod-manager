import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import useFetch from "@/src/hooks/fetch";
import { AuthContext } from "@/src/providers/auth-provider";
import { useContext, useEffect, useState } from "react";
import { ContentWrapperCard } from "../panel";
import DeleteAccountSection from "./delete-account";
import ManageProviders from "./manage-providers";
import PasswordSection from "./password";
import EditProfileDialog from "./profile-details";

const AccountSettingsPage = () => {
	const { session, setNewSession } = useContext(AuthContext);
	const [linkedProviders, setlinkedProviders] = useState([]);
	const [hasAPassword, setHasAPassword] = useState<boolean | undefined>(undefined);

	const fetchLinkedProviders = async () => {
		const res = await useFetch("/api/user/linked-auth-providers");
		const result = await res.json();

		setlinkedProviders(result?.data || []);
	};

	const getToKnowIfUserHasAPAssword = async () => {
		try {
			const res = await useFetch("/api/user/has-password");
			const data = await res.json();
			setHasAPassword(data?.hasPassword || false);
		} catch (error) {
			setHasAPassword(false);
		}
	};

	const fetchPageData = async () => {
		const promises = [fetchLinkedProviders(), getToKnowIfUserHasAPAssword()];
		await Promise.all(promises);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchPageData();
	}, []);

	useEffect(() => {
		if (session === null) {
			window.location.pathname = "/login";
		}
	}, [session]);

	if (session === undefined || linkedProviders.length === 0 || hasAPassword === undefined) {
		return (
			<div className="py-12 flex">
				<Spinner size="2rem" className="mt-8" />
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col items-center justify-start pb-8 gap-4">
			<ContentWrapperCard>
				<div className="w-full flex flex-wrap gap-4 items-center justify-between">
					<h2 className="flex text-left text-2xl font-semibold text-foreground-muted">User profile</h2>
					<div className="flex h-full items-center justify-center">
						<EditProfileDialog
							name={session?.name || ""}
							username={session?.user_name || ""}
							currProfileProvider={session?.avatar_provider}
							setNewSession={setNewSession}
							linkedProviders={linkedProviders}
						/>
					</div>
				</div>
				<div className="w-full flex flex-col items-center justify-center my-2">
					<div className="w-full flex flex-wrap items-center justify-start gap-6">
						<div className="flex grow sm:grow-0 items-center justify-center">
							{session?.avatar_image ? (
								<img
									src={session?.avatar_image}
									alt={`${session?.user_name} `}
									className="h-24 aspect-square rounded-full bg-bg-hover"
								/>
							) : (
								<span>{session?.name[0]}</span>
							)}
						</div>
						<div className="grow max-w-full flex flex-col items-start justify-center">
							<h1 className="flex w-full items-center sm:justify-start justify-center text-2xl font-semibold">
								{session?.name}
							</h1>
							<ScrollArea className="w-full">
								<div className="w-full flex text-sm sm:text-base items-center sm:justify-start justify-center">
									<span role="img" aria-hidden className="text-foreground/60 select-none text-xl">
										@
									</span>
									<span className="text-foreground">{session?.user_name}</span>
								</div>
								<ScrollBar orientation="horizontal" />
							</ScrollArea>
						</div>
					</div>
				</div>
			</ContentWrapperCard>

			<ContentWrapperCard>
				<div className="w-full flex flex-wrap gap-4 items-center justify-between">
					<h2 className="flex text-left text-2xl font-semibold text-foreground-muted">Account security</h2>
				</div>

				<div className="w-full flex flex-col items-center justify-center my-2 gap-8 sm:gap-6">
					<div className="w-full flex flex-col items-start justify-center gap-1">
						<p className="text-lg font-semibold text-foreground">Email</p>
						<form className="w-full flex items-center justify-start" name="Email">
							{session?.email && (
								<Input
									type="email"
									placeholder="johndoe@xyz.com"
									className="grow min-w-48 sm:max-w-96"
									readOnly
									value={session?.email}
								/>
							)}
						</form>
					</div>

					<PasswordSection email={session?.email || ""} hasAPassword={hasAPassword} fetchPageData={fetchPageData} />

					<ManageProviders linkedProviders={linkedProviders} fetchLinkedProviders={fetchLinkedProviders} />
				</div>
			</ContentWrapperCard>

			<ContentWrapperCard>
				<div className="w-full flex flex-wrap gap-4 items-center justify-between">
					<h2 className="flex text-left text-2xl font-semibold text-foreground-muted">Delete account</h2>
				</div>
				<DeleteAccountSection />
			</ContentWrapperCard>
		</div>
	);
};

export default AccountSettingsPage;
