import TrainingSessionSummaryHome from "@/appComponents/TrainingSessionSummaryHome";

export default function RecentActivity() {
    return (
        <div className="flex-1">
            <h2 className="text-white text-3xl">Recent activity</h2>
            <div className="flex flex-col gap-4 pt-6 items-center">
                <TrainingSessionSummaryHome />
                <TrainingSessionSummaryHome />
                <TrainingSessionSummaryHome />
                <TrainingSessionSummaryHome />
            </div>
        </div>
    );
}
