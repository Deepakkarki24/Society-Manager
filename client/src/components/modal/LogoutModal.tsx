import { XIcon } from "@phosphor-icons/react";
import React, { useEffect } from "react";
import { Button } from "../ui/Button";
import { useAppDispatch } from "@/store/hooks";
import { useNavigate } from "react-router-dom";
import { logout } from "@/store/slices/authSlice";
import api from "@/api-manager/apiInterceptor";
import toast from "react-hot-toast";

interface LogoutModalProps {
    setLogoutModal: (open: boolean) => void;
    isOpen: boolean;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ setLogoutModal, isOpen }) => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await api.get("/api/auth/logout")
            .then(() => toast.success("Logged out!"))
            .catch((err) => toast.error(err.message))

        dispatch(logout());
        navigate("/login");
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative m-auto max-w-63 sm:max-w-sm w-full glass-strong ai-glow rounded-2xl p-8 flex flex-col justify-between items-center">
                <XIcon
                    onClick={() => setLogoutModal(false)}
                    className="cursor-pointer absolute top-4 right-4 text-text-secondary hover:text-text-primary transition rounded-lg p-1.5 hover:bg-surface-hover"
                    size={24}
                />
                <p className="sm:text-xl text-base font-semibold text-text-primary pt-6">
                    Do you want to logout?
                </p>
                <Button onClick={handleLogout} className="mt-6 font-semibold">Logout</Button>
            </div>
        </div>
    );
};

export default LogoutModal;
