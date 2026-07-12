import { forwardRef, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock } from "lucide-react";

const PasswordInput = forwardRef(
  (
    {
      label = "Password",
      error = "",
      className = "",
      ...inputProps
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputProps.name}
            className="block text-sm font-medium tracking-wide text-slate-300"
          >
            {label}
          </label>
        )}

        <motion.div
          whileFocus={{ scale: 1.01 }}
          className={`
            group
            flex
            items-center
            rounded-2xl
            border
            bg-white/[0.04]
            backdrop-blur-xl
            transition-all
            duration-300

            ${
              error
                ? "border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,.25)]"
                : "border-white/10 hover:border-violet-500/30 focus-within:border-violet-500/70 focus-within:shadow-[0_0_35px_rgba(124,58,237,.30)]"
            }

            ${className}
          `}
        >
          <div className="px-4">
            <Lock
              size={19}
              className="text-slate-400 transition-colors group-focus-within:text-violet-400"
            />
          </div>

          <input
            ref={ref}
            {...inputProps}
            type={showPassword ? "text" : "password"}
            className="
              flex-1
              bg-transparent
              py-4
              pr-2
              text-white
              outline-none
              placeholder:text-slate-500
            "
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="
              mr-3
              rounded-xl
              p-2
              transition-all
              duration-300
              hover:bg-white/10
            "
          >
            {showPassword ? (
              <EyeOff
                size={20}
                className="text-slate-400"
              />
            ) : (
              <Eye
                size={20}
                className="text-slate-400"
              />
            )}
          </button>
        </motion.div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;