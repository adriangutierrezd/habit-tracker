import { Toaster } from "sonner";
import AccountBanner from "./AccountBanner";
import HabitList from "./HabitList";
import Header from "./Header";

export default function HomePage() {
    return (
        <>
            <Header />
            <main className="py-2 px-4">
                <AccountBanner />
                <HabitList />
                <Toaster richColors={true} className="z-100" />
            </main>
        </>
    )
}