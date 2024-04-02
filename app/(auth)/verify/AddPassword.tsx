import {
	discardNewPasswordAddition,
	confirmNewPasswordAddition,
} from "@/app/api/actions/user";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import React, { useState } from "react";
import SecurityLink from "./SecurityLink";
import { CheckIcon } from "@radix-ui/react-icons";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

const AddPasswordConfirmAction = ({ token }: { token: string }) => {
	const [loading, setLoading] = useState(false);
	const [actionResult, setActionResult] = useState<{
		success: boolean;
		message: string;
	} | null>(null);

	const addTheNewPassword = async () => {
		if (loading) return;
		setLoading(true);

		const res = await confirmNewPasswordAddition(token);

		setLoading(false);
		if (res?.success === true) {
			setActionResult(res);
		}
	};

	const removeTheNewPassword = async () => {
		if (loading) return;
		setLoading(true);

		const res = await discardNewPasswordAddition(token);

		setLoading(false);
		if (res?.success === true) {
			setActionResult(res);
		}
	};

	if (actionResult?.success === true) {
		return (
			<div className="max-w-md flex flex-col items-center justify-center gap-4">
				<div className="w-full flex items-center justify-center gap-2 text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 py-2 px-4 rounded-lg">
					<CheckIcon className="w-10 h-10" />
					<p className="text-2xl">{actionResult?.message}</p>
				</div>

				<div>
					<p className="text-lg">
						Go back to&nbsp;
						<Link
							href="/"
							className="text-blue-500 dark:text-blue-400 hover:bg-blue-500/10 hover:dark:bg-blue-400/10 py-1 px-2 rounded"
						>
							Home page
						</Link>
					</p>
				</div>
			</div>
		);
	}

	return (
		<Card className="max-w-md gap-0 relative">
			<CardHeader className="text-xl ms:text-3xl font-semibold text-left">
				Verify your new password
			</CardHeader>
			<CardContent>
				<p className="w-full text-left text-foreground/80 dark:text-foreground_dark/80">
					A new password was recently added to your account. Confirm below if
					this was you. The new password will not work until then.
				</p>
			</CardContent>
			<CardFooter className="w-full flex flex-col items-center justify-end gap-4">
				<div className="w-full flex items-center justify-end gap-4">
					<form
						onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
							e.preventDefault();
							removeTheNewPassword();
						}}
					>
						<Button type="submit" variant="outline">
							Cancel
						</Button>
					</form>
					<form
						onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
							e.preventDefault();
							addTheNewPassword();
						}}
					>
						<Button type="submit">Confirm</Button>
					</form>
				</div>
				<div className="w-full flex items-center justify-start">
					<SecurityLink />
				</div>
			</CardFooter>
			{loading === true && (
				<div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-full rounded-xl flex items-center justify-center">
					<div className="w-full h-full flex items-center justify-center relative rounded-xl">
						<div className="w-full h-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-background dark:bg-background_dark opacity-60" />
						<Spinner size="2.4rem" />
					</div>
				</div>
			)}
		</Card>
	);
};

export default AddPasswordConfirmAction;
