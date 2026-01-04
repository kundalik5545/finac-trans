"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import React, { useState } from "react";

const SignUpPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // handle signup logic here
        console.log({ name, email, password });
        const { data, error } = await authClient.signUp.email(
            {
                name: name,
                email: email,
                password: password,
                callbackURL: process.env.NEXT_PUBLIC_BASE_URL,
            },
            {
                onRequest: (ctx) => {
                    //show loading
                    console.log("Signing up...");
                },
                onSuccess: (ctx) => {
                    //redirect to the dashboard or sign in page
                    console.log("Signed up successfully!");
                    redirect("/dashboard");
                },
                onError: (ctx) => {
                    console.log("Error signing up:", ctx.error.message);
                },
            }
        );

    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col space-y-4 border p-6 rounded w-80"
            >
                <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
                <Label className="flex items-center justify-between space-y-2">
                    <span>Name</span>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-40"
                    />
                </Label>
                <Label className="flex items-center justify-between space-y-2">
                    <span>Email</span>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-40"
                    />
                </Label>
                <Label className="flex items-center justify-between space-y-2 ">
                    <span>Password</span>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-40"
                    />
                </Label>
                <Button type="submit">Sign Up</Button>
            </form>
        </div>
    );
};

export default SignUpPage;