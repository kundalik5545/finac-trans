import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const AboutPage = () => {
    return (
        <main className="max-w-2xl mx-auto px-4 py-12 space-y-10">
            <header className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-primary">
                    About <span className="text-primary-foreground bg-primary px-2 py-1 rounded">Finac</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                    Your personal finance tracker. Organize transactions, categorize spending, and gain insight into your finances efficiently.
                </p>
            </header>

            <section className="bg-card p-6 rounded-md shadow-sm border space-y-4">
                <h2 className="text-2xl font-semibold mb-2 text-primary">What is Finac?</h2>
                <ul className="list-disc pl-6 space-y-2 text-base">
                    <li>
                        <span className="font-medium text-primary">Track your income</span> and expenses effortlessly.
                    </li>
                    <li>
                        <span className="font-medium text-primary">Organize transactions</span> by category and sub-category.
                    </li>
                    <li>
                        <span className="font-medium text-primary">Visualize your spending</span> to make better financial decisions.
                    </li>
                    <li>
                        <span className="font-medium text-primary">Import data</span> easily using a template Excel sheet.
                    </li>
                </ul>
            </section>

            <section className="bg-secondary/50 rounded-md p-6 border space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span role="img" aria-label="excel">📄</span>
                    Demo Excel Sheet
                </h3>
                <p>
                    Download a sample Excel sheet to see the required format for bulk uploads.
                </p>
                <div className="flex gap-2">

                    <Link
                        href="https://docs.google.com/spreadsheets/d/13WtYni_aREWkg8pjYEvFbyvUZbnh5IP9KhbnQHEos3U/export?format=xlsx"
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                    >
                        <Button variant="default" size="sm">Download Demo Excel (.xlsx)</Button>
                    </Link>

                    <Link
                        href="https://docs.google.com/spreadsheets/d/13WtYni_aREWkg8pjYEvFbyvUZbnh5IP9KhbnQHEos3U"
                        target="_blank"
                        rel="noopener noreferrer"

                    >
                        <Button variant="outline" size="sm">View Demo Excel (.xlsx)</Button>
                    </Link>
                </div>
            </section>


        </main>
    );
};

export default AboutPage;