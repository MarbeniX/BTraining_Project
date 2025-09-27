import ReadyToSweatComp from "@/components/app/readyToSweatComp"
import { createPortal } from "react-dom";

type HowDoYouWantToTrainPopUpProps = {
    isOpen: boolean;
}

export default function HowDoYouWantToTrainPopUp({ isOpen }: HowDoYouWantToTrainPopUpProps) {
    if (!isOpen) return null;
    const container = typeof window !== 'undefined' ? document.body : null;
    if (!container) return null;

    return createPortal (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <ReadyToSweatComp
                    title="How do you want to train today?"
                    message="Choose your workout style for todal"
                    isTraining={true}
                />
            </div>
        </>,
        container
    )
}
