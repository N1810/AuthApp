import { Button } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";

export default function GoogleLogin() {
    const googleLogin = useGoogleLogin({
        onSuccess: async (authResult) => {
            try {
                console.log(authResult);
            } catch (error) {
                console.log(error);
            }
        },
        onError: (error) => console.error("Google login failed:", error),
        flow: "auth-code",
    });

    return (
        <Button
            variant="outlined"
            fullWidth
            className="flex items-center justify-center gap-2 text-gray-600 border-gray-300"
            onClick={() => googleLogin()}
        >
            <img
                src="/images/logos/google.png"
                alt="Google Logo"
                className="w-5 h-5"
            />
            Sign up with Google
        </Button>
    );
}
