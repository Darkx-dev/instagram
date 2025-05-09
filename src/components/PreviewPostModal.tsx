import { X } from "lucide-react"
import { createPortal } from "react-dom"

interface ModalProps {
    onClose: () => void,
}

function PreviewPostModal({ onClose }: ModalProps) {
    return createPortal(
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <X onClick={onClose} className="fixed top-3 right-3 cursor-pointer" size={30}/>
            <div></div>
        </div>,
        document.body
    )
}

export default PreviewPostModal