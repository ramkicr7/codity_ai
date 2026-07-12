import { motion } from "framer-motion";

import AuthLayout from "../layouts/AuthLayout";
import RegisterForm from "../components/auth/RegisterForm";

const pageVariants = {
    initial: {
        opacity: 0,
        y: 16,
        scale: 0.98
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1]
        }
    },
    exit: {
        opacity: 0,
        y: -12,
        scale: 0.98,
        transition: {
            duration: 0.25,
            ease: "easeInOut"
        }
    }
};


export default function Register() {
    return (
        <AuthLayout>
            <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex w-full items-center justify-center"
            >
                <RegisterForm />
            </motion.div>
        </AuthLayout>
    );
}